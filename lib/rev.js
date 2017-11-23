/**
 * revision
 */
const path = require('path');

const gulp = require('gulp');
const plugins = {
  if: require('gulp-if'),
  rev: require('gulp-rev'),
  revAll: require('../plugins/gulp-rev-all'),
  revDeleteOriginal: require('gulp-rev-delete-original'),
  revReplace: require('gulp-rev-replace'),
};

/**
 * revision 任务注册方法
 * @param {Object} options 任务配置
 * @param {String} options.taskName 自定义任务名称
 * @param {String} options.src 待处理文件
 * @param {String} options.dest 处理后存放目录
 * @param {String} options.manifest rev 的 manifest 文件路径
 * @param {Object} options.revReplace revReplace 配置
 * @param {String} options.revAll revAll 的配置
 */
module.exports = (options) => {
  const {
    taskName = 'rev',
    src,
    dest,
    taskHandler = () => {
      let stream = gulp.src(src).pipe(gulp.dest(dest));

      if (revReplace) {
        if (manifest) {
          Object.assign(revReplace, { manifest: gulp.src(manifest) });
        }
        stream = stream.pipe(plugins.revReplace(revReplace));
      }

      return stream.pipe(plugins.if(!!revAll, plugins.revAll(revAll), plugins.rev()))
        .pipe(gulp.dest(dest))
        .pipe(plugins.revDeleteOriginal())
        .pipe(plugins.rev.manifest(manifest, { merge: true }))
        .pipe(gulp.dest(''));
    },
    manifest = path.resolve(dest, 'rev-manifest.json'),
    revReplace,
    revAll,
  } = options;

  gulp.task(taskName, taskHandler);
};
