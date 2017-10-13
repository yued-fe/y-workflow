const gulp = require('gulp');
const runSequence = require('run-sequence');

require('../../lib/clean.js')({
  src: './dest',
});

require('../../lib/sass.js')({
  src: './src/**/*.scss',
  dest: './dest/static/css',
  watch: true,
  urify: {
    root: './dest',
    absBase: './dest/static',
  },
});

gulp.task('default', ['clean'], () => {
  runSequence(['sass', 'sass:watch']);
});
