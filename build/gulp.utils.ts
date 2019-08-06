import * as path from "path"
import * as vinyl from "vinyl"

export function getSuffix(filename: string) {
  const index = filename.lastIndexOf(".")
  return filename.substr(index + 1)
}

export function src2dist(filename: string, dist: string, srcRegExp: RegExp) {
  const relativePath = path.relative(__dirname, filename).split(path.sep).join('/')
  const projectPath = relativePath.replace(srcRegExp, '')
  const distPath = path.join(dist, projectPath)
  return distPath
}

export function vinylIsTs(fs: vinyl) {
  return fs.extname === '.ts'
}

export function vinylIsNotTs(fs: vinyl) {
  return fs.extname !== '.ts'
}

export function vinylIsJs(fs: vinyl) {
  return fs.extname === '.js'
}