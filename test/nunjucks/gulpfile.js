const gulp = require('gulp');
const runSequence = require('run-sequence');

require('../../lib/clean.js')({
  src: './dest',
});

require('../../lib/nunjucks.js')({
  src: './src/**/*.html',
  dest: './dest',
  watch: true,
  urifyBase: './dest',
});

gulp.task('default', ['clean'], () => {
  runSequence(['nunjucks', 'nunjucks:watch']);
});
