const plugins = require('y-server-load-plugins')();

module.exports = {
  port: 8080,

  watch: [],

  plugins: [
    plugins.static({
      staticPaths: {
        '/static': './.cache/static',
      },
    }),
    plugins.ejs({
      viewDir: './.cache/server/views',
    }),
    (app) => {
      app.get('/', (req, res) => {
        res.render('index.html');
      });
    },
  ],
};
