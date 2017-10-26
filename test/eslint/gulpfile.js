const gulp = require('gulp');
const runSequence = require('run-sequence');

require('../../lib/eslint.js')({
  src: './src/**/*.js',
  watch: true,
});

gulp.task('default', () => {
  runSequence(['eslint:watch']);
});
