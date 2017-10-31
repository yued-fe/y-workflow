/**
 * cmd transport 内容替换
 */
const path = require('path');

const gutil = require('gulp-util');
const gulp = require('gulp');
const through2 = require('through2');

/**
 * cmd transport 内容替换任务注册方法
 * @param {Object} options 任务配置
 * @param {String} options.taskName 自定义任务名称
 * @param {String} options.src 待处理文件
 * @param {String} options.dest 处理后存放目录
 * @param {Function} options.taskHandler 自定义任务处理方法
 * @param {String} options.cmdifyManifest cmdify 生成的 manifest 文件路径
 * @param {String} options.revManifest rev 生成的 manifest 文件路径
 * @param {String} options.aliasPlaceholder 别名占位
 * @param {String} options.cmdKeyword cmd规范实现类库关键字
 */
module.exports = (options) => {
  const {
    taskName = 'cmdifyReplace',
    src,
    dest,
    taskHandler = () => {
      return gulp.src(src)
        .pipe(plugin({
          cmdifyManifest: require(path.resolve(cmdifyManifest)),
          revManifest: require(path.resolve(revManifest)),
          aliasPlaceholder,
          cmdKeyword,
        }))
        .pipe(gulp.dest(dest));
    },
    cmdifyManifest,
    revManifest,
    aliasPlaceholder,
    cmdKeyword,
  } = options;

  gulp.task(taskName, taskHandler);
};

function plugin({ cmdifyManifest, revManifest, cmdKeyword, aliasPlaceholder }) {
  const revManifestKeys = Object.keys(revManifest);
  const useEntryReg = new RegExp(`${cmdKeyword}\\.use\\(((?:\\[[^\\]]+\\])|(?:['"][^'"]+['"]))`, 'g')

  const append = (modules, module) => {
    const moduleDeps = cmdifyManifest[module];

    if (modules.indexOf(module) === -1) {
      modules.push(module);
    }
    if (Array.isArray(moduleDeps)) {
      moduleDeps.forEach((depModule) => {
        append(modules, depModule);
      });
    }
  };

  const concat = (allModules, modules) => {
    modules.forEach((module) => {
      if (allModules.indexOf(module) === -1) {
        allModules.push(module);
      }
    });
  };

  const getAlias = (module) => {
    let i = revManifestKeys.length;
    let key;
    while (i--) {
      key = revManifestKeys[i];
      if (module.endsWith(key)) {
        return module.replace(key, '') + revManifest[key];
      }
    }
  };

  return through2.obj(function (file, encoding, callback) {
    if (!file) {
      this.emit('error', new gutil.PluginError('gulp-cmdify-replace', 'files can not be empty'));
      return callback();
    }

    if (file.isNull()) {
      return callback();
    }

    if (file.isStream()) {
      this.push(file);
      return callback();
    }

    if (path.extname(file.path) !== '.html') {
      this.push(file);
      return callback();
    }

    let contents = file.contents.toString('utf-8');

    const allModules = [];
    const allAlias = {};

    contents = contents.replace(useEntryReg, (match, useEntry, offset, string) => {
      const entryModules = useEntry.replace(/[\[\]'" ]/g, '').split(',');
      const entryAllModules = entryModules.slice(0);
      entryModules.forEach(module => append(entryAllModules, module));

      concat(allModules, entryAllModules);

      return match.replace(useEntry, JSON.stringify(entryAllModules));
    });

    allModules.forEach((module) => {
      allAlias[module] = getAlias(module);
    });

    contents = contents.replace(aliasPlaceholder, JSON.stringify(allAlias).slice(1, -1));

    file.contents = Buffer.from(contents);
    this.push(file);
    callback();
  });
}
