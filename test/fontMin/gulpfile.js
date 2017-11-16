const gulp = require('gulp');
const runSequence = require('run-sequence');

require('../../lib/clean.js')({
  src: './dest',
});

require('../../lib/fontMin.js')({
  src: './src/FZZCYSK/*.ttf',
  dest: './dest/font/FZZCYSK',
  watch: true,
  textFile: './src/FZZCYSK/words.txt',
});

gulp.task('default', ['clean'], () => {
  runSequence(['fontMin:watch']);
});
