const gulp = require('gulp');
const runSequence = require('run-sequence');

require('../../lib/clean.js')({
  src: './dest',
});

require('../../lib/multiple.js')({
  taskName: 'icon:img',
  srcDirs: './src/icon/*/',
  srcFiles: '**/*.{png,PNG}',
  destDir: './dest/icon',
  watch: true,
  lib: 'imgSprite',
  libOptions: {
    urify: './dest'
  },
});

require('../../lib/multiple.js')({
  taskName: 'icon:svg',
  srcDirs: './src/icon/*/',
  srcFiles: '**/*.{svg,SVG}',
  destDir: './dest/icon',
  watch: true,
  lib: 'svgSprite',
});

gulp.task('default', ['clean'], () => {
  runSequence(['icon:img:watch', 'icon:svg:watch']);
});
