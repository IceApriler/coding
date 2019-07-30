const path = require('path')
const fs = require('fs-extra')
const gulp = require("gulp")
const ts = require('gulp-typescript')
const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')
const gulpIf = require('gulp-if')
const log = require('fancy-log')
const chalk = require('chalk')
const tsProject = ts.createProject('tsconfig.json')

const isMuti = true

const PATHS = {
  dist: path.resolve(__dirname, './dist'),
  page: ['src/**/*.html'],
  ts: ['src/**/*.ts']
}

gulp.task("cleanDist", function(done) {
  fs.emptyDirSync(PATHS.dist)
  done()
})

gulp.task("copy-html", function() {
  return gulp.src(PATHS.page)
    .pipe(gulp.dest("dist"))
})

function buildTs (path) {
  log.info(`Starting ${chalk.cyan("'buildTs'")} ${chalk.magenta(path || '')}`)
  return gulp.src(path || PATHS.ts)
    .pipe(tsProject())
    .pipe(sourcemaps.init())
    .pipe(gulpIf(!isMuti, concat('bundle.js')))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'))
    .on('end', () => {
      log.info(`Finished ${chalk.cyan("'buildTs'")}`)
    })
}

gulp.task("build-ts", function() {
  return buildTs()
})

gulp.task("watch", function(done) {
  gulp.watch(PATHS.page, gulp.series('copy-html'))
  const tsWatcher = gulp.watch(PATHS.ts)
  ;['change', 'add'].forEach(t => {
    tsWatcher.on(t, _path => buildTs(_path))
  })
  ;['unlink'].forEach(t => {
    tsWatcher.on(t, _path => {
      const relativePath = path.relative(__dirname, _path).split(path.sep).join('/')
      const projectPath = relativePath.replace(/^(.\/)*src\//g, '')
      const distPath = path.join(PATHS.dist, projectPath).replace('.ts', '.js')
      fs.removeSync(distPath)
    })
  })
  done()
})

gulp.task("default", gulp.series('cleanDist', 'copy-html', 'build-ts'))
gulp.task('dev', gulp.series('cleanDist', 'copy-html', 'build-ts', 'watch'))
