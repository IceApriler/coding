import * as path from "path"
import { Config } from './gulp.pure'
import { WeappConfig } from './gulp.weapp'

export const config: Config = {
  dist: path.resolve(__dirname, '../dist'),
  src: path.resolve(__dirname, '../src/**'),
  page: path.resolve(__dirname, '../src/**/*.html'),
}
export const weappConfig: WeappConfig = {
  dist: path.resolve(__dirname, '../minidist'),
  src: path.resolve(__dirname, '../miniprogram/**'),
  srcPath: path.resolve(__dirname, '../miniprogram'),
  srcRegExp: /^(..\/)*miniprogram\//g
}