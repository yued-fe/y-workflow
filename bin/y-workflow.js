#!/usr/bin/env node
const program = require('commander');

const yWorkflow = require('../index.js');

program
  .version(require('../package.json').version)
  .usage('<command>');

program
  .command('run [task]')
  .description('执行任务')
  .option('-c, --config [config]', '指定 y-workflow.config.js 路径')
  .action(yWorkflow.run);

program.parse(process.argv);

if (!program.args.length) {
  program.help();
}
