function getJsModuleAlias(allFiles, filterReg, prefix) {
  const alias = {};

  Object.keys(allFiles).forEach((name) => {
    if (filterReg.test(name)) {
      alias[prefix + name] = prefix + allFiles[name];
    }
  });

  return JSON.stringify(alias);
}

module.exports = {
  dev: ['clean:cache', ['fontMin:watch', 'imgMin:watch', 'imgSprite:watch', 'svgSprite:watch', 'css:watch', 'js:watch', 'html:watch']],
  build: [['clean:cache', 'clean:dest'], ['fontMin', 'imgMin', 'imgSprite', 'svgSprite', 'js', 'css', 'html'], ['copy:map', 'rev:assets'], 'rev:css', 'rev:js', 'rev:html'],

  tasks: [
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
      taskName: 'imgMin',
      src: './src/img/**/*',
      dest: './.cache/static/img',
      watch: true,
    },

    // 图标
    {
      $lib: 'imgSprite',
      taskName: 'imgSprite',
      src: './src/icon/**/*.png',
      dest: './.cache/static/icon',
      watch: true,
      urify: './.cache',
    },
    {
      $lib: 'svgSprite',
      taskName: 'svgSprite',
      src: './src/icon/**/*.svg',
      dest: './.cache/static/icon',
      watch: true,
    },

    // css
    {
      $lib: 'sass',
      taskName: 'css',
      src: './src/css/**/*.scss',
      dest: './.cache/static/css',
      watch: true,
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
      cmdify: 'site/js',
      urify: {
        base: './.cache/static',
        replace: d => `site${d}`,
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
          keyword: /(__uri__)/,
          replace: () => 'static',
        },
        {
          keyword: '__cmdify',
          replace: d => `site${d}`,
        },
        {
          keyword: /(__cmdify__)/,
          replace: () => 'site',
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
      revReplace: {},
    },
    {
      $lib: 'rev',
      taskName: 'rev:html',
      src: './.cache/server/views/**/*.html',
      dest: './dest/server/views',
      manifest: './dest/rev-manifest.json',
      rev: false,
      revReplace: {
        modifyUnreved: d => d.startsWith('js/') ? '__not_replace__' : d,
        modifyReved: d => d.startsWith('js/') ? '__not_replace__' : d,
      },
      urify: {
        keyword: /(__alias__)/,
        replace: () => getJsModuleAlias(require('./dest/rev-manifest.json'), /^js\//, 'site/'),
      },
    },
    {
      $lib: 'copy',
      taskName: 'copy:map',
      src: './.cache/static/**/*.map',
      dest: './dest/static',
      globOptions: { dot: true },
    },
  ],
};
