/**
 * revision replace
 */
const path = require('path');

const gulp = require('gulp');
const plugins = {
  if: require('gulp-if'),
  revReplace: require('gulp-rev-replace'),
};

/**
 * revision replace 任务注册方法
 * @param {Object} options 任务配置
 * @param {String} options.taskName 自定义任务名称
 * @param {String} options.src 待处理文件
 * @param {String} options.dest 处理后存放目录
 * @param {String} options.manifest rev 的 manifest 文件路径
 * @param {Object} options.revReplace revReplace 配置
 */
module.exports = (options) => {
  const {
    taskName = 'revReplace',
    src,
    dest,
    taskHandler = () => {
      Object.assign(revReplace, { manifest: gulp.src(manifest) });

      return gulp.src(src)
        .pipe(plugins.revReplace(revReplace))
        .pipe(gulp.dest(dest));
    },
    manifest = path.resolve(dest, 'rev-manifest.json'),
    revReplace = {},
  } = options;

  gulp.task(taskName, taskHandler);
};
