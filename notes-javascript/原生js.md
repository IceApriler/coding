# javascript

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

- 判断字符类型

  ```js
  Object.prototype.toString.call({}) // "[object Object]"
  Object.prototype.toString.call('') // "[object String]"
  Object.prototype.toString.call([]) // "[object Array]"
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

- 