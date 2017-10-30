/**
 * svg图标合并
 */
const path = require('path');

const gulp = require('gulp');
const plugins = {
  if: require('gulp-if'),
  newer: require('gulp-newer'),
  plumber: require('gulp-plumber'),
  rename: require('gulp-rename'),
  svgmin: require('gulp-svgmin'),
  svgstore: require('gulp-svgstore'),
  svgJsify: require('../plugins/gulp-svg-jsify'),
};

/**
 * svg图标合并任务注册方法
 * @param {Object} options 任务配置
 * @param {String} options.taskName 自定义任务名称
 * @param {String} options.src 待处理文件
 * @param {String} options.dest 处理后存放目录
 * @param {Boolean} options.watch 是否监听
 * @param {Function} options.taskHandler 自定义任务处理方法
 * @param {Object} options.svgmin svgmin配置
 * @param {Object} options.svgstore svgstore配置
 * @param {String} options.spritedFilename 合并之后文件名
 */
module.exports = (options) => {
  const {
    taskName = 'svgSprite',
    src,
    dest,
    watch,
    taskHandler = () => {
      const spritedFilePath = path.join(dest, spritedFilename);

      return gulp.src(src)
        .pipe(plugins.plumber())
        .pipe(plugins.newer(spritedFilePath)) // 忽略未更改的文件(多对一)
        .pipe(plugins.svgmin(svgmin))
        .pipe(plugins.svgstore(svgstore))
        .pipe(plugins.if(path.extname(spritedFilename) === '.js', plugins.svgJsify())) // svg 转 js 文件
        .pipe(plugins.rename(spritedFilename))
        .pipe(gulp.dest(dest));
    },
    svgmin = {
      plugins: [
        { removeAttrs: { attrs: '(fill|fill-rule)' } },
        { removeTitle: true },
      ],
    },
    svgstore = { inlineSvg: true },
    spritedFilename = 'svg-sprite.js',
  } = options;

  gulp.task(taskName, taskHandler);

  if (watch) {
    gulp.task(`${taskName}:watch`, [taskName], () => {
      gulp.watch(src, [taskName]);
    });
  }
};
