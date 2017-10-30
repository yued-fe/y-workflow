/**
 * 图像压缩
 */
const gulp = require('gulp');
const plugins = {
  changed: require('gulp-changed'),
  imagemin: require('gulp-imagemin'),
  plumber: require('gulp-plumber'),
};

/**
 * 图片压缩任务注册方法
 * @param {Object} options 任务配置
 * @param {String} options.taskName 自定义任务名称
 * @param {String} options.src 待处理文件
 * @param {String} options.dest 处理后存放目录
 * @param {Boolean} options.watch 是否监听
 * @param {Function} options.taskHandler 自定义任务处理方法
 * @param {Object|Array} options.imagemin imagemin配置
 */
module.exports = (options) => {
  const {
    taskName = 'imgMin',
    src,
    dest,
    watch,
    taskHandler = () => {
      return gulp.src(src)
        .pipe(plugins.plumber())
        .pipe(plugins.changed(dest)) // 忽略未更改的文件
        .pipe(plugins.imagemin(imagemin))
        .pipe(gulp.dest(dest));
    },
    imagemin = [
      plugins.imagemin.gifsicle({ interlaced: true }),
      plugins.imagemin.jpegtran({ progressive: true }),
      plugins.imagemin.optipng({ optimizationLevel: 2 }),
      plugins.imagemin.svgo(),
    ],
  } = options;

  gulp.task(taskName, taskHandler);

  if (watch) {
    gulp.task(`${taskName}:watch`, [taskName], () => {
      gulp.watch(src, [taskName]);
    });
  }
};
