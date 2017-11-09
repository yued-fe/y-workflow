/**
 * combo
 */
const gulp = require('gulp');
const plugins = {
  combo: require('../plugins/gulp-combo'),
  plumber: require('gulp-plumber'),
};

/**
 * combo 任务注册方法
 * @param {String} options.taskName 自定义任务名称
 * @param {String} options.src 待处理文件
 * @param {String} options.dest 处理后存放目录
 * @param {Function} options.taskHandler 自定义任务处理方法
 * @param {Object} options.combo combo 配置
 */
module.exports = (options) => {
  const {
    taskName = 'combo',
    src,
    dest,
    taskHandler = () => {
      return gulp.src(src)
        .pipe(plugins.plumber())
        .pipe(plugins.combo(combo))
        .pipe(gulp.dest(dest));
    },
    combo,
  } = options;

  gulp.task(taskName, taskHandler);
};
