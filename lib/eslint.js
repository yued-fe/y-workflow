/**
 * eslint
 */
const gulp = require('gulp');
const plugins = {
  eslint: require('gulp-eslint'),
  plumber: require('gulp-plumber'),
};

/**
 * eslint 任务注册方法
 * @param {Object} options 任务配置
 * @param {String} options.taskName 自定义任务名称
 * @param {String} options.src 待处理文件
 * @param {String} options.dest 处理后存放目录
 * @param {Boolean} options.watch 是否监听
 * @param {Function} options.taskHandler 自定义任务处理方法
 * @param {Object} options.eslint eslint配置
 * @param {String|Function} options.eslintFormatter eslint.formatter配置
 */
module.exports = (options) => {
  const {
    taskName = 'eslint',
    src,
    watch,
    taskHandler = () => {
      return gulp.src(src)
        .pipe(plugins.plumber())
        .pipe(plugins.eslint(eslint))
        .pipe(plugins.eslint.format(eslintFormatter));
    },
    eslint,
    eslintFormatter = require.resolve('eslint-friendly-formatter'),
  } = options;

  gulp.task(taskName, taskHandler);

  if (watch) {
    gulp.task(`${taskName}:watch`, [taskName], () => {
      gulp.watch(src, [taskName]);
    });
  }
};
