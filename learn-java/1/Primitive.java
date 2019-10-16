import java.math.*;

/**
 * 基本类型：整数类型 & 浮点类型 & 字符类型
 */
public class Primitive {
  public static void main(String[] args) {
    System.out.println("---------- 整数类型");

    byte by = 29;
    short shor = 9999;
    int in = 10000;
    long lo = 999_9999_9988L; // 可以使用下划线
    System.out.println(by);
    System.out.println(shor);
    System.out.println(in);
    System.out.println(lo);

    System.out.println("---------- 浮点类型");

    float fl = 3.14F;
    float fl2 = 0.0f;
    double dou = 3.14;
    double dou1 = 3.14F;
    double dou2 = 315E-2;
    
    System.out.println(fl);
    System.out.println(fl2 / fl2); // NaN
    System.out.println(Double.NEGATIVE_INFINITY == Float.NEGATIVE_INFINITY); // -Infinity == -Infinity
    System.out.println(Double.POSITIVE_INFINITY); // Infinity
    
    System.out.println(3 / fl2 == -4 / fl2); // Infinity !== -Infinity
    System.out.println(dou);
    System.out.println(dou2);
    System.out.println(fl == dou); // false => 浮点类型有精度问题
    System.out.println(fl == dou1); // true

    float f1 = 31415926123F;
    float f2 = f1 + 1;
    System.out.println(f1 == f2); // true => 浮点类型不精确，不要直接比较(float只能精确表示7位)
    
    // 可以使用BigInteger(实现了任意精度的整数运算)和BigDecimal(实现了任意精度的浮点运算)进行比较
    BigDecimal bd = BigDecimal.valueOf(1.0);
    bd = bd.subtract(BigDecimal.valueOf(0.1));
    bd = bd.subtract(BigDecimal.valueOf(0.1));
    bd = bd.subtract(BigDecimal.valueOf(0.1));
    bd = bd.subtract(BigDecimal.valueOf(0.1));
    bd = bd.subtract(BigDecimal.valueOf(0.1));
    System.out.println(bd); // 0.5 => 精确
    System.out.println(1.0 - 0.1 - 0.1 - 0.1 - 0.1 - 0.1); // 0.5000000000000001 => 有误差

    BigDecimal bd2 = BigDecimal.valueOf(0.1);
    BigDecimal bd3 = BigDecimal.valueOf(1.0/10.0);
    System.out.println(bd2.equals(bd3)); // true

    System.out.println("---------- 字符类型");

    char cha = 'a';
    // char chat = 'ab'; // Invalid character constant => char只能存放一个字符，想存放多个字符需要用String类型
    char cha1 = '\u0022';
    char cha2 = '\u0021' + '\u0001'; // " => char本质也是整形，可以进行运算
    char cha3 = '\u6789';
    char cha4 = '\u6789' + '\u0001';
    char cha5 = 100;

    System.out.println(cha); // a
    System.out.println(cha1); // "
    System.out.println(cha2); // "
    System.out.println(cha3); // 枉
    System.out.println(cha4); // 枊
    System.out.println(cha5); // d
    System.out.println("" + 'a' + '\t' + 'b'); // a       b
    System.out.println('a' * 2); // 194

    String str = "你好";
    System.out.println(str); // 你好 => String就是字符序列(字符数组)

    System.out.println("---------- 布尔值类型");

    boolean boo1 = false;
    String str2 = true + "";
    System.out.println(boo1); // false 
    System.out.println(str2); // true => 字符串
  }
}