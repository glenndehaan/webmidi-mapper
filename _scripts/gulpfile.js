var gulp = require('gulp');
var babel = require('gulp-babel');
var es2015preset = require('babel-preset-es2015');

gulp.task('default', function () {
    return gulp.src('../src/**/*.js')
        .pipe(babel({
            "presets": [es2015preset]
        }))
        .pipe(gulp.dest('../dist'));
});
