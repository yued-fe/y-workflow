/**
 * css url 相对路径转绝对路径
 */
const gulp = require('gulp');
const plugins = {
  changed: require('gulp-changed'),
  cssUrlAbsify: require('../plugins/gulp-css-url-absify'),
  plumber: require('gulp-plumber'),
};

/**
 * css url 相对路径转绝对路径任务注册方法
 * @param {String} options.taskName 自定义任务名称
 * @param {String} options.src 待处理文件
 * @param {String} options.dest 处理后存放目录
 * @param {Boolean} options.watch 是否监听
 * @param {Function} options.taskHandler 自定义任务处理方法
 * @param {Object} options.cssUrlAbsify cssUrlAbsify 配置
 */
module.exports = (options) => {
  const {
    taskName = 'cssUrlAbsify',
    src,
    dest,
    watch,
    taskHandler = () => {
      return gulp.src(src)
        .pipe(plugins.plumber())
        .pipe(plugins.changed(dest)) // 忽略未更改的文件
        .pipe(gulp.dest(dest))
        .pipe(plugins.cssUrlAbsify(cssUrlAbsify))
        .pipe(gulp.dest(dest));
    },
    cssUrlAbsify,
  } = options;

  gulp.task(taskName, taskHandler);

  if (watch) {
    gulp.task(`${taskName}:watch`, [taskName], () => {
      gulp.watch(src, [taskName]);
    });
  }
};
