/**
 * 字体压缩
 */
'use strict';

const fs = require('fs');
const path = require('path');

const gulp = require('gulp');
const plugins = {
  newer: require('gulp-newer'),
  plumber: require('gulp-plumber'),
  urify: require('../plugins/gulp-urify'),
};

/**
 * 字体压缩任务注册方法
 * @param {Object} options 任务配置
 * @param {String} options.taskName 自定义任务名称
 * @param {String} options.src 待处理文件
 * @param {String} options.dest 待处理文件
 * @param {Boolean} options.watch 是否监听
 * @param {Function} options.taskHandler 自定义任务处理方法
 * @param {Object} options.fontMin fontMin配置
 * @param {String} options.textFile 记录要压缩文字的文件
 * @param {String} options.urifyBase uri 转换基础路径
 * @param {Object} options.urifyOptions uri 转换配置
 */
module.exports = (options) => {
  try {
    plugins.fontmin = require('gulp-fontmin');
  } catch (ex) {
    throw new Error('要想使用字体压缩功能，请先安装"gulp-fontmin"模块: npm i --save-dev gulp-fontmin');
  }

  const {
    taskName = 'fontMin',
    src,
    dest,
    watch,
    taskHandler = () => {
      const newer = { dest }; // 这里直接填写 dest 表示比较与 src 同名文件，基本就是指 ttf 文件

      if (isTextFileExists) {
        newer.extra = textFilePath;
        fontMin.text = fs.readFileSync(textFilePath, 'utf-8');
      }

      const stream = gulp.src(src)
        .pipe(plugins.plumber())
        .pipe(plugins.newer(newer)) // 忽略未更改的文件(多对一)
        .pipe(plugins.fontmin(fontMin))
        .pipe(gulp.dest(dest));

      if (urifyBase) {
        return stream.pipe(plugins.urify(urifyBase, urifyOptions)).pipe(gulp.dest(dest));
      }

      return stream;
    },
    fontMin = {},
    textFile,
    urifyBase,
    urifyOptions = {
      keyword: 'url',
      replace: d => `url("${d}")`,
    },
  } = options;

  const textFilePath = textFile ? path.resolve(textFile) : null;
  const isTextFileExists = textFilePath && fs.existsSync(textFilePath);

  gulp.task(taskName, taskHandler);

  if (watch) {
    gulp.task(`${taskName}:watch`, [taskName], () => {
      if (isTextFileExists) {
        gulp.watch(textFilePath, [taskName]);
      }
      gulp.watch(src, [taskName]);
    });
  }
};
