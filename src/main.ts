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

// 接口
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
     
      return 1
    }
  }
  con.log('==')
  con.log('--')
}

function isDoubleEqual(str: string) : str is "==" {
  return str === "=="
}

function isDoubleSlash(str: string) : str is "--" {
  return str === "--"
}
