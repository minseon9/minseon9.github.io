---
layout      : single
title       : 
summary     : 
date        : 2025-07-08 13:03:16 +0900
updated     : 2025-07-08 14:08:00 +0900
category    : 
tags        : 
toc         : true
public      : true
parent      : 
latex       : false
resource    : 7C7E7479-FAF3-49F0-BDDA-16E154603A6E
---
* TOC
{:toc}


# Content
## Spring IoC

## What is Control
Control ?
https://en.wikipedia.org/wiki/Control_flow

In the context of programming, control refers to the ability to determine the order in which instructions, statements, or function calls are executed within a program. This concept is known as control flow (or flow of control), and it dictates how a program moves from one statement to another, often based on conditions, loops, or external events

.

Control is exercised through structures such as:

    Sequential execution: Running code line by line in order.

    Decision structures: Using conditional statements like if, else, or switch to choose between different paths.

    Looping structures: Repeating certain code blocks with constructs like for, while, or do-while loops

    .

In summary, control in programming is about directing the flow of execution so that a program can make decisions, repeat actions, and respond to various scenarios dynamically

Control은 program의 실행 순서. 조건에 따라 다른 statement를 실행할 수도 있고(choice), 특정 조건까지 statment를 반복 실행할 수도 있고(loop), 분리된 statement를 호출할 수도 있다(function call; subroutines, corotines).
program에서 어떤 statememt, function call을 실행할거냐를 control이라고 하고,
program의 전체 control을 control flow(flow of control)이라 한다.

Control flow refers to the order in which the instructions of a program are executed. It determines how a program moves from one statement to another, based on certain conditions and decisions.
How does control flow affect program execution?

Control flow decides the path your program takes. It helps your program make decisions, loop through instructions, and execute code blocks based on conditions, making it dynamic and responsive to different scenarios.
https://www.lenovo.com/us/en/glossary/control-flow/?orgRef=https%253A%252F%252Fwww.perplexity.ai%252F


---  

## Procedural Programming

```ruby
  #ruby
  puts 'What is your name?'
  name = gets
  process_name(name)
  puts 'What is your quest?'
  quest = gets
  process_quest(quest)
```  
In this interaction, my code is in control: it decides when to ask questions, when to read responses, and when to process those results.
---  



## Inversion of Control 
https://scispace.com/explore/journals/journal-of-object-oriented-programming-15nxtmf4
Object-Oriented Frameworks A survey of methodological issues - Michael Mattsson (https://www.researchgate.net/publication/2238535_Object-Oriented_Frameworks)



## Framework vs. Library



## Dependency Injection


## Etymology


#
Then, Inversion of Control means external source such as framework takes control, not custom code i writed?

Yes, Inversion of Control (IoC) means that an external source such as a framework or container takes over the control flow of your application, rather than your custom code managing it directly. In traditional programming, you write code that calls libraries and manages the sequence of actions. With IoC, the framework or container is in charge of creating objects, managing their lifecycles, and invoking your custom code when needed

.

This approach is often described by the "Hollywood Principle": "Don't call us, we'll call you." Your code provides the business logic, but the framework decides when and how to execute it
. This inversion makes your code more modular, decoupled, and easier to maintain, as the framework handles the orchestration and dependencies. Dependency Injection is a common technique used to implement IoC, where the framework injects dependencies into your components rather than having your code create them directly

.
---  

Then, Can i define Library as set of functions that in my control ?

You can define a library as a set of pre-written functions, routines, or modules that you control by deciding when and how to use them in your code
. When using a library, your custom code is in charge of the program’s flow—you call library functions as needed, and the library does not dictate the structure or sequence of your application

. This is in contrast to a framework, which typically takes control of the flow and calls your code at specific points.

In summary:

    Library: You control the flow; you call the library’s functions when you need them

    .

    Framework: The framework controls the flow and calls your code as required.

This distinction is a key aspect of Inversion of Control.
관련
Can I consider a library as a set of functions under my control for reuse
How do I ensure the functions in my library are well-organized and manageable
What limitations exist when defining a library solely as functions I control
How does controlling function implementation affect library flexibility and sharing
In what scenarios is creating a custom function set better than using existing libraries

In application architecture, the traditional definition of "inversion" in Inversion of Control (IoC) refers to a reversal of the conventional flow of control in a software system. Traditionally, in procedural programming, your code is in charge: it calls libraries and manages the sequence of operations. With IoC, this is "inverted"—an external source, such as a framework or container, takes over the control flow and calls your custom code when needed

.

Key aspects of the traditional definition:

means the application code is no longer the main driver; instead, the framework or container orchestrates the flow and lifecycle of components
