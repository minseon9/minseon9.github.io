---
layout      : single
title       : 
summary     : 
date        : 2025-07-08 22:47:37 +0900
updated     : 2025-07-08 22:50:17 +0900
category    : 
tags        : 
toc         : true
public      : true
parent      : 
latex       : false
resource    : 2E34E6E3-9DE2-4ED6-B9D4-47096C8CFEC2
---
* TOC
{:toc}
https://scispace.com/explore/journals/journal-of-object-oriented-programming-15nxtmf4
http://www.laputan.org/drc/drc.html


#4. Lifecycle
The lifecycle of a Smalltalk application is not necessarily
different from that of other programs developed using rapid
prototyping. However, the lifecycle of classes differs
markedly from that of program components in conventional
languages, since classes may be reused in many applications.
Classes usually start out being application dependent. It is
always worth-while to examine a nearly-complete project to
see if new abstract classes and frameworks can be discovered.
They can probably be reused in later projects, and their
presence in the current project will make later enhancements
much easier. Thus, creating abstract classes and frameworks is
both a way of scavenging components for later reuse and a
way of cleaning up a design. The final class hierarchy is a
description of how the system ought to have been designed,
though it may bear little relation to the original design.
There are many ways that classes can be reorganized. Big,
complex classes can be split into several smaller classes. A
common superclass can be found for a set of related classes.
Concrete superclasses can be made abstract. An white-box
framework can be converted into a black-box framework. All
these changes make classes more reusable and maintainable.
Every class hierarchy offers the possibility of becoming a
framework. Since a white-box framework is just a set of
conventions for overriding methods, there is no fine line
between a white-box framework and a simple class hierarchy.
In its simplest form, a white-box framework is a program
skeleton, and the subclasses are the additions to the skeleton.
Ideally, each framework will evolve into a black-box
framework. However, it is often hard to tell in advance how
an white-box framework will evolve into a black-box
framework, and many frameworks will not complete the
journey from skeleton to black-box frameworks during their
lifetimes.
White-box inheritance frameworks should be seen as a natural
stage in the evolution of a system. Because they are a middle
ground between a particular application and an abstract
design, white-box inheritance frameworks provide an
indispensable path along which applications may evolve. A
white-box framework will sometime be a step in the evolution
of a loose collection of methods into a discrete set of
components. At other times, a white-box framework will be a
finished product. A useful design strategy is to begin with a
white-box approach. White-box frameworks, as a result of
their internal informality, are usually relatively easy to design.
As the system evolves, the designer can then see if additional
internal structure emerges.
Finding new abstractions is difficult. In general, it seems that
an abstraction is usually discovered by generalizing from a
number of concrete examples. An experienced designer can
sometimes invent an abstract class from scratch, but only after
having implemented concrete versions for several other
projects.
This is probably unavoidable. Humans think better about
concrete examples then about abstractions. We can think well
about abstractions such as integers or parsers only because we
have a lot of experience with them. However, new
abstractions are very important. A designer should be very
happy whenever a good abstraction is found, no matter how it
was found. 

---  


Smalltalk 애플리케이션과 클래스의 라이프사이클 설명

이 글은 Smalltalk 애플리케이션 개발 과정에서 라이프사이클과, 특히 클래스의 라이프사이클이 다른 전통적인 프로그래밍 언어와 어떻게 다른지에 대해 설명하고 있습니다.
1. Smalltalk 애플리케이션 라이프사이클과 일반적인 프로토타이핑 비교

    Smalltalk 애플리케이션의 라이프사이클 자체는 다른 빠른 프로토타이핑 방식으로 개발된 프로그램과 크게 다르지 않습니다.

    하지만 클래스의 라이프사이클은 매우 다릅니다. 그 이유는 클래스가 여러 애플리케이션에서 재사용될 수 있기 때문입니다.

2. 클래스의 진화와 재사용

    처음에는 클래스가 특정 애플리케이션에 종속되어 시작하지만, 프로젝트가 거의 완성될 무렵에는 추상 클래스와 프레임워크를 발견하고 만들 기회가 생깁니다.

    이렇게 만든 추상 클래스와 프레임워크는 이후 프로젝트에서 재사용할 수 있어, 향후 기능 확장과 유지보수를 쉽게 만듭니다.

    즉, 추상 클래스와 프레임워크를 만드는 것은 재사용 가능한 컴포넌트를 확보하는 동시에 설계를 정리하는 작업입니다.

    최종 클래스 계층구조는 시스템이 어떻게 설계되어야 했는지를 보여주지만, 원래 설계와는 많이 다를 수 있습니다.

3. 클래스 재조직화 방법

    큰 클래스는 여러 작은 클래스로 나눌 수 있습니다.

    관련된 클래스들을 묶어 공통의 슈퍼클래스를 만들 수 있습니다.

    구체적인 슈퍼클래스를 추상 클래스로 바꿀 수 있습니다.

    내부 구조가 드러나는(white-box) 프레임워크를 외부 인터페이스만 제공하는(black-box) 프레임워크로 전환할 수 있습니다.

    이러한 변화는 클래스의 재사용성과 유지보수성을 높여줍니다.

4. 프레임워크와 클래스 계층구조

    모든 클래스 계층구조는 프레임워크가 될 가능성을 지니고 있습니다.

    white-box 프레임워크는 메서드 오버라이딩에 대한 일종의 규칙 집합이며, 단순한 클래스 계층과의 경계가 모호합니다.

    white-box 프레임워크는 기본적으로 프로그램의 뼈대(스켈레톤)이고, 서브클래스가 그 뼈대에 기능을 추가하는 형태입니다.

    이상적으로는 white-box 프레임워크가 발전해 black-box 프레임워크가 되지만, 실제로는 많은 프레임워크가 이 과정을 완성하지 못합니다.

5. white-box 프레임워크의 중요성

    white-box 프레임워크는 시스템 진화 과정에서 자연스러운 중간 단계입니다.

    특정 애플리케이션과 추상 설계 사이의 다리 역할을 하며, 시스템이 점차 추상화되고 구성 요소로 분리되는 길을 제공합니다.

    때로는 white-box 프레임워크가 최종 산물이 되기도 합니다.

    설계 전략으로는 white-box 접근법으로 시작하여 시스템이 발전함에 따라 내부 구조가 드러나는지 관찰하는 것이 좋습니다.

    white-box 프레임워크는 내부가 덜 엄격해 설계가 비교적 쉽습니다.

6. 추상화 발견의 어려움과 중요성

    새로운 추상화를 발견하는 것은 어렵습니다.

    일반적으로 여러 구체적인 사례에서 일반화하는 과정에서 추상화가 발견됩니다.

    경험 많은 설계자는 여러 구체적인 프로젝트를 거친 후에야 추상 클래스를 처음부터 설계할 수 있습니다.

    이는 인간이 구체적인 예를 통해 생각하는 경향이 있기 때문입니다.

    하지만 새로운 추상화를 발견하는 것은 매우 중요하며, 좋은 추상화를 발견하면 설계자는 매우 기뻐해야 합니다.

요약

Smalltalk에서 클래스와 프레임워크는 애플리케이션 개발 과정에서 점진적으로 진화하며, 추상화와 재사용성을 높이는 방향으로 발전합니다. white-box 프레임워크는 이 진화 과정의 중간 단계로서 매우 중요한 역할을 하며, 새로운 추상화를 발견하는 것은 경험과 반복적인 구체적 사례를 통한 일반화 과정에서 이루어집니다. 좋은 추상화는 설계의 질을 크게 향상시키므로 매우 가치 있는 발견입니다.
