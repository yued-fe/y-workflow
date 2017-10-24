const gulp = require('gulp');
const runSequence = require('run-sequence');

require('../../lib/clean.js')({
  src: './dest',
});

require('../../lib/imgMin.js')({
  src: './src/*.{png,jpg}',
  dest: './dest',
  watch: true,
});

gulp.task('default', ['clean'], () => {
  runSequence(['imgMin:watch']);
});
