---
layout      : single
title       : Best Time to Buy and Sell Stock(Easy)
summary     : 
date        : 2025-07-10 23:09:23 +0900
updated     : 2025-11-10 01:12:17 +0900
tags        : ["Problem Solving"]
toc         : true
public      : true
parent      : 
latex       : false
resource    : 6B8B4337-4E34-4D0A-B8AE-6ED0980673CA
author_profile: false
classes: wide
---

# Best Time to Buy and Sell Stock
Stock의 가격이 정수 배열로 주어진다.  
Stock의 가격이 날마다 변한다.  
언제 사고 언제 팔아야 가장 큰 차익을 남기는 지 구하는 문제다.  

가령,
```
Input: prices = [7,1,5,3,6,4]
Output: 5
```  

# 문제 풀이
최대 차이값을 구하는 문제다.  
단, 비교의 방향이 일방향이다. **어제의 Stock 가격은 궁금하지 않다.**  

O(n^2) 해결법은 단순하다. 모든 값을 비교하면 된다.  
그럼 한번의 순회로 문제를 해결하려면 ?  
`어제의 Stock 가격은 궁금하지 않다.` 는 점을 잘 이용하면 된다.  
1. 이전의 index의 element와는 비교할 필요 없다.  
2. **이전의 가격보다 싼 가격**이 등장하면 해당 가격을 기준으로 비교한다.  
3. 그 중 가장 큰 diff를 반환한다.  


## Code

{% capture Python %}
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        mininum_price = inf
        diff = 0
        for price in prices:
            if mininum_price > price:
                mininum_price = price

            if diff < price - mininum_price:
                diff = price - mininum_price

        return diff
{% endcapture %}

{% capture Kotlin %}
class Solution {
    fun maxProfit(prices: IntArray): Int {
        var minimumPrice = Int.MAX_VALUE
        var diff = 0
        for (price in prices) {
            if (minimumPrice > price) {
                minimumPrice = price
            }
            
            if (diff < price - minimumPrice) {
                diff = price - minimumPrice
            }
        }

        return diff
    }
}
{% endcapture %}

{% include code-table.html 
   tabs="python,kotlin"
   python=Python
   kotlin=Kotlin
%}

## Leetcode Solution Link
[O(n) Time Complexity Solution](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/solutions/6943329/on-time-complexity-solution-by-leeapple-cgaz)
