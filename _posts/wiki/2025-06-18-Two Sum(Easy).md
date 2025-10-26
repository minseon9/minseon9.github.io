---
layout      : single
title       : Two Sum(Easy)
summary     : Leetcode - Two Sum (Array, HashTable)
date        : 2025-06-15 17:32:25 +0900
updated     : 2025-06-18 21:56:10 +0900
category    : Algorithm
tags        : ["Problem Solving"]
toc         : true
public      : true
parent      : 
latex       : false
resource    : 16DD8F24-B9C9-4502-86DF-26055480B4AF
author_profile: false
classes: wide
---

# Two Sum
문제는 단순하다. 
integet 배열(nums)이 주어지고, integer의 목표값(target)이 주어진다.
배열에서 합이 target이 되는 두 element의 index를 반환하면 된다.

가령
```
Input: nums = [3,2,4], target = 6
Output: [1,2]
```


## 문제 풀이

문제는 a+b=x인 a,b를 찾는 것이다.

2가지 관점에서 생각해볼 수 있는데,
하나는 문제를 바꾸는 것. a와 b를 찾는 것이 아니라, x-b를 찾는 것으로 문제를 바꿀 수 있다.
다른 하나는 이미 search한 값은 알고 있다는 점이다.

### 상세  
이미 search한 값을 잘 들고 있어야한다. 검색 비용이 O(1)인 HashMap을 사용한다.
key값이 중복되는 상황을 고려하지 않아도 되니, 해당 숫자를 key로 한다.
원하는 결과인 해당 숫자의 위치 index를 value로 둔다.  

iterate하면서 HashMap에 원하는 값인 target - num 값이 있는 지 확인한다.
있다면, 해당 value와 현재 위치를 반환한다.
없다면, HashMap의 현재 값을 key, 위치를 value로 넣어준다.


## Code

### Kotlin
```kotlin
class Solution {
    fun twoSum(nums: IntArray, target: Int): IntArray {
        val numByIndex = mutableMapOf<Int, Int>()
        for ((i, num) in nums.withIndex()) {
            val desiredNum = target - num
            if (numByIndex.containsKey(desiredNum)) {
                return intArrayOf(numByIndex[desiredNum]!!, i)
            }
            numByIndex[num] = i
        }
        return intArrayOf()
    }
}  
```

### Python
```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        num_by_index: dict[int, int] = {}

        for i, num in enumerate(nums):
            desired_num = target - num
            if num_by_index.get(desired_num) is not None:
                return [num_by_index[desired_num], i]

            num_by_index[num] = i

        return []
```

## Leetcode Solution Link
[O(n) Time Complexity HashMap Solution](https://leetcode.com/problems/two-sum/solutions/6845845/o1-time-complexity-hashmap-solution-by-l-j1g9)

