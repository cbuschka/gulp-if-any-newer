var gulp = require('gulp'),
  allIfAnyNewer = require('.');

gulp.task('default', function() {
  gulp.src('in/**')
    .pipe(allIfAnyNewer('out/**'))
    .pipe(gulp.dest('out/'));
});
