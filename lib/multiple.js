/**
 * multiple
 */
'use strict';

const path = require('path');

const globby = require('globby');
const gulp = require('gulp');

/**
 * 批量任务注册方法
 * @param {Object} options 任务配置
 * @param {String} options.taskName 自定义任务名称
 * @param {String} options.srcBase src基础路径
 * @param {Array} options.srcDirs src目录
 * @param {String|Array} options.srcFiles src文件
 * @param {String} options.destDir dest目录
 * @param {Boolean} options.watch 是否监听
 * @param {String} options.lib 任务名称
 * @param {Object|Function} options.libOptions 任务配置，可为方法，传入参数为子任务路径名
 */
module.exports = (options) => {
  const {
    srcDirs,
    srcFiles,
    destDir,
    watch,
    lib,
    libOptions,
  } = options;

  const {
    taskName = lib,
    srcBase = typeof srcDirs === 'string' ? srcDirs.replace(/\/\*\/$/, '') : process.env.PWD,
  } = options;

  const taskRegister = require(`./${lib}.js`);

  const subTaskNames = [];

  globby.sync(srcDirs).forEach((srcDir) => {
    const name = path.relative(srcBase, srcDir);

    const subTaskName = `${taskName}(${name})`;
    const subTaskSrc = (Array.isArray(srcFiles) ? srcFiles : [srcFiles]).map(d => path.join(srcDir, srcFiles));
    const subTaskDest = path.join(destDir, name);

    const options = {};

    if (typeof libOptions === 'function') {
      Object.assign(options, libOptions(name));
    } else {
      Object.assign(options, libOptions);
    }

    Object.assign(options, {
      taskName: subTaskName,
      src: subTaskSrc,
      dest: subTaskDest,
      watch,
    });

    taskRegister(options);

    subTaskNames.push(subTaskName);
  });

  gulp.task(taskName, subTaskNames);

  if (watch) {
    gulp.task(`${taskName}:watch`, subTaskNames.map(subTaskName => `${subTaskName}:watch`));
  }
};
