import * as path from "path"
import { Config } from './gulp.pure'
import { WeappConfig } from './gulp.weapp'

export const config: Config = {
  dist: path.resolve(__dirname, '../dist'),
  src: path.resolve(__dirname, '../src/**'),
  page: path.resolve(__dirname, '../src/**/*.html'),
}
export const weappConfig: WeappConfig = {
  rootPath: path.resolve(__dirname, '../'),
  tsSrc: path.resolve(__dirname, '../miniprogram/**/*.ts'),
  stylusPath: path.resolve(__dirname, '../miniprogram/**/*.styl'),
  srcPath: path.resolve(__dirname, '../miniprogram'),
  templatePath: path.resolve(__dirname, '../template'),
  weappCliConfig: {
    path: {
      mac: '/Applications/wechatwebdevtools.app/Contents/MacOS/cli',
      win: 'D:/微信web开发者工具/cli.bat' // or 'D:\\微信web开发者工具\\cli.bat'
    },
    args: [
      'l', 'login', // 登录
      'o', 'open', // 打开项目
      'p', 'preview', // 预览 & 自定义预览
      'auto-preview', // 提交后自动预览
      'u', 'upload', 'desc', 'upload-desc', // 上传
      'close', // 关闭项目窗口
      'quit' // 退出开发者工具
    ],
    // 配置自定义预览页面 路径&参数
    'compile-condition': {
      pathName: 'pages/cabinets/cabinet-list/cabinet-list',
      query: ''
    }
  }
}