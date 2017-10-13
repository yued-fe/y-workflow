const gulp = require('gulp');
const runSequence = require('run-sequence');

require('../../lib/clean.js')({
  src: './dest',
});

require('../../lib/urify.js')({
  src: './src/**/*',
  dest: './dest/static',
  watch: true,
  urify: {
    root: './dest',
    absBase: './dest/static',
  },
});

gulp.task('default', ['clean'], () => {
  runSequence(['urify', 'urify:watch']);
});
