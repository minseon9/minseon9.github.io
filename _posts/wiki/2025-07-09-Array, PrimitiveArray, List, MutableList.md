---
layout      : single
title       : Array, PrimitiveArray, List, MutableList
summary     : 
date        : 2025-07-09 11:21:56 +0900
updated     : 2025-07-09 14:58:23 +0900
category    : Language
tags        : Kotlin
toc         : true
public      : true
parent      : 
latex       : false
resource    : 90171542-768C-4A6E-A1B1-93065BFC881A
author_profile: false
classes: wide
---

Kotlin에서 Array와 List의 동작 방식을 비교한다.  

## Background knowledge
### int vs. Integer
Kotlin은 java에서의 정수형 원시 타입(primitive type)인 int와 정수 객체인 Integer를 구분하지 않는다.  
대신 JVM에서 실행될 때는 상황에 따라 적절하게 컴파일된다.  

예를 들어,  
`val a: Int = 1`에서 Int는 런타임에 int로 동작한다.  
`val a: List<Int> = listOf(...)`에서 Int는 런타임에 Integer 객체로 동작한다.  

### Auto/UnBoxing
`val a: List<Int> = listOf(...)` 예시에서 listOf에 들어있는 녀석들은 primitive type이다.  
즉, primitive type 데이터가 List에 저장될 때 Integer라는 객체로 변환되어야한다. 컴파일러가 알아서 처리해준다.  
이처럼 primitive type의 데이터를 대응하는 래퍼 클래스(wrapper class) 객체로 자동 변환되는 것을 오토박싱(Auto Boxing)이라 한다.  
언박싱(UnBoxing)은 이 역과정이다.


## Comparision
### Array<T>
Kotlin의 `Array<T>`는 Java의 T[]에 해당한다.


래퍼 클래스에 해당하는 객체의 참조를 들고 있다. 예를 들어, `Array<Int>`는 내부적으로 Int 객체 참조들을 저장한다. (즉, Int[]가 아님).
그리고 객체를 저장하기 때문에 오토박싱/언박싱이 필요하다.  

### PrimitiveArray
`IntArray`, `DoubleArray`, `BooleanArray` 와 같은 Kotlin이 제공하는 원시 타입 배열 래퍼 클래스이다.  
Java의 `int[]`, `double[]` 등과 대응된다

Primitive Type의 데이터를 들고 있기 때문에 오토박싱/언박싱이 필요없다.  
   

### List<T>
`List<T>`는 읽기 전용(immutable) 리스트다.
기본적으로 `ArrayList<T>`를 감싸고 있으며, `Array<T>`와 동일하게 객체 참조를 저장한다.

### MutableList<T>
`MutableList<T>`는 리스트 원소를 추가, 삭제, 수정할 수 있는 가변 컬렉션이다.  
역시 객체 참조를 저장한다.


### Performance Comparision(Just a casual test)
재미삼아 해본 성능 테스트다. 
총 연산 횟수 100,000,000회동안의 소요 시간이다.  

MutableList 테스트 예시
```kotlin
import kotlin.system.measureNanoTime

fun main() {
    val size = 10_000_000
    val repeat = 10
    val mutableListInt = MutableList(size) { it }
    var sum = 0L
    val time = measureNanoTime {
        repeat(repeat) {
            for (i in 0 until mutableListInt.size) sum += mutableListInt[i]
        }
    }
    println("\n================= MutableList<Int> 성능 테스트 =================")
    println("합계: $sum, 소요 시간(ms): ${time / 1_000_000}")
    println("============================================================\n")
} 
```

결과는 이렇다.
```
================= IntArray 성능 테스트 ================
합계: 499999950000000, 소요 시간(ms): 69
=======================================================

================= Array<Int> 성능 테스트 ==============
합계: 499999950000000, 소요 시간(ms): 71
=======================================================

================= List<Int> 성능 테스트 ===============
합계: 499999950000000, 소요 시간(ms): 119
=======================================================

================= MutableList<Int> 성능 테스트 ========
합계: 499999950000000, 소요 시간(ms): 116
=======================================================
```

100,000,000회에서의 성능 차이기 때문에 각 케이스에서의 성능 차이가 유의미하다고 할 수는 없겠지만,   
`IntArray`와 `Array<Int>`는 차이가 거의 없었다.
대신 `List/MutableList`은 꽤나 차이가 나는데, 오토박싱/언박싱 때문이라기 보다 JVM에서의 동작 차이에서 기인하는 듯하다.  

