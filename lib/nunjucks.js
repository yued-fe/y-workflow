/**
 * nunjucks模板编译
 */
'use strict';

const gulp = require('gulp');
const plugins = {
  changedDeps: require('../plugins/gulp-changed-deps'),
  plumber: require('gulp-plumber'),
  urify: require('../plugins/gulp-urify'),
};

/**
 * nunjucks模板编译任务注册方法
 * @param {Object} options 任务配置
 * @param {String} options.taskName 自定义任务名称
 * @param {String} options.src 待处理文件
 * @param {String} options.dest 处理后存放目录
 * @param {Boolean} options.watch 是否监听
 * @param {Function} options.taskHandler 自定义任务处理方法
 * @param {String} options.nunjucksBaseDir nunjucks基础目录
 * @param {Object} options.nunjucksOptions nunjucks配置
 * @param {String} options.urifyBase uri 转换基础路径
 * @param {Object} options.urifyOptions uri 转换配置
 */
module.exports = (options) => {
  try {
    plugins.nunjucks = require('gulp-nunjucks');
  } catch (ex) {
    throw new Error('要想nunjucks模板编译功能，请先安装"gulp-nunjucks"模块: npm i --save-dev gulp-nunjucks');
  }

  const {
    src,
    dest,
    watch,
    taskName = 'nunjucks',
    taskHandler = () => {
      const stream = gulp.src(src)
        .pipe(plugins.plumber())
        .pipe(plugins.changedDeps(dest, { syntax: 'nunjucks', base: nunjucksBaseDir })) // 忽略未更改的文件(包含依赖分析功能)
        .pipe(plugins.nunjucks.compile(nunjucksOptions))
        .pipe(gulp.dest(dest));

      if (urifyBase) {
        return stream.pipe(plugins.urify(urifyBase, urifyOptions)).pipe(gulp.dest(dest));
      }

      return stream;
    },
    nunjucksBaseDir = true,
    nunjucksOptions = {},
    urifyBase,
    urifyOptions,
  } = options;

  gulp.task(taskName, taskHandler);

  if (watch) {
    gulp.task(`${taskName}:watch`, [taskName], () => {
      gulp.watch(src, [taskName]);
    });
  }
};
