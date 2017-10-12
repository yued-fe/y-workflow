'use strict';

const path = require('path');

const gutil = require('gulp-util');
const through2 = require('through2');

module.exports = (base, options) => {
  if (!base) {
    base = process.env.PWD;
  } else {
    base = path.resolve(base).replace(/[/\\]$/, '');
  }

  if (!options) {
    options = {};
  }

  if (typeof options === 'string') {
    options = { prefix: options };
  }

  if (typeof options === 'function') {
    options = { replace: options };
  }

  if (!options.keyword) {
    options.keyword = '__uri';
  }

  if (!options.replace) {
    options.replace = d => d;
  }

  if (!options.prefix) {
    options.prefix = '';
  }

  if (options.extensions !== '*' && !Array.isArray(options.extensions)) {
    options.extensions = ['.js', '.css', '.html'];
  }

  const REG_URI = new RegExp(options.keyword + '\\([\'"]?([^\'")]+)[\'"]?\\)', 'g');

  return through2.obj(function (file, encoding, callback) {
    if (!file) {
      this.emit('error', new gutil.PluginError('gulp-urify', 'files can not be empty'));
      return callback();
    }

    if (file.isNull()) {
      return callback();
    }

    if (file.isStream()) {
      this.push(file);
      return callback();
    }

    if (Array.isArray(options.extensions) && options.extensions.indexOf(path.extname(file.path)) === -1) {
      this.push(file);
      return callback();
    }

    const uriBase = path.dirname(file.path).replace(base, '').replace(/\\/gim, '/') || '/';

    let contents = file.contents.toString('utf-8');

    contents = contents.replace(REG_URI, (str, uri) => {
      if (uri.charAt(0) !== '/') {
        uri = path.join(uriBase, uri);
      }
      uri = path.join(options.prefix, uri);
      return options.replace(uri);
    });

    file.contents = new Buffer(contents);
    this.push(file);
    callback();
  });
};
