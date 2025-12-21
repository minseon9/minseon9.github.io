---
layout      : single
title       : Kotlin null 처리 문법
summary     : 
date        : 2025-06-16 12:40:05 +0900
updated     : 2025-06-16 13:22:07 +0900
tags        : Kotlin
toc         : true
public      : true
parent      : 
latex       : false
resource    : F1C84F34-9879-4360-B75B-D9D6FECAC17A
author_profile: false
classes: wide
---

Leetcode 풀면서 배운 TIL, Kotlin에서 null 처리 문법이다.


## Nullable Type
```kotlin
val value: Int? = obj.value
```
타입 뒤에 question mark를 붙이 nullable함을 의미한다.

## `?.` (Safe call operator)
```kotlin
val value = obj?.value
```
Safe call operator, 안전 호출 연산자라고 한다.
예시에서 obj이 null이 아닐 경우에만 .val에 접근한다. obj이 null이면 전체 표현식은 null이 된다.

javascript의 Optional Chaining과도 유사하다. 대신 javascript는 체이닝 도중 null 혹은 undefined인 값이 있는 경우, 결과가 undefined이다.  
Kotlin은 null을 반환한다.


## `?:` (Elvis operator):
```kotlin
val value = obj.value ?: 0
```
엘비스 연산자로, `?.`의 결과가 null이면, `?:` 엘비스 연산자 뒤의 값(0)을 반환한다.  
javascript에서의 `obj.value ?? 0` python에서 `obj.value or 0` 도 동일한 결과가 나올 듯 하다.


## Not-null assertion operator
```kotlin
val value = obj.value!!
```
해석하면 "null이 아님은 단언하는 연산자" 이다.
nullable한 값에 대해서 널이 아닌 타입으로 강제 변환한다.
값이 null인 경우, NullPointerException이 발생한다.

## Truthiness
Python에는 Truthiness라는 개념이 있다.
0이 아닌 숫자, 비어 있지 않은 리스트/문자열 등은 "True"로 간주되고, 반대인 0, 빈 리스트/문자열 등은 "False"로 간주되는데 이를 Truthiness라고 한다.
```python
carry = 1
if carry:
    print('Truthiness!')
    
>> 'Truthiness!'
```

Kotlin은 비교적 엄격한 타입 시스템이라 Boolean이 필요한 곳에는 반드시 Boolean 값을 사용해야한다.
```kotlin
var carry = 1
if (carry) {
    println("Truthiness?")
}
    
>> Compile Error 발생
```


