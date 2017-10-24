const gulp = require('gulp');
const runSequence = require('run-sequence');

const config = require('./y-workflow.config.js');

config.tasks.forEach((options) => {
  const createTask = require(`../../lib/${options.$lib}.js`);

  options = Object.assign({}, options);
  delete options.$lib;

  createTask(options);
});

gulp.task('dev', (cb) => {
  runSequence.apply(null, config.dev.concat(cb));
});

gulp.task('build', (cb) => {
  runSequence.apply(null, config.build.concat(cb));
});

gulp.task('default', ['dev']);
