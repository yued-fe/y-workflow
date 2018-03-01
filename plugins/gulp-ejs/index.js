const path = require('path');

const ejs = require('ejs');
const gutil = require('gulp-util');
const through2 = require('through2');

/**
 * ejs 模版渲染 gulp 插件
 * @param {Object} options 转换配置
 * @param {Array|String} options.extensions 要渲染的文件后缀，"*" 表示所有，默认值为： "['.ejs', '.html']"
 * @param {Boolean} options.include 是否包含内容片段(文件名以 "_" 开头)
 * @param {Object} options.renderOptions ejs render 的配置
 * @param {Object} options.renderData ejs render 的数据
 */
module.exports = function (options) {
  if (!options) {
    options = {};
  }

  if (options.extensions !== '*' && !Array.isArray(options.extensions)) {
    options.extensions = ['.ejs', '.html'];
  }

  return through2.obj(function (file, encoding, callback) {
    if (!file) {
      this.emit('error', new gutil.PluginError('gulp-ejs', 'File can not be empty'));
      return callback();
    }

    if (file.isNull()) {
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-ejs', 'Streaming not supported'));
      return callback();
    }

    const extname = path.extname(file.path);
    const basename = path.basename(file.path);

    if (Array.isArray(options.extensions) && options.extensions.indexOf(extname) === -1) {
      this.push(file);
      return callback();
    }

    // 过滤掉内容片段(文件名以 "_" 开头)
    if (!options.include && basename.indexOf('_') === 0) {
      return callback();
    }

    let contents = file.contents.toString('utf-8');

    try {
      const renderOptions = Object.assign({}, options.renderOptions, {
        filename: file.path,
      });
      contents = ejs.render(contents, options.renderData, renderOptions);
      file.contents = Buffer.from(contents);

      if (typeof options.ext !== 'undefined') {
        file.path = gutil.replaceExtension(file.path, options.ext);
      }
    } catch (err) {
      this.emit('error', new gutil.PluginError('gulp-ejs', err.toString()));
    }

    this.push(file);
    callback();
  });
};
