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
  urify: {
    base: './dest/static',
    replace: d => `/static${d}`,
  },
});

createRevTask({
  taskName: 'rev:js',
  src: './src/**/*.js',
  dest: './dest/static',
  manifest: './dest/rev-manifest.json',
  revReplace: {},
  urify: {
    base: './dest/static',
    replace: d => `/static${d}`,
  },
});

createRevTask({
  taskName: 'rev:html',
  src: './src/**/*.html',
  dest: './dest',
  manifest: './dest/rev-manifest.json',
  rev: false,
  revReplace: {},
  urify: d => `/static${d}`,
});

require('../../lib/yServer.js')({
  yServerConfig: {
    port: 8080,
    plugins: [
      require('y-server-plugin-static')({
        staticPaths: './dest',
      }),
    ],
  },
});

gulp.task('default', ['clean'], () => {
  runSequence('rev:assets', 'rev:css', 'rev:js', 'rev:html', 'yServer');
});
