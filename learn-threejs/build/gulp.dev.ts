import * as fs from "fs-extra"
import * as gulp from "gulp"
import * as sourcemaps from "gulp-sourcemaps"
import * as stylus from "gulp-stylus"
import * as log from "fancy-log"
import * as postcss from "gulp-postcss"
import * as gulpIf from "gulp-if"
import * as cache from "gulp-cached"
import * as remember from "gulp-remember"
import chalk from "chalk"
import typescript from 'rollup-plugin-typescript2'
import { isFixed } from './gulp.utils'
const autoprefixer = require('autoprefixer')
const eslint = require('gulp-eslint')
const rollup = require("gulp-better-rollup")

export type Done = (error?: any) => void


export interface IConfig {
  rootPath: string
  tsSrc: string
  srcPath: string
  stylusPath: string
}

export class Dev {
  readonly rootPath: string
  readonly tsSrc: string
  readonly srcPath: string
  readonly stylusPath: string

  constructor(config: IConfig) {
    const { rootPath, tsSrc, srcPath, stylusPath } = config
    this.rootPath = rootPath
    this.tsSrc = tsSrc
    this.srcPath = srcPath
    this.stylusPath = stylusPath

    this.init()
  }

  init() {
    this.createBuild()
    this.createWatch()

    gulp.task("default", gulp.parallel('build:styl', 'build:ts'))
    gulp.task('dev', gulp.series(gulp.parallel('build:styl', 'build:ts'), 'watch'))
  }

  createBuild() {
    gulp.task("build:styl", () => {
      return gulp.src(this.stylusPath, { base: '' })
        .pipe(stylus())
        .pipe(
          postcss([
            autoprefixer()
          ])
        )
        .pipe(gulp.dest(this.srcPath))
    })
    gulp.task("build:ts", () => {
      return gulp.src(this.tsSrc, { base: '' })
        .pipe(cache('build:ts'))
        .pipe(remember('build:ts'))
        .pipe(eslint({ fix: true }))
        .pipe(eslint.format())
        .pipe(gulpIf(isFixed, gulp.dest(this.srcPath) ))
        .pipe(sourcemaps.init())
        .pipe(
          rollup({
            plugins: [typescript({
              tsconfig: './tsconfig.json'
            })]
          },{
            format: "iife"
          })
        )
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(this.srcPath))
    })
  }

  createWatch() {
    gulp.task("watch", (done: Done) => {
      const tsWatcher = gulp.watch(this.tsSrc, gulp.series('build:ts'))
      const stylusWatcher = gulp.watch(this.stylusPath, gulp.series('build:styl'))
      ;['unlink'].forEach(event => {
        tsWatcher.on(event, (filename: string) => {
          log.info(`Starting ${chalk.cyan("'delete:ts'")} ${chalk.magenta(filename || '')}`)
          const _filename = filename
            .replace('.ts', '.js')
          fs.remove(_filename, () => {
            log.info(`Finished ${chalk.cyan("'delete:ts'")}`)
          })
          delete (cache.caches['build:ts'] as any)[filename]
          remember.forget('build:ts', filename)
        })
        stylusWatcher.on(event, (filename: string) => {
          log.info(`Starting ${chalk.cyan("'delete:styl'")} ${chalk.magenta(filename || '')}`)
          const _filename = filename
            .replace('.styl', '.wxss')
          fs.remove(_filename, () => {
            log.info(`Finished ${chalk.cyan("'delete:styl'")}`)
          })
        })
      })
      done()
    })
  }
}
