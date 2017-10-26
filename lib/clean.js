/**
 * 删除
 */
const gulp = require('gulp');
const del = require('del');

const arrayify = obj => (Array.isArray(obj) ? obj : [obj]);

/**
 * 删除任务注册方法
 * @param {Object} options 任务配置
 * @param {String} options.taskName 自定义任务名称
 * @param {String} options.src 待处理文件
 * @param {Function} options.taskHandler 自定义任务处理方法
 * @param {Object} options.delOptions del配置参数
 */
module.exports = (options) => {
  const {
    taskName = 'clean',
    src,
    taskHandler = () => {
      return del(arrayify(src), delOptions);
    },
    delOptions = { dot: true, force: true },
  } = options;

  gulp.task(taskName, taskHandler);
};
