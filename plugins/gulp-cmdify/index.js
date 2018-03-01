const path = require('path');

const { ast } = require('cmd-util');
const gutil = require('gulp-util');
const sortKeys = require('sort-keys');
const through2 = require('through2');
const vinylFile = require('vinyl-file');

/**
 * cmd transport 插件
 * @param {Object|String} options 插件配置
 * @param {String} options.base 模块基础路径
 * @param {Boolean} options.format 是否格式化
 * @return {Stream} gulp stream
 */
const plugin = function (options) {
  if (!options) {
    options = {};
  }

  if (typeof options === 'string') {
    options = { base: options };
  }

  if (!options.base) {
    options.base = '';
  }

  return through2.obj(function (file, encoding, callback) {
    if (!file) {
      this.emit('error', new gutil.PluginError('gulp-cmdify', 'File can not be empty'));
      return callback();
    }

    if (file.isNull()) {
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-cmdify', 'Streaming not supported'));
      return callback();
    }

    if (path.extname(file.path) !== '.js') {
      this.push(file);
      return callback();
    }

    let contents = file.contents.toString('utf-8');
    let astModule;

    try {
      // 修复 xxx.define 不会被 ast.parse 解析成模块问题
      contents = contents.replace(/([a-zA-Z0-9]+\.)?define/g, 'define');

      // 格式: { id: 'id', dependencies: ['a'], dependencyNode, factory }
      astModule = ast.parseFirst(contents);
    } catch (ex) {
      this.emit('error', new gutil.PluginError('gulp-cmdify', 'parse file "' + gutil.colors.red(file.path) + '" failed')); // eslint-disable-line max-len,prefer-template
      return callback();
    }

    if (astModule) {
      const moduleId = astModule.id || path.join(options.base, file.relative).replace(/\\/g, '/'); // 转换 "\\" 兼容 windows
      const moduleDeps = astModule.dependencies;

      if (options.format) {
        astModule.id = moduleId;
        const newAstModule = ast.modify(contents, astModule);
        contents = Buffer.from(newAstModule.print_to_string({ beautify: true }));
      } else if (!astModule.id && !astModule.dependencyNode) { // 只有 factory
        contents = contents.replace(/define\(\s*/g, `define("${moduleId}",${JSON.stringify(moduleDeps)},`);
      } else if (!astModule.id) { // 有 id
        contents = contents.replace(/define\(\s*/g, `define("${moduleId}",`);
      } else if (!astModule.dependencyNode) { // 有 deps
        contents = contents.replace(/define\(\s*(['"])[^'"]+\1/g, `define("${moduleId}",${JSON.stringify(moduleDeps)}`);
      }

      file.cmdModuleId = moduleId;
      file.cmdModuleDeps = moduleDeps;
      file.contents = Buffer.from(contents);
    }

    this.push(file);
    callback();
  });
};

/**
 * cmd transport 插件生成 manifest 文件方法，文件格式：{ id: deps }
 * @param {Object|String} options 插件配置
 * @param {String} options.path 生成文件路径名
 * @return {Stream} gulp stream
 */
plugin.manifest = function (options) {
  if (!options) {
    options = {};
  }

  if (typeof options === 'string') {
    options = { path: options };
  }

  if (!options.path) {
    options.path = 'cmdify-manifest.json';
  }

  let manifest = {};

  return through2.obj((file, encoding, callback) => {
    if (!file || !file.cmdModuleId || !file.cmdModuleDeps) {
      return callback();
    }

    manifest[file.cmdModuleId] = file.cmdModuleDeps;
    callback();
  }, function (callback) {
    if (Object.keys(manifest).length === 0) {
      return callback();
    }

    vinylFile.read(options.path, options)
      .then(null, (err) => {
        if (err.code === 'ENOENT') {
          return new gutil.File(options);
        }
        throw err;
      }).then((manifestFile) => {
        if (!manifestFile.isNull()) {
          let oldManifest = {};

          try {
            oldManifest = JSON.parse(manifestFile.contents.toString());
          } catch (ex) {
            oldManifest = {};
          }

          manifest = Object.assign(oldManifest, manifest);
        }

        manifestFile.contents = Buffer.from(JSON.stringify(sortKeys(manifest), null, '  '));
        this.push(manifestFile);
        callback();
      }).catch(callback);
  });
};

module.exports = plugin;
