// interface
interface Arg {
  name: string,
  age: number
}
export const say = (arg: Arg) => {
  return `我的叫${arg.name}，今年${arg.age}`
}

// class
export class Student {
  fullName: string
  constructor(public firstName: string, public middleInitial: string, public lastName: string) {
    this.fullName = firstName + '' + middleInitial + '' + lastName
  }
}
