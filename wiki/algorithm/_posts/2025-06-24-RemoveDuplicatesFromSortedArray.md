---
layout      : single
title       : Remove Duplicates From Sorted Array(Easy)
summary     : 
date        : 2025-06-24 18:23:39 +0900
updated     : 2025-06-24 18:50:43 +0900
tags        : ["Problem Solving"]
toc         : true
public      : true
parent      : 
latex       : false
resource    : D48A71EA-57B7-41A4-8B8B-1F0B12B2BCE6
author_profile: false
classes: wide
---


# Remove Duplicates From Sorted Array
주어진 정수 배열에서 중복된 인자를 제거하는 문제다.
주어진 배열을 수정해야하며, 중복되지 않은 인자의 갯수를 반환하면 된다.


가령
```
Input: nums = [1,1,2]
Output: 2, nums = [1,2,_]
```
중복되지 않은 n개의 인자 뒤는 아무 값으로 채워져있어도 무관하다.
단, `in-place` 문제로 추가 메모리를 사용하면 안된다.


# 문제 풀이
정렬되어 있음을 잘 이용하면 `in-place`로 해결할 수 있다.
정렬되어 있다는 것은, 중복된 인자들이 인접해있다는 뜻이다.
즉, 바로 옆에 있는 인자끼리만 비교하면 된다.


## 상세
정렬되어 있으니 첫번째 인자는 탐색하지 않아도 된다.
두번째 인자부터 탐색하며, 인접한 인자와 비교해 중복되지 않은 경우, 적절한 위치에 넣어준다.
여기서 탐색하는 위치와 중복되지 않은 인자를 넣어주는 위치가 다르며 이를 각각 조절해야한다.
이 두 위치(pointer)를 활용하는 방법이 `Two Pointers`이다.

## Two Pointers
탐색하는 위치 포인터(`index`)는 순차적으로 증가한다.
중복되지 않은 인자를 넣을 위치 포인터(`unique index`)는 조건에 부합하는 경우 증가한다.

`index`는 먼저 증가하고, `unique index`는 조건에 따라 느리게 증가하는 이런 패턴을 `Fast & Slow 패턴`이라고 한다.


## Code

{% capture Kotlin %}
class Solution {
    fun removeDuplicates(nums: IntArray): Int {
    	var uniqueNumCount = 1

        for (index in 1 until nums.size) {
            if (nums[index - 1] != nums[index]) {
                nums[uniqueNumCount] = nums[index]
                uniqueNumCount++
            }
        }

	return uniqueNumCount
        
    }
}
{% endcapture %}

{% capture Python %}
class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        unique_num_count = 1

        for index in range(1, len(nums)):
            if nums[index-1] != nums[index]:
                nums[unique_num_count] = nums[index]
                unique_num_count += 1

        return unique_num_count
{% endcapture %}

{% include code-table.html 
   tabs="kotlin,python"
   kotlin=Kotlin
   python=Python
%}

## Leetcode Solution Link
[O(n) Time Complexity Two Pointers Solution](https://leetcode.com/problems/remove-duplicates-from-sorted-array/solutions/6879936/on-time-complexity-two-pointers-solution-artl)
