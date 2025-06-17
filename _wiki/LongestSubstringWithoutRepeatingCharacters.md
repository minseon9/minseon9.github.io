---
layout      : single
title       : Longest Substring Without Repeating Characters
summary     : 
date        : 2025-06-17 12:05:14 +0900
updated     : 2025-06-17 13:36:10 +0900
category    : Leetcode
tags        : substring HashTable SlidingWindow
toc         : true
public      : true
parent      : 
latex       : false
resource    : DD81F695-3E0C-4AC2-8968-6BF71FA80346
---
* TOC
{:toc}

# Longest Substring Without Repeating Characters
하나의 문자열이 주어진다.

해당 문자열에서 중복된 문자가 없는 가장 긴 substring의 "길이"를 찾으면 된다.


가령
```
Input: s = "abcabcbb"
Output: 3
```

## Substring & Subsequence
substring 문제다.  
substring은 원래의 string에서 연속된 문자열로 이루어진 부분 문자열이다.  
예를 들어,   
"example"이라는 단어에서 "am"은 substring이지만 "ap"는 substring이 아니라 subsequence이다.  
자세한 차이는 [여기](https://www.geeksforgeeks.org/dsa/string-subsequence-substring/)를 확인하면 좋다.  



# 문제 풀이
substring이라는 점을 잘 고려해야한다. 즉, 연속된 문자열이어야한다.  
이미 탐색한 문자열(substring)은 알고 있다.  
탐색 도중 substring에 이미 있는 문자를 만나게 되면, 해당 문자가 마지막으로 등장한 위치의 다음 인덱스로 substring의 시작 위치를 이동시켜 substring을 갱신한다.  

## Sliding Window
이런 식의 문제 풀이를 Sliding Window라고 한다.  
지금까지 탐색한 데이터(Window)을 다음 탐색에 활용하는 것이 메인 아이디어다.  

<figure>
 <img src="/assets/images/LongestSubstringWithoutRepeatingCharacters/slidingwindow.png">  
</figure>


위 사진처럼, 문자열을 양 끝(`start`, `end`)을 추적하면서, **현재까지의 유효한 범위를 재활용**한다.  
다음 탐색에서 중복 문자열을 발견하면, 해당 문자가 마지막으로 등장한 위치의 **다음 인덱스**로 `start`를 옮겨 윈도우를 조정한다.   
이렇게 하면, 이미 탐색한 데이터를 재활용함으로 탐색 비용을 줄 일 수 있다.  

## 상세  
탐색한 substring을 잘 유지하고, 다시 활용하는 것이 중요하다.  
중복 문자열의 유무를 빠르게 찾기 위해 Key-Value Map을 사용한다. Key는 문자, Value는 해당 문자의 위치(index)로 저장한다.  

중복이 발생하면, substring의 시작 위치를 중복 문자열의 다음으로 변경해준다.  
이미 탐색한 데이터는 그대로 활용할 수 있다.  

탐색한 substring의 길이와 이전의 최대 길이를 비교해 최대 길이를 업데이트한다.  


## Code
### Kotlin
```kotlin
class Solution {
    fun lengthOfLongestSubstring(s: String): Int {
        var maxLength = 0 
        var startIndex = 0

        val substring = mutableMapOf<Char, Int>()
        var substring_length = 0
        s.forEachIndexed { index, char ->
            if (substring.containsKey(char)) {
                startIndex= maxOf(startIndex, substring[char]!! + 1)
                substring_length = index - startIndex + 1
            } else {
                substring_length++
            }

            substring[char] = index
            maxLength = maxOf(maxLength, substring_length)
        }

        return maxLength
    }
}
```

### Python
```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        max_length = 0
        start_index = 0

        substring: dict[str, int] = {}
        substring_length = 0
        for i, char in enumerate(s):
            if substring.get(char) is not None:
                start_index = max(substring[char] + 1, start_index)
                substring_length = i - start_index + 1
            else:
                substring_length += 1

            substring[char] = i

            max_length = max(max_length, substring_length)

        return max_length
```

## Leetcode Solution Link
[O(n) Time Complexity Sliding Window Solution](https://leetcode.com/problems/longest-substring-without-repeating-characters/solutions/6852496/on-time-complexity-sliding-window-soluti-jhgd)
