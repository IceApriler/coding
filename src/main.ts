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

// 对象结构和声明
{
  const obj = { a: 1, b: 2}
  const { a, b }: { a: number, b: number } = obj
  console.log('对象结构和声明', a, b)
}

// 函数参数设置可选
{
  function func(name: string, age: number = 32) {
    console.log(`I am ${name} 今年${age}岁`)
  }
  func('Ironman')
}