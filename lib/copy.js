/**
 * 复制
 */
const gulp = require('gulp');
const plugins = {
  changed: require('gulp-changed'),
};

/**
 * 复制任务注册方法
 * @param {Object} options 任务配置
 * @param {String} options.taskName 自定义任务名称
 * @param {String} options.src 待处理文件
 * @param {Object} options.srcOptions gulp.src配置参数
 * @param {String} options.dest 处理后存放目录
 * @param {Boolean} options.watch 是否监听
 * @param {Function} options.taskHandler 自定义任务处理方法
 */
module.exports = (options) => {
  const {
    taskName = 'copy',
    src,
    srcOptions = {},
    dest,
    watch,
    taskHandler = () => {
      return gulp.src(src, srcOptions)
        .pipe(plugins.changed(dest)) // 忽略未更改的文件
        .pipe(gulp.dest(dest));
    },
  } = options;

  gulp.task(taskName, taskHandler);

  if (watch) {
    gulp.task(`${taskName}:watch`, [taskName], () => {
      gulp.watch(src, srcOptions, [taskName]);
    });
  }
};
