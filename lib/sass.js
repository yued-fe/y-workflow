/**
 * sass编译
 */
'use strict';

const path = require('path');

const gulp = require('gulp');
const plugins = {
  changedDeps: require('../plugins/gulp-changed-deps'),
  if: require('gulp-if'),
  plumber: require('gulp-plumber'),
  urify: require('../plugins/gulp-urify'),
};

/**
 * sass编译任务注册方法
 * @param {Object} options 任务配置
 * @param {String} options.taskName 自定义任务名称
 * @param {String} options.src 待处理文件
 * @param {String} options.dest 处理后存放目录
 * @param {Boolean} options.watch 是否监听
 * @param {Function} options.taskHandler 自定义任务处理方法
 * @param {Object} options.sass sass配置
 * @param {String} options.sourcemaps sourcemaps存放目录
 * @param {String} options.urifyBase uri 转换基础路径
 * @param {Object} options.urifyOptions uri 转换配置
 */
module.exports = (options) => {
  try {
    plugins.sass = require('gulp-sass');
    plugins.sourcemaps = require('gulp-sourcemaps');
  } catch (ex) {
    throw new Error('要想SASS编译功能，请先安装"gulp-sass"和"gulp-sourcemaps"模块: npm i --save-dev gulp-sass gulp-sourcemaps');
  }

  const {
    taskName = 'sass',
    src,
    dest,
    watch,
    taskHandler = () => {
      const stream = gulp.src(src)
        .pipe(plugins.plumber())
        .pipe(plugins.changedDeps(dest, { extension: '.css' })) // 忽略未更改的文件(包含依赖分析功能)
        .pipe(plugins.if(!!sourcemaps, plugins.sourcemaps.init()))
        .pipe(plugins.sass(sass).on('error', plugins.sass.logError))
        .pipe(plugins.if(!!sourcemaps, plugins.sourcemaps.write(sourcemaps)))
        .pipe(gulp.dest(dest));

      if (urifyBase) {
        return stream.pipe(plugins.urify(urifyBase, urifyOptions)).pipe(gulp.dest(dest));
      }

      return stream;
    },
    sass = {},
    sourcemaps = '.map',
    urifyBase,
    urifyOptions = {},
  } = options;

  gulp.task(taskName, taskHandler);

  if (watch) {
    gulp.task(`${taskName}:watch`, [taskName], () => {
      gulp.watch(src, [taskName]);
    });
  }
};
