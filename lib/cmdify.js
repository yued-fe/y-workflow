/**
 * 图像合并
 */
const gulp = require('gulp');
const plugins = {
  changed: require('gulp-changed'),
  cmdify: require('../plugins/gulp-cmdify'),
  plumber: require('gulp-plumber'),
  urify: require('../plugins/gulp-urify'),
};

/**
 * 图片合并任务注册方法
 * @param {Object} options 任务配置
 * @param {String} options.taskName 自定义任务名称
 * @param {String} options.src 待处理文件
 * @param {String} options.dest 处理后存放目录
 * @param {Boolean} options.watch 是否监听
 * @param {Function} options.taskHandler 自定义任务处理方法
 * @param {String|Object} options.cmdify cmdify 配置
 * @param {String|Function|Object} options.urify uri 转换配置
 */
module.exports = (options) => {
  const {
    taskName = 'cmdify',
    src,
    dest,
    watch,
    taskHandler = () => {
      const stream = gulp.src(src)
        .pipe(plugins.plumber())
        .pipe(plugins.changed(dest)) // 忽略未更改的文件
        .pipe(plugins.cmdify(cmdify))
        .pipe(gulp.dest(dest));

      if (urify) {
        return stream.pipe(plugins.urify(urify)).pipe(gulp.dest(dest));
      }

      return stream;
    },
    cmdify,
    urify,
  } = options;

  gulp.task(taskName, taskHandler);

  if (watch) {
    gulp.task(`${taskName}:watch`, [taskName], () => {
      gulp.watch(src, [taskName]);
    });
  }
};
