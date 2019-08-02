import * as path from "path"
import { Config } from './gulp.pure'

export const config: Config = {
  dist: path.resolve(__dirname, '../dist'),
  src: path.resolve(__dirname, '../src/**'),
  page: path.resolve(__dirname, '../src/**/*.html'),
}