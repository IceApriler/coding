const gulp = require("gulp")
const ts = require('gulp-typescript')
const tsProject = ts.createProject('tsconfig.json')
const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')
 
gulp.task("copy-html", function() {
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest("dist"))
})

gulp.task("build-ts", function() {
  return gulp.src('src/**/*.ts')
    .pipe(tsProject())
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'))
})

gulp.task("watch", function(done) {
  gulp.watch('src/**/*.ts', gulp.series('build-ts'))
  gulp.watch('src/**/*.html', gulp.series('copy-html'))
  done()
})

gulp.task("default", gulp.series('copy-html', 'build-ts'))
gulp.task('dev', gulp.series('copy-html', 'build-ts', 'watch'))
