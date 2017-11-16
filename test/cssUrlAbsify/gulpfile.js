const gulp = require('gulp');
const runSequence = require('run-sequence');

require('../../lib/clean.js')({
  src: './dest',
});

require('../../lib/cssUrlAbsify.js')({
  src: './src/**/*.css',
  dest: './dest',
  watch: true,
  cssUrlAbsify: './dest',
});

gulp.task('default', ['clean'], () => {
  runSequence(['cssUrlAbsify:watch']);
});
