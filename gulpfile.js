const gulp = require('gulp');
const gutil = require('gulp-util');

const yWorkflow = require('./index');

const yWorkflowConfig = require(gutil.env.yWorkflowConfig);

yWorkflow(yWorkflowConfig);
