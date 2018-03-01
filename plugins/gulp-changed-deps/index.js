const fs = require('fs');
const path = require('path');

const gutil = require('gulp-util');
const through2 = require('through2');

const REG_SCSS_COMMENTS = /\/\*[\s\S]*?\*\/|\/\/.*(?=[\n\r])/g;
const REG_SCSS_DEPS = /@import\s*["']([^"']+)["'];?/g;

const REG_NUNJUCKS_COMMENTS = /{#[\s\S]*?#}/g;
const REG_NUNJUCKS_DEPS = /{%\s*(?:extends|import|include)\s*["']([^"']+)["'][^%]*%}/g;

const REG_EJS_COMMENTS = /<%#[\s\S]*?%>/g;
const REG_EJS_DEPS = /<%\s*include\s+(\S+)\s*%>|<%-\s*include\(\s*["']([^"']+)["'][^%]*%>/g;

const allGetContentsDeps = {
  // scss文件处理
  scss: (contents) => {
    contents = contents.replace(REG_SCSS_COMMENTS, ''); // 移除注释

    const deps = [];
    let matched;

    /* eslint-disable no-cond-assign */
    while ((matched = REG_SCSS_DEPS.exec(contents)) !== null) {
      deps.push(matched[1]);
    }
    return deps;
  },

  // nunjucks文件处理
  nunjucks: (contents) => {
    contents = contents.replace(REG_NUNJUCKS_COMMENTS, ''); // 移除注释

    const deps = [];
    let matched;

    /* eslint-disable no-cond-assign */
    while ((matched = REG_NUNJUCKS_DEPS.exec(contents)) !== null) {
      deps.push(matched[1]);
    }

    return deps;
  },

  // ejs文件处理
  ejs: (contents) => {
    contents = contents.replace(REG_EJS_COMMENTS, ''); // 移除注释

    const deps = [];
    let matched;

    /* eslint-disable no-cond-assign */
    while ((matched = REG_EJS_DEPS.exec(contents)) !== null) {
      deps.push(matched[1] || matched[2]);
    }

    return deps;
  },
};

/**
 * 获取文件与其依赖文件最后修改时间最大值
 * @param {Object} fileObj 文件对象
 * @param {File} fileObj.File 文件实例
 * @param {Object<path: fileObj>} fileObj.deps 依赖文件
 * @return {Date} 最后修改时间
 */
function getLastModified(fileObj) {
  let lastModified = fileObj.File.stat ? fileObj.File.stat.mtime : 0;

  Object.keys(fileObj.deps).forEach((depFilePath) => {
    const depLastModified = getLastModified(fileObj.deps[depFilePath]);

    if (lastModified < depLastModified) {
      lastModified = depLastModified;
    }
  });

  return lastModified;
}

/**
 * 筛选出将要更新文件
 * @param {String|Function} dest 匹配路径
 * @param {Object} options 配置项
 * @param {String} options.cwd 工作目录
 * @param {Boolean} options.underscore 是否包含(不过滤)以"_"开头的文件
 * @param {String} options.extension 对比文件的后缀名
 * @param {String} options.base 依赖文件定位目录
 * @param {Function} options.getContentsDeps 根据内容获取依赖文件方法
 * @param {String} options.syntax 文件语法
 * @return {DestroyableTransform} 文件流
 */
module.exports = function (dest, options) {
  if (!dest) {
    throw new gutil.PluginError('gulp-changed-deps', '`dest` required');
  }

  if (typeof dest !== 'function') {
    const originDest = dest;
    dest = function () {
      return originDest;
    };
  }

  options = options || {};
  options.cwd = options.cwd || process.cwd();

  let fileObjs = {};

  /**
   * 获取文件的依赖文件
   * @param {File} file 文件对象
   * @return {Array<String>} 依赖文件数组(由文件的绝对地址组成)
   */
  function getFileDeps(file) {
    const dirname = path.dirname(file.path);
    const extname = path.extname(file.path);

    const ext = extname.slice(1).toLowerCase();

    const getContentsDeps = options.getContentsDeps || allGetContentsDeps[options.syntax] || allGetContentsDeps[ext]; // eslint-disable-line max-len

    if (!getContentsDeps) {
      return [];
    }

    const depBase = options.base ? options.base === true ? file.base : path.resolve(options.base) : dirname; // eslint-disable-line max-len,no-nested-ternary

    const contents = file.contents.toString('utf-8');
    const fileDeps = [];

    getContentsDeps(contents).forEach((dep) => {
      let depFilePath = path.join(depBase, dep);

      if (!path.extname(depFilePath)) { // 补齐后缀
        depFilePath += extname;
      }

      if (fs.existsSync(depFilePath)) {
        fileDeps.push(depFilePath);
      } else { // 依赖的文件不存在
        gutil.log('"' + gutil.colors.red(path.relative(options.cwd, file.path)) + '" dependency file "' + gutil.colors.red(dep) + '" does not found'); // eslint-disable-line max-len,prefer-template
      }
    });

    return fileDeps;
  }

  // 文件对象组装
  function transform(file, encoding, callback) {
    if (!file) {
      this.emit('error', new gutil.PluginError('gulp-changed-deps', 'File can not be empty'));
      return callback();
    }

    if (file.isNull()) {
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-changed-deps', 'Streaming not supported'));
      return callback();
    }

    const fileObj = fileObjs[file.path] || (fileObjs[file.path] = {});

    fileObj.File = file;
    fileObj.deps = {};

    getFileDeps(file).forEach((depFilePath) => {
      fileObj.deps[depFilePath] = fileObjs[depFilePath] || (fileObjs[depFilePath] = {});
    });

    let targetPath = path.resolve(options.cwd, dest(file), file.relative);

    if (options.extension) {
      targetPath = gutil.replaceExtension(targetPath, options.extension);
    }

    fs.stat(targetPath, (err, targetStat) => {
      if (err) {
        fileObj.isNew = true;
      } else {
        fileObj.targetLastModified = targetStat.mtime;
      }

      callback();
    });
  }

  // 提取需要更新文件
  function flush(callback) {
    Object.keys(fileObjs).forEach((filePath) => {
      const fileObj = fileObjs[filePath];

      if (!fileObj.File) {
        // gutil.log('Not Found', gutil.colors.red(filePath));
        return;
      }

      if (fileObj.isNew) {
        if (options.underscore || path.basename(filePath).indexOf('_') !== 0) {
          this.push(fileObj.File);
          // gutil.log('New File', gutil.colors.green(filePath));
        }
      } else if (getLastModified(fileObj) > fileObj.targetLastModified) {
        this.push(fileObj.File);
        gutil.log(gutil.colors.red('Changed'), gutil.colors.blue(filePath));
      }
    });

    fileObjs = null;
    callback();
  }

  return through2.obj(transform, flush);
};
