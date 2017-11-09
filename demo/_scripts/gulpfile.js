//All dependencies loaded
var gulp = require('gulp');
var del = require('del');
var webpack = require('webpack-stream');

//Folder paths
var publicPath = '../';
var jsBuildPath = publicPath + 'js/build';
var jsSrcPath = publicPath + 'js/src';

//Javascript files list
var javascriptFiles = [
    publicPath + 'js/src/**/*.js',
    publicPath + '../src/**/*.js'
];

/**
 * Clean the build folders, as preparation for next build
 */
gulp.task('clean', function ()
{
    del([
        jsBuildPath + '/**'
    ], {force: true});
});

/**
 * Build for JS development, with sourcemaps and without uglify
 */
gulp.task('build-js-development', function ()
{
    return gulp.src(jsSrcPath + '/main.js')
        .pipe(webpack(require('./webpack.config.js')))
        .on('error', function handleError() {
            this.emit('end'); // Recover from errors
        })
        .pipe(gulp.dest(jsBuildPath));
});

/**
 * Default watcher for development. Cleans build folder before and does a build before starting watching
 */
gulp.task('default', ['clean'], function ()
{
    gulp.start('build-js-development');

    gulp.watch(javascriptFiles, ['build-js-development']);
});
