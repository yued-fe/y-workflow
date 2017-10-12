/**
 * 图像合并
 */
'use strict';

const path = require('path');

const gulp = require('gulp');
const plugins = {
  newer: require('gulp-newer'),
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
 * @param {Object} options.responsive responsive配置
 * @param {Object} options.spritesmith spritesmith配置
 * @param {String} options.urifyBase uri 转换基础路径
 * @param {Object} options.urifyOptions uri 转换配置
 */
module.exports = (options) => {
  try {
    plugins.responsive = require('gulp-responsive');
    plugins.spritesmith = require('gulp.spritesmith');
  } catch (ex) {
    throw new Error('要想使用图片合并功能，请先安装"gulp-responsive"和"gulp.spritesmith"模块: npm i --save-dev gulp-responsive gulp.spritesmith');
  }

  const {
    taskName = 'imgSprite',
    src,
    dest,
    watch,
    taskHandler = () => {
      const stream = gulp.src(src)
        .pipe(plugins.plumber())
        .pipe(plugins.newer(path.join(dest, spritesmith.imgName))) // 忽略未更改的文件(多对一)
        .pipe(plugins.responsive(responsive, { errorOnUnusedConfig: false }))
        .pipe(plugins.spritesmith(spritesmith))
        .pipe(gulp.dest(dest));

      if (urifyBase) {
        return stream.pipe(plugins.urify(urifyBase, urifyOptions)).pipe(gulp.dest(dest));
      }

      return stream;
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
    urifyBase,
    urifyOptions = {
      keyword: 'url',
      replace: d => `url("${d}")`,
    },
  } = options;

  gulp.task(taskName, taskHandler);

  if (watch) {
    gulp.task(`${taskName}:watch`, [taskName], () => {
      gulp.watch(src, [taskName]);
    });
  }
};
