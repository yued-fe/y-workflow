const gulp = require('gulp');

const config = require('./y-workflow.config.js');

config.tasks.forEach((options) => {
  const createTask = require(`../../lib/${options.$lib}.js`);

  options = Object.assign({}, options);
  delete options.$lib;

  createTask(options);
});

gulp.task('default', ['dev']);
