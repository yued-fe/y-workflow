/**
 * sequence
 */
const gulp = require('gulp');
const runSequence = require('run-sequence');

/**
 * 顺序执行任务注册方法
 * @param {Object} options 任务配置
 * @param {String} options.taskName 自定义任务名称
 * @param {Array} options.tasks 任务数组
 */
module.exports = (options) => {
  const {
    taskName = 'sequence',
    tasks,
  } = options;

  gulp.task(taskName, (done) => {
    runSequence(...tasks, done);
  });
};
