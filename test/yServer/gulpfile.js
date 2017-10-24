const gulp = require('gulp');
const runSequence = require('run-sequence');

require('../../lib/yServer.js')({
  yServerConfig: './y-server.config.js',
  hot: true,
});

gulp.task('default', () => {
  runSequence(['yServer']);
});
