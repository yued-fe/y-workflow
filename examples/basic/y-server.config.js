module.exports = {
  port: process.env.PORT || 8082,

  watch: [],

  plugins: [
    (app) => {
      app.get('/', (req, res) => {
        res.send('Index');
      });
    },
  ],
};
