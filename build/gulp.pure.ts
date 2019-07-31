import * as path from "path"
import * as fs from "fs-extra"
import * as gulp from "gulp"
import * as sourcemaps from "gulp-sourcemaps"
import * as ts from "gulp-typescript"
import * as gulpIf from "gulp-if"
import * as log from "fancy-log"
import * as vinyl from "vinyl"
import chalk from "chalk"

const tsProject = ts.createProject('tsconfig.json')

const PATHS = {
  dist: path.resolve(__dirname, '../dist'),
  src: path.resolve(__dirname, '../src/**')
}

type Done = (error?: any) => void

export class Pure {
  constructor() {
    this.init()
  }
  init() {
    gulp.task("cleanDist", function(done: Done) {
      fs.emptyDirSync(PATHS.dist)
      done()
    })

    function getSuffix(filename: string) {
      const index = filename.lastIndexOf(".")
      return filename.substr(index + 1)
    }

    function src2dist(filename: string) {
      const relativePath = path.relative(__dirname, filename).split(path.sep).join('/')
      const projectPath = relativePath.replace(/^(..\/)*src\//g, '')
      const distPath = path.join(PATHS.dist, projectPath)
      return distPath
    }

    function isTs(fs: vinyl) {
      return fs.extname === '.ts'
    }

    function buildFile (filename?: string) {
      log.info(`Starting ${chalk.cyan("'buildFile'")} ${chalk.magenta(filename || '')}`)

      let basePath: string,
          srcPath: string | string[],
          stream: NodeJS.ReadableStream
      if (filename) {
        basePath = path.resolve(__dirname, '../src')
        srcPath = filename

        stream = gulp.src(srcPath, { base: basePath })
        if (getSuffix(filename) === 'ts') {
          stream = stream
            .pipe(tsProject())
            .pipe(sourcemaps.init())
            .pipe(sourcemaps.write())
        }
        stream = stream
          .pipe(gulp.dest(PATHS.dist))
      } else {
        basePath = ''
        srcPath = PATHS.src

        stream = gulp
          .src(srcPath, { base: basePath })
          .pipe(
            gulpIf(isTs, tsProject())
          )
          .pipe(sourcemaps.init())
          .pipe(sourcemaps.write())
          .pipe(gulp.dest(PATHS.dist))
      }
      return stream
        .on('end', () => {
          log.info(`Finished ${chalk.cyan("'buildFile'")}`)
        })
    }
    
    gulp.task("build-file", function() {
      return buildFile()
    })

    gulp.task("watch", function(done: Done) {
      const tsWatcher = gulp.watch(PATHS.src)
      ;['change', 'add'].forEach(event => {
        tsWatcher.on(event, (filename: string) => {
          buildFile(filename)
        })
      })
      ;['unlink', 'unlinkDir'].forEach(event => {
        tsWatcher.on(event, (filename: string) => {
          log.info(`Starting ${chalk.cyan("'delete'")} ${chalk.magenta(filename || '')}`)
          fs.remove(src2dist(filename).replace('.ts', '.js'), function() {
            log.info(`Finished ${chalk.cyan("'delete'")}`)
          })
        })
      })
      done()
    })
    
    gulp.task("default", gulp.series('cleanDist', 'build-file'))
    gulp.task('dev', gulp.series('cleanDist', 'build-file', 'watch'))
  }
}
