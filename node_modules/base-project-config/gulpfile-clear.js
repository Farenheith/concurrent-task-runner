const baseDir = require('./bin/get-base-dir');
const gulp = require('gulp');
const del = require('del');

gulp.task('default', function () {
  return del([
    `${baseDir}/build/`
  ], {
		force: true,
	});
});
