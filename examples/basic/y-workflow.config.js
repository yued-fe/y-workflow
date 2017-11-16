const yServer = require('y-server');

module.exports = {
  tasks: [
    // dev
    {
      $lib: 'sequence',
      taskName: 'dev',
      tasks: [['fontMin:watch'], ['font:watch', 'imgMin:watch', 'imgSprite:watch', 'svgSprite:watch', 'css:dev:watch', 'js:watch', 'eslint:watch', 'html:watch'], 'server:dev'],
    },

    // build
    {
      $lib: 'sequence',
      taskName: 'build',
      tasks: [['clean:cache', 'clean:dest', 'fontMin:watch'], ['font', 'imgMin', 'imgSprite', 'svgSprite', 'css:build', 'js', 'html'], 'rev:assets', 'rev:css', 'rev:js', 'revReplace', 'cmdifyReplace', 'combo', 'server:pro'],
    },

    // server
    (gulp) => {
      gulp.task('server:dev', () => {
        yServer.run('./y-server.config.js');
      })
    },
    (gulp) => {
      gulp.task('server:pro', () => {
        yServer({
          port: 8080,
          plugins: [
            {
              $name: 'static',
              staticPaths: {
                '/static': './dest/static',
              },
            },
            {
              $name: 'ejs',
              viewDir: './dest/server/views',
              renderAdapter: (result) => {
                result.$static = '//127.0.0.1:8080';
                result.$env = 'demo';
                return result;
              },
            },
            (app) => {
              app.get('/', (req, res) => {
                res.render('index.html');
              });
            },
          ],
        });
      })
    },

    // clean
    {
      $lib: 'clean',
      taskName: 'clean:cache',
      src: './.cache',
    },
    {
      $lib: 'clean',
      taskName: 'clean:dest',
      src: './dest',
    },

    // 字体
    {
      $lib: 'multiple',
      taskName: 'fontMin',
      srcDirs: './src/font/.src/*/',
      srcFiles: '*.ttf',
      destDir: './src/font',
      watch: true,
      lib: 'fontMin',
      libOptions: (name) => ({
        textFile: `./src/font/.src/${name}/words.txt`,
      }),
    },
    {
      $lib: 'cssUrlAbsify',
      taskName: 'font',
      src: './src/@(font)/**/*',
      dest: './.cache/static',
      watch: true,
      cssUrlAbsify: './.cache',
    },

    // 图片
    {
      $lib: 'imgMin',
      src: './src/@(img)/**/*',
      dest: './.cache/static',
      watch: true,
    },

    // 图标
    {
      $lib: 'imgSprite',
      src: './src/icon/**/*.png',
      dest: './.cache/static/icon',
      watch: true,
      cssUrlAbsify: './.cache',
    },
    {
      $lib: 'svgSprite',
      src: './src/icon/**/*.svg',
      dest: './.cache/static/icon',
      watch: true,
    },

    // css
    {
      $lib: 'sass',
      taskName: 'css:dev',
      src: './src/@(css)/**/*.scss',
      dest: './.cache/static',
      watch: true,
      sourcemaps: './.map',
      urify: d => `/static${d}`,
    },
    {
      $lib: 'sass',
      taskName: 'css:build',
      src: './src/@(css)/**/*.scss',
      dest: './.cache/static',
      urify: d => `/static${d}`,
    },

    // js
    {
      $lib: 'cmdify',
      taskName: 'js',
      src: './src/@(js)/**/*.js',
      dest: './.cache/static',
      watch: true,
      urify: d => `site${d}`,
      cmdify: 'site',
      manifest: './.cache/cmdify-manifest.json',
    },
    {
      $lib: 'eslint',
      src: './src/@(js)/**/*.js',
      watch: true,
      eslint: {
        useEslintrc: false,
      },
    },

    // html
    {
      $lib: 'nunjucks',
      taskName: 'html',
      src: './src/views/**/*.html',
      dest: './.cache/server/views',
      watch: true,
      urify: [
        {
          keyword: '__uri',
          replace: d => `/static${d}`,
        },
        {
          keyword: '__uri\.cmdify',
          replace: d => `site${d}`,
        },
      ],
    },

    // rev
    {
      $lib: 'rev',
      taskName: 'rev:assets',
      src: ['./.cache/@(static)/**/*', '!./.cache/static/**/*.{css,js,html,map,json}'],
      dest: './dest',
      manifest: './dest/rev-manifest.json',
    },
    {
      $lib: 'rev',
      taskName: 'rev:css',
      src: './.cache/@(static)/**/*.css',
      dest: './dest',
      manifest: './dest/rev-manifest.json',
      revReplace: {},
    },
    {
      $lib: 'rev',
      taskName: 'rev:js',
      src: './.cache/@(static)/**/*.js',
      dest: './dest',
      manifest: './dest/rev-manifest.json',
      revReplace: {},
    },
    {
      $lib: 'revReplace',
      src: './.cache/server/views/**/*.html',
      dest: './dest/server/views',
      manifest: './dest/rev-manifest.json',
      revReplace: {},
    },
    {
      $lib: 'cmdifyReplace',
      src: './dest/server/views/**/*.html',
      dest: './dest/server/views',
      cmdifyManifest: './.cache/cmdify-manifest.json',
      revManifest: './dest/rev-manifest.json',
      aliasPlaceholder: '/* __cmd_loader_config_alias__ */',
      depsPlaceholder: '/* __cmd_loader_config_deps__ */',
      cmdKeyword: 'LBF',
      revCmdify: d => d.replace(/^static/, 'site'),
    },
    {
      $lib: 'combo',
      src: './dest/server/views/**/*.html',
      dest: './dest/server/views',
      combo: {
        comboDomain: '<%= $static %>',
        getCombedStylesContent: (styles, hrefs) => {
          return `
  <% if ($env == 'production') { %>
    <link rel="stylesheet" href="<%= $static %>/c/=${hrefs.join(',')}" />
  <% } else { %>
    ${styles.join('\n    ')}
  <% } %>`;
        },
      },
    },
  ],
};
