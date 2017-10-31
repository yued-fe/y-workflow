const gulp = require('gulp');
const runSequence = require('run-sequence');

require('../../lib/clean.js')({
  src: './dest',
});

require('../../lib/cmdifyReplace.js')({
  src: './src/**/*.html',
  dest: './dest',
  cmdifyManifest: './src/cmdify-manifest.json',
  revManifest: './src/rev-manifest.json',
  aliasPlaceholder: '/* __cmd_config_alias__ */',
  cmdKeyword: 'LBF',
});

gulp.task('default', ['clean'], () => {
  runSequence(['cmdifyReplace']);
});
