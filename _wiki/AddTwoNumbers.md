---
layout      : single
title       : Add Two Numbers(Med.)
summary     : 
date        : 2025-06-16 13:05:32 +0900
updated     : 2025-06-16 13:11:35 +0900
category    : Leetcode
tags        : LinkedList 
toc         : true
public      : true
parent      : 
latex       : false
resource    : 4F0E4DB8-9F57-4624-B55A-F3328F17474E
---
* TOC
{:toc}

# Add Two Numbers
두개의 non-negative interger가 들어있는 Linked Lists가 주어진다.

각 자리수들은 1의 자리부터 각 Linked Lists에 저장되어 있다.
문제는 두 Linked List의 non-negative interger의 합을 동일한 Linked Lists로 반환하는 것이다.

가령
```
Input: l1 = [2,4,3], l2 = [5,6,4]
Output: [7,0,8]
```


# 문제 풀이
떠오른 접근은 두가지이다. 
1. 다시 숫자로 변경해서, 덧셈 연산을 한 뒤 결과를 다시 Linked List로 만드는 것. 
2. Linked List를 순차 탐색하면서 덧셈 연산을 하는 것.  

1번은 로직이 간단하지만, 알고리즘 문제 풀이에 좋은 접근은 아닌 듯 하다. iterate도 비교적 많이 하게 될 것이다. 
2번은 nullable에 대한 처리만 잘 완료하면 한번의 iterate로 깔끔하게 떨어질 것이다.  

## 상세  
각 자리수에 대해 덧셈을 진행할 때 고려해야할 것은 논리 회로에서 덧셈을 다루는 방식과 비슷하다.
각 자리수와 이전 자리수의 덧셈에 따른 올림을 고려해야한다.
따라서 각 자리수의 노드가 존재하거나, carry가 남아있는 한 연산을 반복한다.

nullable에 대한 고려는 두 Linked List의 길이가 다르다는 점에서 시작한다.
각 값에 대한 nullable을 잘 고려해야한다.

## Code

### Kotlin
```kotlin
class Solution {
    fun addTwoNumbers(l1: ListNode?, l2: ListNode?): ListNode? {
        val resultNode = ListNode()
        var currentNode = resultNode
        var carry = 0

        var list1 = l1
        var list2 = l2
        while (list1 != null || list2 != null || carry != 0) {
            val l1Val = list1?.`val` ?: 0
            val l2Val = list2?.`val` ?: 0

            val sumVal = l1Val + l2Val + carry
            val result = sumVal % 10
            carry = sumVal / 10
            currentNode.next = ListNode(result)
            currentNode = currentNode.next

            list1 = list1?.next
            list2 = list2?.next
        }

        return resultNode.next
    }
}
```

### Python
```python
class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        carry = 0
        result_list_node = ListNode()
        current_node = result_list_node
        while l1 or l2 or carry:
            l1_val = 0
            if l1:
                l1_val = l1.val

            l2_val = 0
            if l2:
                l2_val = l2.val

            sum_val = l1_val + l2_val + carry
            result = sum_val % 10
            carry = sum_val // 10
            current_node.next= ListNode(val=result, next=None)
            current_node = current_node.next

            if l1:
                l1 = l1.next

            if l2:
                l2 = l2.next

        return result_list_node.next
```

## Leetcode Solution Link
[O(n) Time Complexity Solution](https://leetcode.com/problems/add-two-numbers/solutions/6848503/on-time-complexity-solution-by-leeapple-lye2)
