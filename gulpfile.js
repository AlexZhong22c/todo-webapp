var gulp = require('gulp')
var sass = require('gulp-sass')
var minifyCss = require('gulp-clean-css')
var uglify = require('gulp-uglify')

gulp.task('sass', function () {
  return gulp.src('src/sass/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('src/cssBySass'))
})

gulp.task('watchSass', function () {
  gulp.watch('src/sass/*.scss', ['sass'])
})

gulp.task('sass-group', ['sass', 'watchSass'])

gulp.task('minify-css', function () {
  return gulp.src('src/cssBySass/*.css')
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css'))
})

gulp.task('js-uglify', function () {
  return gulp.src(['src/js/*.js', '!src/js/*.min.js'])
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
})
gulp.task('js-copy', function () {
  return gulp.src(['src/js/*.min.js'])
    .pipe(gulp.dest('dist/js'))
})

gulp.task('watchCssJavaScript', function () {
  gulp.watch('src/cssBySass/*css', ['minify-css'])
  gulp.watch(['src/js/*.js', '!src/js/*.min.js'], ['js-uglify'])
  gulp.watch('src/js/*.min.js', ['js-copy'])
})
gulp.task('acj-group', ['minify-css', 'js-uglify', 'js-copy', 'watchCssJavaScript'])

gulp.task('default', ['sass-group', 'acj-group'])
