---
layout      : single
title       : 
summary     : 
date        : 2025-06-16 12:40:05 +0900
updated     : 2025-06-16 12:42:21 +0900
category    : 
tags        : 
toc         : true
public      : true
parent      : 
latex       : false
resource    : F1C84F34-9879-4360-B75B-D9D6FECAC17A
---
* TOC
{:toc}


Kotlin: val val1 = list1?.val ?: 0
?. (안전 호출 연산자): list1이 null이 아닐 경우에만 .val에 접근합니다. list1이 null이면 전체 표현식은 null이 됩니다.
?: (엘비스 연산자): ?.의 결과가 null이면, 엘비스 연산자 뒤의 값(0)을 반환합니다. 이는 널 값을 처리하고 기본값을 제공하는 Kotlin의 간결한 관용구입니다.

Kotlin: current = current.next!!
!! (널이 아님을 단언하는 연산자): 이 연산자는 널이 될 수 있는 타입을 널이 될 수 없는 타입으로 강제 변환합니다. 만약 값이 null이면 NullPointerException이 발생합니다. 여기서는 current.next = ListNode(total % 10) 바로 앞에서 current.next에 새로운 ListNode를 할당했기 때문에, current.next는 null이 아님이 보장되므로 !!를 안전하게 사용할 수 있습니다.


 while (list1 != null || list2 != null || carry != 0)
여기서  while (list1 != null || list2 != null || carry)
이렇게 하면 안돼?

아니요, Kotlin에서는 while (list1 != null || list2 != null || carry)와 같이 작성할 수 없습니다. 그렇게 하면 컴파일 오류가 발생합니다.
이유는 다음과 같습니다:
Python의 'Truthiness': Python에서는 0이 아닌 숫자, 비어 있지 않은 리스트/문자열 등은 "True"로 간주되고 (0, 빈 리스트/문자열 등은 "False"로 간주됩니다). 이러한 특성을 'Truthiness'라고 합니다. 그래서 Python에서는 while carry:라고 하면 carry가 0이 아닐 때 True로 평가되어 루프가 계속 실행됩니다.
Kotlin의 엄격한 타입 시스템: Kotlin은 Python과 달리 'Truthiness' 개념이 없습니다. Kotlin은 매우 엄격한 타입 시스템을 가지고 있어서, Boolean 타입이 필요한 곳에는 반드시 Boolean 타입의 값만 올 수 있습니다. Int 타입인 carry는 Boolean 타입으로 자동 변환되지 않습니다.
따라서 carry가 0이 아닐 때 루프를 계속 실행하고 싶다면, carry != 0처럼 명시적으로 Boolean 값을 반환하는 비교 연산을 사용해야 합니다.
결론적으로, while (list1 != null || list2 != null || carry != 0)가 Kotlin에서 올바른 문법입니다.

