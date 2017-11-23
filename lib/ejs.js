/**
 * ejs 渲染
 */
const gulp = require('gulp');
const plugins = {
  changedDeps: require('../plugins/gulp-changed-deps'),
  ejs: require('../plugins/gulp-ejs'),
  plumber: require('gulp-plumber'),
  urify: require('../plugins/gulp-urify'),
};

/**
 * ejs 渲染任务注册方法
 * @param {Object} options 任务配置
 * @param {String} options.taskName 自定义任务名称
 * @param {String} options.src 待处理文件
 * @param {String} options.dest 处理后存放目录
 * @param {Boolean} options.watch 是否监听
 * @param {Function} options.taskHandler 自定义任务处理方法
 * @param {Object} options.changedDeps changedDeps配置
 * @param {Object} options.ejs ejs 配置
 * @param {String|Function|Object|Array} options.urify uri 转换配置
 */
module.exports = (options) => {
  const {
    taskName = 'ejs',
    src,
    dest,
    watch,
    taskHandler = () => {
      let stream = gulp.src(src)
        .pipe(plugins.plumber())
        .pipe(plugins.changedDeps(dest, changedDeps)) // 忽略未更改的文件(包含依赖分析功能)
        .pipe(plugins.ejs(ejs))
        .pipe(gulp.dest(dest));

      if (urify) {
        const multiUrify = Array.isArray(urify) ? urify : [urify];
        multiUrify.forEach((urify) => {
          stream = stream.pipe(plugins.urify(urify)).pipe(gulp.dest(dest));
        });
      }

      return stream;
    },
    changedDeps = { syntax: 'ejs' },
    ejs,
    urify,
  } = options;

  gulp.task(taskName, taskHandler);

  if (watch) {
    gulp.task(`${taskName}:watch`, [taskName], () => {
      gulp.watch(src, [taskName]);
    });
  }
};
