# webpack

- 概述

  > webpack 是一个现代 JavaScript 应用程序的模块打包器(特点 module、 bundler)
  > webpack 是一个**模块化方案（预编译）**
  > webpack获取具有依赖关系的模块，并生成表示这些模块的静态资源

- 四个核心概念：**入口(entry)**、**输出(output)**、**加载器loader**、**插件(plugins)**

- 对比

  > 模块化方案: webpack 和 requirejs（通过编写代码的方式将前端的功能，划分成独立的模块）
  > 
  > browserify 是与 webpack 相似的模块化打包工具
  > 
  > webpack 预编译 (在开发阶段通过webpack进行模块化处理, 最终项目上线, 就不在依赖于 webpack)
  > requirejs 线上的编译( 代码运行是需要依赖与 requirejs 的 )

- webpack起源

  - webpack解决了现存模块打包器的两个痛点：
  - 1 **Code Spliting** - 代码分离 按需加载
    - 2 **静态资源的模块化处理方案**
  
- webpack与模块化

  - 在webpack看来：所有的**静态资源都是模块**
  - webpack 模块能够识别以下等形式的模块之间的依赖：
    - JS的模块化规范：
      - ES2015 `import` `export`
      - CommonJS `require()` `module.exports`
      - AMD `define` 和 `require`
    - 非JS等静态资源：
      - css/sass/less 文件中的 `@import`
      - 图片连接，比如：样式 `url(...)` 或 HTML ``
      - 字体 等

- plugins

  - html-webpack-plugin 插件

    - 安装：`npm i -D html-webpack-plugin`
    - 作用：根据模板，自动生成html页面
    - 优势：页面存储在内存中，自动引入`bundle.js`、`css`等文件

    ```js
    /* webpack.config.js */
    const htmlWebpackPlugin = require('html-webpack-plugin')
    plugins: [
      new htmlWebpackPlugin({
        // 模板页面路径
        template: path.join(__dirname, './index.html'),
        // 在内存中生成页面路径，默认值为：index.html
        filename: 'index.html'
      })
    ]
    ```
    
  - clean-webpack-plugin 插件

    - 安装：`npm i -D clean-webpack-plugin`
    - 作用: 每次打包之前, 删除上一次打包的dist目录

    ```js
    /* webpack.prod.js */
    const cleanWebpackPlugin = require('clean-webpack-plugin')
    
    plugins: [
      // 创建一个删除文件夹的插件，删除dist目录
      new cleanWebpackPlugin(['./dist'])
    ]
    ```

  - CommonsChunkPlugin 插件

    - 作用：将公共的第三方包，抽离为一个单独的包文件，这样防止重复打包！

    ```js
    plugins: [
      // 3 抽离第三方包
      new webpack.optimize.CommonsChunkPlugin({
        // 将 entry 中指定的 ['vue', 'vue-router', 'axios'] 打包到名为 vendor 的js文件中
        // 第三方包入口名称，对应 entry 中的 vendor 属性
        name: 'vendor',
      }),
    ]
    ```

  - UglifyJsPlugin 和 DefinePlugin 插件

    - DefinePlugin作用：注入全局环境变量
    - UglifyJsPlugin作用：压缩JS，注意不能压缩ES6！

    ```js
    plugins: [
      // 优化代码
      // https://github.com/webpack-contrib/uglifyjs-webpack-plugin/tree/v0.4.6
      new webpack.optimize.UglifyJsPlugin({
        // 压缩
        compress: {
          // 移除警告
          warnings: false
        }
      }),
    
      // 指定环境为生产环境：vue会根据这一项启用压缩后的vue文件
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      })
    ]
    ```

  - extract-text-webpack-plugin 和 optimize-css-assets-webpack-plugin 插件

    - extract-text-webpack-plugin作用：分离 css 到独立的文件中
    - optimize-css-assets-webpack-plugin作用：压缩 css 资源文件

    ```js
    /* webpack.prod.js */
    
    // 分离 css 到独立的文件中
    const ExtractTextPlugin = require("extract-text-webpack-plugin");
    // 压缩 css 资源文件
    const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
    
    // bug描述: 生成后面的css文件中图片路径错误，打开页面找不到图片
    // 解决：google搜索 webpack css loader 样式图片路径
    output: {
      // ...
    
      // https://doc.webpack-china.org/configuration/output/#output-publicpath
      // 设置公共路径
      publicPath: '/',
    },
    
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: "css-loader"
          })
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: ['css-loader', 'sass-loader']
          })
        },
      ]
    },
    plugins: [
      // 通过插件抽离 css (参数)
      new ExtractTextPlugin("css/style.css"),
      // 抽离css 的辅助压缩插件
      new OptimizeCssAssetsPlugin()
    ]
    ```

  - Html-webpack-plugins

    - 作用：压缩html文件

    ```js
      const HtmlWebpackPlugin = require('html-webpack-plugin');
    
    	plugins: [
        new htmlWebpackPlugin({
          // 模板页面
          template: path.join(__dirname, './index.html'),
    
          // 压缩HTML
          minify: {
            // 移除空白
            collapseWhitespace: true,
            // 移除注释
            removeComments: true,
            // 移除属性中的双引号
            removeAttributeQuotes: true
          }
        }),
      ]
    ```

  - 

- loaders

  > webpack只能处理JavaScript资源
  >
  > webpack通过loaders处理非JavaScript静态资源

  - css打包

    - 安装：`npm i -D style-loader css-loader`
    - 注意：use中模块的顺序不能颠倒，加载顺序：从右向左加载

    ```js
    /* 在index.js  导入 css 文件*/
    import './css/app.css'
    
    /* webpack.config.js 配置各种资源文件的loader加载器*/
    module: {
      // 配置匹配规则
      rules: [
        // test 用来配置匹配文件规则（正则）
        // use  是一个数组，按照从后往前的顺序执行加载
        {test: /\.css$/, use: ['style-loader', 'css-loader']},
      ]
    }
    ```

  - 使用webpack打包sass文件

    - 安装：`npm i -D sass-loader node-sass`
    - 注意：`sass-loader` 依赖于 `node-sass` 模块

    ```js
    /* webpack.config.js */
    // 参考：https://webpack.js.org/loaders/sass-loader/#examples
    // "style-loader"  ：creates style nodes from JS strings 创建style标签
    // "css-loader"    ：translates CSS into CommonJS 将css转化为CommonJS代码
    // "sass-loader"   ：compiles Sass to CSS 将Sass编译为css
    module:{
      rules:[
        {test: /\.(scss|sass)$/, use: ['style-loader', 'css-loader', 'sass-loader']},
      ]
    }
    ```

  - 图片和字体打包

    - 安装：`npm i -D url-loader file-loader`
    - `file-loader`：加载并重命名文件（图片、字体 等）
    - `url-loader`：将图片或字体转化为base64编码格式的字符串，嵌入到样式文件中

    ```js
    /* webpack.config.js */
    module: {
      rules:[
        // 打包 图片文件
        { test: /\.(jpg|png|gif|jpeg)$/, use: 'url-loader' },
    
        // 打包 字体文件
        { test: /\.(woff|woff2|eot|ttf|otf)$/, use: 'file-loader' }
      ]
    }
    ```

  - 图片打包细节

    - `limit`参数的作用：（单位为：字节(byte)）
      - 当图片文件大小（字节）`小于`指定的limit时，图片被转化为base64编码格式
      - 当图片文件大小（字节）`大于等于`指定的limit时，图片被重命名以url路径形式加载（此时，需要`file-loader`来加载图片）
    - 图片文件重命名，保证相同文件不会被加载多次。例如：一张图片（a.jpg）拷贝一个副本（b.jpg），同时引入这两张图片，重命名后只会加载一次，因为这两张图片就是同一张
    - 文件重命名以后，会通过MD5加密的方式，来计算这个文件的名称
    
    ```js
    /* webpack.config.js */
    
    module: {
      rules: [
        // {test: /\.(jpg|png|gif|jpeg)$/, use: 'url-loader?limit=100'},
        {
          test: /\.(jpg|png|gif|jpeg)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192
              }
            }
          ]
        }
      ]
    }
    ```
    
  - 字体文件打包说明
  
    - 处理方式与图片相同，可以使用：`file-loader`或`url-loader`
    
  - vue单文件组件
  
    - [vue-loader](https://vue-loader.vuejs.org/zh-cn/)
    - single-file components(单文件组件)
    - 后缀名：`.vue`，该文件需要被预编译后才能在浏览器中使用
    - 注意：单文件组件依赖于两个包 **vue-loader** / **vue-template-compiler**
    - 安装：`npm i -D vue-loader vue-template-compiler`
  
    ```vue
    <!-- App.vue 示例代码： -->
    <template>
      <div>
        <h1>VUE 单文件组件示例 -- App.vue</h1>
        <p>这是 模板内容</p>
      </div>
    </template>
    
    <script>
      // 组件中的逻辑代码
      export default {}
    </script>
    
    <style>
    /* 组件样式 */
    h1 {
      color: red;
    }
    </style>
    ```
  
    ```js
    // webpack.config.js 配置：
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        }
      ]
    }
    ```
  
    ```js
    /* main.js */
    
    import Vue from 'vue'
    // 导入 App 组件
    import App from './App.vue'
    
    const vm = new Vue({
      el: '#app',
      // 通过 render 方法，渲染App组件
      render: c => c(App)
    })
    ```
  
  - 单文件组件使用步骤
  
    - 1 安装：`npm i -D vue-loader vue-template-compiler`
    - 2 在 `webpack.config.js` 中配置 `.vue` 文件的loader
      - `{ test: /\.vue$/, use: 'vue-loader' }`
    - 3 创建 `App.vue` 单文件组件，注意：App可以是任意名称
    - 4 在 `main.js` 入口文件中，导入 `vue` 和 `App.vue`组件，通过 render 将组件与实例挂到一起
  
  - 单文件组件 + 路由
  
    ```js
    import Vue from 'vue'
    import App from './App.vue'
    
    // ------------- vue路由配置 开始 --------------
    import Home from './components/home/Home.vue'
    import Login from './components/login/Login.vue'
    
    // 1 导入 路由模块
    import VueRouter from 'vue-router'
    // 2 ** 调用use方法使用插件 **
    Vue.use(VueRouter)
    // 3 创建路由对象
    const router = new VueRouter({
      routes: [
        { path: '/home', component: Home },
        { path: '/login', component: Login }
      ]
    })
    
    // ------------- vue路由配置 结束 --------------
    
    const vm = new Vue({
      el: '#app',
      render: c => c(App),
      // 4 挂载到 vue 实例中
      router
    })
    ```
  
- Mint-ui

   - 为什么js中引入css？因为要通过webpack加载资源
   
  ``` js
  // 1 导入 mint-ui模块
  import MintUI from 'mint-ui'
  // 2 导入 样式
  import 'mint-ui/lib/style.css'
  // 3 注册插件
  Vue.use(MintUI)
  ```

- webpack发布项目

  - 配置项目

    - 开发期间配置文件：`webpack.config.js`
    - 项目发布配置文件：`webpack.prod.js` （文件名称非固定 production 生产环境）
    - 命令：`webpack --config webpack.prod.js` 指定配置文件名称运行webpack
    - 参数：`--display-error-details` 用于显示webpack打包的错误信息

    ```json
    /* package.json */
    
    "scripts": {
      "build": "webpack --config webpack.prod.js"
    }
    ```

  - 步骤

    > 1 在项目根目录中创建 webpack.prod.js 文件
    > 2 在 package.json 中, 配置一个 scripts
    > 3 在 终端中 通过 npm run build 对项目进行打包
    
  - 打包处理过程
  
    > 1 删除掉 devServer 相关的配置项
    > 2 将图片和字体文件输出到指定的文件夹中
    > 3 自动删除dist目录
    > 4 分离第三方包（将使用的vue等第三方包抽离到 vender.js 中）
    > 5 压缩混淆JS 以及 指定生成环境
    > 6 抽取和压缩CSS文件
    > 7 压缩HTML页面
    > 8 配合vue的异步组件，实现按需加载功能
  
- 分离第三方包

   - 目的：将公共的第三方包，抽离为一个单独的包文件，这样防止重复打包！
      - 例如：main.js、router、vuex中都引入了vue，不分离的话，vue会被打包3次
      - 抽离后, vue文件只会被打包一次, 用到的地方仅仅是引用

   ```js
   /* webpack.prod.js */
   
   // 1 入口 -- 打包文件的入口
   entry: {
     // 项目代码入口
     app: path.join(__dirname, './src/js/main.js'),
     // 第三方包入口
     vendor: ['vue', 'vue-router', 'axios']
   },
   
   output: {
     // 2 修改输出文件路径和命名规则
     filename: 'js/[name].[chunkhash].js',
   },
   
   plugins: [
     // 3 抽离第三方包
     new webpack.optimize.CommonsChunkPlugin({
       // 将 entry 中指定的 ['vue', 'vue-router', 'axios'] 打包到名为 vendor 的js文件中
       // 第三方包入口名称，对应 entry 中的 vendor 属性
       name: 'vendor',
     }),
   ]
   ```

- 压缩混淆JS

   - 注意：**uglifyjs 无法压缩ES6的代码**

   ```js
   plugins: [
     // 优化代码
     // https://github.com/webpack-contrib/uglifyjs-webpack-plugin/tree/v0.4.6
     new webpack.optimize.UglifyJsPlugin({
       // 压缩
       compress: {
         // 移除警告
         warnings: false
       }
     }),
   
     // 指定环境为生产环境：vue会根据这一项启用压缩后的vue文件
     new webpack.DefinePlugin({
       'process.env': {
         'NODE_ENV': JSON.stringify('production')
       }
     })
   ]
   ```

- 抽取和压缩CSS文件

  - 安装：抽离 `npm i -D extract-text-webpack-plugin`
  - 安装：压缩 `npm i -D optimize-css-assets-webpack-plugin`
  - [webpack 抽离CSS文档](https://doc.webpack-china.org/plugins/extract-text-webpack-plugin/)
  - [压缩抽离后的CSS](https://www.npmjs.com/package/optimize-css-assets-webpack-plugin)

  > 压缩和抽离CSS报错的说明：
  > Error processing file: css/style.css
  > postcss-svgo: Error in parsing SVG: Unquoted attribute value
  > 
  > 原因：压缩和抽离CSS的插件中只允许 SVG 使用双引号

  ```js
    /* webpack.prod.js */
    
    // 分离 css 到独立的文件中
    const ExtractTextPlugin = require("extract-text-webpack-plugin");
    // 压缩 css 资源文件
    const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
    
    // bug描述: 生成后面的css文件中图片路径错误，打开页面找不到图片
    // 解决：google搜索 webpack css loader 样式图片路径
    output: {
      // ...
    
      // https://doc.webpack-china.org/configuration/output/#output-publicpath
      // 设置公共路径
      publicPath: '/',
    },
    
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: "css-loader"
          })
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: ['css-loader', 'sass-loader']
          })
        },
      ]
    },
    plugins: [
      // 通过插件抽离 css (参数)
      new ExtractTextPlugin("css/style.css"),
      // 抽离css 的辅助压缩插件
      new OptimizeCssAssetsPlugin()
    ]
  ```
  
- 压缩HTML页面

  ```js
    const HtmlWebpackPlugin = require('html-webpack-plugin');
  
  	plugins: [
      new htmlWebpackPlugin({
        // 模板页面
        template: path.join(__dirname, './index.html'),
  
        // 压缩HTML
        minify: {
          // 移除空白
          collapseWhitespace: true,
          // 移除注释
          removeComments: true,
          // 移除属性中的双引号
          removeAttributeQuotes: true
        }
      }),
    ]
  ```

- vue配合webpack实现路由按需加载

  - [Vue 路由懒加载](https://router.vuejs.org/zh-cn/advanced/lazy-loading.html)

  - [Vue 异步组件](https://cn.vuejs.org/v2/guide/components.html#异步组件)

  - [Vue 组件懒加载浅析](http://www.cnblogs.com/zhanyishu/p/6587571.html)

  - [Vue.js路由懒加载[译]]([http://www.jianshu.com/p/abb0...](http://www.jianshu.com/p/abb02075b56b))

  - 步骤

    - 1 修改组件的引用方式

      ```js
      // 方式一: require.ensure()
      const NewsList = r => require.ensure([], () => r(require('../components/news/newslist.vue')), 'news')
      
      // 方式二: import() -- 推荐
      // 注意：/* webpackChunkName: "newsinfo" */ 是一个特殊的语法，表示生成js文件的名称
      const NewsInfo = () => import(/* webpackChunkName: "newsinfo" */ '../components/news/newsinfo.vue')
      ```

    - 2 修改 webpack 配置文件的output

      ```js
      put: {
        // ------添加 chunkFilename, 指定输出js文件的名称------
        chunkFilename: 'js/[name].[chunkhash].js',
      },
      ```