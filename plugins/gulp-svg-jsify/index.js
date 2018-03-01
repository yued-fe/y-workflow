const path = require('path');

const gutil = require('gulp-util');
const through2 = require('through2');

module.exports = () => {
  const wrap = str => `!(function() { document.body.insertAdjacentHTML('afterBegin', '<div hidden>${str}</div>'); })();`;

  return through2.obj(function (file, encoding, callback) {
    if (!file) {
      this.emit('error', new gutil.PluginError('gulp-svg-jsify', 'File can not be empty'));
      return callback();
    }

    if (file.isNull()) {
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-svg-jsify', 'Streaming not supported'));
      return callback();
    }

    if (path.extname(file.path) !== '.svg') {
      this.push(file);
      return callback();
    }

    file.contents = Buffer.from(wrap(file.contents.toString('utf-8')));
    this.push(file);
    callback();
  });
};
