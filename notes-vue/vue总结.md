# vue总结

- v-for的的源数据可以是数组、对象、字符串和数字。

- 使用v-for时，提供key属性可以获得性能提升

  - 主要是为了提升diff【同级比较】的效率。自己想一下自己要实现前后列表的diff，如果对列表的每一项增加一个key，即唯一索引，那就可以很清楚的知道两个列表谁少了谁没变。而如果不加key的话，就只能一个个对比了。

- v-show修改的是display属性，v-if会对元素进行销毁和重建

- v-once只渲染组件或元素一次，随后的渲染会跳过，可以用来优化性能。

- 过滤器filter

  - 全局过滤器

    - Vue.filter

      > 注意，一定要先注册全局过滤器，再创建Vue实例。

      ```js
      Vue.filter('capitalize', function (value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      })
      
      new Vue({
        // ...
      })
      ```

  - 局部过滤器

    - filter

      ```js
      filters: {
        capitalize: function (value) {
          if (!value) return ''
          value = value.toString()
          return value.charAt(0).toUpperCase() + value.slice(1)
        }
      }
      ```

  - 可以串联`{{ message | filterA | filterB }}`

  - 可以传参`{{ message | filterA('arg1', arg2) }}`

- watch

  - 概述：`watch`是一个对象，键是需要观察的表达式，值是对应回调函数
  - 作用：当表达式的值发生变化后，会调用对应的回调函数完成响应的监视操作

    ```js
    new Vue({
      data: { a: 1, b: { age: 10 } },
      watch: {
        a: function(val, oldVal) {
          // val 表示当前值
          // oldVal 表示旧值
          console.log('当前值为：' + val, '旧值为：' + oldVal)
        },
    
        // 监听对象属性的变化
        b: {
          handler: function (val, oldVal) { /* ... */ },
          // deep : true表示是否监听对象内部属性值的变化 
          deep: true
        },
    
        // 只监视user对象中age属性的变化
        'user.age': function (val, oldVal) {
        },
      }
    })
    ```

- computed

  - 说明：计算属性是基于它们的依赖进行缓存的，只有在它的依赖发生改变时才会重新求值

  - 注意：**`computed`中的属性不能与`data`中的属性同名，否则会报错**

    ```js
    var vm = new Vue({
      el: '#app',
      data: {
        firstname: 'jack',
        lastname: 'rose'
      },
      computed: {
        fullname() {
          return this.firstname + '.' + this.lastname
        }
      }
    })
    ```

- vue实例的生命周期

  - 一个组件从开始到销毁的各个状态，叫做生命周期

- 生命周期钩子函数

  - 从组件被**创建**，到组件**挂载**到页面上运行，再到页面关闭组件被**卸载**，这三个阶段总是伴随着组件各种各样的事件，这些事件，统称为组件的生命周期函数！
  - `beforeCreate`
    - 说明：在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用
    - 注意：此时，无法获取 data中的数据、methods中的方法
  - `created`
    - 注意：这是一个常用的生命周期，可以调用methods中的方法、改变data中的数据
    - 使用场景：发送请求获取数据
  - `beforeMount`
    - 说明：在挂载开始之前被调用
  - `mounted`
    - 说明：此时，vue实例已经挂载到页面中，可以获取到el中的DOM元素，进行DOM操作
  - `beforeUpdate`
    - 说明：数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。你可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程。
    - 注意：此处获取的数据是更新后的数据，但是获取页面中的DOM元素是更新之前的（数据已经准备好，等待渲染更新dom）
  - `updated`
    - 说明：组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。
  - `beforeDestroy`
    - 说明：实例销毁之前调用。在这一步，实例仍然完全可用。
    - 使用场景：实例销毁之前，执行清理任务，比如：清除定时器等
  - `destroyed`
    - 说明：Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。

- axios拦截器

  - 拦截器会拦截发送的每一个请求，请求发送之前执行`request`中的函数，请求发送完成之后执行`response`中的函数

  ```js
  // 请求拦截器
  axios.interceptors.request.use(function (config) {
    // 所有请求之前都要执行的操作
  
    return config;
  }, function (error) {
    // 错误处理
  
    return Promise.reject(error);
  });
  
  // 响应拦截器
  axios.interceptors.response.use(function (response) {
    // 所有请求完成后都要执行的操作
  
    return response;
  }, function (error) {
    // 错误处理
    return Promise.reject(error);
  });
  ```

- 父子组件通信

  - 方式：通过子组件`props`属性来传递数据， `props`是一个数组
  - 注意：属性的值必须在组件中通过`props`属性显示指定，否则，不会生效
  - 说明：传递过来的`props`属性的用法与`data`属性的用法相同

  ```vue
  <div id="app">
    <!-- 如果需要往子组件总传递父组件data中的数据 需要加v-bind="数据名称" -->
    <hello v-bind:msg="info"></hello>
    <!-- 如果传递的是字面量 那么直接写-->
    <hello my-msg="abc"></hello>
  </div>
  
  <!-- js -->
  <script>
    new Vue({
      el: "#app",
      data : {
        info : 15
      },
      components: {
        hello: {
          // 创建props及其传递过来的属性
          props: ['msg', 'myMsg'],
          template: '<h1>这是 hello 组件，这是消息：{{msg}} --- {{myMsg}}</h1>'
        }
      }
    })
  </script>
  ```

- 子组件到父组件

  - 方式：父组件给子组件传递一个函数，由子组件调用这个函数
    - 说明：借助vue中的自定义事件（v-on:cunstomFn="fn"）

  ```vue
  <hello @pfn="parentFn"></hello>
  
  <script>
    Vue.component('hello', {
      template: '<button @click="fn">按钮</button>',
      methods: {
        // 子组件：通过$emit调用
        fn() {
          this.$emit('pfn', '这是子组件传递给父组件的数据')
        }
      }
    })
    new Vue({
      methods: {
        // 父组件：提供方法
        parentFn(data) {
          console.log('父组件：', data)
        }
      }
    })
  </script>
  ```

- 非父子组件通信

  > 在简单的场景下，可以使用一个空的 Vue 实例作为事件总线

  ```js
  var bus = new Vue()
  
  // 在组件 B 绑定自定义事件
  bus.$on('id-selected', function (id) {
    // ...
  })
  // 触发组件 A 中的事件
  bus.$emit('id-selected', 1)
  ```

- 内容分发

  - 通过<slot></slot> 标签指定内容展示区域

  ```vue
  <!-- html代码 -->
  <div id="app">
    <hello>
      <!-- 如果只有一个slot插槽 那么不需要指定名称 -->
      <p slot="插槽名称">我是额外的内容</p>
    </hello>
  </div>
  ```

  ```js
  // js代码
  new vue({
    el : "#app",
    components : {
      hello : {
        template : `
            <div>
              <p>我是子组件中的内容</p>
              <slot name="插槽名称"></slot>
            </div>
          `
      }
    }
  })
  ```

- 获取组件（或元素） - refs

  - 说明：`vm.$refs` 一个对象，持有已注册过 ref 的所有子组件（或HTML元素）
  - 使用：在 HTML元素 中，添加`ref`属性，然后在JS中通过`vm.$refs.属性`来获取
  - 注意：如果获取的是一个子组件，那么通过ref就能获取到子组件中的data和methods

  ```vue
  <div id="app">
    <div ref="dv"></div>
    <my res="my"></my>
  </div>
  
  <!-- js -->
  <script>
    new Vue({
      el : "#app",
      mounted() {
        this.$refs.dv //获取到元素
        this.$refs.my //获取到组件
      },
      components : {
        my : {
          template: `<a>sss</a>`
        }
      }
    })
  </script>
  ```

- 单页面应用

  - SPA 单页面应用：只有第一次会加载页面, 以后的每次请求, 仅仅是获取必要的数据.然后, 由页面中js解析获取的数据, 展示在页面中。
  - MPA传统多页面应用：对于传统的多页面应用程序来说, 每次请求服务器返回的都是一个完整的页面。
  - 优势
    - 1 减少了请求体积，加快页面响应速度，降低了对服务器的压力
    - 2 更好的用户体验，让用户在web app感受native app的流畅
  - 实现思路和技术点
    - 1 ajax
    - 2 锚点的使用（window.location.hash #）
    - 3 hashchange 事件 window.addEventListener("hashchange",function () {})
    - 4 监听锚点值变化的事件，根据不同的锚点值，请求相应的数据
    - 5 原本用作页面内部进行跳转，定位并展示相应的内容

- vue路由

  - 路由即：浏览器中的哈希值（# hash）与展示视图内容（template）之间的对应规则
  - vue中的路由是：hash 和 component的对应关系
    - 在 Web app 中，通过一个页面来展示和管理整个应用的功能。
    - SPA往往是功能复杂的应用，为了有效管理所有视图内容，前端路由 应运而生！
    - 简单来说，路由就是一套映射规则（一对一的对应规则），由开发人员制定规则。
    - 当URL中的哈希值（# hash）发生改变后，路由会根据制定好的规则，展示对应的视图内容

  ```vue
  <div id="app">
    <!-- 5 路由入口 指定跳转到只定入口 -->
    <router-link to="/home">首页</router-link>
    <router-link to="/login">登录</router-link>
  
    <!-- 7 路由出口：用来展示匹配路由视图内容 -->
    <router-view></router-view>
  </div>
  
  <!-- 1 导入 vue.js -->
  <script src="./vue.js"></script>
  <!-- 2 导入 路由文件 -->
  <script src="./node_modules/vue-router/dist/vue-router.js"></script>
  <script>
    // 3 创建两个组件
    const Home = Vue.component('home', {
      template: '<h1>这是 Home 组件</h1>'
    })
    const Login = Vue.component('login', {
      template: '<h1>这是 Login 组件</h1>'
    })
  
    // 4 创建路由对象
    const router = new VueRouter({
      routes: [
        // 路径和组件一一对应
        { path: '/home', component: Home },
        { path: '/login', component: Login }
      ]
    })
  
    var vm = new Vue({
      el: '#app',
      // 6 将路由实例挂载到vue实例
      router
    })
  </script>
  ```

  - 路由其他配置

    ```js
    new Router({
      routers:[],
      mode: "hash", //默认hash | history 可以达到隐藏地址栏hash值 | abstract，如果发现没有浏览器的 API 则强制进入
      linkActiveClass : "now" //当前匹配的导航链接将被自动添加now类
    })
    ```

  - `$router`和`$route`的区别

    - `$router`是一个全局对象，包含了所有的路由包含了许多关键的对象和属性。
      - `this.$router.push()`
      - `this.$router.replace()`
      - `this.$router.go()`
    - `$route`是一个局部对象
      - `$route.path`路由的path
      - `$route.params`包含路由中的动态片段和全匹配片段的键值对
      - `$route.query`包含路由中查询URL参数的键值对

  - 嵌套路由-子路由

    - 路由是可以嵌套的，即：路由中又包含子路由
    - 规则：父组件中包含 router-view，在路由规则中使用 children 配置

    ```js
    // 父组件：
    const User = Vue.component('user', {
      template: `
      <div class="user">
        <h2>User Center</h2>
        <router-link to="/user/profile">个人资料</router-link>
        <router-link to="/user/posts">岗位</router-link>
        <!-- 子路由展示在此处 -->
        <router-view></router-view>
      </div>
    `
    })
    
    // 子组件[简写]
    const UserProfile = {
      template: '<h3>个人资料：张三</h3>'
    }
    const UserPosts = {
      template: '<h3>岗位：FE</h3>'
    }
    
    // 路由
    var router =new Router({
      routers : [
    
        { path: '/user', component: User,
         // 子路由配置：
         children: [
           {
             // 当 /user/profile 匹配成功，
             // UserProfile 会被渲染在 User 的 <router-view> 中
             path: 'profile',
             component: UserProfile
           },
           {
             // 当 /user/posts 匹配成功
             // UserPosts 会被渲染在 User 的 <router-view> 中
             path: 'posts',
             component: UserPosts
           }
         ]
        }
      ]
    })
    ```
