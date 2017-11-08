/**
 * multiple
 */
const path = require('path');

const glob = require('glob');
const globParent = require('glob-parent');
const gulp = require('gulp');
const runSequence = require('run-sequence');


function arrayify(arr) {
  return Array.isArray(arr) ? arr : [arr];
}

/**
 * 批量任务注册方法
 * @param {Object} options 任务配置
 * @param {String} options.taskName 自定义任务名称
 * @param {String|Array} options.srcDirs src目录
 * @param {String|Array} options.srcFiles src文件
 * @param {String} options.destDir dest目录
 * @param {Boolean} options.watch 是否监听
 * @param {String} options.lib 任务名称
 * @param {Object|Function} options.libOptions 任务配置，可为方法，传入参数为子任务路径名
 */
module.exports = (options) => {
  const {
    taskName = 'multiple',
    srcDirs,
    srcFiles,
    destDir,
    watch,
    lib,
    libOptions,
  } = options;

  const taskRegister = require(`./${lib}.js`);

  const subTaskNames = [];

  arrayify(srcDirs).forEach((srcDirPattern) => {
    const srcBase = globParent(srcDirPattern);

    glob.sync(srcDirPattern).forEach((srcDir) => {
      const name = path.relative(srcBase, srcDir);

      const subTaskName = `${taskName}(${name})`;
      const subTaskSrc = arrayify(srcFiles).map(srcFile => path.join(srcDir, srcFile));
      const subTaskDest = path.join(destDir, name);

      const subOptions = {};

      if (typeof libOptions === 'function') {
        Object.assign(subOptions, libOptions(name));
      } else {
        Object.assign(subOptions, libOptions);
      }

      Object.assign(subOptions, {
        taskName: subTaskName,
        src: subTaskSrc,
        dest: subTaskDest,
        watch,
      });

      taskRegister(subOptions);

      subTaskNames.push(subTaskName);
    });
  });

  gulp.task(taskName, (done) => {
    runSequence(subTaskNames, done);
  });

  if (watch) {
    gulp.task(`${taskName}:watch`, (done) => {
      runSequence(subTaskNames.map(subTaskName => `${subTaskName}:watch`), done);
    });
  }
};
