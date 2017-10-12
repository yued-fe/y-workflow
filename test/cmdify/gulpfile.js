const gulp = require('gulp');
const runSequence = require('run-sequence');

require('../../lib/clean.js')({
  src: './dest',
});

require('../../lib/cmdify.js')({
  src: './src/js/**/*.js',
  dest: './dest/static/js',
  watch: true,
  cmdify: 'static/js',
  urifyBase: './dest/static',
  urifyOptions: 'static',
});

gulp.task('default', ['clean'], () => {
  runSequence(['cmdify', 'cmdify:watch']);
});
