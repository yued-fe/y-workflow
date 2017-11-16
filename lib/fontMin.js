/**
 * 字体压缩
 */
const fs = require('fs');
const path = require('path');

const gulp = require('gulp');
const plugins = {
  fontmin: require('gulp-fontmin'),
  newer: require('gulp-newer'),
  plumber: require('gulp-plumber'),
};

/**
 * 字体压缩任务注册方法
 * @param {Object} options 任务配置
 * @param {String} options.taskName 自定义任务名称
 * @param {String} options.src 待处理文件
 * @param {String} options.dest 待处理文件
 * @param {Boolean} options.watch 是否监听
 * @param {Function} options.taskHandler 自定义任务处理方法
 * @param {Object} options.fontMin fontMin配置
 * @param {String} options.textFile 记录要压缩文字的文件
 */
module.exports = (options) => {
  const {
    taskName = 'fontMin',
    src,
    dest,
    watch,
    taskHandler = () => {
      const newer = { dest }; // 这里直接填写 dest 表示比较与 src 同名文件，基本就是指 ttf 文件

      if (isTextFileExists) {
        newer.extra = textFilePath;
        fontMin.text = fs.readFileSync(textFilePath, 'utf-8');
      }

      return gulp.src(src)
        .pipe(plugins.plumber())
        .pipe(plugins.newer(newer)) // 忽略未更改的文件(多对一)
        .pipe(plugins.fontmin(fontMin))
        .pipe(gulp.dest(dest));
    },
    fontMin = {},
    textFile,
  } = options;

  const textFilePath = textFile ? path.resolve(textFile) : null;
  const isTextFileExists = textFilePath && fs.existsSync(textFilePath);

  gulp.task(taskName, taskHandler);

  if (watch) {
    gulp.task(`${taskName}:watch`, [taskName], () => {
      if (isTextFileExists) {
        gulp.watch(textFilePath, [taskName]);
      }
      gulp.watch(src, [taskName]);
    });
  }
};
