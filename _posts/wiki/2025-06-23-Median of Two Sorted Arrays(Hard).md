---
layout      : single
title       : Median of Two Sorted Arrays(Hard)
summary     : 
date        : 2025-06-18 18:45:00 +0900
updated     : 2025-06-23 12:12:09 +0900
category    : Leetcode
tags        : Array BinarySearch DivideAndConquer
toc         : true
public      : true
parent      : 
latex       : false
resource    : D602B8CC-B768-4BD4-9A39-DD3AA49AA5F9
author_profile: false
classes: wide
---

# Median of Two Sorted Arrays
두개의 정렬이 되어 있는 배열이 주어진다.
두 정렬된 배열의 특정 원소를 찾는 문제로, 이번에는 중앙값(median)을 찾으면 된다.


가령
```
Input: nums1 = [1,3], nums2 = [2]
Output: 2.00000
```

# 문제 풀이
쉬운 방법은 주어진 배열을 다시 정렬하여 중앙값을 찾는 것이다.  
하지만 문제에 time complexity `O(log(m+n))` 안에 해결하도록 조건을 달아두어서 고민이 더 필요하다.  
 
다른 방법은 이미 정렬되어 있다는 사실을 잘 활용하는 것이다.   
거기에 time complexity `O(log(m+n))`라는 조건은 Binary Search(이진 탐색)을 활용할 수 있겠다는 힌트를 줬다.    
정렬되어 있는 두 배열을 그대로 둔 채로 중앙값을 이진 탐색으로 찾는다.    
중앙값을 어떻게 찾을 수 있을까?  


## 상세
메인 아이디어는 **두 배열을 각각 "왼쪽 파티션"과 "오른쪽 파티션"으로 나누는 것이다.**  
이때, 그 기준점이 중앙값 왼쪽 파티션의 모든 값이 오른쪽 파티션의 모든 값보다 작거나 같다.   
절반씩 나눠 탐색(Binary Search)하다보면 위 조건을 만족하는 정답을 찾는다.  
이를 위해 두 배열 중 더 짧은 배열에 대해 이진 탐색을 수행한다.    

예시를 들면,
아래와 같은 입력값이 있다.  
```
nums1: [2, 4, 6]
nums2: [1, 3, 5, 7]

```

이 문제에서 우리는 전체 배열의 중앙에 해당하는 pivot을 찾아야 한다.  
전체 원소 개수를 (m + n)이라 할 때, 왼쪽 파티션의 총 원소 수는 `(m + n + 1) / 2` 가 되어야 한다.  
따라서, 이진 탐색으로 nums1에서 pivot(가칭 nums1_pivot)를 선택하면,  
nums2의 pivot은 `(m + n + 1) / 2 - nums1_pivot` 이다.

예시로 계산하면,
크기가 작은 nums1의 pivot을 중앙인 (0 + 3) / 2 인 1로 잡는다.  
nums2의 pivot은 (3 + 4) / 2 - (0 + 3) / 2 인 3이다.  
```
nums1: [2] | [4, 6]
           ^
        pivot=1
nums2: [1, 3, 5] | [7]
                 ^
               pivot=3
```
pivot을 기준으로 nums1의 왼쪽은 2, nums2의 오른쪽은 7이다. 조건을 만족한다.  
하지만 nums1의 오른쪽은 4, nums2의 왼쪽은 5로 조건을 만족하지 않는다.  

pivot을 적절하게 옮겨야한다.  
이때 nums1에 대해 오른쪽에 대해 탐색하는 것이 맞다. 다시 말하면, nums1의 오른쪽이 더 크기 때문에 pivot이 오른쪽으로 이동하는 것이 적절하다.
nums1에 대해 오른쪽 절반만 다시 탐색하면 되니 binary search가 된다.  

```
nums1: [2, 4] | [6]
              ^
           pivot=2
nums2: [1, 3] | [5, 7]
              ^
           pivot=2

```
nums1에 대해 이전 스텝의 pivot 오른쪽만 탐색하면 된다. 새로 설정한 pivot은 (1+3)/2 인 2이다.
nums2도 이에 맞게 (3 + 4) / 2 - (1 + 3) / 2 인 2이다.
이제 조건을 만족하므로 중앙값을 계산할 수 있다.

각각의 왼쪽, 오른쪽 파티션을 나눠보면 이렇다.
```
왼쪽 파티션: 1, 2, 3, 4
오른쪽 파티션: 5, 6, 7
```
위에서 이야기한 max(left) <= min(right)라는 조건을 만족한다.  

구현 시에 고려해야할 것은 아무래도 각 배열에 끝지점에 대한 처리이다.  
pivot이 배열의 왼쪽 끝 혹은 오른쪽 끝에 다다른 경우로, 해당 배열의 모든 요소가 다른 배열의 오른쪽 혹은 왼쪽에 포함됨을 의미한다.
Infinity를 사용하거나, 해당 타입이 표현할 수 있는 최대, 최소값을 사용해 로직을 간소화했다.  



## Code
### Kotlin
```kotlin
import java.lang.Exception

class Solution {
    fun findMedianSortedArrays(nums1: IntArray, nums2: IntArray): Double {
        var firstNums = nums1
        var secondNums = nums2
        if (nums1.size > nums2.size) {
            firstNums = nums2
            secondNums = nums1
        }

        val firstNumSize = firstNums.size
        val secondNumSize = secondNums.size

        var left = 0
        var right = firstNumSize

        while (left <= right) {
            val firstNumPivot = (left + right) / 2
            val secondNumPivot = (firstNumSize + secondNumSize + 1) / 2 - firstNumPivot

            val firstNumLeftMax = if (firstNumPivot > 0) firstNums[firstNumPivot - 1] else Int.MIN_VALUE
            val firstNumRightMin = if (firstNumPivot < firstNumSize) firstNums[firstNumPivot]  else Int.MAX_VALUE

            val secondNumLeftMax = if (secondNumPivot > 0) secondNums[secondNumPivot - 1]  else  Int.MIN_VALUE
            val secondNumRightMin = if (secondNumPivot < secondNumSize) secondNums[secondNumPivot]  else Int.MAX_VALUE

            if (firstNumLeftMax <= secondNumRightMin && firstNumRightMin >= secondNumLeftMax) {
                val isEven = (firstNumSize + secondNumSize) % 2 == 0
                if (isEven) {
                    return (maxOf(firstNumLeftMax, secondNumLeftMax) + minOf(firstNumRightMin, secondNumRightMin)).toDouble() / 2
                } else {
                    return maxOf(firstNumLeftMax, secondNumLeftMax).toDouble()
                }
            }

            if (firstNumLeftMax > secondNumRightMin) {
                right = firstNumPivot - 1
            } else {
                left = firstNumPivot + 1
            }
        }

        throw Exception()
    }
}
```

### Python
```python
class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        if len(nums1) > len(nums2):
            nums1, nums2 = nums2, nums1

        n, m = len(nums1), len(nums2)
        left, right = 0, n

        while left <= right:
            nums1_pivot = (left + right) // 2
            nums2_pivot = (m + n + 1) // 2 - nums1_pivot

            nums1_left_partition_max = (
                nums1[nums1_pivot - 1] if nums1_pivot > 0 else float("-inf")
            )
            nums1_right_partition_min = (
                nums1[nums1_pivot] if nums1_pivot < n else float("inf")
            )

            nums2_left_partition_max = (
                nums2[nums2_pivot - 1] if nums2_pivot > 0 else float("-inf")
            )
            nums2_right_partition_min = (
                nums2[nums2_pivot] if nums2_pivot < m else float("inf")
            )

            if (
                nums1_left_partition_max <= nums2_right_partition_min
                and nums1_right_partition_min >= nums2_left_partition_max
            ):
                break

            if nums1_left_partition_max > nums2_right_partition_min:
                right = nums1_pivot - 1
            else:
                left = nums1_pivot + 1


        is_even = (n + m) % 2 == 0
        if is_even:
            return (
                max(nums1_left_partition_max, nums2_left_partition_max)
                + min(nums1_right_partition_min, nums2_right_partition_min)
            ) / 2
        else:
            return max(nums1_left_partition_max, nums2_left_partition_max)
```

## Leetcode Solution Link
[O(log(min(n, m))) Time Complexity Solution](https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/6857931/ologminn-m-time-complexity-solution-by-l-eo32)
