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
