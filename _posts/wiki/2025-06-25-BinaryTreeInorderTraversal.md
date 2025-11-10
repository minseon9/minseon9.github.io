---
layout      : single
title       : Binary Tree Inorder Traversal(Med.)
summary     : 
date        : 2025-06-25 13:22:27 +0900
updated     : 2025-06-25 14:07:26 +0900
category    : Algorithm
tags        : ["Problem Solving"]
toc         : true
public      : true
parent      : 
latex       : false
resource    : B72E397C-98CD-48C5-A2FA-60841F18AE0F
author_profile: false
classes: wide
---

# Binary Tree Inorder Traversal
주어진 이진 트리를 inorder로 탐색하는 문제다.

가령
```
Input: root = [1,2,3,4,5,null,8,null,null,6,7,9]
Tree:
        1
       / \
      2   3
     / \   \
    4   5   8
       / \   \
      6   7   9

Output: [4,2,6,5,7,1,3,9,8]
```
재귀 함수를 사용하지 않고 풀도록 권장한다.  


# 문제 풀이
트리를 탐색하는데 익숙하다면 재귀적으로 쉽게 풀어낼 수 있다.  
```
def inorderTraversal(self, node: TreeNode):
    if node.left is not None:
        self.inorderTraversal(node.left)
            
    print(node,val)

    if node.right is not None:
        self.inorderTraversal(node.right)
```
왼쪽 노드가 있다면 왼쪽 자식 트리에 대해 먼저 탐색하는 재귀적인 구조이다.  
문제는 재귀가 아닌 다른 방식으로 어떻게 풀 것이냐 이다.
이를 다르게 말하면, 재귀적으로 탐색할 때의 호출 순서를 다른 자료 구조에 어떻게 녹여낼 것이냐 가 된다.  


## 상세  
inorder 탐색은 순서상 왼쪽 -> 루트 -> 오른쪽으로 탐색한다.   
재귀 호출의 순서는
```
1. 왼쪽 노드가 있다면 왼쪽 자식 트리를 먼저 탐색한다.
2. 왼쪽 노드가 없다면, 해당 노드를 출력한다.
3. 오른쪽 노드가 있다면, 오른쪽 자식 트리에 대해 1~2번을 반복한다.
```

**왼쪽 노드만 보면 순서 상 처음 탐색한 노드를 먼저 출력**하도록 동작한다.  
이런 특성을 잘 활용할 수 있는 자료구조는 stack이다.  
재귀 호출의 순서를 stack에서의 동작으로 수정하면 아래와 같다.  
```
1. 왼쪽에 노드가 있다면, 현재 노드를 stack에 넣어두고 왼쪽 자식 트리에 대해 탐색한다.  
2. 왼쪽에 노드가 없다면, stack에서 pop하여 출력한다.  
3. 오른쪽 노드가 있다면, 오른쪽 자식 트리에 대해 1~2번을 반복한다.  
4. 1~3번을 stack이 빌 때까지 반복한다.
```

주의해야할 것이 있다면, stack에 이미 탐색한 노드는 저장하지 않도록 해야한다.  
재귀 호출은 이미 호출한 노드에 대해 다시 호출하지 않아 간단하지만,  
stack은 적절한 위치까지 pop하지 않으면 무한루프를 돌게된다.  

## Code

{% capture Kotlin %}
class Solution {
    fun inorderTraversal(root: TreeNode?): List<Int> {
        if (root == null) {
            return emptyList()
        }

        val nodes = mutableListOf<TreeNode>(root)
        val result = mutableListOf<Int>()
        while (nodes.isNotEmpty()) {
            val lastNode = nodes.last()
            if (lastNode.left != null) {
                nodes.add(lastNode.left!!)
                continue
            }

            while (true) {
                val lastNode = nodes.removeLast()
                result.add(lastNode.`val`)

                if (lastNode.right != null) {
                    nodes.add(lastNode.right!!)
                    break
                }

                if (nodes.isEmpty()) break
            }
        }

        return result
    }
}
{% endcapture %}

{% capture Python %}
class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        if not root:
            return []

        nodes: list[TreeNode] = [root]
        results: list[int] = []
        while nodes:
            last_node = nodes[len(nodes)-1]
            if last_node.left is not None:
                nodes.append(last_node.left)
                continue

            while True:
                last_node = nodes.pop()
                results.append(last_node.val)

                if last_node.right is not None:
                    nodes.append(last_node.right)
                    break

                if not nodes:
                    break

        return results
{% endcapture %}

{% include code-table.html 
   tabs="kotlin,python"
   kotlin=Kotlin
   python=Python
%}

## Leetcode Solution Link
[O(n) Time Complexity Stack Solution](https://leetcode.com/problems/binary-tree-inorder-traversal/solutions/6882833/on-time-complexity-stack-solution-by-lee-mpp9)
