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
    },
    (app) => {
      app.get('/', (req, res) => {
        res.render('index.html');
      });
    },
  ],
};
