import { say } from './demo'

// Quick start
{
  const introduction = (divId: string, name: string, age: number) => {
    const el = document.querySelector('#' + divId) as HTMLElement // 类型断言
    el.innerText = say({ name, age })
  }
  
  introduction('greeting', '臧安国', 22)
}

// 类型断言
{
  interface Obj {
    name: string,
    age: number,
    car: number[],
    house: Array<number|string>, // 数组泛型: 动态声明类型
    tuple: [string, number], // tuple
  }

  type a = Pick<Obj, 'name' | "age"> // 提取类型约束
  
  const obj: Obj = {} as Obj
  const obj2: Obj = <Obj>{}
  obj.name = ''
  obj.age = 12
  obj.car = [10, 2]
  obj.house = [2, '']
  obj.tuple = ['', 2]
  
  const num: any = 2
  console.log((num as string).length)
}

// any
{
  let temp: any = 3
  temp = ''
  let tempList: any[] = ['-', true, 2, {}]

  console.log('any', tempList, temp)
}

// 类型推导
{
  const arr = [1, "name"]
  const ele = arr[3] // string | number
}

// 枚举类型
{
  enum Color {
    temp0, // 默认初始化0
    temp2 = 2,
    temp, // 自增为3
    red = '#FF3C00',
    blue = '#22D5FF'
  }
  const colorRed: Color = Color.red
  console.log('枚举类型', Color[0], Color[2])
}

// void undefined null
{
  const unusable: void = undefined // void类型的变量只能赋值null或undefined
  const u: undefined = undefined
  const n: null = null
}

// undefined和null是所有类型的子类型(开启strictNullChecks后无效)
{
  // const num2: number = null
}

// 声明
{
  // 当let声明出现在循环体里时拥有完全不同的行为。 不仅是在循环里引入了一个新的变量环境，而是针对每次迭代都会创建这样一个新作用域。
  for (let i = 0; i < 10 ; i++) {
    setTimeout(function() { console.log(i) }, 100 * i) // 0,1,2,3,4,5,6,7,8,9
  }
}

// 对象解构和声明
{
  const obj = { a: 1, b: 2}
  const { a, b }: { a: number, b: number } = obj
  console.log('对象结构和声明', a, b)
}

// 函数参数设置可选
{
  function func(name: string, age: number = 32, city?: string): string { // ?表示可选
    console.log(`I am ${name} 今年${age}岁，来自${city}`)
    return `I am ${name} 今年${age}岁，来自${city}`
  }
  func('Ironman')
}

// 解构也能用于函数声明
{
  type C = { name: string, age?: number }
  function test({ name, age }: C):void {

  }
  test({ name: '解构也能用于函数声明' })
}

// 函数参数的类型有两种方法：一种是显式声明，一种赋默认值隐式声明
{
  // 显式声明类型，参数必传
  function fn(a: string): void {
    // a = 1
  }
  fn('')
  // 隐式声明进行类型推导，参数可选
  function f({ a = '', b = 0 } = {}): void {
    // a = 1
  }
  f()
}

// 展开操作符
{
  class C {
    p = 12
    m() {
    }
  }
  let c = new C()
  let clone = { ...c }
  clone.p; // ok
  // clone.m(); // error!
  // 其次，TypeScript编译器不允许展开泛型函数上的类型参数。这个特性会在TypeScript的未来版本中考虑实现
}

// 接口(用来描述约束条件)
// 用来定义对象的类型
{
  interface LabelObj {
    readonly label: string, // 必传，只读
    text?: string, // 可选，可以修改
  }
  function printLabel2(obj: LabelObj):void {
    console.log('printLabel', obj.label)
    obj.text = '' // 修改
  }
  printLabel2({ label: '' })

  interface Config {
    color: string,
    [propName: string]: string, // 索引签名
  }
  function setConfig(config: Config): void {

  }
  setConfig({ color: '', age: '2' }) // 可以传入任意符合要求参数
}

// 函数类型
{
  interface searchFunc {
    (name: string, age: number): boolean // 函数调用签名：使用接口描述函数类型
  }

  let search: searchFunc // 声明一个函数类型的变量
  search = () => {
    return false
  }
  search('', 2)

  const search2: searchFunc = () => { // 声明 + 赋值
    return !0
  }
  search('-', 3)

  const search3: searchFunc = (name: string, age: number): boolean => {
    return !0
  }

  const search4: searchFunc = (nameCustom: string, ageCustom: number): boolean => { // 参数名称可以自定义
    return !0
  }
}

// 可索引的类型
{
  // 1.数字索引类型：可以声明数组和对象，要求索引为数字
  interface NumberIndexCollection {
    [index: number]: number
  }

  const obj: NumberIndexCollection = { 10: 1 }
  const arr: NumberIndexCollection = [99]

  // 2.字符串索引类型：只可以声明对象，索引既可以是数字也可以是字符串( obj[0] === obj['0'] )
  interface StringIndexCollection{
    [index: string]: number
  }
  const obj2: StringIndexCollection = { 10: 1, age: 10 }

  // 3.数字索引和字符串索引可以共存：数字索引的返回值必须是字符串索引返回值类型的子类型
  class Animal {
    name: string
  }
  class Dog extends Animal {
    breed: string
  }

  interface NotOkay {
    [x: number]: Dog, // Dog为Animal的子类型
    [x: string]: Animal
  }

  const test: NotOkay = { 0: new Dog(), key: new Animal() }

  // 4.设置索引签名只读
  interface ReadonlyArray{
    readonly [i: number]: string
  }
  const arr2: ReadonlyArray = ['A', 'B']
  // arr2[1] = 'C' // error
}

// 类类型
{
  // 接口描述了类的公共部分，而不是公共和私有两部分。 它不会帮你检查类是否具有某些私有成员
  interface ClockInterface {
    currentTime: Date
    // private currentTimeTemp: Date, // error
    setTime(d: Date): void
  }
  class clock implements ClockInterface {
    currentTime: Date
    private currentTimeTemp: Date
    constructor(h: number, m: number) { }
    setTime(d: Date) {
      this.currentTime = d
    }
  }
}

// 类静态部分与实例部分的区别( 有难度，需要反复阅读文档 )
{}

// 接口的继承
{
  // 声明一个接口：形状
  interface Shape {
    color: string
  }
  // 声明一个接口：圆形，继承自形状
  interface Square extends Shape {
    sideLength: number
  }
  let square: Square = { color: '', sideLength: 10 }
  let square2 = <Square>{}
  let square3 = {} as Square

  // 声明一个接口：椭圆，集成自形状和圆形
  interface Ellipse extends Shape, Square{
    center: number[]
  }
  let ellipse: Ellipse = { color: '', sideLength: 10, center: [10, 10] }
}

// 混合类型
{
  interface Counter {
    (start: number): string,
    interval: number,
    reset(): void
  }
  const getCounter = (): Counter => {
    let counter = function(start: number) {} as Counter // 强制类型断言
    counter.interval = 100
    counter.reset = function() {}
    return counter
  }

  const c = getCounter()
}

// 字面量也可以作为类型
{
  interface Con {
    log(str: '=='): number
    log(str: '--'): number
    log(str: string): number
  }

  const con: Con = {
    log: (str: string) =>{
      if (str === '==') {
        return 1
      } else if (str === '--') {
        return 2
      } else {
        return 3
      }
    }
  }
  con.log('==')
  con.log('--')
}

// 命名空间可以对枚举进行扩展
enum Color {
  red = 1,
  green = 2,
  blue = 4
}
namespace Color {
  export function mixColor(colorName: string) {
    if (colorName == "yellow") {
      return Color.red + Color.green;
    }
    else if (colorName == "white") {
      return Color.red + Color.green + Color.blue;
    }
    else if (colorName == "magenta") {
      return Color.red + Color.blue;
    }
    else if (colorName == "cyan") {
      return Color.green + Color.blue;
    }
  }
}

console.warn('===', Color.mixColor('yellow'))

// 类的继承
{
  // 基类，也叫超类
  class Animal {
    // name: string // 构造函数中使用(public name: string)语法，参数属性通过给构造函数参数前面添加一个访问限定符来声明
    readonly age: number // 只读属性只能在声明时，或者构造函数中初始化
    private createTime: Date // 私有属性，只能Animal类内部访问
    protected budget: number // 受保护的属性，只能在基类和子类内部访问

    // 构造函数声明为被保护，则无法在类外实例化，但是可以被子类继承后实例化子类
    protected constructor(public name: string, age: number = 10) {
      this.name = name
      this.age = age
      this.createTime = new Date()
      this.budget = 999
    }
    move(distance: number):void {
      console.log(`${this.name}${this.age}岁，移动了${distance}米`)
    }
  }
  // Animal的派生类，也叫子类 
  class Dog extends Animal {
    private from: string // 私有属性，只能Dog类内部访问
    // 派生类的构造函数必须包含super的调用
    constructor(name: string) {
      // this.from = '北京' // error
      super(name, 2) // 执行父类的构造方法(而且必须先调用super，然后再执行自有构造逻辑)
      this.from = '北京'
    }
    move(distance: number):void {
      console.log(`动物园财政预算${this.budget}元，${this.name}今年${this.age}岁了，来自${this.from}, 奔跑了${distance}米`)
    }
    bark() {
      console.log('汪汪')
    }
  }
  // const animal = new Animal('动物') // Animal 构造函数被声明为被保护
  const dog = new Dog('狗狗')
  dog.name = '金毛狗狗'
  // dog.age = 200 // read-only
  dog.bark()
  dog.move(20)
  dog.bark()
}

// getters & setters
{
  let passWord = 'pass'
  class Employee {
    private _userName: string

    // 只带有 get不带有 set的存取器自动被推断为 readonly
    get userName(): string {
      return this._userName + '--'
    }
    set userName(name: string) { // get不能具有返回值包括void
      if (passWord === 'pass') {
        this._userName = name
      } else {
        console.log('password error')
      }
    }
  }
  let emp = new Employee()
  console.log(emp.userName)
  emp.userName = 'zhang'
  console.log(emp.userName)
}

// 静态属性
{
  class Grid {
    static origin = { x: 0, y: 0 } // 静态属性无需实例化就已经在类上初始化了，只能通过类名访问。（其他属性都是依赖于实例，实例化之后才会初始化）
    constructor(public scale: number) {}
    caculateDistanceFromOrigin(point: { x: number, y: number }) {
      const { x, y } = point
      const xDist = x - Grid.origin.x
      const yDist = y - Grid.origin.y
      return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale
    }
  }
  const grid1 = new Grid(1)
  const grid2 = new Grid(2)
  console.log(grid1.caculateDistanceFromOrigin({ x: 3, y: 4 }), grid2.caculateDistanceFromOrigin({ x: 15, y: 20 }))
}

// 抽象类
{
  // 抽象类
  abstract class Department {
    constructor(public name: string) {}
    printName() {
      console.log(`部门名称为${this.name}`)
    }
    abstract printMeeting(): void // 必须在派生类中实现
  }
  class AccountDepartment extends Department {
    constructor() {
      super('财务部')
    }
    printMeeting(): void {
      console.log('The Accounting Department meets each Monday at 10am.')
    }
    generateReports(): void {
      console.log('Generating accounting reports...')
    }
  }
  const department = new AccountDepartment()
  department.printName()
  department.printMeeting()
  department.generateReports()
}

// 构造函数
{
  class Greeter {
    static standardGreeting = "Hello, there"
    greeting: string;
    greet() {
      if (this.greeting) {
        return "Hello, " + this.greeting
      }
      else {
        return Greeter.standardGreeting
      }
    }
  }

  let greeter1: Greeter // Greeter类的实例的类型是 Greeter
  greeter1 = new Greeter()
  console.log(greeter1.greet())

  let greeterMaker: typeof Greeter = Greeter // 声明greeterMaker的类型为Greeter类的类型
  greeterMaker.standardGreeting = "Hey there!"

  let greeter2: Greeter = new greeterMaker()
  console.log(greeter2.greet())
}

// 把类当做接口使用
{
  // 类定义会创建两个东西：类的实例类型和一个构造函数，因为可以创建类型，所以可以使用接口继承类的类型
  class Point {
    x: number
    y: number
  }
  interface Point3d extends Point {
    z: number
  }

  const point: Point3d = { x: 10, y: 10, z: 10 }
  console.log(point)
}

// 声明一个函数
{
  const add: (baseValue: number, incrementValue: number) => number = function(x: number, y: number): number {
    return x + y
  }
  const add2: (baseValue: number, incrementValue: number) => number = (x: number, y: number): number => x + y
  const add3 = (x: number, y: number): number => x + y
  const add4 = (x: number, y: number) => x + y // 函数类型、返回值类型会进行自动推导，可以省略，这样更简洁。
}

{
  function buildName(firstName: string, lastName?: string) {
    // ...
  }
  function buildName2(firstName: string, lastName = "Smith") {
    // ...
  }
  function buildName3(firstName: string, lastName = "Smith", ...restName: string[]) {
    // ...
  }
}

// 函数重载(适用于根据传递不同参数，执行不同操作，返回不同值)
{
  // 重载流程：查找重载列表，尝试使用第一个重载定义。 如果匹配的话就使用这个，所以一定要把最精确的定义放在最前面
  function getDistance(point: { x: number, y: number }): number
  function getDistance(point: number): number

  // any 并不是重载列表的一部分，重载只有上面👆两个
  function getDistance(point: any): any {
    if (typeof point === 'object') {
      const { x, y } = point
      return Math.sqrt(x * x + y * y)
    } else {
      return point
    }
  }
  console.log(getDistance({ x: 3, y: 4 }))
  console.log(getDistance(1000))
}

// 泛型
{
  // 声明一个泛型函数
  function identity<T>(arg: T): T {
    // 如果使用了泛型，那就意味着参数arg可以是任意类型
    if (typeof arg === 'string') {
      console.log(arg.length)
    }
    return arg
  }
  identity('')

  let myIdentity: <U>(arg: U) => U = identity //  <U>(arg: U) => U 为函数类型
  let myIdentity2 = identity
  let myIdentity3:{ <U>(arg: U): U } = identity // { <U>(arg: U): U } 为，使用签名的对象字面量声明函数类型

  // 泛型接口
  interface Identity {
    <H>(arg: H): H
  }
  let myIdentity4: Identity = identity
}

// 枚举值
{
  // 当所有枚举成员都拥有字面量枚举值时，枚举成员可以作为类型使用
  enum ShapeKind {
    Circle,
    Square,
  }

  interface Circle {
    kind: ShapeKind.Circle // 枚举成员作为类型使用，kind只能是 ShapeKind.Circle 的值
    radius: number
  }

  interface Square {
    kind: ShapeKind.Square
    sideLength: number
  }

  let c: Circle = {
    // kind: ShapeKind.Square, // error 不符合接口的类型约束

    kind: ShapeKind.Circle,
    radius: 100,
  }
}

{
  enum E {
    Foo,
    Bar,
    Test = 'Foo2'
  }

  // 枚举类型本身变成了每个枚举成员的联合
  // x: E 等价于 E.Foo | E.Bar
  function f(x: E) {
    // if (x !== E.Foo || x !== E.Bar) {
    //   // error 总是为true，官方提供的这段代码有点挫啊，哪怕脱离ts，正常逻辑也不应该这么写
    // }
  }

  // 在运行时，枚举是真正存在的对象
  function fn(obj: { Foo: number }) {
    return obj.Foo
  }
  fn(E)

  // 反向映射（通过值查名称）
  const value = E['Foo'] // 不可为Test？
  const name = E[value]
  console.log('FooVal', name)
}

// any
{
  // 如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 any 类型而完全不被类型检查
  // any类型的变量允许被复制任意类型，允许调用任何方法，允许返回任意类型
  let name
  name = 3
  name = ''
  if (false) {
    name.getName()
    name.cc()
    name()
  }
}

// 联合类型
{
  // 当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，我们只能访问此联合类型的所有类型里共有的属性或方法：
  // function getLength(something: string | number): number {
  //   return something.length
  // }
  function getString(something: string | number): string {
    if (typeof something === 'string') {
      console.log(something.length)
    }
    return something.toString()
  }
}

{
  // keyof，对类型进行拆解，拆解为联合类型（ 具体如何拆解？猜测：将keyof的类型限制一个变量(对象)时（万物皆对象，包括字符串和数字），该变量(对象)的key可以是什么类型。 ）
  type ty = keyof any // string | number | symbol 解释：一个类型为any的变量，作为一个对象，此时这个对象还没有确定数据类型，所以它的key可以是string，number，symbol；
  type d = keyof string // number | "toString" | "charAt" | etc.. 解释：一个类型为string的变量，由于类型已经确定，所以他的key...

  // a的类型已经确定，只能是name和age
  type ob = {
    name: string,
    age: number
  }
  type a = keyof ob // 'name' | 'age'

  // b和c的类型是动态的，是string类型
  // 冒号不严格，string兼容number
  type ob1 = {
    [x: string]: string
  }
  type b = keyof ob1 // string | number

  // in 严格，必须是string
  type ob2 = {
    [k in string]: string
  }
  type c = keyof ob2 // string
  
  type name = keyof any // string | number | symbol  // 读取除了key的类型
  type name2 = keyof (number | string) // "toString" | "toFixed" | "toExponential" | "toPrecision" | "valueOf" | "toLocaleString" // 读取除了可枚举的字面量key
  // const name: name2 = "toString"

  // type Record<K extends keyof any, T> = {
  //   [P in K]: T
  // }
  // Record<string, any>
}

// 不同于 interface 只能定义对象类型， type 声明的方式可以定义组合类型，交叉类型，原始类型
{

}

{
  type b = keyof Object

  type KVInfer<T> = {
    [K in keyof T]: T[K]
  }

  const test: KVInfer<Object> = { valueOf: () => Object }

  interface Obj {
    name: string,
    age?: number
  }
  const test2: KVInfer<Obj> = { name: '' }
}

// extends
{
  // 类的继承
  class Person {

  }
  class Man extends Person {

  }
  // 类型约束
  type a  = number | string | boolean | undefined
  type b = Exclude<a, undefined>
  type c = a extends undefined ? never : a // 使用泛型才会遍历
  type test  = number extends undefined ? true : false
  type Exclude2<T, U> = T extends U ? never : T
  type g = Exclude2<a, undefined> // 使用泛型才会遍历
}

{
  interface a {
    name: string
  }
  interface b extends a {
    age: number
  }

  const info: b = {
    name: '',
    age: 12
  }

  interface Data {
    arr: { name: string }[]
  }
  const arr: Data['arr'] = []
}
