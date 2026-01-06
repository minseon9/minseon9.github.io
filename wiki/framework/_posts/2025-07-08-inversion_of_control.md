---
layout		: single
title		: Inversion of Control(IoC)
summary		: 
date		: 2025-07-08 15:23:13 +0900
updated		: 2025-07-08 15:23:13 +0900
tags		: etymology 
toc		    : true
public		: true
parent		: 
latex		: false
resource	: 3858B342-FDFF-412E-95CB-D5CDFC470FA1
author_profile 	:  false
classes		:  wide
---

First thing you'll see in Spring Framework documents is [IoC Container and Bean](https://docs.spring.io/spring-framework/reference/core/beans/introduction.html Spring Framework - Introduction to the Spring IoC Container and Beans).  
IoC is not specific to Spring. Most modern frameworks are built around this idea so, I want to clearly organize the concept of Inversion of Control before going any further.  

This post focuses on where the concept of IoC came from; its etymology, historical background, and the papers or ideas that originally introduced it.  

## Control Flow
Code we write is usually executed sequentially, from top to bottom.  
Depending on conditions, some parts of the code may be skipped, or the same code may be iterated until a certain condition is satisfied.  
Control flow is overall structure of statements-how the program decides which statements to execute and in what order.  

The concepts from here on are all about who is in control of the flow.  

## Procedural Control Flow
An example below is just a simple program that reads user input and prints the result.  
```c
#include <stdio.h>

int main() {
    int a, b;

    scanf("%d %d", &a, &b);
    printf("%d\n", a + b);

    return 0;
}
```  
I decide the entire execution flow-when to receive user input and what to do with it.
That means **my code is in control of the flow**.

A library is simply code reuse in that I control when and how the library’s pre-defined functions are executed.  

## Inversion of Control
Inversion of Control is a general pattern used by frameworks.  
The key idea is that the framework—not my program—controls the execution flow.  
The framework decides when and how my code is called.  

For example, in a framework used to build a web application server, the framework controls the flow of handling incoming requests.
We only define specific parts, such as middleware or application domain logic (business logic).  
The framework processes each request according to a predefined design and simply invokes the user-defined code at the appropriate points.  

In this sense, **a framework is an approach to reusing software**.  
**By applying Inversion of Control, frameworks make it possible to reuse not just code, but software design itself**.
 
### Framework, Re-use of Design
Quoted from [Framework, Re-use of Design](http://www.laputan.org/drc/drc.html  Ralph E. Johnson & Brian Foote - Framework, Re-use of Design)
> One important characteristic of a framework is that **the methods defined by the user to tailor the framework will often be called from within the framework itself, rather than from the user's application code**.  
> The framework often plays the role of the main program in coordinating and sequencing application activity.  
> **This inversion of control gives frameworks the power to serve as extensible skeletons**.  
> The methods supplied by the user tailor the generic algorithms defined in the framework for a particular application.

> One of the most important kinds of reuse is **reuse of designs**.  
> A collection of abstract classes can be used to express an abstract design.  
> The design of a program is usually described in terms of the program's components and the way they interact.

### Object-Oriented Frameworks A survey of methodological issues
Quoted from [Object-Oriented Frameworks A survey of methodological issues](https://www.researchgate.net/publication/2238535_Object-Oriented_Frameworks  Michael Mattsson - Object-Oriented Frameworks A survey of methodological issues)  

> A framework then implies reuse of both code and design. A framework particularly emphasizes those parts of the application domain that will remain stable and the relationships and interactions among those parts, i.e the framework is in charge of the flow of control.

This document covers a wide range of topics, from framework design patterns and core concepts to how frameworks should be developed, documented, and used.  
It also helped me understand the **shared philosophies that run from object-oriented programming to the emergence of modern frameworks**.

> Reusable assets in object-orientation can be found in a continuum ranging from objects and classes to design patterns and object-oriented frameworks,
the latter which represent the state-of-the-art in object-oriented reusable assets.

**In short, this is the history of reuse**.

With the introduction of objects and classes, data and operations were encapsulated together, and these classes were packaged into **class libraries, enabling code reuse**.  
However, reuse based on class libraries had its limitations: excessive use of inheritance made structures hard to understand, and since all control responsibility remained with the developer, such systems were prone to errors.

This led to the emergence of object-oriented frameworks.  
**A framework is a reusable design or subsystem, defined by a set of abstract classes and their collaborations**.  
In other words, a framework provides a default implementation for a “standard” application, enabling the reuse of both code and design.  

## Dependency Injection

> Inversion of Control is too generic a term, and thus people find it confusing. 
> As a result with a lot of discussion with various IoC advocates we settled on the name Dependency Injection.

Quoted from [Martin Folwer Article](https://martinfowler.com/articles/injection.html Martin Folwer - Inversion of Control Containers and the Dependency Injection pattern)  

In modern web application server frameworks like Spring, developers do not create dependent objects themselves.  
In other words, the responsibility for managing the lifecycle and flow of these objects does not lie with the application code.  
Instead, the `Container`-also called `Injector`-takes charge of creating and managing them on behalf of the application.  
Developers only need to define the dependencies.  
Because the Container explicitly injects these dependencies, this pattern is called `Dependency Injection(DI)`.  

Because IoC and DI are often discussed together, the two concepts tend to get mixed up. Same for me.  
**IoC is the concept; DI is one way frameworks implement it**.  


## Hollywood Principle
> “Don't call us, we'll call you”  

The Hollywood Principle and Inversion of Control refer to the same concept.
We don’t directly process HTTP API requests ourselves. Instead, the framework receives the request, manages the overall flow.  
**The framework calls us**.