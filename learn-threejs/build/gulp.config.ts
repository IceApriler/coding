import * as path from "path"
import { IConfig } from './gulp.dev'

export const config: IConfig = {
  rootPath: path.resolve(__dirname, '../'),
  tsSrc: path.resolve(__dirname, '../src/**/*.ts'),
  stylusPath: path.resolve(__dirname, '../src/**/*.styl'),
  srcPath: path.resolve(__dirname, '../src'),
  distPath: path.resolve(__dirname, '../dist/'),
  entryName: path.resolve(__dirname, '../src/index.ts'),
  outputPath: path.resolve(__dirname, '../dist/bundle.js'),
}