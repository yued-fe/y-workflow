const gulp = require('gulp');
const runSequence = require('run-sequence');

const createComboTask = require('../../lib/combo.js');

require('../../lib/clean.js')({
  src: './dest',
});

createComboTask({
  src: './src/index.html',
  dest: './dest',
  combo: {
    comboDomain: '<%= $domains.static %>',
    getCombedStylesContent: (styles, hrefs) => {
      return `
<% if ($env == 'production') { %>
  <link rel="stylesheet" href="<%= $domains.static %>/c/=${hrefs.join(',')}" />
<% } else { %>
  ${styles.join('\n  ')}
<% } %>`;
    },
    getCombedScriptsContent: (scripts, srcs) => {
      return `
<% if ($env == 'production') { %>
  <script src="<%= $domains.static %>/c/=${srcs.join(',')}"></script>
<% } else { %>
  ${scripts.join('\n  ')}
<% } %>`;
    },
  },
});

createComboTask({
  taskName: 'combo:html',
  src: './src/full.html',
  dest: './dest',
  combo: {
    startTag: '<html>',
    endTag: '</html>',
    comboDomain: '<%= $domains.static %>',
    getCombedStylesContent: (styles, hrefs) => {
      return `
<% if ($env == 'production') { %>
  <link rel="stylesheet" href="<%= $domains.static %>/c/=${hrefs.join(',')}" />
<% } else { %>
  ${styles.join('\n  ')}
<% } %>`;
    },
  },
})

gulp.task('default', ['clean'], () => {
  runSequence(['combo', 'combo:html']);
});
