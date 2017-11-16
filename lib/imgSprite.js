/**
 * 图像合并
 */
const path = require('path');

const gulp = require('gulp');
const plugins = {
  cssUrlAbsify: require('../plugins/gulp-css-url-absify'),
  newer: require('gulp-newer'),
  plumber: require('gulp-plumber'),
  responsive: require('gulp-responsive'),
  spritesmith: require('gulp.spritesmith'),
};

/**
 * 图片合并任务注册方法
 * @param {Object} options 任务配置
 * @param {String} options.taskName 自定义任务名称
 * @param {String} options.src 待处理文件
 * @param {String} options.dest 处理后存放目录
 * @param {Boolean} options.watch 是否监听
 * @param {Function} options.taskHandler 自定义任务处理方法
 * @param {Object} options.responsive responsive配置
 * @param {Object} options.spritesmith spritesmith配置
 * @param {String} options.cssUrlAbsify cssUrlAbsify 配置
 */
module.exports = (options) => {
  const {
    taskName = 'imgSprite',
    src,
    dest,
    watch,
    taskHandler = () => {
      let stream = gulp.src(src)
        .pipe(plugins.plumber())
        .pipe(plugins.newer(path.join(dest, spritesmith.imgName))) // 忽略未更改的文件(多对一)
        .pipe(plugins.responsive(responsive, { errorOnUnusedConfig: false }))
        .pipe(plugins.spritesmith(spritesmith));

      if (cssUrlAbsify) {
        stream = stream.pipe(gulp.dest(dest)).pipe(plugins.cssUrlAbsify(cssUrlAbsify));
      }

      return stream.pipe(gulp.dest(dest));
    },
    responsive = {
      '**/*': [{
        min: true,
        width: '50%',
      }, {
        min: true,
        rename: { suffix: '@2x' },
      }],
    },
    spritesmith = {
      imgName: 'img-sprite.png',
      cssName: 'img-sprite.css',
      padding: 4,
      retinaSrcFilter: '**/*@2x.png',
      retinaImgName: 'img-sprite@2x.png',
    },
    cssUrlAbsify,
  } = options;

  gulp.task(taskName, taskHandler);

  if (watch) {
    gulp.task(`${taskName}:watch`, [taskName], () => {
      gulp.watch(src, [taskName]);
    });
  }
};
