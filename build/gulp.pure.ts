import * as path from "path"
import * as fs from "fs-extra"
import * as gulp from "gulp"
import * as sourcemaps from "gulp-sourcemaps"
import * as ts from "gulp-typescript"
import * as gulpIf from "gulp-if"
import * as log from "fancy-log"
import * as babel from "gulp-babel"
import * as browserify from "browserify"
import * as source from "vinyl-source-stream"
import chalk from "chalk"
import { src2dist, vinylIsTs, vinylIsJs } from './gulp.utils'

const tsProject = ts.createProject('tsconfig.json')

export type Done = (error?: any) => void

export interface Config {
  dist: string
  src: string | string[]
}

export class Pure {

  readonly dist: string
  readonly src: string | string[]
  protected browser: browserify.BrowserifyObject

  constructor(config: Config) {
    const { dist, src } = config
    this.dist = dist
    this.src = src
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

  createCleanDist() {
    gulp.task("clean-dist", (done: Done) => {
      fs.emptyDirSync(this.dist)
      done()
    })
  }

  createBuildFile() {
    gulp.task("build-file", () => {
      return this.buildFile()
    })
  }

  createWatch() {
    gulp.task("watch", (done: Done) => {
      const tsWatcher = gulp.watch(this.src)
      ;['change', 'add'].forEach(event => {
        tsWatcher.on(event, (filename: string) => {
          this.buildFile(filename)
        })
      })
      ;['unlink', 'unlinkDir'].forEach(event => {
        tsWatcher.on(event, (filename: string) => {
          log.info(`Starting ${chalk.cyan("'delete-file'")} ${chalk.magenta(filename || '')}`)
          fs.remove(src2dist(filename, this.dist).replace('.ts', '.js'), () => {
            log.info(`Finished ${chalk.cyan("'delete-file'")}`)
          })
        })
      })
      done()
    })
  }

  createBrowser() {
    this.browser = browserify({
      entries: path.resolve(__dirname, '../dist/index.js'),
      debug: true
    })
  }

  buildBrowser() {
    log.info(`Starting ${chalk.cyan("'browser-build'")}`)
    return this.browser.bundle()
      .on('error', log.error.bind(log, 'Browserify Error'))
      .pipe(source('bundle.js'))
      .pipe(gulp.dest(this.dist))
      .on('end', () => {
        log.info(`Finished ${chalk.cyan("'browser-build'")}`)
      })
  }

  buildFile (filename?: string) {
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
    return gulp.src(srcPath, { base: basePath })
      .pipe(sourcemaps.init())
      .pipe(
        gulpIf(vinylIsTs, tsProject())
      )
      .pipe(
        gulpIf(
          vinylIsJs, 
          babel()
        )
      )
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(this.dist))
      .on('end', () => {
        log.info(`Finished ${chalk.cyan("'build-file'")}`)
        this.buildBrowser() // 待优化，最好只针对js文件
      })
  }
}
