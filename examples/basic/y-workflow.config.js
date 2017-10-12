

module.exports = {
  dev: ['clean:cache', ['fontMin:FZZCYSK:watch', 'imgMin:watch', 'imgSprite:watch', 'svgSprite:watch', 'css:watch', 'js:watch', 'html:watch']],
  build: [['clean:cache', 'clean:dest'], ['fontMin:FZZCYSK', 'imgMin', 'imgSprite', 'svgSprite', 'css', 'html'], 'rev:assets', 'rev:css', 'rev:js', 'rev:html'],

  tasks: [
    // clean
    {
      lib: 'clean',
      taskName: 'clean:cache',
      src: './.cache',
    },
    {
      lib: 'clean',
      taskName: 'clean:dest',
      src: './dest',
    },

    // 字体
    {
      lib: 'fontMin',
      taskName: 'fontMin:FZZCYSK',
      src: './src/font/FZZCYSK/*.ttf',
      dest: './.cache/static/font/FZZCYSK',
      watch: true,
      textFile: './src/font/FZZCYSK/words.txt',
      urifyBase: './.cache',
    },

    // 图片
    {
      lib: 'imgMin',
      taskName: 'imgMin',
      src: './src/img/**/*',
      dest: './.cache/static/img',
      watch: true,
    },

    // 图标
    {
      lib: 'imgSprite',
      taskName: 'imgSprite',
      src: './src/icon/**/*.png',
      dest: './.cache/static/icon',
      watch: true,
      urifyBase: './.cache',
    },
    {
      lib: 'svgSprite',
      taskName: 'svgSprite',
      src: './src/icon/**/*.svg',
      dest: './.cache/static/icon',
      watch: true,
      urifyBase: './.cache',
    },

    // css
    {
      lib: 'sass',
      taskName: 'css',
      src: './src/css/**/*.scss',
      dest: './.cache/static/css',
      watch: true,
      urifyBase: './.cache',
    },

    // js
    {
      lib: 'cmdify',
      taskName: 'js',
      src: './src/js/**/*.js',
      dest: './.cache/static/js',
      watch: true,
      cmdify: 'site/js',
      urifyBase: './.cache/static',
      urifyOptions: 'site',
    },

    // html
    {
      lib: 'nunjucks',
      taskName: 'html',
      src: './src/views/**/*.html',
      dest: './.cache/server/views',
      watch: true,
      urifyBase: './.cache/server/views',
      urifyOptions: d => d.slice(-3) === '.js' ? `site${d}` : `/static${d}`,
    },

    // rev
    {
      lib: 'rev',
      taskName: 'rev:assets',
      src: ['./.cache/static/**/*', '!./.cache/static/**/*+(css|js|html|map|json)'],
      dest: './dest/static',
      manifest: './dest/rev-manifest.json',
    },
    {
      lib: 'rev',
      taskName: 'rev:css',
      src: './.cache/static/**/*.css',
      dest: './dest/static',
      manifest: './dest/rev-manifest.json',
      revReplace: true,
      // urifyBase: './dest',
    },
    {
      lib: 'rev',
      taskName: 'rev:js',
      src: './.cache/static/js/**/*.js',
      dest: './dest/static/js',
      manifest: './dest/rev-manifest.json',
      revReplace: true,
      // urifyBase: './dest/static',
      // urifyOptions: 'static',
    },
    {
      lib: 'rev',
      taskName: 'rev:html',
      src: './.cache/server/views/**/*.html',
      dest: './dest/server/views',
      manifest: './dest/rev-manifest.json',
      rev: false,
      revReplace: true,
      // urifyBase: './dest/server/views',
      // urifyOptions: '/static',
    },
  ],
};
