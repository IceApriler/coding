class Person {
  public name: string
  constructor() {
    this.name = 'hehe'
  }
  getName() {
    return this.name
  }
}

class Asia extends Person {
  constructor() {
    super()
  }
}

const as = new Asia()
console.log(as.getName)