const path = require('path');

const gutil = require('gulp-util');
const through2 = require('through2');

/**
 * uri 转换(绝对路径补齐/相对路径转绝对路径) gulp 插件
 * @param {Object} options 转换配置
 * @param {String} options.base 基础路径，相对路径转绝对路径，去掉此部分，得到需要的绝对路径
 * @param {String|RegExp} options.keyword 关键字
 * @param {String|Array} options.extensions 要转换的文件后缀名，'*' 表示所有文件
 * @param {Function} options.replace 最终修改方法
 *
 * @examples
 *  options = {
 *    base: './dest', // ./a.js => /js/a.js
 *    replace: d => `/static/${d}`, // /js/a.js => /static/js/a.js
 *  }
 */
module.exports = (options) => {
  if (!options) {
    options = {};
  }

  if (typeof options === 'string') {
    options = { base: options };
  }

  if (typeof options === 'function') {
    options = { replace: options };
  }

  if (!options.keyword) {
    options.keyword = '__uri';
  }

  if (options.base) {
    options.base = path.resolve(options.base);
  }

  if (options.extensions !== '*' && !Array.isArray(options.extensions)) {
    options.extensions = ['.js', '.css', '.html'];
  }

  if (!options.replace) {
    options.replace = d => d;
  }

  const REG_URI = options.keyword instanceof RegExp ? options.keyword : new RegExp(options.keyword + '\\(([\'"]?)([^\'")]*)\\1\\)', 'g'); // eslint-disable-line max-len,prefer-template

  return through2.obj(function (file, encoding, callback) {
    if (!file) {
      this.emit('error', new gutil.PluginError('gulp-urify', 'File can not be empty'));
      return callback();
    }

    if (file.isNull()) {
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-urify', 'Streaming not supported'));
      return callback();
    }

    if (Array.isArray(options.extensions) && options.extensions.indexOf(path.extname(file.path)) === -1) { // eslint-disable-line max-len
      this.push(file);
      return callback();
    }

    const dirname = path.dirname(file.path);

    const contents = file.contents.toString('utf-8').replace(REG_URI, (...args) => {
      const matched = args.slice(1, -2);
      let uri = matched.pop();

      if (/^https?:\/\/|data:|about:/.test(uri)) {
        return uri;
      }

      if (uri && uri.charAt(0) !== '/') {
        uri = path.join(dirname, uri).replace(options.base || file.base, '');
      }
      return options.replace(uri).replace(/\\/g, '/');
    });

    file.contents = Buffer.from(contents);
    this.push(file);
    callback();
  });
};
