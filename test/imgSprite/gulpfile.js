const gulp = require('gulp');
const runSequence = require('run-sequence');

require('../../lib/clean.js')({
  src: './dest',
});

require('../../lib/imgSprite.js')({
  src: './src/*.png',
  dest: './dest/icon',
  watch: true,
  urify: './dest',
});

gulp.task('default', ['clean'], () => {
  runSequence(['imgSprite', 'imgSprite:watch']);
});
