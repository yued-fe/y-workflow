const gulp = require('gulp');
const runSequence = require('run-sequence');

const createRevTask = require('../../lib/rev.js');

require('../../lib/clean.js')({
  src: './dest',
});

createRevTask({
  taskName: 'rev:assets',
  src: ['./src/**/*', '!./src/**/*+(css|js|html|map|json)'],
  dest: './dest/static',
  manifest: './dest/rev-manifest.json',
});

createRevTask({
  taskName: 'rev:css',
  src: './src/**/*.css',
  dest: './dest/static',
  manifest: './dest/rev-manifest.json',
  revReplace: true,
  urifyBase: './dest',
});

createRevTask({
  taskName: 'rev:js',
  src: './src/**/*.js',
  dest: './dest/static',
  manifest: './dest/rev-manifest.json',
  revReplace: true,
  urifyBase: './dest/static',
  urifyOptions: 'static',
});

createRevTask({
  taskName: 'rev:html',
  src: './src/**/*.html',
  dest: './dest',
  manifest: './dest/rev-manifest.json',
  rev: false,
  revReplace: true,
  urifyBase: './dest',
  urifyOptions: '/static',
});

gulp.task('default', ['clean'], () => {
  runSequence('rev:assets', 'rev:css', 'rev:js', 'rev:html');
});
