# Java基础准备

### 概述

- Java分为 JavaSE、 JavaEE和 JavaME。

- JDK: Java SE Development Kit（Java 标准版开发包 ）。

  - JDK = JRE + javac + jar + debugging + tools + javap。

- Java EE SDK: Java EE Software Development Kit（Java EE 软件开发包）。

  - Java EE SDK中包含了JDK。

- JRE: Java Runtime Environment（Java运行时环境 ）。

  - JRE = JVM + java + javaw + libraries + rt.jar。

  -  如果只是想运行java程序，只需要安装jre即可。

- jvm: java字节码即时编译器。

  - 用来跨平台，负责和不同平台沟通。

- Java的核心优势是跨平台。

### 开发环境

- 环境变量：

  - JAVA_HOME

    ```bash
    export JAVA_HOME="/Library/Java/JavaVirtualMachines/jdk1.8.0_121.jdk/Contents/Home"
    ```

  - CLASSPATH

    ```bash
    export CLASSPATH=".:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar"
    ```

    > JDK1.5以上不需要配置这个环境变量了，JRE会自动搜索当前路径下的类文件及相关jar文件。而且，JDK9 己经删除了dt.jar、tools.jar这两个文件。

    > 如果指定了 CLASSPATH 环境变量，一定不要忘记在 CLASSPATH 环境变量中增加点 (.)，点代表当前路径，用以强制Java解释器在当前路径下技索Java类。

  - PATH

    ```bash
    # 设置PATH环境变量
    export PATH=.:$PATH:$HOME/bin:/home/yeeku/Java/jdk-9/bin
    ```

  - Linux平台与 Windows平台不一样，多个路径之间以冒号(:)作为分隔符，而$PATH则用于引用原有的PATH变量值。

- 编译步骤

  1. 使用`javac`将源文件编译成字节码(**.class)。

     ```bash
     # javac -d destdir srcFile
     javac -d . HelloWorld.java
     ```

  2. 使用`java`解释执行与平台无关的字节码程序。

     ```bash
     # java className
     java HelloWorld
     ```

### Java基本规则

-  Java 程序必须以类(class)的形式存在。

  > Java 程序是一种纯粹的面向对象的程序设计语言，因此 Java 程序必须以类(class)的形式存在，类(class)是 Java 程序的最小程序单位。 Java 程序不允许可执行性语句、方法等成分独立存在 ，所有的程序都必须放在类定义里。

- 最简单的Java程序，只包含一个空类定义：

  ```java
  class Demo {}
  ```

- Java 解释器规定：如果希望某个类能直接被解释器解释执行，则这个类里必须包含 main 方法，而且 main 方法必须使用 `public static void` 来修饰（public 和 static 修饰符的位置可以互换），且 main 方法的形参必须是字符串数组类型，即`String[] args`。

- 对于一个大型的 Java程序而言，往往只需要一个入口，也就是只有 一个类包含 main 方法，而其他类都是用于被 main 方法直接或间接调用的。

- Java文件的命名：

  - Java源文件必须使用`.java`扩展名。

  - 如果Java源文件中定义了一个public类，则该源文件的主文件名必须与public类的类名相同。

    > 也正因如此，一个Java源文件中最多只能定义一个public类。

- Java文件的命名建议：

  - 一个Java源文件只定义一个类，不同的类使用不同的源文件定义。
  - 让Java源文件的主文件名与public类同名。

- Java程序中，严格区分大小写。

- Java 程序中的**关键字**全部是小写的，无须大写任何字母。

### 垃圾回收机器

- 垃圾回收是一种动态存储管理技术，它自动释放不再被程序引用的对象，按照特定的垃圾回收算法来实现内存资源的自动回收功能。
- 当编写 Java 程序时，一个基本原则是：对于不再需要的对象，不要引用它们。如果保持对这些对象的引用，垃圾回收机制暂时不会回收该对象，则会导致系统可用内存越来越少；当系统可用内存越来越少，垃圾回收执行的频率就越来越高，从而导致系统的性能下降。