// 定义一个动物类
function Animal (name) {
  // 属性
  this.name = name || 'Animal'
  // 实例方法
  this.sleep = function(){
    console.log(this.name + '正在睡觉！')
  }
}
// 原型方法
Animal.prototype.eat = function(food) {
  console.log(this.name + '正在吃：' + food)
}

function Cat(){}
Cat.prototype = new Animal()
Cat.prototype.name = 'cat'

// Test Code
var cat = new Cat()
console.log(cat.name) //cat
cat.eat('fish') // cat正在吃：fish
cat.sleep() // cat正在睡觉！
console.log(cat instanceof Animal) // true 
console.log(cat instanceof Cat) // true


// // 1.声明一个函数，这个函数会有一个prototype属性指向它的原型对象。且原型对象有一个constructor属性，指向这个函数。=> 循环指向，所以这个函数既是一个普通函数；也是一个构造函数。
// function FuncA() {}
// FuncA.prototype.get = function(){}
// console.log(FuncA.prototype) // get: f
// console.log(FuncA.prototype.constructor === FuncA) // true

// // 2.使用构造函数创建对象，创建出的对象会有一个__proto__属性，指向构造函数的原型对象。
// // 3.需要注意的是，对象在被创建出来后，就已经和构造函数无关了，而是与构造函数的原型对象有关。
// function FuncB() {}
// FuncB.prototype.getName = function(){ return 'funcb-name' }
// const obj = new FuncB()
// console.log(obj.__proto__ === FuncB.prototype) // true
// // 4.对象，可以使用构造函数的原型上的属性和方法
// console.log(obj.getName()) // 'funcb-name'
// // 比如一个字符串可以任意使用String.prototype下的方法
// const str = ''
// console.log(str.indexOf === String.prototype.indexOf) // true => 字符串、数字等本质还是对象，所以才可以用'.'去获取方法

// // 5.我们访问一个对象str中的方法indexOf，如果str中存在，则直接返回。如果在str上没有找到，则去str对象的__proto__属性(也就是String的原型对象)中查找。之后同理。
// console.log(str.__proto__ === String.prototype)
// String.prototype.hehe = 'lalala'
// console.log(str.hehe) // 'lalala'



