const gulp = require('gulp');
const runSequence = require('run-sequence');

require('../../lib/clean.js')({
  src: './dest',
});

require('../../lib/sass.js')({
  src: './src/**/*.scss',
  dest: './dest/css',
  watch: true,
  urifyBase: './dest',
});

gulp.task('default', ['clean'], () => {
  runSequence(['sass', 'sass:watch']);
});
