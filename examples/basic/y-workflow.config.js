module.exports = {
  tasks: [
    // dev
    {
      $lib: 'sequence',
      taskName: 'dev',
      tasks: [['clean:cache'], ['fontMin:watch', 'imgMin:watch', 'imgSprite:watch', 'svgSprite:watch', 'css:dev:watch', 'js:watch', 'html:watch'], 'yServer:dev'],
    },

    // build
    {
      $lib: 'sequence',
      taskName: 'build',
      tasks: [['clean:cache', 'clean:dest'], ['fontMin', 'imgMin', 'imgSprite', 'svgSprite', 'js', 'css:build', 'html'], 'rev:assets', 'rev:css', 'rev:js', 'revReplace', 'cmdifyReplace', 'yServer:pro'],
    },

    // server
    {
      $lib: 'yServer',
      taskName: 'yServer:dev',
      yServerConfig: './y-server.config.js',
      hot: true,
    },
    {
      $lib: 'yServer',
      taskName: 'yServer:pro',
      yServerConfig: {
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
              return result;
            },
          },
          (app) => {
            app.get('/', (req, res) => {
              res.render('index.html');
            });
          },
        ],
      },
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
      srcDirs: './src/font/*/',
      srcFiles: '*.ttf',
      destDir: './.cache/static/font',
      watch: true,
      lib: 'fontMin',
      libOptions: (name) => ({
        textFile: `./src/font/${name}/words.txt`,
        urify: './.cache',
      }),
    },

    // 图片
    {
      $lib: 'imgMin',
      src: './src/img/**/*',
      dest: './.cache/static/img',
      watch: true,
    },

    // 图标
    {
      $lib: 'imgSprite',
      src: './src/icon/**/*.png',
      dest: './.cache/static/icon',
      watch: true,
      urify: './.cache',
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
      src: './src/css/**/*.scss',
      dest: './.cache/static/css',
      watch: true,
      sourcemaps: './.map',
      urify: {
        base: './.cache/static',
        replace: d => `/static${d}`,
      },
    },
    {
      $lib: 'sass',
      taskName: 'css:build',
      src: './src/css/**/*.scss',
      dest: './.cache/static/css',
      urify: {
        base: './.cache/static',
        replace: d => `/static${d}`,
      },
    },

    // js
    {
      $lib: 'cmdify',
      taskName: 'js',
      src: './src/js/**/*.js',
      dest: './.cache/static/js',
      watch: true,
      urify: {
        base: './.cache/static',
        replace: d => `site${d}`,
      },
      cmdify: 'site/js',
      manifest: './.cache/cmdify-manifest.json',
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
      src: ['./.cache/static/**/*', '!./.cache/static/**/*+(css|js|html|map|json)'],
      dest: './dest/static',
      manifest: './dest/rev-manifest.json',
    },
    {
      $lib: 'rev',
      taskName: 'rev:css',
      src: './.cache/static/**/*.css',
      dest: './dest/static',
      manifest: './dest/rev-manifest.json',
      revReplace: {},
    },
    {
      $lib: 'rev',
      taskName: 'rev:js',
      src: './.cache/static/**/*.js',
      dest: './dest/static',
      manifest: './dest/rev-manifest.json',
      revReplace: {
        modifyUnreved: d => d.startsWith('js/') ? '__js_loader_alias_instead_rev_replace__' : d,
      },
    },
    {
      $lib: 'revReplace',
      src: './.cache/server/views/**/*.html',
      dest: './dest/server/views',
      manifest: './dest/rev-manifest.json',
      revReplace: {
        modifyUnreved: d => d.startsWith('js/') ? '__js_loader_alias_instead_rev_replace__' : d,
      },
    },
    {
      $lib: 'cmdifyReplace',
      src: './dest/server/views/**/*.html',
      dest: './dest/server/views',
      cmdifyManifest: './.cache/cmdify-manifest.json',
      revManifest: './dest/rev-manifest.json',
      aliasPlaceholder: '/* __cmd_loader_config_alias__ */',
      cmdKeyword: 'LBF',
    },
  ],
};
