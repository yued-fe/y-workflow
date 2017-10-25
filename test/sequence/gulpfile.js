const runSequence = require('run-sequence');

require('../../lib/clean.js')({
  src: './dest',
});

require('../../lib/copy.js')({
  taskName: 'copy:js',
  src: './src/**/*.js',
  dest: './dest',
});

require('../../lib/copy.js')({
  taskName: 'copy:txt',
  src: './src/**/*.txt',
  dest: './dest',
});

require('../../lib/sequence.js')({
  taskName: 'default',
  tasks: ['clean', ['copy:js', 'copy:txt']],
});
