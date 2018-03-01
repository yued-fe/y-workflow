const crypto = require('crypto');
const path = require('path');

const gutil = require('gulp-util');
const through2 = require('through2');

const revHash = str => crypto.createHash('md5').update(str).digest('hex').slice(0, 10);
const relPath = (base, filePath) => filePath.slice(base.length).replace(/\\/g, '/').replace(/^\//, '');
/**
 * 有依赖分析的 rev 插件
 */
module.exports = function () {
  const files = [];

  return through2.obj(function (file, encoding, callback) {
    if (!file) {
      this.emit('error', new gutil.PluginError('gulp-rev-all', 'File can not be empty'));
      return callback();
    }

    if (file.isNull()) {
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-rev-all', 'Streaming not supported'));
      return callback();
    }

    file.depFilesCount = 0; // 依赖文件数
    // file.depFiles = []; // 依赖文件集合
    file.beDepFiles = []; // 被依赖文件集合

    files.push(file);
    callback();
  }, function (callback) {
    const stream = this;

    // 提取被依赖项
    files.forEach((file1) => {
      files.forEach((file2) => {
        if (file2 === file1) {
          return;
        }
        if (file2.contents.toString('utf-8').indexOf(file1.relative) > -1) {
          file2.depFilesCount++;
          // file2.depFiles.push(file1);
          file1.beDepFiles.push(file2);
        }
      });
    });

    // 排序提高效率
    files.sort((file1, file2) => (file1.depFilesCount > file2.depFilesCount ? 1 : -1));

    function doRev(willRevFiles) {
      let hasDepRelationship = false;

      willRevFiles.forEach((file) => {
        // 已经被 rev
        if (file.revHash) {
          return;
        }

        // 还有依赖的文件没有被 rev
        if (file.depFilesCount > 0) {
          hasDepRelationship = true;
          return;
        }

        // rev
        file.revOrigPath = file.path;
        file.revOrigBase = file.base;
        file.revHash = revHash(file.contents.toString('utf-8'));
        file.path = gutil.replaceExtension(file.path, `-${file.revHash}${path.extname(file.path)}`);

        const revisionedFile = relPath(file.base, file.path);
        const originalFile = path.join(path.dirname(revisionedFile), path.basename(file.revOrigPath)).replace(/\\/g, '/');

        file.contents = Buffer.from(file.contents.toString('utf-8').split(originalFile).join(revisionedFile));

        file.beDepFiles.forEach((beDepFile) => {
          // rev replace
          beDepFile.contents = Buffer.from(beDepFile.contents.toString('utf-8').split(originalFile).join(revisionedFile));
          beDepFile.depFilesCount--;
        });

        stream.push(file);
      });

      if (hasDepRelationship) {
        doRev(willRevFiles);
      }
    }

    doRev(files);

    callback();
  });
};
