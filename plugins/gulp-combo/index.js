const path = require('path');

const gutil = require('gulp-util');
const through2 = require('through2');

const REG_COMMENT = /<!--[\s\S]*?-->/g;
const REG_SCRIPT = /<script[^>]+?src="([^"]+)"[^>]*><\/script>/gim;
const REG_STYLE1 = /<link[^>]+?href="([^"]+?)"[^>]+?rel="stylesheet"[^>]*>/gim;
const REG_STYLE2 = /<link[^>]+?rel="stylesheet"[^>]+?href="([^"]+?)"[^>]*>/gim;

const comboPlaceholder = '<%%% COMBO_PLACEHOLDER %%%>';
const arrayify = obj => (Array.isArray(obj) ? obj : [obj]);
const domainify = str => str.replace(/^http(s)?:\/\/|\/\//, '').split('/')[0];
const pathify = str => str.replace(/^http(s)?:\/\/|\/\//, '').replace(/^[^/]+/, '');
const isComment = str => typeof str !== 'string' || REG_COMMENT.test(str);

function getCombedContent(content, domain, regs, getCombedItems) {
  const items = [];
  const urls = [];

  domain = domainify(domain);

  arrayify(regs).forEach((reg) => {
    content = content.replace(reg, (matched, $1) => {
      // 增加忽略属性避免条件注释或者模板条件判断中的资源被合并
      if (matched.match('ignore')) {
        return matched;
      }

      if (domainify($1) !== domain) {
        return matched;
      }

      items.push(matched);
      urls.push(pathify($1));

      // 第一个匹配的 script 留个占位符，用于后续替换
      if (items.length === 1) {
        return comboPlaceholder;
      }

      return '';
    });
  });

  return content.replace(comboPlaceholder, getCombedItems(items, urls));
}

/**
 * combo插件
 * @param {Object} options 配置项
 * @param {String|RegExp} options.startTag combo块开始标签
 * @param {String|RegExp} options.endTag combo块结束标签
 * @param {String} options.comboDomain combo域名
 * @param {Function} options.getCombedStylesContent style combo 结果生成方法
 * @param {Function} options.getCombedScriptsContent javascript combo 结果生成方法
 * @return {DestroyableTransform} 文件流
 */
module.exports = function (options) {
  const {
    startTag = /<!--\s*combo\s*-->/gim,
    endTag = /<!--\s*endcombo\s*-->/gim,
    comboDomain,
    getCombedStylesContent,
    getCombedScriptsContent,
  } = options;

  return through2.obj(function (file, encoding, callback) {
    if (!file) {
      this.emit('error', new gutil.PluginError('gulp-combo', 'File can not be empty'));
      return callback();
    }

    if (file.isNull()) {
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-combo', 'Streaming not supported'));
      return callback();
    }

    if (path.extname(file.path) !== '.html') {
      this.push(file);
      return callback();
    }

    const contents = file.contents.toString('utf-8');

    const blocks = [];

    const sections = contents.split(endTag);
    sections.forEach((section, index) => {
      const [block, willComboBlock] = section.split(startTag);

      if (index > 0 && !isComment(endTag)) {
        blocks.push(endTag);
      }

      blocks.push(block);

      if (willComboBlock) {
        if (!isComment(startTag)) {
          blocks.push(startTag);
        }

        let combedContent = willComboBlock;

        if (getCombedStylesContent) {
          combedContent = getCombedContent(combedContent, comboDomain, [REG_STYLE1, REG_STYLE2], getCombedStylesContent); // eslint-disable-line max-len
        }

        if (getCombedScriptsContent) {
          combedContent = getCombedContent(combedContent, comboDomain, [REG_SCRIPT], getCombedScriptsContent); // eslint-disable-line max-len
        }

        blocks.push(combedContent);
      }
    });

    file.contents = Buffer.from(blocks.join(''));

    this.push(file);
    callback();
  });
};
