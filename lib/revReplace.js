/**
 * revision replace
 */
'use strict';

const path = require('path');

const gulp = require('gulp');
const plugins = {
};

/**
 * revision replace 任务注册方法
 * @param {Object} options 任务配置
 * @param {String} options.taskName 自定义任务名称
 * @param {String} options.src 待处理文件
 * @param {String} options.dest 处理后存放目录
 * @param {String} options.manifest rev 的 manifest 文件路径
 * @param {Object} options.revReplace revReplace 配置
 */
module.exports = (options) => {
  try {
    plugins.revReplace = require('gulp-rev-replace');
  } catch (ex) {
    throw new Error('要想使用rev功能，请先安装gulp-rev-replace"模块: npm i --save-dev gulp-rev-replace');
  }

  const {
    taskName = 'revReplace',
    src,
    dest,
    taskHandler = () => {
      Object.assign(revReplace, { manifest: gulp.src(manifest) });

      return gulp.src(src)
        .pipe(plugins.revReplace(revReplace))
        .pipe(gulp.dest(dest));
    },
    manifest = path.resolve(dest, 'rev-manifest.json'),
    revReplace = {},
  } = options;

  gulp.task(taskName, taskHandler);
};
