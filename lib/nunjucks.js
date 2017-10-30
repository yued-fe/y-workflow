/**
 * nunjucks模板编译
 */
const gulp = require('gulp');
const plugins = {
  changedDeps: require('../plugins/gulp-changed-deps'),
  nunjucks: require('gulp-nunjucks'),
  plumber: require('gulp-plumber'),
  urify: require('../plugins/gulp-urify'),
};

/**
 * nunjucks模板编译任务注册方法
 * @param {Object} options 任务配置
 * @param {String} options.taskName 自定义任务名称
 * @param {String} options.src 待处理文件
 * @param {String} options.dest 处理后存放目录
 * @param {Boolean} options.watch 是否监听
 * @param {Function} options.taskHandler 自定义任务处理方法
 * @param {Object} options.changedDeps changedDeps配置
 * @param {Object} options.nunjucks nunjucks配置
 * @param {String|Function|Object|Array} options.urify uri 转换配置
 */
module.exports = (options) => {
  const {
    taskName = 'nunjucks',
    src,
    dest,
    watch,
    taskHandler = () => {
      let stream = gulp.src(src)
        .pipe(plugins.plumber())
        .pipe(plugins.changedDeps(dest, changedDeps)) // 忽略未更改的文件(包含依赖分析功能)
        .pipe(plugins.nunjucks.compile(nunjucks))
        .pipe(gulp.dest(dest));

      if (urify) {
        const multiUrify = Array.isArray(urify) ? urify : [urify];
        multiUrify.forEach((urify) => {
          stream = stream.pipe(plugins.urify(urify)).pipe(gulp.dest(dest));
        });
      }

      return stream;
    },
    changedDeps = { syntax: 'nunjucks', base: true },
    nunjucks = {},
    urify,
  } = options;

  gulp.task(taskName, taskHandler);

  if (watch) {
    gulp.task(`${taskName}:watch`, [taskName], () => {
      gulp.watch(src, [taskName]);
    });
  }
};
