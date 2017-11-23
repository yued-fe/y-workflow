const gulp = require('gulp');
const runSequence = require('run-sequence');

require('../../lib/clean.js')({
  src: './dest',
});

require('../../lib/ejs.js')({
  src: './src/**/*.html',
  dest: './dest',
  watch: true,
  ejs: {},
});

gulp.task('default', ['clean'], () => {
  runSequence(['ejs:watch']);
});
