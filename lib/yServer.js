/**
 * yServer
 */
const path = require('path');

const gulp = require('gulp');
const yServer = require('y-server');

/**
 * yServer任务注册方法
 * @param {Object} options 任务配置
 * @param {String} options.taskName 自定义任务名称
 * @param {Boolean} options.hot 是否热加载(即文件变更重启server)
 * @param {String|Object} options.yServerConfig yServer配置
 */
module.exports = (options) => {
  const {
    taskName = 'yServer',
    taskHandler = () => {
      if (hot) {
        return yServer.run(yServerConfig);
      }
      if (typeof yServerConfig === 'string') {
        return yServer(require(path.resolve(yServerConfig)));
      }
      return yServer(yServerConfig);
    },
    hot,
    yServerConfig,
  } = options;

  gulp.task(taskName, taskHandler);
};
