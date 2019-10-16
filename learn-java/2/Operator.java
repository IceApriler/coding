/**
 * 运算
 */
public class Operator {
  public static void main(String[] args) {
    System.out.println("------------ 数据类型");
    int intVa1 = 0b11101001;
    byte binVa2 = (byte)0b11101001;
    System.out.println(intVa1); // 11101001 => 1+8+32+64+128=233 => 默认占32位
    System.out.println(binVa2); // 11101001 => 11101000 => 10010111 => -(1+2+4+16)=-23 => 最高位的1变成了符号位
    System.out.println("------------ 赋值和运算");
    int a = 10;
    byte b = 2;
    byte c = b++; // 2
    int d = a * b; // 10 * 3
    // byte e = a * b; // Type mismatch: cannot convert from int to byte => 类型不兼容
    System.out.println(c); // 2
    System.out.println(d); // 30

    System.out.println("------------ 逻辑运算符");

    boolean and1 = false & true; // false => 逻辑与(两个值一起进行比较)
    boolean and2 = false && true; // Dead code => 短路与(从左到右进行比较)
    boolean notOr = false ^ true; // 异或 => 相异为真
    System.out.println(and1); // false
    System.out.println(and2); // false
    System.out.println(notOr); // true

    System.out.println("------------ 逻辑与或和短路与或的不同");

    // boolean and3 = 1 > 2 & 2 > (3/0); // java.lang.ArithmeticException: / by zero => 哪怕左边已经为false，依然会去执行右边
    boolean and4 = 1 > 2 && 2 > (3/0); // 左边已经false，右边被短路，不会执行
    // System.out.println(and3);
    System.out.println(and4);

    System.out.println("------------ 位运算符");

    
    byte num3 = 0b0011;
    byte num4 = 0b0100;
    System.out.println(~num3); // -4 => 按位非
    System.out.println(Integer.toBinaryString(~num3)); // 0b11111111111111111111111111111100 => 按位非
    System.out.println(Integer.valueOf(0b11111111111111111111111111111100)); // -4
    System.out.println(num4>>1); // 2 >> 按位右移 => 相当于/2取商
    System.out.println(num4<<1); // 8 << 按位左移 => 相当于*2取积
    // & 按位与
    // | 按位或
    // ^ 按位异或
  }
}