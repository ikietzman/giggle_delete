'use strict'

const gulp = require('gulp');
const sass = require('gulp-sass');
const cssNano = require('gulp-cssnano');
const cssBeautify = require('gulp-cssbeautify');
const cssLint = require('gulp-csslint');
const uglify = require('gulp-uglify');
const jshint = require('gulp-jshint');
const stylish = require('jshint-stylish');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const autoPrefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const sourceMaps = require('gulp-sourcemaps');
const browserSync = require ('browser-sync')
const imagemin = require('gulp-imagemin');

// Copies HTML
gulp.task('copyHtml', function() {
  gulp.src('src/html/*.html')
  .pipe(gulp.dest('dist/main.html'));
})

// Optimize Images
gulp.task('images', function() {
    gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
});

// compile SASS to CSS
gulp.task('sass', function() {
   return gulp.src('src/sass/styles.scss')
      .pipe(sourceMaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(sourceMaps.write())
      .pipe(gulp.dest('src/sass/'));
});

// CSS task
gulp.task('css', function() {
  return gulp.src('./src/sass/styles.css')
    .pipe(sourceMaps.init())
    .pipe(autoPrefixer())
    .pipe(cssLint())
    .pipe(cssNano())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('dist/css'))
});

// Minify & Concat JS
gulp.task('scripts', function(){
   return gulp.src('./src/js/*.js')
    .pipe(sourceMaps.init())
    // .pipe(babel({
    //         presets: ['@babel/env']
    //     }))
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))

    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('dist/js'));
});

// fixes streams
gulp.src('./src/*.ext')
    .pipe(plumber())
    .pipe(gulp.dest('./dist'));



gulp.task('run', ['copyHtml', 'images', 'sass', 'css', 'scripts',]);

gulp.task('watch', function(){
      gulp.watch('src/js/*.js',['scripts']);
      gulp.watch('src/sass/*.scss',['sass', 'css']);
      gulp.watch('src/images/*', ['images']);
      gulp.watch('src/*.html', ['copyHtml']);
});

gulp.task('default', ['run', 'watch']);
