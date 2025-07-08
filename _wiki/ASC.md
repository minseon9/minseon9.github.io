---
layout      : single
title       : 
summary     : 
date        : 2025-07-08 22:18:58 +0900
updated     : 2025-07-08 22:19:25 +0900
category    : 
tags        : 
toc         : true
public      : true
parent      : 
latex       : false
resource    : D1BE887D-8411-433B-909B-A2CDEC9B8CE8
---
* TOC
{:toc}

#Abstract classes
Abstract classes are distinguished from concrete classes since they can not
be used for creating instances. Classes that have this ability are called
instantiable or concrete classes. In [Hur94] the so called Abstract Superclass
Rule (ASC), “All superclasses must be abstract” was evaluated from differ-
ent aspects. Aspects covered in the evaluation were expressiveness, data
modelling, evolution, reusability and simplicity.
The expressiveness of an object-oriented design is not reduced if the ASC-
rule is applied, since every class structure that contains a concrete superclass
can be transformed into an equivalent class structure conforming to the
ASC-rule.
Regarding data modelling, three factors were identified where the ASC-rule
makes a difference: the notion of inheritance, multiple inheritance and
classes as collections of objects. The ASC-rule allows both the “concept-ori-
ented view”, i.e is-a, and the “program-oriented view”, i.e implementation,
of inheritance. Multiple inheritance is motivated by the distinction of inter-
face inheritance and data inheritance. When a class only inherits a set of
interfaces defined in the superclass, this is called interface inheritance and
when only a set of instance variables is inherited, it is called data inherit-
ance. These two views of inheritance of necessity means that superclasses
are abstract. The aspect of classes as collections of objects motivates the
ASC-rule by the following example. Consider the situation at the left in fig-
ure 3.7. In that case it is not possible to define a variable that consists of
objects of class A excluding objects of classes B and C. This because if
objects of class A are allowed, so must object of classes B and C be allowed.
However, in the situation at the right, it is possible to define variables that
only consist of objects from class A’. Thus, from a data modelling perspec-
tive, the ASC-rule is highly motivated.
The evolutionary aspect covers the dynamics of a software system. How will
the ASC-rule conform to a changing system? Changes that can take place
are that there will be new subclasses, and modifications of properties of
existing classes. In the case of subclassing there will be problems if existing
class libraries are used and the source for the library is not available. How-
ever, the ASC-rule will work properly if it is used in conjunction with the
abstract library rule [Hur94]. For avoiding later restructuring of the hierar-
67
Important Design Elements
chy in the library, the following four guidelines have to be followed.
Depending on the expected use of the class, for each instantiable class:
• If the class is to serve for instantiation only, provide a concrete class
• If the class is to serve for subclassing only, provide an abstract class
• If the class is to serve for both subclassing and instantiation, provide
both an abstract superclass and a concrete subclass
• If the expected use of a class cannot be predetermined, it is safer to
provide both an abstract and a concrete class.
Using the ASC-rule in conjunction with the abstract library rule will cost
extra in maintenance.
Regarding the aspect of modifying class properties, the ASC-rule is useful
for the program-oriented view of inheritance, and it also allows for easier
change of representation.
The reusability aspect is very well captured by the ASC-rule since both class
libraries and object-oriented frameworks are striving to have a high degree
of abstraction. One of the goals of library and framework design is to make a
generalization of a concept and capture the concept in an abstract class to
make it suitable for reuse in later applications.
Finally, the ASC-rule simplifies the object-oriented development process in
a number of ways. It is possible to identify which classes can be instantiated
or not, adding and deleting properties as well as changing representations.
To summarize, the Abstract Superclass Rule, has both it advantages and dis-
advantages. In the aspects of data modelling, evolution and reusability
(which are highly relevant for framework development), the application of
the ASC-rule is likely.
A
B C
A
A’ B C
Abstract class
Figure 3.7: Concrete superclass transformed to abstract superclass
68
Framework Development
Related to the ASC-rule is the idea of object types [Mat94][Ohl93a]. Here
two classes are considered to belong to the same object type if they have the
same public interface. The rule introduced says that if the public interface
has to be extended, the derivation should result in an abstract class and then
perform another derivation that will result in a concrete class. Following this
principle will make it possible to reuse existing classes and make it easier to
utilize the dynamic binding facility.
To summarize, the use of abstract classes is a useful mean for achieving
reusability, proper use of inheritance and utilization of dynamic binding. All
those aspects are relevant to the design of an object-oriented framework. 
