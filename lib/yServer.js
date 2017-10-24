/**
 * yServer
 */
'use strict';

const gulp = require('gulp');

/**
 * yServer任务注册方法
 * @param {Object} options 任务配置
 * @param {String} options.taskName 自定义任务名称
 * @param {Boolean} options.hot 是否热加载(即文件变更重启server)
 * @param {String|Object} options.yServerConfig yServer配置
 */
module.exports = (options) => {
  let yServer;
  try {
    yServer = require('y-server');
  } catch (ex) {
    throw new Error('要想使用yServer功能，请先安装"y-server"模块: npm i --save-dev y-server');
  }

  const {
    taskName = 'yServer',
    taskHandler = () => {
      if (hot) {
        return yServer.run(yServerConfig);
      }
      return yServer(yServerConfig);
    },
    hot = true,
    yServerConfig,
  } = options;

  gulp.task(taskName, taskHandler);
};
