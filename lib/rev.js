/**
 * sass编译
 */
'use strict';

const path = require('path');

const gulp = require('gulp');
const plugins = {
  urify: require('../plugins/gulp-urify'),
};

/**
 * revision 任务注册方法
 * @param {Object} options 任务配置
 * @param {String} options.taskName 自定义任务名称
 * @param {String} options.src 待处理文件
 * @param {String} options.dest 处理后存放目录
 * @param {String} options.manifest rev 的 manifest 文件路径
 * @param {Boolean|Object} options.revReplace revReplace 配置
 * @param {Boolean} options.rev 是否进行 rev
 * @param {String} options.urifyBase uri 转换基础路径
 * @param {Object} options.urifyOptions uri 转换配置
 */
module.exports = (options) => {
  try {
    plugins.rev = require('gulp-rev');
    plugins.revDeleteOriginal = require('gulp-rev-delete-original');
    plugins.revReplace = require('gulp-rev-replace');
  } catch (ex) {
    throw new Error('要想使用rev功能，请先安装"gulp-rev"、"gulp-rev-delete-original"、"gulp-rev-replace"和"gulp-sequence"模块: npm i --save-dev gulp-rev gulp-rev-delete-original gulp-rev-replace gulp-sequence');
  }

  const {
    taskName = 'rev',
    src,
    dest,
    taskHandler = () => {
      let stream = gulp.src(src).pipe(gulp.dest(dest));

      if (urifyBase) {
        stream = stream.pipe(plugins.urify(urifyBase, urifyOptions));
      }

      if (revReplace) {
        stream = stream.pipe(plugins.revReplace(revReplace === true ? { manifest: gulp.src(manifest) } : revReplace));
      }

      if (rev) {
        stream = stream.pipe(plugins.rev())
          .pipe(gulp.dest(dest))
          .pipe(plugins.revDeleteOriginal())
          .pipe(plugins.rev.manifest(manifest, { merge: true }))
          .pipe(gulp.dest(''))
      } else {
        stream = stream.pipe(gulp.dest(dest));
      }

      return stream;
    },
    manifest = path.resolve(dest, 'rev-manifest.json'),
    revReplace,
    rev = true,
    urifyBase,
    urifyOptions,
  } = options;

  gulp.task(taskName, taskHandler);
};
