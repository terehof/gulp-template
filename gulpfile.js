let gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-cssmin'),
    rigger = require('gulp-rigger'),
    minify = require('gulp-minify'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    watch = require('gulp-watch'),
    fileInclude = require('gulp-file-include'),
    historyApiFallback = require('connect-history-api-fallback'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload;

let path = {
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

    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    }
};
gulp.task('html', function () {
    return gulp.src(path.src.html)
        .pipe(fileInclude({
            prefix: '@@',
            basepath: 'src/html_includes/'
        }))
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({ stream:true }));
});
gulp.task('fonts', function () {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(reload({ stream:true }));
});
gulp.task('images', function() {
    gulp.src(path.src.img)
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({ stream:true }));
});
gulp.task('styles', function () {
    return gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(rename('style.css'))
        .pipe(replace('../../', '../'))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({ stream:true }));
});
gulp.task('styles-min', function () {
    return gulp.src(path.src.style)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['> 0.01%'],
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(rename('style.css'))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({ stream:true }));
});
gulp.task('js', function () {
    return gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({ stream:true }));
});
gulp.task('js-min', function () {
    return gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(minify({
            ext:{
                src: '-src.js',
                min: '.js'
            },
            ignoreFiles: ['vendor.js']
        }))
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({ stream:true }));
});

gulp.task('watch-dev', ['build-dev'], function () {
    browserSync.init({
        server: {
            baseDir: "./dist",
            middleware: [historyApiFallback({})]
        },
        port: 3000,
        ghostMode: {
            clicks: false,
            forms: false,
            scroll: false
        }
    });
    watch([path.watch.html], function(event, cb) {
        gulp.start('html');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('styles');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('images');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts');
    });
});

gulp.task('watch-prod', ['build-prod'], function () {
    browserSync.init({
        server: {
            baseDir: "./dist",
            middleware: [historyApiFallback({})]
        },
        port: 3000,
        ghostMode: {
            clicks: false,
            forms: false,
            scroll: false
        }
    });
    watch([path.watch.html], function(event, cb) {
        gulp.start('html');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('styles-min');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js-min');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('images');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts');
    });
});
gulp.task('build-dev', ['html', 'styles', 'js']);
gulp.task('build-prod', ['html', 'styles-min', 'js-min']);


gulp.task('default', ['watch-dev']);