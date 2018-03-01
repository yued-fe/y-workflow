const path = require('path');

const gutil = require('gulp-util');
const rework = require('rework');
const reworkUrl = require('rework-plugin-url');
const through2 = require('through2');

/**
 * css url 相对路径转绝对路径 gulp 插件
 * @param {Object} options 转换配置
 * @param {String} options.base 基础路径，相对路径转绝对路径，去掉此部分，得到需要的绝对路径
 */
module.exports = (options) => {
  if (!options) {
    options = {};
  }

  if (typeof options === 'string') {
    options = { base: options };
  }

  if (options.base) {
    options.base = path.resolve(options.base);
  }

  return through2.obj(function (file, encoding, callback) {
    if (!file) {
      this.emit('error', new gutil.PluginError('gulp-css-url-absify', 'File can not be empty'));
      return callback();
    }

    if (file.isNull()) {
      return callback();
    }

    if (file.isStream()) {
      // this.emit('error', new gutil.PluginError('gulp-css-url-absify', 'Streaming not supported'));
      return callback();
    }

    if (path.extname(file.path) !== '.css') {
      return callback();
    }

    const dirname = path.dirname(file.path);

    const contents = rework(file.contents.toString('utf-8'))
      .use(reworkUrl((url) => {
        if (/^https?:\/\/|data:|about:/.test(url)) {
          return url;
        }
        url = url.replace(/^\s*([^\s]*)\s*$/, '$1');

        if (url && url.charAt(0) !== '/') {
          url = path.join(dirname, url).replace(options.base || file.base, '');
        }

        return url.replace(/\\/g, '/');
      }))
      .toString();

    file.contents = Buffer.from(contents);
    this.push(file);
    callback();
  });
};
