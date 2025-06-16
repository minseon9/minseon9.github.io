---
layout      : single
title       : 
summary     : 
date        : 2025-06-16 12:42:39 +0900
updated     : 2025-06-16 12:42:58 +0900
category    : 
tags        : 
toc         : true
public      : true
parent      : 
latex       : false
resource    : 80EBC937-4D29-494F-B1F0-1148F5B06A8D
---
* TOC
{:toc}

#**User**

Kotlin도 C처럼 포인터 개념이 있을 것 같은데,

parameter로 넘어온 l1: ListNode에 대해서
l1 = l1.next처럼 parameter를 직접 변경하면 
이 함수를 호출한 외부에서 다시 l1을 참조할 때 변경된 값을 참조하게 되는거니?

---

**Cursor**

좋은 질문입니다! Kotlin은 C/C++와 같은 언어의 직접적인 "포인터" 개념을 가지고 있지 않습니다. 대신, Java와 유사하게 "참조(references)" 개념을 사용합니다. 이 차이를 이해하는 것이 중요합니다.

### Kotlin의 변수와 참조

Kotlin에서 객체(예: `ListNode` 인스턴스)를 변수에 할당할 때, 실제 객체 자체가 변수에 저장되는 것이 아니라 객체가 메모리에 있는 위치를 가리키는 **참조(reference)**가 변수에 저장됩니다.

### Kotlin의 매개변수 전달 방식 (Pass-by-Value of References)

Kotlin (그리고 Java)은 **항상 값으로 전달(pass-by-value)** 방식을 사용합니다. 하지만 객체의 경우에는 '객체의 참조를 값으로 전달'하는 방식입니다.

`fun addTwoNumbers(l1: ListNode?, l2: ListNode?): ListNode?` 함수를 예로 들어 설명하겠습니다.

1.  **함수 호출 시**: `addTwoNumbers` 함수가 호출될 때, 외부에서 전달된 `l1`과 `l2` 참조 변수들이 가리키는 **객체의 주소(참조)를 복사하여** 함수의 매개변수 `l1`과 `l2`에 할당합니다. 즉, 함수 내부의 `l1`과 외부의 `l1`은 서로 다른 '참조 변수'이지만, 이 두 변수가 **동일한 메모리 주소에 있는 객체를 가리키고 있습니다.**

2.  **`l1 = l1.next` 또는 `list1 = list1.next`의 효과**:
    *   **매개변수 직접 변경 (Kotlin에서 불가능)**:
        Kotlin에서 함수 매개변수는 기본적으로 `val` (불변)입니다. 따라서 함수 내부에서 `l1 = l1.next`와 같이 **매개변수 `l1` 자체를 재할당하는 것은 허용되지 않습니다**. 만약 이 코드를 직접 작성하면 컴파일 오류가 발생합니다. C와 달리 Kotlin에서는 `ListNode *l1` 같은 포인터 매개변수를 직접 조작하여 외부 변수의 포인터 값을 바꾸는 방식이 없습니다.
    *   **로컬 변수 변경 (현재 Kotlin 코드의 경우)**:
        제가 제공한 Kotlin 번역 코드에서는 이 문제를 해결하기 위해 함수 내부에 `var list1 = l1`과 같이 **새로운 로컬 가변 변수(`var`)를 선언하여 매개변수의 참조를 복사**했습니다. 그리고 이 `list1` 변수를 변경했습니다:
        ```kotlin
        var list1 = l1 // l1이 가리키는 객체의 참조를 list1에 복사
        // ...
        if (list1 != null) {
            list1 = list1.next // list1 변수가 이제 다른 ListNode를 가리키게 됨
        }
        ```
        이 경우 `list1 = list1.next`는 **함수 내부의 `list1`이라는 로컬 변수가 가리키는 객체를 변경하는 것**입니다. 외부에서 이 함수를 호출한 곳의 원래 `l1` 변수는 여전히 **함수 호출 전에 가리키던 원래 `ListNode` 객체를 가리키고 있습니다**. 외부의 `l1`에는 아무런 영향을 주지 않습니다.

3.  **객체의 내부 상태 변경**:
    만약 매개변수 `l1` (또는 `list1`)이 가리키는 **객체 자체의 내부 상태를 변경**한다면 (예: `list1.val = someValue`), 이 변경은 외부에서도 확인할 수 있습니다. 왜냐하면 함수 내부와 외부의 참조 변수가 동일한 객체를 가리키고 있기 때문입니다.
    예시:
    ```kotlin
    fun changeNodeValue(node: ListNode?) {
        node?.`val` = 100 // node가 null이 아니면 node의 val을 100으로 변경
    }

    // 외부 코드
    val myNode = ListNode(5)
    changeNodeValue(myNode)
    println(myNode.`val`) // 출력: 100 (외부에서도 변경된 값이 보임)
    ```

### 요약

*   Kotlin은 C의 '포인터' 개념이 아니라 '참조' 개념을 사용합니다.
*   함수에 객체를 매개변수로 전달할 때, **객체 자체가 아닌 '객체의 참조'가 값으로 복사되어 전달됩니다.**
*   함수 내부에서 매개변수 자체를 **재할당** (`l1 = l1.next`와 같이 다른 객체를 가리키도록 변경)하는 것은, 매개변수가 `val`이기 때문에 불가능하며, `var` 로컬 변수를 사용하더라도 **그 로컬 변수의 참조만 변경될 뿐, 외부의 원래 변수에는 영향을 주지 않습니다.**
*   하지만 함수 내부에서 매개변수(`l1` 또는 `list1`)가 가리키는 **객체의 내부 속성(`l1.val` 또는 `list1.next`)을 변경**하는 것은, 외부의 원래 변수도 동일한 객체를 가리키므로 **외부에서도 그 변경이 반영됩니다.**

따라서 Python 코드의 `l1 = l1.next` 동작을 Kotlin에서 재현하려면, `var list1 = l1`처럼 새로운 로컬 가변 변수를 만들고 그 변수를 재할당하는 것이 올바른 방식입니다. 이는 외부 `l1` 변수에는 영향을 미치지 않고, 함수 내부에서 연결 리스트를 탐색하는 데 사용됩니다.

```plaintext
        var list1 = l1 // l1이 가리키는 객체의 참조를 list1에 복사
        // ...
        if (list1 != null) {
            list1 = list1.next // list1 변수가 이제 다른 ListNode를 가리키게 됨
        }
```

```plaintext
    fun changeNodeValue(node: ListNode?) {
        node?.`val` = 100 // node가 null이 아니면 node의 val을 100으로 변경
    }

    // 외부 코드
    val myNode = ListNode(5)
    changeNodeValue(myNode)
    println(myNode.`val`) // 출력: 100 (외부에서도 변경된 값이 보임)
```

 
