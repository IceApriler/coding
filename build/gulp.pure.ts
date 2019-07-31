import * as path from "path"
import * as fs from "fs-extra"
import * as gulp from "gulp"
import * as concat from "gulp-concat"
import * as sourcemaps from "gulp-sourcemaps"
import * as ts from "gulp-typescript"
import * as gulpIf from "gulp-if"
import * as log from "fancy-log"
import chalk from "chalk"

const tsProject = ts.createProject('tsconfig.json')

const isMuti = true

const PATHS = {
  dist: path.resolve(__dirname, '../dist'),
  src: path.resolve(__dirname, '../src'),
  page: [`${path.resolve(__dirname, '../src')}/**/*.html`],
  ts: [`${path.resolve(__dirname, '../src')}/**/*.ts`]
}

export class Pure {
  constructor() {
    this.init()
  }
  init() {
    gulp.task("cleanDist", function(done: any) {
      fs.emptyDirSync(PATHS.dist)
      done()
    })
    
    gulp.task("copy-html", function() {
      return gulp.src(PATHS.page)
        .pipe(gulp.dest(PATHS.dist))
    })
    
    function buildTs (path?: string) {
      log.info(`Starting ${chalk.cyan("'buildTs'")} ${chalk.magenta(path || '')}`)
      return gulp.src(path || PATHS.ts)
        .pipe(tsProject())
        .pipe(sourcemaps.init())
        .pipe(gulpIf(!isMuti, concat('bundle.js')))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(PATHS.dist))
        .on('end', () => {
          log.info(`Finished ${chalk.cyan("'buildTs'")}`)
        })
    }
    
    gulp.task("build-ts", function() {
      return buildTs()
    })
    
    gulp.task("watch", function(done: any) {
      gulp.watch(PATHS.page, gulp.series('copy-html'))
      const tsWatcher = gulp.watch(PATHS.ts)
      ;['change', 'add'].forEach(t => {
        tsWatcher.on(t, (_path: string): void => {
          buildTs(_path)
        })
      })
      ;['unlink'].forEach(t => {
        tsWatcher.on(t, (_path: string): void => {
          const relativePath = path.relative(__dirname, _path).split(path.sep).join('/')
          const projectPath = relativePath.replace(/^(..\/)*src\//g, '')
          const distPath = path.join(PATHS.dist, projectPath).replace('.ts', '.js')
          fs.removeSync(distPath)
        })
      })
      done()
    })
    
    gulp.task("default", gulp.series('cleanDist', 'copy-html', 'build-ts'))
    gulp.task('dev', gulp.series('cleanDist', 'copy-html', 'build-ts', 'watch'))
  }
}
