---
layout      : single
title       : Longest Palindrome Substring(Med.)
summary     : 
date        : 2025-06-20 01:44:02 +0900
updated     : 2025-06-20 03:41:45 +0900
category    : 
tags        : 
toc         : true
public      : true
parent      : 
latex       : false
resource    : 565AF6A0-3B1C-4F5E-AF33-151686729FBC
---
* TOC
{:toc}


# Longest Palindrome Substring
주어진 문자열에 대해 가장 긴 Palindrome을 찾는 문제다.
가령

```
Input: s = "babad"
Output: "bab"
```

Palindrome은 거꾸로 읽어도, 똑바로 읽어도 똑같은 회문을 말한다.  
토마토, 기러기, 스위스, 우영우, 역삼역  


# 문제 풀이
이미 탐색한 데이터는 잘 알고 있다.  
여기에 Palindrome의 특성을 잘 사용하면 조금 더 똑똑해보이게 풀 수 있다. 바로 정반대쪽이 동일한 문자열을 가진다는 것.
아쉽게도 내가 생각해난 건 아니고, 학교 다니면서 배운 기묘한 알고리즘이다.

## Manacher's Algorithm  
메인 아이디어는 2가지 인 것 같다.  
하나는 각 요소들의 padlindrome 길이를 기억하고 있는 것.  
다른 하나는 다른 padlindrome을 이용해, 지금 탐색하는 위치의 탐색 비용을 줄이는 것이다.

그림으로 보면,  
`p`: 현재까지 발견된 palindrome 중 가장 **오른쪽 끝**까지 뻗는 palindrome의 **중심 위치**   
`A`: 현재까지 탐색한 각 요소 별 palindrome의 길이  
`i`: 현재 탐색 중인 위치   
`i' = 2 * p - i`: `i`의 `p`에 대한 대칭점  

<figure>
 <img src="/assets/images/LongestPalindromeSubstring/manacher's_algorithm.png">  
</figure>  

index `i`가 `p`의 palindrome 안에 위치한다. 수식으로 표현하면 `i < p + A[p]`이다.  
palindrome의 특성을 이용해, `p`를 기준으로 대칭점인 `i'` 의 데이터를 활용할 수 있다.  
즉, 이미 탐색한 `i'`의 palindrome을 i도 거의 그대로 가질 것이다. (거의라고 한 것은 여타 조건을 조금 따져야하기 때문)  
그럼 `i`를 탐색할 때는 이미 탐색한 `i'`의 palindrome의 길이를 활용해 탐색 비용을 최적화할 수 있다.  

결론적으로, **탐색의 오른쪽 끝인 p+A[p]은 항상 증가한다.**  
반복된 탐색이 없으므로 Time Complexity가 O(n)이다.  

## 상세
탐색하는 지점의 위치에 따라 로직이 달라진다.  
- `i`가 `p + A[p]`에 포함되는 경우, 대칭점인 `i'`를 활용한다.
- 이를 벗어나는 경우에는 `i`를 새로운 기준으로 업데이트한다.  


### Trick
panlindrome은 길이가 짝수일 수도, 홀수일 수도 있다.  
이것을 처리하는 로직이 굉장히 눈에 아른 거린다.  
이를 간소화하기 위해서 Tricky한 방법을 사용했는데, 주어진 문자열 사이에 특수한 문자를 넣어주는 것이다.  
예를 들어, `banana`이면 `b$a$n$a$n$a$`  
그럼 `aa` 와 같은 케이스도 `a$a$`가 되어서 고민할거리가 줄어든다.  


## Code
### Kotlin
```kotlin
class Solution {
    private val DIVIDER = "$"

    fun longestPalindrome(s: String): String {
        val refinedString = refineString(s)

        val palindromeLengthMap = mutableMapOf<Int, Int>()
        var searchedEndIndex = 0
        var searchedCenterIndex = 0
        var maxLength = 0
        var maxLengthIndex = 0
        for(index in refinedString.indices) {
            if (index > searchedEndIndex) {
                palindromeLengthMap[index] = 0
            } else {
                palindromeLengthMap[index] = minOf(searchedEndIndex - index, palindromeLengthMap.get(2 * searchedCenterIndex - index) ?: 0)
            }

            var left = index - palindromeLengthMap.get(index)!!
            var right = index + palindromeLengthMap.get(index)!!
            while (true) {
                if (left < 0 || right >= refinedString.length) break

                if (refinedString[left] == refinedString[right]) {
                    palindromeLengthMap[index] = palindromeLengthMap.get(index)!! + 1
                }
                else break

                left--
                right++
            }

            if (searchedEndIndex < index) {
                searchedEndIndex = index + palindromeLengthMap.get(index)!!
                searchedCenterIndex = index
            }

            if (maxLength < palindromeLengthMap.get(index)!!) {
                maxLength = palindromeLengthMap.get(index)!!
                maxLengthIndex = index
            }
        }

        [[return]] getLongestPalindrome(refinedString,palindromeLengthMap, maxLengthIndex)
    }


    fun refineString(s: String): String {
        var refinedString = ""
        for (char in s) {
            refinedString = refinedString.plus(char).plus(DIVIDER)
        }

        return refinedString
    }

    fun getLongestPalindrome(refinedString: String, palindromeLengthMap: MutableMap<Int, Int>, maxLengthIndex: Int): String {
        val maxLength = palindromeLengthMap.get(maxLengthIndex)!!
        val longestPalindrome = refinedString.substring(maxLengthIndex - maxLength + 1, maxLengthIndex + maxLength)

        return longestPalindrome.replace(DIVIDER, "")
    }
}

```
### Python
```python
class Solution:
    DIVIDER = '$'

    def longestPalindrome(self, s: str) -> str:
        refined_string = self.refine_string(s)

        palindrome_lengths: dict[int, int] = {}


        searched_end_index = 0
        searched_center_index = 0
        max_length_index = 0
        max_length = 0
        for index, char in enumerate(refined_string):
            if index >= searched_end_index:
                palindrome_lengths[index] = 0
            else:
                palindrome_lengths[index] = min(searched_end_index - index, palindrome_lengths.get(2*searched_center_index-index, 0))

            while True:
                left = index - palindrome_lengths[index]
                right = index + palindrome_lengths[index]
                if left < 0 or right >= len(refined_string):
                    break

                if refined_string[left] == refined_string[right]:
                    palindrome_lengths[index] += 1
                else:
                    break

                left -= 1
                right += 1

            if index >= searched_end_index:
                searched_end_index = index + palindrome_lengths[index]
                searched_center_index = index

            if max_length < palindrome_lengths[index]:
                max_length_index = index
                max_length = palindrome_lengths[index]

        return self.get_longest_palindrom(refined_string, palindrome_lengths,  max_length_index)


    def refine_string(self, s: str) -> str:
        refined_string = ''
        for char in s:
            refined_string += char + self.DIVIDER

        return refined_string

    def get_longest_palindrom(self, refined_string: str, palindrome_lengths:list[int], max_length_index: int) -> str:
        max_length = palindrome_lengths[max_length_index]

        print(refined_string[max_length_index - max_length + 1 : max_length_index + max_length])
        longest_palindrom = ''
        for char in refined_string[max_length_index - max_length + 1 : max_length_index + max_length]:
            if char != self.DIVIDER:
                longest_palindrom += char

        return longest_palindrom
```

## Leetcode Solution Link
[O(n) Time Complexity Manacher's Algorithm Solution](https://leetcode.com/problems/longest-palindromic-substring/solutions/6863162/on-time-complexity-manachers-algorithm-s-8rgm)

