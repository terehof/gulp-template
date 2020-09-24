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
        .pipe(gulp.dest(path.build.img))
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
    gulp.watch(path.watch.html, html);
    gulp.watch(path.watch.fonts, fonts);
    gulp.watch(path.watch.img, images);
    gulp.watch(path.watch.style, css);
    gulp.watch(path.watch.js, js);
}


// define complex tasks
const build = gulp.series(clean, gulp.parallel(css, images, jekyll, js));
const watch = gulp.parallel(watchFiles, browserSync);



// export tasks
exports.images = images;
exports.css = css;
exports.js = js;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;







// let gulp = require('gulp'),
//     sass = require('gulp-sass'),
//     sourcemaps = require('gulp-sourcemaps'),
//     autoprefixer = require('gulp-autoprefixer'),
//     cssmin = require('gulp-cssmin'),
//     rigger = require('gulp-rigger'),
//     minify = require('gulp-minify'),
//     rename = require('gulp-rename'),
//     replace = require('gulp-replace'),
//     watch = require('gulp-watch'),
//     fileInclude = require('gulp-file-include'),
//     historyApiFallback = require('connect-history-api-fallback'),
//     browserSync = require('browser-sync').create(),
//     reload = browserSync.reload;
//
// let path = {
//     build: {
//         js: 'dist/js/',
//         html: 'dist/',
//         css: 'dist/css/',
//         img: 'dist/img/',
//         fonts: 'dist/fonts/'
//     },
//     src: {
//         js: 'src/js/*.js',
//         style: 'src/style/main.scss',
//         html: 'src/*.html',
//         img: 'src/img/**/*.*',
//         fonts: 'src/fonts/**/*.*'
//     },
//
//     watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
//         html: 'src/**/*.html',
//         js: 'src/js/**/*.js',
//         style: 'src/style/**/*.scss',
//         img: 'src/img/**/*.*',
//         fonts: 'src/fonts/**/*.*'
//     }
// };
// gulp.task('html', function () {
//     return gulp.src(path.src.html)
//         .pipe(fileInclude({
//             prefix: '@@',
//             basepath: 'src/html_includes/'
//         }))
//         .pipe(gulp.dest(path.build.html))
//         .pipe(reload({ stream:true }));
// });
// gulp.task('fonts', function () {
//     gulp.src(path.src.fonts)
//         .pipe(gulp.dest(path.build.fonts))
//         .pipe(reload({ stream:true }));
// });
// gulp.task('images', function() {
//     gulp.src(path.src.img)
//         .pipe(gulp.dest(path.build.img))
//         .pipe(reload({ stream:true }));
// });
// gulp.task('styles', function () {
//     return gulp.src(path.src.style)
//         .pipe(sourcemaps.init())
//         .pipe(sass().on('error', sass.logError))
//         .pipe(sourcemaps.write())
//         .pipe(rename('style.css'))
//         .pipe(replace('../../', '../'))
//         .pipe(gulp.dest(path.build.css))
//         .pipe(reload({ stream:true }));
// });
// gulp.task('styles-min', function () {
//     return gulp.src(path.src.style)
//         .pipe(sass().on('error', sass.logError))
//         .pipe(autoprefixer({
//             browsers: ['> 0.01%'],
//             cascade: false
//         }))
//         .pipe(cssmin())
//         .pipe(rename('style.css'))
//         .pipe(gulp.dest(path.build.css))
//         .pipe(reload({ stream:true }));
// });
// gulp.task('js', function () {
//     return gulp.src(path.src.js)
//         .pipe(rigger())
//         .pipe(gulp.dest(path.build.js))
//         .pipe(reload({ stream:true }));
// });
// gulp.task('js-min', function () {
//     return gulp.src(path.src.js)
//         .pipe(rigger())
//         .pipe(minify({
//             ext:{
//                 src: '-src.js',
//                 min: '.js'
//             },
//             ignoreFiles: ['vendor.js']
//         }))
//         .pipe(gulp.dest(path.build.js))
//         .pipe(reload({ stream:true }));
// });
//
// gulp.task('watch-dev', ['build-dev'], function () {
//     browserSync.init({
//         server: {
//             baseDir: "./dist",
//             middleware: [historyApiFallback({})]
//         },
//         port: 3000,
//         ghostMode: {
//             clicks: false,
//             forms: false,
//             scroll: false
//         }
//     });
//     watch([path.watch.html], function(event, cb) {
//         gulp.start('html');
//     });
//     watch([path.watch.style], function(event, cb) {
//         gulp.start('styles');
//     });
//     watch([path.watch.js], function(event, cb) {
//         gulp.start('js');
//     });
//     watch([path.watch.img], function(event, cb) {
//         gulp.start('images');
//     });
//     watch([path.watch.fonts], function(event, cb) {
//         gulp.start('fonts');
//     });
// });
//
// gulp.task('watch-prod', ['build-prod'], function () {
//     browserSync.init({
//         server: {
//             baseDir: "./dist",
//             middleware: [historyApiFallback({})]
//         },
//         port: 3000,
//         ghostMode: {
//             clicks: false,
//             forms: false,
//             scroll: false
//         }
//     });
//     watch([path.watch.html], function(event, cb) {
//         gulp.start('html');
//     });
//     watch([path.watch.style], function(event, cb) {
//         gulp.start('styles-min');
//     });
//     watch([path.watch.js], function(event, cb) {
//         gulp.start('js-min');
//     });
//     watch([path.watch.img], function(event, cb) {
//         gulp.start('images');
//     });
//     watch([path.watch.fonts], function(event, cb) {
//         gulp.start('fonts');
//     });
// });
// gulp.task('build-dev', ['html', 'styles', 'js']);
// gulp.task('build-prod', ['html', 'styles-min', 'js-min']);
//
//
// gulp.task('default', ['watch-dev']);