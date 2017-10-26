const { fork } = require('child_process');
const fs = require('fs');
const path = require('path');

const abs = file => path.join(__dirname, file);

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
        task();
      }
    });
  }

  return yWorkflow;
}

yWorkflow.run = function (task, options) {
  const configFileName = path.resolve(options.config || 'y-workflow.config.js');

  if (fs.existsSync(configFileName)) {
    const fileNames = {
      gulp: path.join(path.dirname(require.resolve('gulp')), 'bin/gulp.js'),
      gulpfile: abs('gulpfile.js'),
      cwd: path.dirname(configFileName),
      yWorkflowConfig: configFileName,
    };
    const args = [fileNames.gulp, task, '--gulpfile', fileNames.gulpfile, '--cwd', fileNames.cwd, '--yWorkflowConfig', fileNames.yWorkflowConfig];

    fork(args[0], args.slice(1));
  } else {
    console.log(`配置文件 '${configFileName}' 未找到`.red); // eslint-disable-line no-console
    process.exit(0);
  }
};

exports = module.exports = yWorkflow;
