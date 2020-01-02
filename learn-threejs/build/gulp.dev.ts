import * as path from "path"
import * as fs from "fs-extra"
import * as gulp from "gulp"
import * as log from "fancy-log"
import * as remember from "gulp-remember"
import * as rollup from 'rollup'
import stylus from "gulp-stylus"
import postcss from "gulp-postcss"
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import chalk from "chalk"
const autoprefixer = require('autoprefixer')

export type Done = (error?: any) => void

export interface IConfig {
  rootPath: string
  tsSrc: string
  srcPath: string
  stylusPath: string
  distPath: string
  entryName: string
  outputPath: string
}

export class Dev {
  readonly rootPath: string
  readonly tsSrc: string
  readonly srcPath: string
  readonly stylusPath: string
  readonly distPath: string
  readonly entryName: string
  readonly outputPath: string

  constructor(config: IConfig) {
    const { rootPath, tsSrc, srcPath, stylusPath, distPath, entryName, outputPath } = config
    this.rootPath = rootPath
    this.tsSrc = tsSrc
    this.srcPath = srcPath
    this.stylusPath = stylusPath
    this.distPath = distPath
    this.entryName = entryName
    this.outputPath = outputPath

    this.init()
  }

  init() {
    this.createBuild()
    this.createWatch()

    gulp.task("default", gulp.series('clean', gulp.parallel('build:styl', 'build:ts')))
    gulp.task('dev', gulp.series('clean', gulp.parallel('build:styl', 'build:ts'), 'watch'))
  }

  createBuild() {
    gulp.task("clean", (done) => {
      fs.emptyDirSync(this.distPath)
      done()
    })
    gulp.task("build:styl", () => {
      return gulp.src(this.stylusPath, { base: '' })
        .pipe(stylus())
        .pipe(
          postcss([
            autoprefixer()
          ])
        )
        .pipe(gulp.dest(this.distPath))
    })
    gulp.task("build:ts", async () => {
      const bundle = await rollup.rollup({
        input: this.entryName,
        plugins: [
          resolve(),
          commonjs(),
          typescript({ tsconfig: path.resolve(__dirname, './tsconfig.json') }),
        ],
        onwarn(warning) {
          console.log(warning)
          // 跳过某些警告
          if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
          // 抛出异常
          if (warning.code === 'NON_EXISTENT_EXPORT') throw new Error(warning.message);
          // 控制台打印一切警告
          console.warn(warning.message);
        }
      })
      await bundle.write({
        file: this.outputPath,
        format: 'umd',
        sourcemap: true
      })
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
