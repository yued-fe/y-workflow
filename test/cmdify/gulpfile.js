const gulp = require('gulp');
const runSequence = require('run-sequence');

require('../../lib/clean.js')({
  src: './dest',
});

require('../../lib/cmdify.js')({
  src: './src/js/**/*.js',
  dest: './dest/static/js',
  watch: true,
  urify: {
    base: './dest/static', // ./a.js => /js/a.js
    replace: d => `site${d}`, // /js/a.js => site/js/a.js
  },
  cmdify: 'site/js',
  manifest: './dest/static/cmdify-manifest.json',
});

gulp.task('default', ['clean'], () => {
  runSequence(['cmdify:watch']);
});
