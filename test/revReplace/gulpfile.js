const gulp = require('gulp');
const runSequence = require('run-sequence');

require('../../lib/clean.js')({
  src: './dest',
});

require('../../lib/revReplace.js')({
  src: './src/**/*.html',
  dest: './dest',
  manifest: './src/rev-manifest.json',
});

gulp.task('default', ['clean'], () => {
  runSequence('revReplace');
});
