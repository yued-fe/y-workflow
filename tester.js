const { fork } = require('child_process');
const fs = require('fs');
const path = require('path');

const gutil = require('gulp-util');

const gulpBin = path.join(path.dirname(require.resolve('gulp')), 'bin/gulp.js');
const yWorkflowBin = path.resolve('./bin/y-workflow.js');

const { lib, example } = gutil.env;

if (lib) {
  const [libName, libTask = 'default'] = lib.split(':');
  const libGulpfile = `./test/${libName}/gulpfile.js`;
  if (fs.existsSync(libGulpfile)) {
    fork(gulpBin, [libTask, '--gulpfile', libGulpfile]);
  }
}

if (example) {
  const [exampleName, exampleTask = 'default'] = example.split(':');
  const yWorkflowConfigFile = `./examples/${exampleName}/y-workflow.config.js`;
  if (fs.existsSync(yWorkflowConfigFile)) {
    fork(yWorkflowBin, ['run', exampleTask, '--config', yWorkflowConfigFile]);
  }
}
