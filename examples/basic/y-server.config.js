module.exports = {
  port: 8080,
  plugins: [
    {
      $name: 'static',
      staticPaths: {
        '/static': './.cache/static',
      },
    },
    {
      $name: 'ejs',
      viewDir: './.cache/server/views',
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
};
