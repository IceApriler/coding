import { say } from './demo'

const introduction = (divId: string, name: string, age: number) => {
  const el = document.querySelector('#' + divId) as HTMLElement
  el.innerText = say({ name, age })
}

introduction('greeting', '臧安国', 22)

interface Obj {
  name: string,
  age: number,
  car: number[],
  house: Array<number|string>, // 数组泛型
  tuple: [string, number], // tuple
}

const obj = {} as Obj
obj.name = ''
obj.age = 12
obj.car = [10, 2]
obj.house = [2, '']
obj.tuple = ['', 2]