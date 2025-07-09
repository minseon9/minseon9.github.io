---
layout      : single
title       : 
summary     : 
date        : 2025-07-09 11:21:56 +0900
updated     : 2025-07-09 11:22:09 +0900
category    : 
tags        : 
toc         : true
public      : true
parent      : 
latex       : false
resource    : 90171542-768C-4A6E-A1B1-93065BFC881A
---
* TOC
{:toc}

# 


## 1. IntArray

- **정의**:  
  - `IntArray`는 Java의 `int[]`와 동일하게, 원시 타입(int)으로 이루어진 배열입니다.
- **특징**:  
  - **성능**: 메모리 사용이 효율적이고, 원소 접근/수정이 매우 빠릅니다(O(1)).
  - **가변성**: 배열이므로 원소의 값을 자유롭게 변경할 수 있습니다.
  - **불변성**: 배열의 크기는 고정이지만, 원소 값은 변경 가능합니다.
- **사용 예시**:
  ```kotlin
  val arr = intArrayOf(1, 2, 3)
  arr[0] = 10 // 값 변경 가능
  ```
- **장점**:  
  - 대량의 숫자 데이터를 다룰 때 가장 빠르고 메모리 효율이 좋음.
- **단점**:  
  - 크기 변경이 불가능(추가/삭제 불가).

---

## 2. List<Int>

- **정의**:  
  - `List<Int>`는 불변(immutable) 리스트입니다. 즉, 한 번 생성하면 원소를 추가/삭제/수정할 수 없습니다.
- **특징**:  
  - **불변성**: 리스트의 원소를 변경할 수 없습니다.
  - **성능**: 내부적으로 `Int` 객체(래퍼 타입)를 사용하므로, `IntArray`에 비해 메모리 사용량이 많고, 성능이 약간 떨어질 수 있습니다.
- **사용 예시**:
  ```kotlin
  val list = listOf(1, 2, 3)
  // list[0] = 10 // 컴파일 에러! 값 변경 불가
  ```
- **장점**:  
  - 불변성을 보장하여, 함수형 프로그래밍이나 멀티스레드 환경에서 안전함.
- **단점**:  
  - 값 변경이 필요할 때마다 새로운 리스트를 만들어야 하므로, 성능이 떨어질 수 있음.

---

## 3. MutableList<Int>

- **정의**:  
  - `MutableList<Int>`는 가변 리스트로, 원소의 추가/삭제/수정이 가능합니다.
- **특징**:  
  - **가변성**: 리스트의 원소를 자유롭게 변경할 수 있습니다.
  - **성능**: 내부적으로 `Int` 객체를 사용하므로, `IntArray`보다는 느릴 수 있습니다.
- **사용 예시**:
  ```kotlin
  val mList = mutableListOf(1, 2, 3)
  mList[0] = 10 // 값 변경 가능
  mList.add(4)  // 원소 추가 가능
  ```
- **장점**:  
  - 동적으로 크기를 변경할 수 있어, 원소 추가/삭제가 필요할 때 유용함.
- **단점**:  
  - `IntArray`에 비해 메모리 사용량이 많고, 성능이 약간 떨어질 수 있음.

---

## 4. 왜 IntArray가 더 적합한가?

- **문제의 본질**:  
  - LeetCode 등에서 배열 문제는 보통 "고정 크기, 숫자 원소의 값만 바꿔서 처리"가 핵심입니다.
  - 셔플(Shuffle) 알고리즘은 배열의 원소 위치만 바꾸면 되지, 크기를 바꾸거나 원소를 추가/삭제하지 않습니다.
- **성능**:  
  - `IntArray`는 원시 타입 배열이므로, 가장 빠르고 메모리 효율이 좋습니다.
  - `List<Int>`나 `MutableList<Int>`는 내부적으로 `Int` 객체를 사용하므로, 오토박싱/언박싱 비용이 추가되고, 메모리 사용량도 더 많아집니다.
- **코드의 명확성**:  
  - 배열 문제에서는 배열을 그대로 사용하는 것이 코드의 의도를 명확하게 드러냅니다.

---

## 5. 예시로 비교

### IntArray 셔플 예시
```kotlin
val arr = intArrayOf(1, 2, 3)
arr[0] = 10 // O(1)로 값 변경
```

### List<Int> 셔플 예시 (불변)
```kotlin
val list = listOf(1, 2, 3)
// list[0] = 10 // 불가능
val newList = list.toMutableList()
newList[0] = 10 // 가능하지만, 새로운 리스트 생성 필요
```

### MutableList<Int> 셔플 예시
```kotlin
val mList = mutableListOf(1, 2, 3)
mList[0] = 10 // O(1)로 값 변경
```

---

## 결론

- **IntArray**:  
  - 고정 크기, 숫자 배열 문제에 최적.  
  - 가장 빠르고 메모리 효율이 좋음.
- **List<Int>**:  
  - 불변성을 강조할 때 사용.  
  - 값 변경이 필요하면 새로운 리스트를 만들어야 하므로 비효율적.
- **MutableList<Int>**:  
  - 크기 변경이 필요할 때 사용.  
  - 배열 기반 문제에서는 굳이 쓸 필요 없음.

---

추가로 궁금한 점이 있으면 언제든 질문해 주세요!

```plaintext
  val arr = intArrayOf(1, 2, 3)
  arr[0] = 10 // 값 변경 가능
```

```plaintext
  val list = listOf(1, 2, 3)
  // list[0] = 10 // 컴파일 에러! 값 변경 불가
```

```plaintext
  val mList = mutableListOf(1, 2, 3)
  mList[0] = 10 // 값 변경 가능
  mList.add(4)  // 원소 추가 가능
```

```plaintext
val arr = intArrayOf(1, 2, 3)
arr[0] = 10 // O(1)로 값 변경
```

```plaintext
val list = listOf(1, 2, 3)
// list[0] = 10 // 불가능
val newList = list.toMutableList()
newList[0] = 10 // 가능하지만, 새로운 리스트 생성 필요
```

```plaintext
val mList = mutableListOf(1, 2, 3)
mList[0] = 10 // O(1)로 값 변경
```

---

**User**

MutableList에서 내부적으로 Int 객체를 사용해 느리다는 내용은
IntArray는 index를 통해 O(1)으로 접근하는데
MutableList은 그렇지 않다는 이야기니?

---

**Cursor**

아주 좋은 질문입니다!  
정확히 말씀드리면, **접근 속도(O(1))** 자체는 `IntArray`와 `MutableList<Int>` 모두 동일하게 지원합니다.  
즉, 두 자료구조 모두 인덱스를 통한 원소 접근은 O(1)입니다.

---

## 차이점의 본질: "원시 타입 vs 래퍼 타입"

- **IntArray**  
  - 내부적으로 Java의 `int[]`와 동일하게, **원시 타입(int)** 값들을 연속된 메모리 공간에 저장합니다.
  - 메모리 사용이 효율적이고, CPU 캐시 친화적입니다.
  - 인덱스 접근, 값 변경 모두 O(1)입니다.

- **MutableList<Int>**  
  - 내부적으로 **Int 객체(래퍼 타입)**의 참조(Reference)들을 저장합니다.
  - 각 원소는 실제 값이 아니라, `Int` 객체를 가리키는 포인터입니다.
  - 인덱스 접근, 값 변경 모두 O(1)이지만,  
    - 값 저장/읽기 시 오토박싱(primitive → 객체), 언박싱(객체 → primitive) 과정이 필요할 수 있습니다.
    - 메모리 사용량이 더 많고, CPU 캐시 효율이 떨어집니다.

---

## 정리

- **접근 속도(O(1))**:  
  - `IntArray`와 `MutableList<Int>` 모두 인덱스를 통한 접근은 O(1)입니다.
- **성능 차이의 원인**:  
  - `IntArray`는 원시 타입을 직접 저장하여 더 빠르고 메모리 효율이 좋음.
  - `MutableList<Int>`는 래퍼 객체를 저장하므로, 오토박싱/언박싱 비용과 메모리 오버헤드가 발생함.

---

### 예시

```kotlin
val arr = intArrayOf(1, 2, 3) // [1, 2, 3]이 연속된 메모리 공간에 저장됨
val mList = mutableListOf(1, 2, 3) // [Int 객체 참조, Int 객체 참조, Int 객체 참조]
```

---

### 결론

- **접근 속도는 동일(O(1))**이지만,
- **메모리 효율과 CPU 캐시 효율**에서 `IntArray`가 더 우수합니다.
- 대량의 숫자 데이터를 다루거나, 성능이 중요한 경우 `IntArray`를 사용하는 것이 좋습니다.

궁금한 점 더 있으시면 언제든 질문해 주세요!

```plaintext
val arr = intArrayOf(1, 2, 3) // [1, 2, 3]이 연속된 메모리 공간에 저장됨
val mList = mutableListOf(1, 2, 3) // [Int 객체 참조, Int 객체 참조, Int 객체 참조]
```

