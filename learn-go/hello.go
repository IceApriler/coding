package main

import "fmt"

var window = "window"

// window := "window2" // 只能在函数体中使用。

func main() {
	fmt.Println("hello word")
	var name string = "heheda"
	var age int = 12                      // int
	var bool = false                      // bool
	var a *int                            // nil
	name, fuck := "new_heheda", "yecheng" // := 是一个声明语句，左侧必须有新的变量，否则会编译错误。而且只能在函数体中使用。
	newName, newFuck := name, fuck
	fmt.Println(name, age, bool, a, fuck, newName, newFuck)
	fmt.Println(window)
	fmt.Println(&window) // 获取变量的内存地址
}
