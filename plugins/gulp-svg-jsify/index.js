'use strict';

const path = require('path');

const gutil = require('gulp-util');
const through2 = require('through2');

module.exports = () => {
  const wrap = (str) => {
    return '!(function() { document.body.insertAdjacentHTML(\'afterBegin\', \'<div hidden>' + str + '</div>\'); })();'
  };

  return through2.obj(function (file, encoding, callback) {
    if (!file) {
      this.emit('error', new gutil.PluginError('gulp-svg-jsify', 'files can not be empty'));
      return callback();
    }

    if (file.isNull()) {
      return callback();
    }

    if (file.isStream()) {
      this.push(file);
      return callback();
    }

    if (path.extname(file.path) !== '.svg') {
      this.push(file);
      return callback();
    }

    file.contents = new Buffer(wrap(file.contents.toString('utf-8')));
    this.push(file);
    callback();
  });
};
