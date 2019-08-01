{
  let A = { name: 'a' }
  let B = { age: 18 }
  let C = { city: 'beijing' }
  C.__proto__ = B
  B.__proto__ = A
  console.log('原型链：', C.name, C.age, C.city) // js继承的本质：__proto__直接确定了继承关系
  console.log(C.__proto__ === B, B.__proto__ === A) // C的原型对象为B，B的原型对象为A

  // 声明构造函数
  const Person = function(name, age) {
    this.name = name
    this.age = age
  }
  // 构造函数的原型上添加getName方法
  Person.prototype.getName = function() {
    return `${this.name} 今年${this.age}岁`
  }
  const zf = new Person('张飞', 30)
  // new 关键字：创建一个对象；执行构造函数将对象进行初始化；zf.__proto__ = Person.prototype 使用构造函数的prototype为实例对象添加__proto__；
  // 注意：只有函数才会有prototype属性。

  zf.getName()
  console.log('实例对象：', zf)
  console.log('构造函数：', Person)
  console.log('实例的原型对象，指向其构造函数的原型：', zf.__proto__ === Person.prototype) // 实例的原型对象为构造函数的prototype属性

  // 总结：
  // __proto__是真正用来查找原型链去获取方法的对象。
  // prototype是在用new创建对象时用来构建__proto__的对象。
}