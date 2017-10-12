const gulp = require('gulp');
const runSequence = require('run-sequence');

require('../../lib/copy.js')({
  src: '../copy/src/**/*',
  dest: '../copy/dest',
});

require('../../lib/clean.js')({
  src: '../copy/dest',
});

gulp.task('default', ['copy'], () => {
  setTimeout(() => runSequence(['clean']), 1000);
});
