/**
 * revision replace
 */
'use strict';

const path = require('path');

const gulp = require('gulp');
const plugins = {
  if: require('gulp-if'),
};

/**
 * revision replace 任务注册方法
 * @param {Object} options 任务配置
 * @param {String} options.taskName 自定义任务名称
 * @param {String} options.src 待处理文件
 * @param {String} options.dest 处理后存放目录
 * @param {String} options.manifest rev 的 manifest 文件路径
 * @param {Object} options.revReplace revReplace 配置
 * @param {Array} options.replace replace 配置，给 gulp-replace 的参数
 */
module.exports = (options) => {
  try {
    plugins.replace = require('gulp-replace');
    plugins.revReplace = require('gulp-rev-replace');
  } catch (ex) {
    throw new Error('要想使用rev功能，请先安装"gulp-replace"和"gulp-rev-replace"模块: npm i --save-dev gulp-replace gulp-rev-replace');
  }

  const {
    taskName = 'revReplace',
    src,
    dest,
    taskHandler = () => {
      Object.assign(revReplace, { manifest: gulp.src(manifest) });

      return gulp.src(src)
        .pipe(plugins.revReplace(revReplace))
        .pipe(plugins.if(!!replace, plugins.replace.apply(null, replace)))
        .pipe(gulp.dest(dest));
    },
    manifest = path.resolve(dest, 'rev-manifest.json'),
    revReplace = {},
    replace,
  } = options;

  gulp.task(taskName, taskHandler);
};
