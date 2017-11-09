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
  depsPlaceholder: '/* __cmd_config_deps__ */',
  cmdKeyword: 'LBF',
  revCmdify: d => d.replace(/^static/, 'site'),
});

gulp.task('default', ['clean'], () => {
  runSequence(['cmdifyReplace']);
});
