'use strict';

const path = require('path');

const gutil = require('gulp-util');
const through2 = require('through2');

/**
 * uri 转换(绝对路径补齐/相对路径转绝对路径) gulp 插件
 * @param {Object} options 转换配置
 * @param {String} options.root 根路径，将文件绝对路径去掉根路径部分，得到需要的绝对路径
 * @param {String} options.absBase 绝对路径(以"/"开头)的基础路径
 * @param {String|RegExp} options.keyword 关键字
 * @param {String|Array} options.extensions 要转换的文件后缀名，'*' 表示所有文件
 * @param {Function} options.replace 最终修改方法
 *
 * @examples
 *  gulp dest => './dest/static/js'
 *  options = {
 *    root: './dest', // __uri(./a.js) => /static/js/a.js
 *    absBase: './dest/static', // __uri(/js/b.js) => /static/js/b.js
 *    replace: d => d.replace(/^\//, ''), // /static/js/a.js => static/js/a.js
 *  }
 */
module.exports = (options) => {
  if (!options) {
    options = {};
  }

  if (typeof options === 'string') {
    options = { root: options };
  }

  if (typeof options === 'function') {
    options = { replace: options };
  }

  if (!options.root) {
    options.root = process.env.PWD;
  } else {
    options.root = path.resolve(options.root);
  }

  if (!options.absBase) {
    options.absBase = options.root;
  } else {
    options.absBase = path.resolve(options.absBase);
  }

  if (!options.keyword) {
    options.keyword = '__uri';
  }

  if (options.extensions !== '*' && !Array.isArray(options.extensions)) {
    options.extensions = ['.js', '.css', '.html'];
  }

  if (!options.replace) {
    options.replace = d => d;
  }

  const REG_URI = options.keyword instanceof RegExp ? options.keyword : new RegExp(options.keyword + '\\([\'"]?([^\'")]+)[\'"]?\\)', 'g');

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

    const dirname = path.dirname(file.path);

    const contents = file.contents.toString('utf-8').replace(REG_URI, (str, uri) => {
      if (typeof uri !== 'string') {
        this.emit('error', new gutil.PluginError('gulp-urify', 'no uri matched'));
        return;
      }
      if (uri.charAt(0) === '/') {
        uri = path.join(options.absBase, uri);
      } else {
        uri = path.join(dirname, uri);
      }
      return options.replace(uri.replace(options.root, ''));
    });

    file.contents = new Buffer(contents);
    this.push(file);
    callback();
  });
};
