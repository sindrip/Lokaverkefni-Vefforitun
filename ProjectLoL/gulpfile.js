const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const sass = require('gulp-sass');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const stylelint = require('stylelint');
const gulpStylelint = require('gulp-stylelint');
const browserify = require('gulp-browserify');



gulp.task('lint-javascript', () => {
  return gulp.src(['./src/*.js'])
       // eslint() attaches the lint output to the "eslint" property
       // of the file object so it can be used by other modules.
       .pipe(eslint())
       // eslint.format() outputs the lint results to the console.
       // Alternatively use eslint.formatEach() (see Docs).
       .pipe(eslint.format())
       // To have the process exit with an error code (1) on
       // lint error, return the stream and pipe to failAfterError last.
       //.pipe(eslint.failAfterError());
});

gulp.task('lint-scss', () => {
  /*gulp.src('src/*.scss')
  .pipe(scsslint())
  .pipe(scsslint.reporter());*/
  return gulp.src('/src/*.scss')
  .pipe(gulpStylelint({
      reporters: [
        {formatter: 'string', console: true}
      ]
    }));
});

gulp.task('serve', () => {
  browserSync.init({
        server: {
            baseDir: "./"
        }

    });
    gulp.watch("./*.html").on("change", reload);
    gulp.watch("src/*.scss", ['sass']);
    gulp.watch("src/*.js", ['js-watch']);
});

gulp.task('js-watch', ['js'], function (done) {
    browserSync.reload();
    done();
});

// process JS files and return the stream when babel is done.
gulp.task('js', ['babel'], function (done) {
    return gulp.src('./src/*js')
        .pipe(browserify())

        .pipe(gulp.dest('./dist/js'));
});


gulp.task('sass', function () {
  return gulp.src('src/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('./dist'))
  .pipe(browserSync.stream());
});

gulp.task('babel', () => {
  return gulp.src('src/testJS.js')
  .pipe(babel({
    presets: ['es2015']
   }))
  .pipe(gulp.dest('dist'));

});

gulp.task('lint', ['lint-scss', 'lint-javascript']);

gulp.task('default', ['lint', 'sass', 'babel', 'serve']);
