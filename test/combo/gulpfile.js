const gulp = require('gulp');
const runSequence = require('run-sequence');

require('../../lib/clean.js')({
  src: './dest',
});

require('../../lib/combo.js')({
  src: './src/**/*.html',
  dest: './dest',
  combo: {
    comboDomain: '<%= $domains.static %>',
    getCombedStylesContent: (styles, hrefs) => {
      return `
<% if ($env == 'producttion') { %>
  <link rel="stylesheet" href="<%= $domains.static %>/c/=${hrefs.join(',')}" />
<% } else { %>
  ${styles.join('\n  ')}
<% } %>`;
    },
    getCombedScriptsContent: (scripts, srcs) => {
      return `
<% if ($env == 'producttion') { %>
  <script src="<%= $domains.static %>/c/=${srcs.join(',')}"></script>
<% } else { %>
  ${scripts.join('\n  ')}
<% } %>`;
    },
  },
});

gulp.task('default', ['clean'], () => {
  runSequence(['combo']);
});
