import * as path from "path"
import * as gulp from "gulp"
import * as gulpIf from "gulp-if"
import * as log from "fancy-log"
import * as babel from "gulp-babel"
import * as browserify from "browserify"
import * as source from "vinyl-source-stream"
import chalk from "chalk"
import { Pure, Config } from './gulp.pure'
import { vinylIsJs } from './gulp.utils'
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

  buildFile (filename?: string) {
    log.info(`Starting ${chalk.cyan("'build-file'")} ${chalk.magenta(filename || '')}`)

    return this.browser
      .plugin(tsify)
      .bundle()
      .on('error', log.error.bind(log, 'Browserify Error'))
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
  }
}
