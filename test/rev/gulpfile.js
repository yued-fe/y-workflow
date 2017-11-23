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
  revReplace: {},
});

createRevTask({
  taskName: 'rev:js',
  src: './src/**/*.js',
  dest: './dest/static',
  revAll: {},
  manifest: './dest/rev-manifest.json',
  revReplace: {},
});

require('../../lib/revReplace.js')({
  taskName: 'revReplace:html',
  src: './src/**/*.html',
  dest: './dest',
  manifest: './dest/rev-manifest.json',
});

gulp.task('server', () => {
  require('y-server')({
    port: 8080,
    plugins: [
      {
        $name: 'static',
        staticPaths: './dest',
      },
    ],
  });
});

gulp.task('default', ['clean'], () => {
  runSequence('rev:assets', 'rev:css', 'rev:js', 'revReplace:html', 'server');
});
