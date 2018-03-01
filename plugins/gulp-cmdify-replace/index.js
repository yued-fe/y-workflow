const fs = require('fs');
const path = require('path');

const gutil = require('gulp-util');
const through2 = require('through2');

const loadManifest = (manifest) => {
  manifest = path.resolve(manifest);
  if (fs.existsSync(manifest)) {
    return require(manifest);
  }
  return {};
};

/**
 * cmd 配置替换 gulp 插件
 * @param {String} options.cmdifyManifest cmdify 生成的 manifest 文件路径
 * @param {String} options.revManifest rev 生成的 manifest 文件路径
 * @param {String} options.aliasPlaceholder 别名占位
 * @param {String} options.depsPlaceholder 依赖占位
 * @param {String} options.cmdKeyword cmd规范实现类库关键字
 * @param {Function} options.revCmdify rev提取的文件名转cmd模块ID方法
 */
module.exports = (options) => {
  const {
    cmdifyManifest,
    revManifest,
    aliasPlaceholder,
    depsPlaceholder,
    cmdKeyword,
    revCmdify = d => d,
  } = options;

  const cmdifyManifestData = loadManifest(cmdifyManifest);
  const revManifestData = loadManifest(revManifest);

  // 先获取所有模块的 alias 和 deps
  const allAliasObj = {};
  const allDepsObj = {};

  Object.keys(revManifestData).forEach((d) => {
    // 过滤掉非 js 文件
    if (path.extname(d) === '.js') {
      allAliasObj[revCmdify(d)] = revCmdify(revManifestData[d]);
    }
  });

  Object.keys(cmdifyManifestData).forEach((moduleId) => {
    let moduleDeps = cmdifyManifestData[moduleId];
    if (moduleDeps.length) {
      if (!aliasPlaceholder) {
        // 如果没有别名占位，则表示模块ID都是真实路径，所以依赖也需要进行转换
        moduleId = allAliasObj[moduleId] || moduleId;
        moduleDeps = moduleDeps.map(d => allAliasObj[d] || d);
      }
      allDepsObj[moduleId] = moduleDeps;
    }
  });

  // 入口模块提取正则
  const REG_USE_ENTRYS = cmdKeyword ? new RegExp(`${cmdKeyword}\\.use\\(((?:\\[[^\\]]+\\])|(?:['"][^'"]+['"]))`, 'g') : null;
  const REG_ENTRY = /(['"])([^'"]+)\1/g;

  // 递归提取模块ID
  const append = (moduleIds, moduleId) => {
    if (moduleIds.indexOf(moduleId) === -1) {
      moduleIds.push(moduleId);
    }
    if (Array.isArray(allDepsObj[moduleId])) {
      allDepsObj[moduleId].forEach((depModuleId) => {
        append(moduleIds, depModuleId);
      });
    }
  };

  return through2.obj(function (file, encoding, callback) {
    if (!file) {
      this.emit('error', new gutil.PluginError('gulp-cmdify-replace', 'File can not be empty'));
      return callback();
    }

    if (file.isNull()) {
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-cmdify-replace', 'Streaming not supported'));
      return callback();
    }

    if (['.js', '.html'].indexOf(path.extname(file.path)) === -1) {
      this.push(file);
      return callback();
    }

    let contents = file.contents.toString('utf-8');

    if (contents.indexOf(aliasPlaceholder) === -1 && contents.indexOf(depsPlaceholder) === -1) {
      this.push(file);
      return callback();
    }

    // 获取所有入口模块(包含所依赖模块)
    const moduleIds = [];

    if (REG_USE_ENTRYS) {
      let matchedUseEntrys;
      let matchedEntry;

      /* eslint-disable no-cond-assign */
      while ((matchedUseEntrys = REG_USE_ENTRYS.exec(contents)) !== null) {
        while ((matchedEntry = REG_ENTRY.exec(matchedUseEntrys[1])) !== null) {
          append(moduleIds, matchedEntry[2]);
        }
      }
    }

    let aliasObj = {};
    let depsObj = {};

    if (moduleIds.length) {
      moduleIds.forEach((moduleId) => {
        aliasObj[moduleId] = allAliasObj[moduleId];
        if (Array.isArray(allDepsObj[moduleId])) {
          depsObj[moduleId] = allDepsObj[moduleId];
        }
      });
    } else {
      // 无入口模块则认为是在专门的 config 文件中，这个时候需要替换为全部 alias 和 deps
      aliasObj = allAliasObj;
      depsObj = allDepsObj;
    }

    if (aliasPlaceholder) {
      contents = contents.replace(aliasPlaceholder, JSON.stringify(aliasObj).slice(1, -1));
    }

    if (depsPlaceholder) {
      contents = contents.replace(depsPlaceholder, JSON.stringify(depsObj).slice(1, -1));
    }

    file.contents = Buffer.from(contents);
    this.push(file);
    callback();
  });
};
