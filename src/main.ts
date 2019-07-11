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
  function printLabel(obj:{ label: string }) {
    console.log('printLabel', obj.label)
  }
  // printLabel({label: '', size: ''})

  interface LabelObj {
    label: string
  }
  function printLabel2(obj:LabelObj) {
    console.log('printLabel', obj.label)
  }
  printLabel2({ label: '' })
}