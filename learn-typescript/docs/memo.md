### 备忘录

1. `xx was also declared here.`

  ```
  无法重新声明块范围变量“gulp”。ts(2451)
  gulpfile.ts(1, 7): 'gulp' was also declared here.
  ```

  解决方法：既然与全局的变量出现重名，那我们将脚本封装到模块（module）内。module 有自己的作用域，自然不会与全局作用域的变量产生冲突。

  ```ts
  export {}
  ```

2. 使用import提示`找不到模块“gulp-typescript”`

   ```
  找不到模块“gulp-typescript”。ts(2307)
  ```

  解决方法：编译选项中增加`"moduleResolution": "node"`