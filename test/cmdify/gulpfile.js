const gulp = require('gulp');
const runSequence = require('run-sequence');

require('../../lib/clean.js')({
  src: './dest',
});

require('../../lib/cmdify.js')({
  src: './src/js/**/*.js',
  dest: './dest/static/js',
  watch: true,
  cmdify: 'static/js',
  urify: {
    root: './dest', // __uri(./a.js) => /static/js/a.js
    absBase: './dest/static', // __uri(/js/b.js) => /static/js/b.js
    replace: d => d.replace(/^\//, ''), // /static/js/a.js => static/js/a.js
  },
});

gulp.task('default', ['clean'], () => {
  runSequence(['cmdify:watch']);
});
