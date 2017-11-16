const gulp = require('gulp');
const runSequence = require('run-sequence');

require('../../lib/clean.js')({
  src: './dest',
});

require('../../lib/copy.js')({
  src: './src/**/*',
  dest: './dest',
  watch: true,
  copyOptions: { dot: true },
});

gulp.task('default', ['clean'], () => {
  setTimeout(() => runSequence(['copy:watch']), 1000);
});
