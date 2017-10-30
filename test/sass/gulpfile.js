const gulp = require('gulp');
const runSequence = require('run-sequence');

require('../../lib/clean.js')({
  src: './dest',
});

require('../../lib/sass.js')({
  src: './src/**/*.scss',
  dest: './dest/static/css',
  watch: true,
  sourcemaps: '.map',
  urify: {
    base: './dest/static',
    replace: d => `/static${d}`,
  },
});

gulp.task('default', ['clean'], () => {
  runSequence(['sass:watch']);
});
