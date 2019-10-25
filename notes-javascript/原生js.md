# javascript

### 基础

- 判断类型：使用原型判断

  ```js
  Object.prototype.toString.call({}) // "[object Object]"
  Object.prototype.toString.call('') // "[object String]"
  Object.prototype.toString.call([]) // "[object Array]"
  ```
  
- 判断类型：使用constructor判断

  ```js
  [].constructor === Array // true
  ''.constructor === String // true
  (12).constructor === Number // true
  ({}).constructor === Object // true
  true.constructor === Boolean // true
  ```

### 箭头函数

- 箭头函数不可以当作构造函数使用，也就是不能用new命令实例化一个对象，否则会抛出一个错误 箭头函数的**this是和定义时有关**和调用无关 调用就是函数调用模式。

  ```js
  var hehe = () => { console.log(this) }
  
  var obj = {}
  obj.hehe = hehe
  obj.hehe() // window
  ```

### call、apply、bind

- call和apply可以调用函数，改变this，实现继承和借用别的对象的方法。

- 两个函数实现继承：

  ```js
  function Animal(name){   
    this.name = name;   
    this.showName = function(){   
      console.log(this.name);   
    }   
  }   
  function Cat(name){  
    Animal.call(this, name);  
  }    
  var cat = new Cat("Black Cat");   
  cat.showName(); //Black Cat
  ```

- 为类数组(arguments和nodeList)，执行数组方法push，pop

  ```js
  (function(){
    Array.prototype.push.call(arguments,'王五');
    console.log(arguments);//['张三','李四','王五']
  })('张三','李四')
  ```

- 手动实现call

  ```js
  Function.prototype.newCall = function(ctx, ...params) {
    if (!ctx instanceof Object) ctx = {}
    ctx.fn = this
    ctx.fn(...params)
    delete ctx.fn
  }
  let person = {
    name: 'Abiel'
  }
  function sayHi(age,sex) {
    console.log(this.name, age, sex)
  }
  sayHi.newCall (person, 25, '男') // Abiel 25 男
  ```




### 原型链

- https://blog.csdn.net/u012468376/article/details/53121081/

- 判断一个对象的原型链上是否存在某个原型。

- 原型和ES6的Class非常相似，Class相当于prototype，construction就相当于构造函数。

  ```js
  class A {}
  const a = new A()
  console.log(a instanceof A) // true
  class B extends A {}
  const b = new B()
  console.log(b instanceof A) // true
  
  console.log(b instanceof Object) // true
  ```

- in 操作符

  - in操作符用来判断一个属性是否存在于这个对象中。但是在查找这个属性时候，现在对象本身中找，如果对象找不到再去原型中找。换句话说，只要对象和原型中有一个地方存在这个属性，就返回true。

    ```js
    function Person () {}
    Person.prototype.name = "志玲"
    var p1 = new Person()
    p1.sex = "女"
    alert("sex" in p1)		// 对象本身添加的，所以true
    alert("name" in p1)	// 原型中存在，所以true
    alert("age" in p1) 	// 对象和原型中都不存在，所以false
    ```

- hasOwnProperty 方法

  - 用来判断某个属性是否是存在于某个对象本身。不会沿原型链查找。

- new Object() 创建对象

  ```js
  var per = new Object()
  per.name = 'ahal'
  per.age = 12
  per.say = function() {}
  ```

- 字面量创建对象

  ```js
  var per = {
    name: 'kdls',
    age: 12,
    say: function() {}
  }
  ```

- 工厂模式创建对象

  ```js
  function createPerson(name){
   var o = new Object()
   o.name = name
   return o
  }
  var person1 = createPerson('张三')
  ```

- 构造函数模式创建对象

  - 在构造函数中，将函数和方法都挂载到`this`实例上。——对属性独立合适，对方法共享不合适。

  ```js
  function Person(name){
   this.name = name
  }
  var person1 = new Person('张三')
  ```

- 原型模式创建对象

  - 将属性和方法全部放到prototype上。——对方法共享合适，对属性独立不合适。

- 组合模式创建对象

  - 原型模式适合封装方法，构造函数模式适合封装属性，综合两种模式的优点就有了组合模式。

  ```js
  // 在构造方法内部封装属性
  function Person(name, age) {
    this.name = name
    this.age = age
  }
  // 在原型对象内封装方法
  Person.prototype.eat = function (food) {
    alert(this.name + "爱吃" + food)
  }
  Person.prototype.play = function (playName) {
    alert(this.name + "爱玩" + playName)
  }
  
  var p1 = new Person("李四", 20)
  var p2 = new Person("张三", 30)
  p1.eat("苹果")
  p2.eat("香蕉")
  p1.play("志玲")
  p2.play("凤姐")
  ```

- 动态原型模式

  - 把构造方法和原型分开写，总让人感觉不舒服，应该想办法把构造方法和原型封装在一起，所以就有了动态原型模式。

  ```js
  // 构造方法内部封装属性
  function Person(name, age) {
    // 每个对象都添加自己的属性
    this.name = name
    this.age = age
    /*
      判断this.eat这个属性是不是function，如果不是function则证明是第一次创建对象，
      则把这个funcion添加到原型中。
      如果是function，则代表原型中已经有了这个方法，则不需要再添加。
      perfect！完美解决了性能和代码的封装问题。
    */
    if (typeof this.eat !== "function"){
      Person.prototype.eat = function () {
        alert(this.name + " 在吃")
      }
    }
  }
  var p1 = new Person("志玲", 40)
  p1.eat()
  ```

  

- 为什么大多数工具库都是暴露出一个构造函数，然后需要自己去实例化呢？直接提供一个对象、下面挂载方法不好吗？

  - 因为实例化后，实例和实例之间属性是独立的，方法根据需求也可以是独立或者共享的。
  - 如果一个库只有方法，那么可以直接给你暴露出一个对象。但是如果有状态，那么就会有问题了，因为状态一般都不是共享的都是独立存在的。
  - 所以这也就是class存在的意义——用来批量构造相互独立的对象。


### defineProperty和proxy

- 对比

  - defineProterty是es5的标准,proxy是es6的标准；
  - proxy可以监听到数组索引赋值,改变数组长度的变化；
  - proxy是监听对象,不用深层遍历,defineProterty是监听属性；
  - 利用defineProterty实现双向数据绑定(vue2.x采用的核心) ；
  - 利用proxy实现双向数据绑定(vue3.x会采用)

- defineProperty存在的问题

  - defineProperty是监听属性，不能深层监听对象。所以当监听的属性为一个数组时，不能监听数组索引赋值和改变长度的变化的方法。
  - 必须深层遍历嵌套的对象，因为defineProterty只能劫持对象的属性，因此我们需要对每个对象的每个属性进行遍历，如果属性值也是对象那么需要深度遍历，显然能劫持一个完整的对象是更好的选择。

  ```js
  let a={};
  bValue=1;
  Object.defineProperty(a,"b",{
      set:function(value){
          bValue=value;
          console.log("setted");
      },
      get:function(){
          return bValue;
      }
  });
  a.b;//1
  a.b=[];//setted
  a.b=[1,2,3];//setted
  a.b[1]=10;//无输出
  a.b.push(4);//无输出
  a.b.length=5;//无输出
  a.b;//[1,10,3,4,undefined];
  
  结论:defineProperty无法检测数组索引赋值,改变数组长度的变化;
      但是通过数组方法来操作可以检测到
  ```

- proxy

  - 监听整个对象。

### 数组

- 数组扁平化

  - 方法1：使用ES10的flat

    ```js
    [1,[2,3]].flat(2) //[1,2,3]
    [1,[2,3,[4,5]].flat(3) //[1,2,3,4,5]
    [1,[2,3,[4,5]]].toString()  //'1,2,3,4,5'
    [1[2,3,[4,5[...]].flat(Infinity) //[1,2,3,4...n]
    ```

  - 方法2：使用递归+concat

    ```js
    function flatten(arr) {
        while(arr.some(item=>Array.isArray(item))) {
            arr = [].concat(...arr);
        }
        return arr;
    }
    flatten([1,[2,3]]) //[1,2,3]
    flatten([1,[2,3,[4,5]]) //[1,2,3,4,5]
    ```

- 数组去重

  - 方法1：使用ES6的new Set()和Array.from、扩展符

    > Array.from是将类数组转化为数组
    >
    > Set是ES6新出来的一种一种定义不重复数组的数据类型

    ```js
    Array.from(new Set([1,2,3,3,4,4])) //[1,2,3,4]
    [...new Set([1,2,3,3,4,4])] //[1,2,3,4]
    ```

### 算法

- 斐波那契序列

  ```js
  function fbnc(n) {
    let pre2 = 0
    let pre1 = 0
    let current = 0
    for (let i = 1; i <= n; i++) {
      if (i === 1 || i === 2) {
        pre2 = 0
        pre1 = 1
      } else {
        pre2 = pre1
        pre1 = current
      }
      current = pre2 + pre1
    }
    return current
  }
  fbnc(4)
  
  // 1, 1, 2, 3, 5, 8, 13, 21
  function fbncSum(n) {
    let sum = 0
    let pre2 = 0
    let pre1 = 0
    let current = 0
    for (let i = 1; i <= n; i++) {
      if (i === 1 || i === 2) {
        pre2 = 0
        pre1 = 1
      } else {
        pre2 = pre1
        pre1 = current
      }
      current = pre2 + pre1
      sum += current
    }
    return sum
  }
  fbncSum(4)
  
  // 性能极差，mmp
  let count = 0
  function fibonacci(num) { 
    if (num === 1 || num === 2) { 
      return 1
    }
    count ++ // 计算复杂度
    return fibonacci(num - 1) + fibonacci(num - 2)
  }
  
  ```

- 排序算法

- sort

  ```js
  var numbers = [4, 2, 9, 1, 7, 4]
  // 记忆秘诀：
  // 1. 如果返回值小于零，那么交换位置
  // 2. 按从左到右算：[pre, cur] => 函数第一项为当前值，第二项为上一个值
  numbers.sort(function (cur, pre) {
  	// 判断升序还是降序的思路：
    // 假设结构为：[1, 7] 由于pre - cur = 1 - 7 < 0
    // 则交换位置：[1, 7] => [7, 1] => 为降序
    return pre - cur
  })
  // [9, 7, 4, 4, 2, 1]
  
  numbers.sort(function (cur, pre) {
  	// 判断升序还是降序的思路：
    // 假设结构为：[1, 7] 由于cur - pre = 7 - 1 > 0
    // 则无需交换位置：[1, 7] => [1, 7] => 为升序
    return cur - pre
  })
  ```

  

