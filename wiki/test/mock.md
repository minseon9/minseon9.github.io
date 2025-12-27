---
layout		: single
title		: 
summary	: 
date		: 2025-12-26 14:54:14 +0900
updated	: 2025-12-26 16:09:46 +0900
category	: 
tags		: 
toc		: true
public		: true
parent		: 
latex		: false
resource	: BE1A4AA8-0CC6-4D54-87F4-AD44122CB2E5
author_profile :  false
classes	:  wide
---
#

https://hamletdarcy.blogspot.com/2007/10/mocks-and-stubs-arent-spies.html 

Test Double

https://blog.gangnamunni.com/post/how-we-improved-test-stability

https://web.archive.org/web/20220903043219/https://docs.microsoft.com/en-us/dotnet/core/testing/unit-testing-best-practices#lets-speak-the-same-language

Fake - A fake is a generic term that can be used to describe either a stub or a mock object. Whether it's a stub or a mock depends on the context in which it's used. So in other words, a fake can be a stub or a mock.

Mock - A mock object is a fake object in the system that decides whether or not a unit test has passed or failed. A mock starts out as a Fake until it's asserted against.

Stub - A stub is a controllable replacement for an existing dependency (or collaborator) in the system. By using a stub, you can test your code without dealing with the dependency directly. By default, a stub starts out as a fake.

http://xunitpatterns.com/Mocks,%20Fakes,%20Stubs%20and%20Dummies.html

SUT(System Under Test) http://xunitpatterns.com/SUT.html
Test Double http://xunitpatterns.com/Test%20Stub.html
Dummy Object http://xunitpatterns.com/Dummy%20Object.html
Test Stub http://xunitpatterns.com/Test%20Stub.html
Test Spy http://xunitpatterns.com/Test%20Spy.html
Mock Object http://xunitpatterns.com/Mock%20Object.html
Fake Object http://xunitpatterns.com/Fake%20Object.html

https://martinfowler.com/articles/mocksArentStubs.html


    Dummy objects are passed around but never actually used. Usually they are just used to fill parameter lists.
    Fake objects actually have working implementations, but usually take some shortcut which makes them not suitable for production (an in memory database is a good example).
    Stubs provide canned answers to calls made during the test, usually not responding at all to anything outside what's programmed in for the test.
    Spies are stubs that also record some information based on how they were called. One form of this might be an email service that records how many messages it was sent.
    Mocks are what we are talking about here: objects pre-programmed with expectations which form a specification of the calls they are expected to receive.


https://blog.cleancoder.com/uncle-bob/2014/05/14/TheLittleMocker.html

https://mockk.io/#spy

Mocks, fakes or stubs
A test double is software used in software test automation that satisfies a dependency so that the test need not depend on production code. A test double provides functionality via an interface that the software under test cannot distinguish from production code.


