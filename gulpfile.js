var gulp = require('gulp'),
  jade = require('gulp-jade'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  browserSync = require('browser-sync');

gulp.task('default', ['compile', 'watch'], function () {
  gulp.start.call(this, 'server');
});

gulp.task('compile', ['markup', 'scripts']);

gulp.task('markup', function () {
  return gulp.src('./src/templates/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('bin'));
});

gulp.task('scripts', function () {

  var bundleStream = browserify('./src/js/root.js').bundle();

  return bundleStream
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('bin/js'));
});

gulp.task('watch', ['watch-scripts', 'watch-markup']);

gulp.task('watch-markup', function () {
  return gulp.watch('src/templates/*.jade', ['markup']);
});

gulp.task('watch-scripts', function () {
  return gulp.watch('src/js/*.js', ['scripts']);
});

gulp.task('server', function () {
  return browserSync.init(['bin/js/*.js', 'bin/index.html'], {
    server: {
      baseDir: './bin'
    }
  });
});
