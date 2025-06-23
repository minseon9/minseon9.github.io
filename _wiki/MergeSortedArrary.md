---
layout      : single
title       : Merge Sorted Array(Eazy)
summary     : 
date        : 2025-06-23 10:34:34 +0900
updated     : 2025-06-23 12:06:41 +0900
category    : Leetcode
tags        : Array Sorting TwoPointers
toc         : true
public      : true
parent      : 
latex       : false
resource    : 1CD5D268-E156-4BBD-9B75-4A624C7D6967
---
* TOC
{:toc}

# Merge Sorted Array
주어진 두 정수 배열(`nums1`, `nums2`)을 정렬된 하나의 배열로 합치는 문제다.  
각 배열에 대해 m, n이 주어지는데 이는 정렬해야할 배열의 크기이다.  

특이한 점은 새로운 배열로 합지는 것이 아니라 nums1에 합쳐야한다는 것이다.
nums1는 m개의 element를 가지고 있고, 뒤에 n만큼이 0으로 채워져 있어서 두 배열을 합쳤을 때의 크기만큼 공간이 확보되어 있다.  


가령
```
Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
Output: [1,2,2,3,5,6]

Input: nums1 = [0], m = 0, nums2 = [1], n = 1
Output: [1]
```

# 문제 풀이
정렬을 하는데 2가지 정도의 방법이 떠올랐다.  
하나는 단순히 iterate를 돌며 합치는 O(m+n) 방식.  

다른 하나는 이진 탐색으로 `nums2`의 element를 `nums1`의 적절한 위치에 삽입하는 방식
경우에 따라 두번째 방식이 유리할 수 있겠으나, nums1에 합쳐야한다는 점과 주어진 범위을 고려하면 첫번째 방법이 더 유리하다.  

## 상세  
이미 정렬되어 있다는 사실을 이용하면 간단하게 풀 수 있다. 
일반적으로 배열의 순서대로 정렬하는 접근을 사용한다.  
이 문제는 parameter로 넘어온 nums1를 수정해야하기 때문에 nums1을 copy한 리스트를 추가로 사용해야한다.  

대신 크기가 큰 순서대로 **뒤에서부터 정렬하면** 그럴 필요없이 nums1을 그대로 사용할 수 있다.  

## Code
### Kotlin
```kotlin
class Solution {
	fun merge(nums1: IntArray, m: Int, nums2: IntArray, n: Int): Unit {
		var nums1Index = m - 1
		var nums2Index = n - 1
		var totalIndex = m + n - 1

		while (nums1Index >= 0 && nums2Index >= 0) {
			if (nums1[nums1Index] >= nums2[nums2Index]) {
				nums1[totalIndex] = nums1[nums1Index]
				nums1Index--
			} else { 
				nums1[totalIndex] = nums2[nums2Index]
				nums2Index--
			}

			totalIndex--
		}


		while (nums2Index >= 0) {
			nums1[totalIndex] = nums2[nums2Index]
			nums2Index--
			totalIndex--
		}
    }
}
```
### Python
```python
class Solution:
    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:
        """
        Do not return anything, modify nums1 in-place instead.
        """
        nums1_index = m - 1
        nums2_index = n - 1
        total_index = m + n - 1
 
        while nums1_index >= 0 and nums2_index >= 0:
            if nums1[nums1_index] >= nums2[nums2_index]:
                nums1[total_index] = nums1[nums1_index]
                nums1_index -= 1
            else:
                nums1[total_index] = nums2[nums2_index]
                nums2_index -= 1

            total_index -= 1


        while nums2_index >= 0:
            nums1[total_index] = nums2[nums2_index]
            nums2_index -= 1
            total_index -= 1
```

## Leetcode Solution Link
[O(n+m) Time Complexity Solution](https://leetcode.com/problems/merge-sorted-array/solutions/6874652/onm-time-complexity-solution-by-leeapple-urts)

