const plugins = require('y-server-load-plugins')();

module.exports = {
  port: 8080,

  watch: [],

  plugins: [
    plugins.static({
      staticPaths: {
        '/static': './dest/static',
      },
    }),
    plugins.ejs({
      viewDir: './dest/server/views',
    }),
    (app) => {
      app.get('/', (req, res) => {
        res.render('index.html');
      });
    },
  ],
};
