#!/usr/bin/env node

const program = require('commander');
const inquirer = require('inquirer');

program
  .version(require('../package.json').version)
  .usage('<command>');

program
  .command('init')
  .description('初始化项目')
  .alias('i')
  .action(() => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Project Name:',
        default: 'test',
      },
      // {
      //   type: 'checkbox',
      //   name: 'server',
      //   message: 'Select server features:',
      //   choices: [
      //     { name: '跨域', value: 'cors' },
      //     { name: '静态资源', value: 'static' },
      //     { name: 'ejs模板渲染', value: 'ejs' },
      //     { name: '数据模拟', value: 'mock' },
      //     { name: '接口代理', value: 'proxy' },
      //     { name: '页面直出', value: 'template' },
      //     { name: '错误处理', value: 'error' },
      //   ],
      //   default: ['static', 'ejs', 'mock', 'proxy', 'template', 'error'],
      // },
      // {
      //   type: 'checkbox',
      //   name: 'tasks',
      //   message: 'Select workflow features:',
      //   choices: [
      //     { name: 'nunjucks模板预编译', value: 'nunjucks' },
      //     { name: 'sass', value: 'sass' },
      //     { name: '图片压缩', value: 'imgMin' },
      //     { name: '图片合并', value: 'imgSprite' },
      //     { name: 'svg合并', value: 'svgSprite' },
      //     { name: '字体压缩', value: 'fontMin' },
      //   ],
      //   default: ['nunjucks', 'sass', 'imgMin', 'imgSprite', 'svgSprite', 'fontMin'],
      // },
    ]).then((answers) => {
      console.log(answers);
    });
  });

program.parse(process.argv);

if (!program.args.length) {
  program.help();
}
