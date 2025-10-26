---
layout      : single
title       : Reversed Integer(Med.)
summary     : 
date        : 2025-06-20 17:31:31 +0900
updated     : 2025-06-23 12:14:45 +0900
category    : Leetcode
tags        : Math
toc         : true
public      : true
parent      : 
latex       : false
resource    : 124B2721-2748-4130-AC49-C306F1884EE1
author_profile: false
classes: wide
---


# Reversed Integer
signed 32-bit integer가 주어진다. 
주어진 정수를 뒤집으면 된다.


가령
```
Input: x = -123
Output: -321
```

**단, 뒤집었을 때 signed 32-bit 범위를 넘어가면 0을 반환한다.**


# 문제 풀이
10진수 정수를 뒤집는 방법은 매우 유명하다.  
10으로 나눈 나머지로 새로운 숫자를 만들어가는 방식이다.  
pseudocode로 보는게 더 좋을 듯하다.  
```
# pseudocode
Initialize `result` to 0

While `x` is greater than 0, do:
    1. Set `remainder` to the last digit of `x` (`x % 10`)
    2. Update `x` to `x` divided by 10 (`x // 10`)
    3. Update `result` to `result * 10 + remainder`
End while
```

## 상세
### Overflow
이 문제에서 고려해야할 것은 Integer 범위를 넘어갔을 때 즉, Overflow가 발생했 을 때의 처리이다.  
signed integer는 4byte(32-bit)이고, MSB는 부호를 표현한다.  
따라서 31-bit로 수를 표현하고, 범위는 -2^31 ~ 2^31-1 이다.  
음수의 범위가 -2^31인 이유는 MSB를 제외한 모든 bit가 0인 경우 -2^31가 되기 떄문이다.  
음수 표현 방식을 이해해야하는데,  
움수는 2의 보수 방식으로 표현한다.  양수를 표현하는 bit를 반전하고 1을 더하는 방식이다.
```
ex) 8-bit에서 -128
양수로 표현하면
 10000000

# 2의 보수에 1을 더함
 10000000 ^ 11111111
 -> 01111111
 01111111 + 1
 -> 10000000 
```

사용하는 언어마다 Overflow처리가 다르다.  
- Python3는 Int, Long같은 타입이 없다. 
  정수를 처리할 때는 BigNumber처럼 임의 정밀도(arbitrary-precision)을 사용하기 때문에 메모리가 허락하는 한 큰 수를 저장할 수 있다.
  따라서 Overflow가 발생하지 않기 때문에, 계산을 한 후에 판단하도록 간단하게 작성했다.  

- 반면 Kotlin과 같이 Int은 4bytes, Long은 8bytes로 크기가 정해져 있다. 
  범위를 넘어간 Overflow시 bit는 날려버린다.  
  예를 들어 크기가 8-bit라고 했을 때,  
  ```
  # -128 - 1 -> -128 + (-1)
  -> 10000000 + 11111111
  -> 1 01111111  (9-bit)
  -> 01111111 (drop overflow-ed bits)
  ```
  따라서 Overflow가 발생하기 전 체크해주어야한다.  

사용하는 언어의 특성에 따라 Overflow 처리를 다르게 해주는 것이 필요하다.  

## Code

### Kotlin
```kotlin
import kotlin.math.abs

class Solution {
    private val MAX = Int.MAX_VALUE
    private val MIN = Int.MIN_VALUE

    fun reverse(x: Int): Int {
        val isNegative = x < 0
        var absoluteX = abs(x)

        var reversed = 0
        while (absoluteX > 0) {
            if (isOutOfRange(reversed, absoluteX, isNegative)) return 0

            reversed = reversed * 10 + absoluteX % 10
            absoluteX = absoluteX / 10
        }

        return if (isNegative) -reversed else reversed
    }

    fun isOutOfRange(reversed: Int, absoluteX: Int, isNegative: Boolean): Boolean {
        val remind = absoluteX % 10
        if (isNegative) {
            if (reversed > Int.MAX_VALUE / 10 || (reversed == Int.MAX_VALUE / 10 && remind > 8)) return true
        } else {
            if (reversed > Int.MAX_VALUE / 10 || (reversed == Int.MAX_VALUE / 10 && remind > 7)) return true
        }

        return false
    }
}
```

### Python
```python
class Solution:
    MAX = 2**31 - 1
    MIN = -2**31
    def reverse(self, x: int) -> int:
        is_negative_number = x < 0
        absolute_x = abs(x)

        reversed_x = 0
        while absolute_x > 0:
            reversed_x = reversed_x * 10 + absolute_x % 10    
            absolute_x = absolute_x // 10

            if self.is_out_of_range(reversed_x, is_negative_number):
                return 0
           
        if is_negative_number:
            reversed_x *= -1

        return reversed_x

    def is_out_of_range(self, x:int, is_negative_number: bool) -> bool:
        if is_negative_number:
            return x > abs(self.MIN)
        else:
            return x > self.MAX    
```

## Leetcode Solution Link
[O(logn) Time Complexity Solution](https://leetcode.com/problems/reverse-integer/solutions/6866270/ologn-time-complexity-solution-by-leeapp-n7x3)
