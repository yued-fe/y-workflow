/**
 * cmd transport
 */
const path = require('path');

const gulp = require('gulp');
const plugins = {
  changed: require('gulp-changed'),
  cmdify: require('../plugins/gulp-cmdify'),
  plumber: require('gulp-plumber'),
  urify: require('../plugins/gulp-urify'),
};

/**
 * cmd transport 任务注册方法
 * @param {Object} options 任务配置
 * @param {String} options.taskName 自定义任务名称
 * @param {String} options.src 待处理文件
 * @param {String} options.dest 处理后存放目录
 * @param {Boolean} options.watch 是否监听
 * @param {Function} options.taskHandler 自定义任务处理方法
 * @param {String|Function|Object} options.urify uri 转换配置
 * @param {String|Object} options.cmdify cmdify 配置
 * @param {String} options.manifest cmdify 的 manifest 文件路径
 */
module.exports = (options) => {
  const {
    taskName = 'cmdify',
    src,
    dest,
    watch,
    taskHandler = () => {
      let stream = gulp.src(src)
        .pipe(plugins.plumber())
        .pipe(plugins.changed(dest)); // 忽略未更改的文件

      if (urify) {
        stream = stream.pipe(gulp.dest(dest)).pipe(plugins.urify(urify));
      }

      stream = stream.pipe(plugins.cmdify(cmdify)).pipe(gulp.dest(dest));

      if (manifest) {
        stream = stream.pipe(plugins.cmdify.manifest(manifest)).pipe(gulp.dest(''));
      }

      return stream;
    },
    urify,
    cmdify,
    manifest = path.join(dest, 'cmdify-manifest.json'),
  } = options;

  gulp.task(taskName, taskHandler);

  if (watch) {
    gulp.task(`${taskName}:watch`, [taskName], () => {
      gulp.watch(src, [taskName]);
    });
  }
};
