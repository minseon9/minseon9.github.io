---
layout      : single
title       : Shuffle an Array
summary     : 
date        : 2025-07-09 11:07:22 +0900
updated     : 2025-07-09 11:16:01 +0900
category    : Leetcode
tags        : Array Math Design Randomized
toc         : true
public      : true
parent      : 
latex       : false
resource    : 1B49406D-571D-4763-8C17-E7672D188E89
---
* TOC
{:toc}

# Shuffle an Array
주어진 정수 배열을 무작위로 섞는 알고리즘을 디자인하면 되는 문제다.  

아래의 함수들을 구현하면 된다.  
int[] reset() Resets the array to its original configuration and returns it.
int[] shuffle() Returns a random shuffling of the array.

가령
```
Input
["Solution", "shuffle", "reset", "shuffle"]
[[[1, 2, 3]], [], [], []]
Output
[null, [3, 1, 2], [1, 2, 3], [1, 3, 2]]
```

# 문제 풀이
일반적으로 랜덤으로 섞는다고 하면 random bulit in class를 활용
겹치지 않는 random이 나올 때까지 혹은 겹치는 경우 조정하는 방식  

최적의 방법? 알려진 알고리즘?
## Fisher-Yates Shuffle

1. 배열을 처음부터 끝까지 순회하면서, 현재 인덱스 i에 대해 i~n-1 사이의 랜덤 인덱스 j를 뽑음
2. i와 j의 값을 swap
3. 끝까지 반복

## Deep copy
일반적으로 Array를 다른 변수에 할당하면 reference를 참조
reference하는 값에 변경이 있으면 변수를 직접 수정하지 않더라도 참조하는 값이 변경되는 것

value를 직접 copy하는 Deep copy를 해야함


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
	    for (i in originNums.indices) {
            val randomIndex = Random.nextInt(length)
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
        for i in range(self.__origin_num_length):
            random_index = random.randint(0, self.__origin_num_length - 1)
            nums[i], nums[random_index] = nums[random_index], nums[i]

        return nums
```

## Leetcode Solution Link
[O(n) Time Complexity Fisher-Yates Shuffle Solution]()
 
