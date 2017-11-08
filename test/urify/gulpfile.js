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
    // base: './dest/static',
    replace: d => `/static${d}`,
  },
});

gulp.task('default', ['clean'], () => {
  runSequence(['urify:watch']);
});
