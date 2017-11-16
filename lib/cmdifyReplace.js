/**
 * cmd 配置替换
 */
const gulp = require('gulp');
const plugins = {
  cmdifyReplace: require('../plugins/gulp-cmdify-replace'),
};

/**
 * cmd 配置替换任务注册方法
 * @param {Object} options 任务配置
 * @param {String} options.taskName 自定义任务名称
 * @param {String} options.src 待处理文件
 * @param {String} options.dest 处理后存放目录
 * @param {Function} options.taskHandler 自定义任务处理方法
 * @param {String} options.cmdifyReplace cmdifyReplace 配置
 */
module.exports = (options) => {
  const {
    taskName = 'cmdifyReplace',
    src,
    dest,
    taskHandler = () => {
      return gulp.src(src)
        .pipe(plugins.cmdifyReplace(cmdifyReplace))
        .pipe(gulp.dest(dest));
    },
    cmdifyReplace = options,
  } = options;

  gulp.task(taskName, taskHandler);
};
