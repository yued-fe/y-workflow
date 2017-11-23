# y-workflow

> 让前端工程更简单



## 安装

全局安装
```bash
npm install -g y-workflow
```

局部安装
```bash
npm install --save-dev y-workflow
```



## 使用

命令行用法
```bash
y-workflow run [task] [--config other-dir/y-workflow.config.js]
```

JS用法
```bash
const yWorkflow = require('y-workflow');

// 注册 tasks
yWorkflow({
  tasks: [],
});

// 注册 tasks 并运行 task
yWorkflow.run('dev', {
  config: 'y-workflow.config.js',
});
```



## 配置

#### 命令行参数 / run方法第二个参数

* `config` 配置文件路径，默认当前目录下的 `y-workflow.config.js` 文件


#### y-workflow.config.js 配置

* `tasks` 任务集合，每一个任务必须有 `$lib` 对应到 [lib](https://github.com/yued-fe/y-workflow/tree/master/lib) 目录下的一个文件，其它部分就是传给对用 lib 的配置


#### lib 通用配置

* `taskName` 任务名称，默认为 `lib` 名字
* `src` 待处理文件
* `dest` 处理后存放目录
* `watch` 是否监听，启用监听之后会额外增加 `{taskName}:watch` 任务，会先执行一次 `{taskName}` 任务，然后监听 `{src}` 再执行 `{taskName}` 任务
* `taskHandler` 任务执行方法，原有的逻辑不满足要求的时候覆盖用的


#### clean lib 配置

* `delOptions` 传给 [del](https://github.com/sindresorhus/del) 的配置


#### cmdify lib 配置

* `urify` 传给 [gulp-urify](https://github.com/yued-fe/y-workflow/blob/master/plugins/gulp-urify/index.js) 的配置
* `cmdify` 传给 [gulp-cmdify](https://github.com/yued-fe/y-workflow/blob/master/plugins/gulp-cmdify/index.js) 的配置
* `manifest` [gulp-cmdify](https://github.com/yued-fe/y-workflow/blob/master/plugins/gulp-cmdify/index.js) 的 `manifest` 文件路径，默认值为 `dest` 加上 `cmdify-manifest.json`


#### cmdifyReplace lib 配置

* `cmdifyReplace` [gulp-cmdify-replace](https://github.com/yued-fe/y-workflow/blob/master/plugins/gulp-cmdify-replace/index.js) 的配置


#### combo lib 配置

* `combo` [gulp-combo](https://github.com/yued-fe/y-workflow/blob/master/plugins/gulp-combo/index.js) 的配置


#### copy lib 配置

* `copyOptions` 传给 [gulp.src](https://github.com/gulpjs/gulp/blob/master/docs/API.md) 的配置


#### cssUrlAbsify lib 配置

* `cssUrlAbsify` [gulp-css-url-absify](https://github.com/yued-fe/y-workflow/blob/master/plugins/gulp-css-url-absify/index.js) 的配置


#### ejs lib 配置

* `changedDeps` 传给 [gulp-changed-deps](https://github.com/yued-fe/y-workflow/blob/master/plugins/gulp-changed-deps/index.js) 的配置，默认值为 `{ syntax: 'ejs' }`
* `ejs` 传给 [gulp-ejs](https://github.com/yued-fe/y-workflow/blob/master/plugins/gulp-ejs/index.js) 的配置
* `urify` 传给 [gulp-urify](https://github.com/yued-fe/y-workflow/blob/master/plugins/gulp-urify/index.js) 的配置，可以通过数组形式传多个


#### eslint lib 配置

* `eslint` 传给 [gulp-eslint](https://github.com/adametry/gulp-eslint) 的配置
* `eslintFormatter` 传给 [eslint.format](https://github.com/adametry/gulp-eslint#eslintformatformatter-output) 的配置，默认值为 `require.resolve('eslint-friendly-formatter')`


#### fontMin lib 配置

* `fontMin` 传给 [gulp-fontmin](https://github.com/ecomfe/gulp-fontmin) 的配置
* `textFile` 传给 [fontmin.text](https://github.com/ecomfe/gulp-fontmin#api) 文件路径


#### imgMin lib 配置

* `imagemin` 传给 [gulp-imagemin](https://github.com/sindresorhus/gulp-imagemin) 的配置，默认值为 `[imagemin.gifsicle({ interlaced: true }), imagemin.jpegtran({ progressive: true }), imagemin.optipng({ optimizationLevel: 2 }), imagemin.svgo()]`


#### imgSprite lib 配置

* `responsive` 传给 [gulp-responsive](https://github.com/mahnunchik/gulp-responsive) 的配置，默认值为 `{'**/*': [{min: true, width: '50%'}, {min: true, rename: { suffix: '@2x' }}]}`
* `spritesmith` 传给 [gulp.spritesmith](https://github.com/twolfson/gulp.spritesmith) 的配置，默认值为 `{ imgName: 'img-sprite.png', cssName: 'img-sprite.css', padding: 4, retinaSrcFilter: '**/*@2x.png', retinaImgName: 'img-sprite@2x.png' }`
* `cssUrlAbsify` [gulp-css-url-absify](https://github.com/yued-fe/y-workflow/blob/master/plugins/gulp-css-url-absify/index.js) 的配置


#### multiple lib 配置

* `srcDirs` 多个任务的 `src` 的目录，每一个 `srcDir` 生成一个任务，`srcDir` 相对 `glob base` 得到每一个 task 的 `name`
* `srcFiles` `src` 目录下需要处理的文件
* `destDir` 处理后存放目录，每一个子任务补上 `name` 得到最终的 `处理后存放目录`
* `lib` 实际任务 lib
* `libOptions` lib 的配置，如果为方法，则会传入 `name` 


#### nunjucks lib 配置

* `changedDeps` 传给 [gulp-changed-deps](https://github.com/yued-fe/y-workflow/blob/master/plugins/gulp-changed-deps/index.js) 的配置，默认值为 `{ syntax: 'nunjucks', base: true }`
* `nunjucks` 传给 [gulp-nunjucks](https://github.com/sindresorhus/gulp-nunjucks) 的配置
* `urify` 传给 [gulp-urify](https://github.com/yued-fe/y-workflow/blob/master/plugins/gulp-urify/index.js) 的配置，可以通过数组形式传多个


#### rev lib 配置

* `manifest` [gulp-rev](https://github.com/sindresorhus/gulp-rev) 的 `manifest` 文件路径，默认值为 `dest` 加上 `rev-manifest.json`
* `revReplace` [gulp-rev-replace](https://github.com/jamesknelson/gulp-rev-replace) 配置，如果传则表示 `rev` 之前会先进行一次 `revReplace`
* `revAll` [gulp-rev-all](https://github.com/yued-fe/y-workflow/blob/master/plugins/gulp-rev-all/index.js) 配置，如果传值就表示要分析依赖


#### revReplace lib 配置

* `manifest` [gulp-rev-replace](https://github.com/jamesknelson/gulp-rev-replace) 的 `manifest` 文件路径，默认值为 `dest` 加上 `rev-manifest.json`
* `revReplace` 传给 [gulp-rev-replace](https://github.com/jamesknelson/gulp-rev-replace) 配置


#### sass lib 配置

* `sass` 传给 [gulp-sass](https://github.com/dlmanning/gulp-sass) 的配置
* `sourcemaps` [gulp-sourcemaps](https://github.com/gulp-sourcemaps/gulp-sourcemaps) write方法的配置
* `urify` 传给 [gulp-urify](https://github.com/yued-fe/y-workflow/blob/master/plugins/gulp-urify/index.js) 的配置


#### sequence lib 配置

* `tasks` [run-sequence]() 的参数


#### svgSprite lib 配置

* `svgmin` 传给 [gulp-svgmin](https://github.com/ben-eb/gulp-svgmin) 配置，默认值为 `{ plugins: [{ removeAttrs: { attrs: '(fill|fill-rule)' } }, { removeTitle: true }] }`
* `svgstore` 传给 [gulp-svgstore](https://github.com/w0rm/gulp-svgstore) 配置，默认值为 `{ inlineSvg: true }`
* `spritedFilename` 合并之后的文件名，如果后缀名为`.js`则需要调用 [gulp-svg-jsify](https://github.com/yued-fe/y-workflow/blob/master/plugins/gulp-svg-jsify/index.js) 进行转换，默认值为 `svg-sprite.js`


#### urify lib 配置

* `urify` 传给 [gulp-urify](https://github.com/yued-fe/y-workflow/blob/master/plugins/gulp-urify/index.js) 的配置



## 测试

##### 测试 lib
```bash
# urify 可以换成其它任何 lib
npm test lib urify
```

##### 测试 example
```bash
# basic 可以换成其它 example, dev 可以换成其它 task
npm test example basic:dev
```
