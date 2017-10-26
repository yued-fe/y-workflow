define(function (require, exports, module) {
  var a = require('__uri(./a.js)');
  var b = require('__uri(/js/b.js)');
  var c = require('site/js/c.js');

  exports = module.exports = function () {
    document.body.insertAdjacentHTML('beforeEnd', '<h3>module ' + a + '</h3>');
    document.body.insertAdjacentHTML('beforeEnd', '<h4>module ' + b + '</h3>');
    document.body.insertAdjacentHTML('beforeEnd', '<h5>module ' + c + '</h3>');
  };
});
