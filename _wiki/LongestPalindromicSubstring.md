---
layout      : single
title       : 
summary     : 
date        : 2025-06-19 17:57:31 +0900
updated     : 2025-06-19 17:57:49 +0900
category    : 
tags        : 
toc         : true
public      : true
parent      : 
latex       : false
resource    : 3C44A026-247C-453B-AD29-BC765DB9BC79
---
* TOC
{:toc}

#


```python

class Solution:
    DIVIDER = '$'

    def longestPalindrome(self, s: str) -> str:
        refined_string = self.refineString(s)

        palindrome_lengths: dict[int, int] = {}
        max_lenght_palindrome_center_index = 0
        max_length = 0
        for index, char in enumerate(refined_string):
            if index >= max_lenght_palindrome_center_index + palindrome_lengths.get(max_lenght_palindrome_center_index, 0):
                palindrome_lengths[index] = 0
            else:
                palindrome_lengths[index] = min(max_lenght_palindrome_center_index + palindrome_lengths[max_lenght_palindrome_center_index], palindrome_lengths.get(2*max_lenght_palindrome_center_index-index, 0))


            left = index - palindrome_lengths[index]
            right = index + palindrome_lengths[index]
            if left < 0 or right >= len(refined_string):
                continue


            while refined_string[left] == refined_string[right]:
                palindrome_lengths[index] += 1

                left -= 1
                right += 1
                if left < 0 or right >= len(refined_string):
                    break

            if palindrome_lengths[index] > max_length:
                max_lenght_palindrome_center_index = index
                max_length = palindrome_lengths[index]
                


        return self.get_longest_palindrom(refined_string, palindrome_lengths,  max_lenght_palindrome_center_index)


    def refineString(self, s: str) -> str:
        refined_string = ''
        for char in s:
            refined_string += char + self.DIVIDER

        return refined_string[:-1]

    def get_longest_palindrom(self, refined_string: str, palindrome_lengths:list[int], max_lenght_palindrome_center_index: int) -> str:
        max_length = palindrome_lengths[max_lenght_palindrome_center_index]

        longest_palindrom = ''
        for char in refined_string[max_lenght_palindrome_center_index - max_length + 1 : max_lenght_palindrome_center_index + max_length]:
            if char != self.DIVIDER:
                longest_palindrom += char

        return longest_palindrom



```
