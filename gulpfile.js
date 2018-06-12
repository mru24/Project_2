var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    cleancss = require('gulp-cleancss'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    changed = require('gulp-changed'),
    htmlReplace = require('gulp-html-replace'),
    htmlMin = require('gulp-htmlmin'),
    copyassets = require('gulp-copy'),
    del = require('del'),
    sequence = require('run-sequence');


var config = {
  dist: 'dist/',
  src: 'src/',
  sassin: 'src/sass/**/*.sass',
  sassout: 'src/css/',
  cssin: 'src/css/**/*.css',
  cssout: 'dist/css/',
  jsin: 'src/js/**/*.js',
  jsout: 'dist/js/',
  imgin: 'src/img/**/*.{jpg,jpeg,png,gif}',
  imgout: 'dist/img/',
  htmlin: 'src/*.html',
  htmlout: 'dist/',
  cssreplaceout: 'css/style.css',
  jsreplaceout: 'js/main.js',
  assetsin: 'src/assets/**/*',
  assetsout: 'dist/assets/'
}

gulp.task('reload', function() {
  browserSync.reload();
});
gulp.task('serve', ['sass'], function() {
  browserSync({
    server: config.src
  })
  gulp.watch(config.htmlin, ['reload']);
  gulp.watch(config.sassin, ['sass']);
});

gulp.task('sass', function() {
  return gulp.src(config.sassin)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 5 versions']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.sassout))
    .pipe(browserSync.stream());
});

gulp.task('css', function() {
  return gulp.src(config.cssin)
    .pipe(cleancss())
    .pipe(gulp.dest(config.cssout));
});

gulp.task('js', function() {
  return gulp.src(config.jsin)
    .pipe(uglify())
    .pipe(gulp.dest(config.jsout));
});

gulp.task('img', function() {
  return gulp.src(config.imgin)
    .pipe(changed(config.imgout))
    .pipe(imagemin())
    .pipe(gulp.dest(config.imgout))
});

gulp.task('copyassets', function () {
  return gulp.src(config.assetsin)
    .pipe(gulp.dest(config.assetsout));
});

gulp.task('html', function() {
  return gulp.src(config.htmlin)
    .pipe(htmlReplace({
      'css': config.cssreplaceout,
      'js': config.jsreplaceout
    }))
    .pipe(htmlMin({
      sortAttributes: true,
      sortClassName: true,
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(config.htmlout))
});

gulp.task('clean', function() {
  return del([config.dist])
});

gulp.task('build', function() {
  sequence('clean', ['css', 'js', 'img', 'copyassets', 'html'])
})

gulp.task('default', ['serve']);
