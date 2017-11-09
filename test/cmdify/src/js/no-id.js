define(['__uri(./a.js)', '__uri(/js/b.js)', 'site/js/c.js'], function (require, exports, module) {
  var a = require('__uri(./a.js)');
  var b = require('__uri(/js/b.js)');
  var c = require('site/js/c.js');

  exports = module.exports = function () {
    console.log(a);

    console.log(b);

    console.log(c);
  };
});
