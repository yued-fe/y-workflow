/**
 * cmd 配置替换
 */
const fs = require('fs');
const path = require('path');

const gulp = require('gulp');
const plugins = {
  cmdifyReplace: require('../plugins/gulp-cmdify-replace'),
};

const loadManifest = file => (fs.existsSync(file) ? require(file) : {});

/**
 * cmd 配置替换任务注册方法
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
        .pipe(plugins.cmdifyReplace({
          cmdifyManifest: loadManifest(path.resolve(cmdifyManifest)),
          revManifest: loadManifest(path.resolve(revManifest)),
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
