const gulp = require('gulp');
const runSequence = require('run-sequence');

require('../../lib/clean.js')({
  src: './dest',
});

require('../../lib/svgSprite.js')({
  src: './src/*.svg',
  dest: './dest',
  watch: true,
  // spritedFilename: 'svg-sprite.svg',
});

gulp.task('default', ['clean'], () => {
  runSequence(['svgSprite:watch']);
});
