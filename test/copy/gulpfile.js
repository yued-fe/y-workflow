const gulp = require('gulp');
const runSequence = require('run-sequence');

require('../../lib/clean.js')({
  src: './dest',
});

require('../../lib/copy.js')({
  src: './src/**/*',
  srcOptions: { dot: true },
  dest: './dest',
  watch: true,
});

gulp.task('default', ['clean'], () => {
  setTimeout(() => runSequence(['copy:watch']), 1000);
});
