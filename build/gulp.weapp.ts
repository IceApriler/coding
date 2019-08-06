import * as path from "path"
import * as fs from "fs-extra"
import * as gulp from "gulp"
import * as sourcemaps from "gulp-sourcemaps"
import * as ts from "gulp-typescript"
import * as gulpIf from "gulp-if"
import * as log from "fancy-log"
import chalk from "chalk"
import { src2dist, vinylIsTs } from './gulp.utils'

const tsProject = ts.createProject('tsconfig.json')

export type Done = (error?: any) => void

export interface WeappConfig {
  dist: string
  src: string | string[],
  srcPath: string,
  srcRegExp: RegExp
}

export class Weapp {
  readonly dist: string
  readonly src: string | string[]
  readonly srcPath: string
  readonly srcRegExp: RegExp

  constructor(config: WeappConfig) {
    const { dist, src, srcPath, srcRegExp } = config
    this.dist = dist
    this.src = src
    this.srcPath = srcPath
    this.srcRegExp = srcRegExp
    this.init()
  }

  init() {
    this.createCleanDist()
    this.createBuildFile()
    this.createWatch()

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
          const _filename = src2dist(filename, this.dist, this.srcRegExp)
            .replace('.ts', '.js')
            .replace('.styl', '.css')
          fs.remove(_filename, () => {
            log.info(`Finished ${chalk.cyan("'delete-file'")}`)
          })
        })
      })
      done()
    })
  }

  buildFile (filename?: string) {
    log.info(`Starting ${chalk.cyan("'build-file'")} ${chalk.magenta(filename || '')}`)

    let basePath: string,
        srcPath: string | string[]
    if (filename) {
      basePath = this.srcPath
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
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(this.dist))
      .on('end', () => {
        log.info(`Finished ${chalk.cyan("'build-file'")}`)
      })
  }
}
