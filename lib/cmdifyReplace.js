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
 * @param {String} options.depsPlaceholder 依赖占位
 * @param {String} options.cmdKeyword cmd规范实现类库关键字
 * @param {Function} options.revCmdify rev提取的文件名转cmd模块ID方法
 */
module.exports = (options) => {
  const {
    taskName = 'cmdifyReplace',
    src,
    dest,
    taskHandler = () => {
      return gulp.src(src)
        .pipe(plugin({ // eslint-disable-line no-use-before-define
          cmdifyManifest: require(path.resolve(cmdifyManifest)),
          revManifest: require(path.resolve(revManifest)),
          aliasPlaceholder,
          depsPlaceholder,
          cmdKeyword,
          revCmdify,
        }))
        .pipe(gulp.dest(dest));
    },
    cmdifyManifest,
    revManifest,
    aliasPlaceholder,
    depsPlaceholder,
    cmdKeyword,
    revCmdify = d => d,
  } = options;

  gulp.task(taskName, taskHandler);
};

function plugin({
  cmdifyManifest,
  revManifest,
  aliasPlaceholder,
  depsPlaceholder,
  cmdKeyword,
  revCmdify,
}) {
  // 先获取所有模块的 alias 和 deps
  const allAliasObj = {};
  const allDepsObj = {};

  Object.keys(revManifest).forEach((d) => {
    allAliasObj[revCmdify(d)] = revCmdify(revManifest[d]);
  });

  Object.keys(cmdifyManifest).forEach((moduleId) => {
    const moduleDeps = cmdifyManifest[moduleId];
    if (moduleDeps.length) {
      allDepsObj[moduleId] = moduleDeps;
    }
  });

  // 入口模块提取正则
  const REG_USE_ENTRYS = cmdKeyword ? new RegExp(`${cmdKeyword}\\.use\\(((?:\\[[^\\]]+\\])|(?:['"][^'"]+['"]))`, 'g') : null;
  const REG_ENTRY = /(['"])([^'"]+)\1/g;

  // 递归提取模块ID
  const append = (moduleIds, moduleId) => {
    if (moduleIds.indexOf(moduleId) === -1) {
      moduleIds.push(moduleId);
    }
    if (Array.isArray(allDepsObj[moduleId])) {
      allDepsObj[moduleId].forEach((depModuleId) => {
        append(moduleIds, depModuleId);
      });
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

    if (['.js', '.html'].indexOf(path.extname(file.path)) === -1) {
      this.push(file);
      return callback();
    }

    let contents = file.contents.toString('utf-8');

    // 获取所有入口模块(包含所依赖模块)
    const moduleIds = [];

    if (REG_USE_ENTRYS) {
      let matchedUseEntrys;
      let matchedEntry;

      while ((matchedUseEntrys = REG_USE_ENTRYS.exec(contents)) !== null) {
        while ((matchedEntry = REG_ENTRY.exec(matchedUseEntrys[1])) !== null) {
          append(moduleIds, matchedEntry[2]);
        }
      }
    }

    let aliasObj = {};
    let depsObj = {};

    if (moduleIds.length) {
      moduleIds.forEach((moduleId) => {
        aliasObj[moduleId] = allAliasObj[moduleId];
        if (Array.isArray(allDepsObj[moduleId])) {
          depsObj[moduleId] = allDepsObj[moduleId];
        }
      });
    } else {
      // 无入口模块则认为是在专门的 config 文件中，这个时候需要替换为全部 alias 和 deps
      aliasObj = allAliasObj;
      depsObj = allDepsObj;
    }

    contents = contents.replace(aliasPlaceholder, JSON.stringify(aliasObj).slice(1, -1));
    contents = contents.replace(depsPlaceholder, JSON.stringify(depsObj).slice(1, -1));

    file.contents = Buffer.from(contents);
    this.push(file);
    callback();
  });
}
