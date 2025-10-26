---
layout      : single
title       : Shuffle an Array
summary     : 
date        : 2025-07-09 11:07:22 +0900
updated     : 2025-07-09 12:18:03 +0900
category    : Leetcode
tags        : Array Math Design Randomized
toc         : true
public      : true
parent      : 
latex       : false
resource    : 1B49406D-571D-4763-8C17-E7672D188E89
author_profile: false
classes: wide
---

# Shuffle an Array
주어진 정수 배열을 무작위로 섞는 알고리즘을 디자인하면 되는 문제다.  
**모든 순열이 공평하게 생성되어야 한다.**

아래의 함수들을 구현하면 된다.  
int[] reset() 처음 주어진 정수 배열을 반환한다.
int[] shuffle() 정수 배열을 무작위로 섞어 반환한다. 

가령
```
Input
["Solution", "shuffle", "reset", "shuffle"]
[[[1, 2, 3]], [], [], []]
Output
[null, [3, 1, 2], [1, 2, 3], [1, 3, 2]]
```

# 문제 풀이
무작위로 섞는다고 하면, random한 index를 계속 뽑다가 이미 사용된 index인지 확인 후 재시도하거나(Brute-force)
겹치는 경우, 단순히 그 다음 index를 사용하는 정도의 방식이 떠오른다.  
하지만, 두 방법 모두 최악의 경우를 생각하면 좋은 해결법은 아니다.

혹은, 서로 겹치지 않게 1:1로 할당하는 perfect hash를 만들어내면 된다 !  
하지만 나는 그런 perfect hash를 알고 있지도, 고안해낼 만큼 비상하지도 않다.  

다행히 **공평하게 무작위 순열**을 만들어내는 유명한 알고리즘이 있다.  

## Fisher-Yates Shuffle
핵심 아이디어는 마지막 index부터 시작해, 랜덤한 index와 자리를 바꿔주는 것이다. 
```
1. 배열의 마지막 원소부터 첫 번째 원소까지 역순으로 반복
2. 각 단계에서, 현재 인덱스(예: i)보다 작거나 같은 임의의 인덱스(j)를 무작위로 선택
3. arr[i]와 arr[j]의 값을 서로 교환(swap)
```
무작위로 섞인 element가 뒤로 가면서 이미 섞인 element들은 제외하고 무작위로 섞을 수 있다.  


## Deep copy
Kotlin이나 Python에서 배열을 변수에 그대로 할당하면, reference를 공유하게 된다.  
즉, 단순히 변수를 할당해서 shuffle을 하면 reference를 공유하는 원래의 배열 또한 바뀐 값을 참조한다.
따라서 reset을 수행하기 위해서는 value를 직접 copy해 기억하고 있어야한다.


## Code

### Kotlin
```kotlin
import kotlin.random.Random

class Solution(nums: IntArray) {
    private val originNums: IntArray = nums.copyOf()
    private val length: Int = originNums.size

    fun reset(): IntArray {
	    return originNums
    }

    fun shuffle(): IntArray {
	    val nums = originNums.copyOf()
	    for (i in length - 1 downTo 0) {
            val randomIndex = Random.nextInt(i+1)
            val temp = nums[i]
            nums[i] = nums[randomIndex]
            nums[randomIndex]  = temp
        }

        return nums
    }
}
```

### Python
```python
class Solution:
    __origin_nums: list[int]
    __origin_num_length: int

    def __init__(self, nums: List[int]):
        self.__origin_nums = nums[:]
        self.__origin_num_length = len(self.__origin_nums)
        

    def reset(self) -> list[int]:
        return self.__origin_nums
        

    def shuffle(self) -> list[int]:
        nums = self.__origin_nums[:]
        for i in range(self.__origin_num_length - 1, 0, -1):
            random_index = random.randint(0, i)
            nums[i], nums[random_index] = nums[random_index], nums[i]

        return nums
```

## Leetcode Solution Link
[O(n) Time Complexity Fisher-Yates Shuffle Solution](https://leetcode.com/problems/shuffle-an-array/solutions/6937237/on-time-complexity-fisher-yates-shuffle-qk3rp)
 
