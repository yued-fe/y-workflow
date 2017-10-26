/**
 * uri转换
 */
const gulp = require('gulp');
const plugins = {
  changed: require('gulp-changed'),
  plumber: require('gulp-plumber'),
  urify: require('../plugins/gulp-urify'),
};

/**
 * uri转换任务注册方法
 * @param {Object} options 任务配置
 * @param {String} options.taskName 自定义任务名称
 * @param {String} options.src 待处理文件
 * @param {String} options.dest 处理后存放目录
 * @param {Boolean} options.watch 是否监听
 * @param {Function} options.taskHandler 自定义任务处理方法
 * @param {String|Function|Object} options.urify uri 转换配置
 */
module.exports = (options) => {
  const {
    taskName = 'urify',
    src,
    dest,
    watch,
    taskHandler = () => {
      return gulp.src(src)
        .pipe(plugins.plumber())
        .pipe(plugins.changed(dest)) // 忽略未更改的文件
        .pipe(gulp.dest(dest))
        .pipe(plugins.urify(urify))
        .pipe(gulp.dest(dest));
    },
    urify,
  } = options;

  gulp.task(taskName, taskHandler);

  if (watch) {
    gulp.task(`${taskName}:watch`, [taskName], () => {
      gulp.watch(src, [taskName]);
    });
  }
};
