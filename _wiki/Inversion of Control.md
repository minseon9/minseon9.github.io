---
layout      : single
title       : Inversion of Control(IoC)
summary     : 
date        : 2025-07-08 13:03:16 +0900
updated     : 2025-07-09 03:41:32 +0900
category    : 'Application Architecture'
tags        : 
toc         : true
public      : true
parent      : 
latex       : false
resource    : 7C7E7479-FAF3-49F0-BDDA-16E154603A6E
---
* TOC
{:toc}

Spring Framework docs에 처음으로 등작하는 개념은 IoC Container와 Bean이다.  
https://docs.spring.io/spring-framework/reference/core/beans/introduction.html  
위키피디아와 파울러 아저씨의 etymology를 참고해서, Inversion of Control이라는 개념이 등장한 문서들을 정리
https://en.wikipedia.org/wiki/Inversion_of_control
https://martinfowler.com/bliki/InversionOfControl.html

## Control Flow
https://en.wikipedia.org/wiki/Control_flow  
program은 순서대로 코드 한줄 한줄 실행하기도 하고, 조건에 따라 특정 코드 구문들만 실행할 수도 있다.  
특정 조건을 만족할 때까지 동일한 구문만 실행할 수도 있고, function call처럼 외부 코드를 실행할 수 도 있다.  

Control flow는 program에서 실행되는 순서를 의미한다.  

Inversion of Control은 이런 흐름을 **"누가"** 제어하느냐에 대한 개념이다.  
---  
## Procedural Programming(절차적 프로그래밍)   
사용자로 부터 숫자를 입력받고, 피라미드 형태의 별을 출력하는 프로그램이다.  

```python3
# 피라미드 출력 예시
n = int(input("피라미드 높이를 입력하세요: "))
for i in range(n):
    print(' ' * (n - i - 1) + '*' * (2 * i + 1))
```  
입력을 언제 받을지,반복문을 몇 번 돌릴지, 각 줄에 무엇을 출력할지 모두 내가 코드로 직접 결정한다.  
즉, 내 코드가 흐름을 제어한다.  

---  

## Inversion of Control
Inversion of Control은 Framework의 일반적인 패턴에 해당하는 개념
핵심 요지는 내가 쓴 코드가 아니라 Framework가 흐름을 제어한다는 것이다.  

(Journal of Object Oriented Programming
https://scispace.com/explore/journals/journal-of-object-oriented-programming-15nxtmf4
http://www.laputan.org/drc/drc.html)
One important characteristic of a framework is that the
methods defined by the user to tailor the framework will often
be called from within the framework itself, rather than from
the user's application code. The framework often plays the
role of the main program in coordinating and sequencing
application activity. This inversion of control gives
frameworks the power to serve as extensible skeletons. The
methods supplied by the user tailor the generic algorithms
defined in the framework for a particular application.

(Object-Oriented Frameworks A survey of methodological issues - Michael Mattsson (https://www.researchgate.net/publication/2238535_Object-Oriented_Frameworks))
Conclusion
An object-oriented framework is “a (generative) architecture designed for
maximum reuse, represented as a collective set of abstract and concrete
classes; encapsulated potential behaviour for subclassed specializations.”
The major difference between an object-oriented framework and a class
library is that the framework calls the application code. Normally the appli-
cation code calls the class library. This inversion of control is sometimes
named the Hollywood principle, “Do not call us, we call You”.
Development of a framework requires a number of design iterations in order
to make it reusable. Existing object-oriented methods have no explicit sup-
port for the development of reusable object-oriented software [Mat95], and
particularly not frameworks. Design elements of special importance in the
development of a framework are: abstract classes, dynamic binding, con-
tracts and design patterns.

예를 들어, Spring, NestJS 등 web application server를 구축하는데 사용하는 프레임워크는 HTTP API request에 대해 프레임워크가 흐름을 제어한다.  
사용자가 정의하는 부분은 미들웨어, API의 endpoint, application domain(비즈니스 로직) 정도.
framework는 request에 대해 미리 정의된 design대로 처리하고, 사용자가 정의한 부분은 호출할 뿐이다.  




### Framework, Re-use of Design
(Journal of Object Oriented Programming
https://scispace.com/explore/journals/journal-of-object-oriented-programming-15nxtmf4
http://www.laputan.org/drc/drc.html)
3. Toolkits and Frameworks
Framework에 대한 동일한 이야기. **reuse of design**
One of the most important kinds of reuse is reuse of designs.
A collection of abstract classes can be used to express an
abstract design. The design of a program is usually described
in terms of the program's components and the way they
interact.


(Object-Oriented Frameworks A survey of methodological issues - Michael Mattsson (https://www.researchgate.net/publication/2238535_Object-Oriented_Frameworks))
software를 재사용하기 위한 접근 -> 생산성과 소프트웨어 퀄리티의 발전
객체 지향의 등장으로 재사용을 가능하게 하는 몇 가지 표준을 제시
Problem-orientation(a formal definition of problems, and a framework for associating problems with solutions through formal, logical arguments), 
- 객체 지향 모델은 problem doamin 으로 설명되며, 문제에 대한 분석으로 하여금, 사용자와 개발자(제품)간의 소통이 쉬워짐

Resilience to evolution.
- application 도메인의 process(비즈니스 로직)는 자주 변하지만, 도메인의 entities는 그렇지 않음. entities로 구성된 모델은 변화에 안정적임

Domain analysis
- single applicaition analysis가 아닌 domain analysis. 미래의 요구사항을 비롯해 prlboem domain의 요구사항을 완결하는 넓고 extensive한 분석


객체 지향에서의 재사용 가능한 assets은 객체와 클래스, 그리고 디자인 패턴과 객체 지향 프레임워크까지 연속선상에 존재한다.
그 중 객체 지향 프레임워크는 최신 기술.

재사용 가능한 software components는 프로시저(procedure)와 함수 라이브러리(function library).
객체와 클래스, 상속의 등장으로 class library 등장
Reuse of Design은 비용적으로 더 이득. design은 소프트웨어에서 가능 intellectual한 부분이며, 코드를 생성/재생성하기 가장 까다로운 부분

객체와 클래스에 데이터와 행동들을 집어넣어 재사용이 훨씬 더 가능해짐
클래스들을 묶어서 class library를 만들 수 있고, class library는 이미 존재하는 class library를 상속하는 등 더 구조화됨.
전통적인 procedural library와는 차이를 보임

문제는 
Complexity: 상속을 너무 많이 사용하는 복잡한 구조는 파악하기 힘듦
Duplication of effort: class library를 통해 재사용할 수 있게 되었지만 각 개발자들은 같은 문제에 대해 class library를 다르게 사용. 유지보수에 문제
Flow of control: class library를 재사용할 때 flow of control은 개발자가 만들고 있는 program에 있음. 즉 개발자에게 책임이 있고, 이는 오류를 만들기 쉬움

```
The striving to avoid the above mentioned problems in combination with the
desire to reuse designs has resulted in object-oriented frameworks. An
object-oriented framework is a reusable design for an application, or subsys-
tem, represented by a set of abstract classes and the way they collaborate.
Thus, a framework outlines the main architecture for the application to be
built. Together with the framework there are accompanying code that pro-
vide a default implementation for a “standard” application (or subsystem). A
framework then implies reuse of both code and design. A framework partic-
ularly emphasizes those parts of the application domain that will remain sta-
ble and the relationships and interactions among those parts, i.e the
framework is in charge of the flow of control.
```  
그래서 등장한 것이 object-oriented frameworks.
추상화 클래스들과 추상화 클래스들의 collaborate가 정의된 재사용 가능한 "design" 혹은 "subsystem"  
다시 말해, framework는 "standard" 어플리케이션의 기본적인 구현을 제공함으로 code와 design을 모두 재사용  
application domain에서 변하지 않은 핵심 구조와 그 요소들의 관계를 중점으로 다룸. 즉, flow of control을 framework가 책



% 해당 문서는 framework의 디자인 패턴이나 컨셉부터, framework를 어떻게 개발할 것인 지, 문서화는 어떻게 할 것 인지, 어떻게 사용하면 되는 지 등을 다룸. 그 중에서 내가 관심있는 것은 Chapter 3



### Dynamic binding
3.6 Important Design Elements
When developing a framework, rather than an ordinary object-oriented
application, some program constructs, or “design elements”, are very impor-
tant. Such design elements are abstract classes, object-oriented design pat-
terns, dynamic binding and contracts
Framework에서 추상화 클래스, 객체 지향 디자인 패턴, 동적 바인딩, contract 가 중요

그 중 동적 바인딩
Dynamic binding
Dynamic binding is identified as one of the key issues for developing object-
oriented frameworks [Ohl93b]. A framework can be considered as a library
designed for dynamic binding. If we compare a framework with a conven-
tional library we will see the importance of dynamic binding. When a con-
ventional library is used by an application routine, calls are made from the
application to the library only. In an object-oriented framework, however,
calls can go also in the opposite direction, see figure 3.8. This two-way flow
of control is made possible by dynamic binding.
Currently, some fragments in existing methods are seen that point towards
the use of dynamic binding as a design element, i.e the notion of abstract
classes is one step in that direction.

프레임워크와 conventional library를 비교하면, 동적 바인딩의 중요성을 알 수 있음.
conventional library가 application routine에 의해 사용될 때, application이 library를 호출하는 일방적인 방향(flow of control이 일방적)
반면, object-oriented framework는 양방향. 이 two-way flow of control은 동적 바인딩으로만 가능  

The rule introduced says that if the public interface
has to be extended, the derivation should result in an abstract class and then
perform another derivation that will result in a concrete class. Following this
principle will make it possible to reuse existing classes and make it easier to
utilize the dynamic binding facility.

추상 클래스를 사용하고, 프레임워크는 구체 클래스를 동적으로 바인딩하면서 활용도가 좋아진다.



### Framework and Library

Framework의 정의
A number of different and similar definitions of frameworks exist. Deutsch
[Deu89] states that
52
Framework Development
"a framework binds certain choices about state partitioning and control
flow; the (re)user (of the framework) completes or extends the framework to
produce an actual application".

Based on this definitions we define an object-oriented framework as:
A (generative) architecture designed for maximum reuse, represented as a
collective set of abstract and concrete classes; encapsulated potential
behaviour for subclassed specializations.


framework는 generative pattern이라고 할 수 있음. framework에 의해 실행되는 application domain의 여러 application를 개발하기 위한 기초를 제공하기 때문  
위의 정의를 바탕으로 다른 컨셉과의 차이를 비교할 것.

그 중에서도 class library와의 비교를 보면, 둘의 차이인 제어의 역전 개념이 드러남.
프레임워크가 어플리케이션 코드를 호출하는 구조가 어떻게 구현되는 지, 그리고 디자인 패턴과 어떤 연관이 있는 지 다룸.
A class library is a set of related classes that provides general-purpose func-
tionality. The classes in a class library are often not related to a specific
application domain, which is the case for classes in an object-oriented
framework. The functionality typically covered by class libraries are, for
example, collection classes (lists, stacks, sets etc.) and i/o-handling (the C++
iostream library [Tea93]). The difference between a class library and a
framework is the degree of reuse and its impact on the architecture of the
application. Since the framework covers the functionality of the application
domain the main architecture is captured by the framework. Thereby, the
framework has a major impact on the architecture of the framework-based
application developed. The impact on the architecture can be also be identi-
fied by the fact that a class in a class library is reused individually and a
class in a framework is reused together with other classes in the framework
to solve a specific instance of a certain problem.



Conclusion

An object-oriented framework is “a (generative) architecture designed for
maximum reuse, represented as a collective set of abstract and concrete
classes; encapsulated potential behaviour for subclassed specializations.”
The major difference between an object-oriented framework and a class
library is that the framework calls the application code. Normally the appli-
cation code calls the class library. This inversion of control is sometimes
named the Hollywood principle, “Do not call us, we call You”.
Development of a framework requires a number of design iterations in order
to make it reusable. Existing object-oriented methods have no explicit sup-
port for the development of reusable object-oriented software [Mat95], and
particularly not frameworks. Design elements of special importance in the
development of a framework are: abstract classes, dynamic binding, con-
tracts and design patterns.

## Dependency Injection
https://martinfowler.com/articles/injection.html
|Inversion of control is a common characteristic of frameworks, 
|so saying that these lightweight containers are special because they use inversion of control is like saying my car is special because it has wheels.  
|
The question is: “what aspect of control are they inverting?”

Spring이나 NestJS에서는 명시적으로 "의존성을 주입"한다.
이런 패턴을 Dependency Injection(DI)이라 함. framework로서 DI 또한 IoC의 성격을 잘 보여준다.  
Spring에서의 DI를 주로 이야기하다보니 IoC와 DI가 동일하게 여겨지는 듯  

DI는 IoC라는 framework의 일반적인 개념과 구분해 IoC container의 패턴을 명칭하는 이름이다.
파울러 아저씨는 IoC는 framework 자체의 개념이고, 이러한 패턴의 이름으로 Dependency Injection. 의존성 주입이라 명명.


처음 IoC가 등장했을 때는 User Interface의 control에 대한 것이었음. 사용자의 입력에 대해 framework가 control flow를 책임지는 것. (사용자가 입력하면 framework는 입력을 감지(event handler)하고 custom source를 호출)

Spring과 같은 프레임워크에서 사용하는 의존성을 관리하는 container.
사용자가 직접 의존성이 있는 객체를 생성하지 않고(사용자에게 flow of control 책임이 있는 것이 아니라) IoC container가 대신 생성(framework가 책임을 짐). 사용자는 정의만 해주면 됨.

For this new breed of containers the inversion is about how they lookup a plugin implementation.

