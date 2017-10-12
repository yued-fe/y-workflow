define(function (require, exports, module) {
  var a = require('__uri(./a.js)');
  var b = require('__uri(/js/b.js)');
  var c = require('static/js/c.js');

  exports = module.exports = function () {
    console.log(a);

    console.log(b);

    console.log(c);
  };
});
