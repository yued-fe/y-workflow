const { fork } = require('child_process');
const fs = require('fs');
const path = require('path');

const gulp = require('gulp');
const gutil = require('gulp-util');

const gulpBin = path.join(path.dirname(require.resolve('gulp')), 'bin/gulp.js');

function yWorkflow(options) {
  if (!options) {
    options = {};
  }

  if (Array.isArray(options)) {
    options = { tasks: options };
  }

  const { tasks } = options;

  if (Array.isArray(tasks)) {
    tasks.forEach((task) => {
      if (task.$lib) {
        const taskOptions = Object.assign({}, task);
        delete taskOptions.$lib;

        require(`./lib/${task.$lib}.js`)(taskOptions);
      } else if (typeof task === 'function') {
        task(gulp);
      }
    });
  }

  return yWorkflow;
}

yWorkflow.run = function (task, options) {
  const configFileName = path.resolve(options.config || 'y-workflow.config.js');

  if (fs.existsSync(configFileName)) {
    fork(gulpBin, [task, '--gulpfile', __filename, '--cwd', path.dirname(configFileName), '--yWorkflowConfig', configFileName]);
  } else {
    console.log(gutil.colors.gray('[y-workflow]'), gutil.colors.red(`配置文件 '${configFileName}' 未找到`)); // eslint-disable-line no-console
    process.exit(0);
  }
};

if (gutil.env.yWorkflowConfig) {
  yWorkflow(require(gutil.env.yWorkflowConfig));
}

exports = module.exports = yWorkflow;
