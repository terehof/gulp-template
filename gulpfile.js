"use strict";

// Load plugins
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');
const rigger = require('gulp-rigger');
const minify = require('gulp-minify');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const plumber = require('gulp-plumber');
const del = require('del');
const browsersync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');
const newer = require('gulp-newer');
const gulpwatch = require('gulp-watch')



const path = {
    build: {
        js: 'dist/js/',
        html: 'dist/',
        css: 'dist/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/'
    },
    src: {
        js: 'src/js/*.js',
        style: 'src/style/main.scss',
        html: 'src/*.html',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    }
};


// BrowserSync
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./dist/"
        },
        port: 3000,
        ghostMode: {
            clicks: false,
            forms: false,
            scroll: false
        }
    });
    done();
}

// BrowserSync Reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}

// Clean destination folder
function clean() {
    return del(["./dist/"]);
}

// HTML task
function html() {
    return gulp
        .src(path.src.html)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'src/html_includes/'
        }))
        .pipe(gulp.dest(path.build.html))
        .pipe(browsersync.stream());
}

// Fonts task
function fonts() {
    return gulp
        .src(path.src.fonts)
        .pipe(newer(path.build.fonts))
        .pipe(gulp.dest(path.build.fonts));
}

// Images task
function images() {
    return gulp
        .src(path.src.img)
        .pipe(newer(path.build.img))
        .pipe(gulp.dest(path.build.img));
}

// CSS task
function css() {
    return gulp
        .src(path.src.style)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'expanded' }))
        .pipe(sourcemaps.write())
        .pipe(rename('style.css'))
        .pipe(replace('../../', '../'))
        .pipe(gulp.dest(path.build.css))
        .pipe(browsersync.stream());
}

// JS task
function js() {
    return (
        gulp
            .src(path.src.js)
            .pipe(plumber())
            .pipe(rigger())
            .pipe(gulp.dest(path.build.js))
            .pipe(browsersync.stream())
    );
}

// Watch files
function watchFiles() {
    gulpwatch([path.watch.html], function(event, cb) {
        html();
    });
    gulpwatch([path.watch.style], function(event, cb) {
        css();
    });
    gulpwatch([path.watch.js], function(event, cb) {
        js();
    });
    gulpwatch([path.watch.img], function(event, cb) {
        images();
    });
    gulpwatch([path.watch.fonts], function(event, cb) {
        fonts();
    });

}


// define complex tasks
const build = gulp.series(clean, gulp.parallel(html, fonts, css, images, js));
const watch = gulp.parallel(watchFiles, browserSync);



// export tasks
exports.images = images;
exports.styles = css;
exports.scripts = js;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;