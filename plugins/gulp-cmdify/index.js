'use strict';

const path = require('path');

const gutil = require('gulp-util');
const through2 = require('through2');
const ast = require('cmd-util').ast;

const REG_DEFINE_ONLY_FACTORY = /define\(\s*([^[])/g;
const REG_DEFINE_WITH_DEPS = /define\(\s*(\[[^\]]*\]\s*,\s*)/g;

module.exports = function (options) {
  if (!options) {
    options = {};
  }

  if (typeof options === 'string') {
    options = { base: options };
  }

  if (!options.base) {
    options.base = '';
  }

  if (options.base !== false) {
    options.simple = true;
  }

  return through2.obj(function (file, encoding, callback) {
    if (!file) {
      this.emit('error', new gutil.PluginError('gulp-cmdify', 'files can not be empty'));
      return callback();
    }

    if (file.isNull()) {
      return callback();
    }

    if (file.isStream()) {
      this.push(file);
      return callback();
    }

    if (path.extname(file.path) !== '.js') {
      this.push(file);
      return callback();
    }

    let contents = file.contents.toString('utf-8');
    let astModule;

    try {
      astModule = ast.parseFirst(contents); // { id: 'id', dependencies: ['a'], factory: factoryNode }
    } catch (ex) {
      this.emit('error', new gutil.PluginError('gulp-cmdify', 'parse file "' + gutil.colors.red(file.path) + '" failed'));
      return callback();
    }

    if (astModule) {
      const moduleId = astModule.id || path.join(options.base, file.relative).replace(/\\/g, '/'); // 转换 "//" 兼容 windows

      if (options.simple) {
        const moduleDeps = astModule.dependencies;
        if (REG_DEFINE_ONLY_FACTORY.test(contents)) {
          contents = contents.replace(REG_DEFINE_ONLY_FACTORY, `define("${moduleId}",${JSON.stringify(moduleDeps)},$1`);
        } else if (REG_DEFINE_WITH_DEPS.test(contents)) {
          contents = contents.replace(REG_DEFINE_WITH_DEPS, `define("${moduleId}",$1`);
        }
      } else {
        astModule.moduleId = moduleId;
        const newAstModule = ast.modify(contents, astModule);
        contents = new Buffer(newAstModule.print_to_string({ beautify: true }));
      }
      file.contents = new Buffer(contents);
    }

    this.push(file);
    callback();
  });
}
