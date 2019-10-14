import * as path from "path"
import * as gulp from "gulp"
import * as gulpIf from "gulp-if"
import * as log from "fancy-log"
import * as babel from "gulp-babel"
import * as browserify from "browserify"
import * as source from "vinyl-source-stream"
import chalk from "chalk"
import { Pure, Config } from './gulp.pure'
import { vinylIsJs, vinylIsNotTs, getSuffix } from './gulp.utils'
const tsify = require('tsify')

export class Browser extends Pure {
  constructor(config: Config) {
    super(config)
    this.init()
  }

  init() {
    this.createCleanDist()
    this.createBuildFile()
    this.createWatch()
    this.createBrowser()

    gulp.task("default", gulp.series('clean-dist', 'build-file'))
    gulp.task('dev', gulp.series('clean-dist', 'build-file', 'watch'))
  }

  createBrowser() {
    this.browser = browserify({
      entries: path.resolve(__dirname, '../src/index.ts'),
      debug: true
    })
  }

  buildFile(filename = '') {
    log.info(`Starting ${chalk.cyan("'build-file'")} ${chalk.magenta(filename || '')}`)

    let basePath: string,
        srcPath: string | string[]
    if (filename) {
      basePath = path.resolve(__dirname, '../src')
      srcPath = filename
    } else {
      basePath = ''
      srcPath = this.src
    }

    switch(getSuffix(filename)) {
      case 'ts':
        return this.browser
          .plugin(tsify)
          .bundle()
          .pipe(
            gulpIf(
              vinylIsJs, 
              babel()
            )
          )
          .pipe(source('bundle.js'))
          .pipe(gulp.dest(this.dist))
          .on('end', () => {
            log.info(`Finished ${chalk.cyan("'build-file'")}`)
          })
      case 'js' || 'html' || 'css':
        return gulp
          .src(srcPath, { base: basePath })
          .pipe(
            gulpIf(
              vinylIsJs, 
              babel()
            )
          )
          .pipe(gulp.dest(this.dist))
          .on('end', () => {
            log.info(`Finished ${chalk.cyan("'build-file'")}`)
          })
      default:
        this.browser
          .plugin(tsify)
          .bundle()
          .pipe(
            gulpIf(
              vinylIsJs, 
              babel()
            )
          )
          .pipe(source('bundle.js'))
          .pipe(gulp.dest(this.dist))
        return gulp
          .src(srcPath, { base: basePath })
          .pipe(
            gulpIf(
              vinylIsJs, 
              babel()
            )
          )
          .pipe(
            gulpIf(
              vinylIsNotTs, 
              gulp.dest(this.dist)
            )
          )
          .on('end', () => {
            log.info(`Finished ${chalk.cyan("'build-file'")}`)
          })
    }
  }
}
