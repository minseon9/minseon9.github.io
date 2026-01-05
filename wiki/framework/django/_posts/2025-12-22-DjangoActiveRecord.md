---
layout		: single
title		: Active Record - The Bad
summary	    :
date		: 2026-01-01 06:32:15 +0900
updated	    : 2026-01-02 03:27:00 +0900
tags		: architecture testing
toc	    	: true
public		: true
parent		:
latex		: false
resource	: BEE76E2C-1631-431E-BDCE-58856D264C18
author_profile  : false
classes	        : wide
---

# Django - Active Record
When I first started using Django, especially Django Rest Framework (DRF), my initial reaction was: “What the heck is going on?”
I had only defined a Django model and a ViewSet, and somehow a fully functional CRUD REST API was already there.  
No explicit service layer, no repository abstraction, yet everything just worked.

[Django’s design philosophies](https://docs.djangoproject.com/en/6.0/misc/design-philosophies/#include-all-relevant-domain-logic, Django - Deisign Philosophies) explicitly state that Django follows the [Active Record design pattern](https://www.martinfowler.com/eaaCatalog/activeRecord.html Martin Fowler's Active Record).  
In short, a Django model is responsible for both ORM behavior and domain behavior at the same time.  
Because of this, simply defining a model allows Django (with DRF) to wire up a ViewSet that maps incoming requests to the model, persists data, performs queries, and serializes results back into HTTP responses.  
For simple CRUD use cases, few frameworks feel as magical as Django.

But things felt very different when I started maintaining a _Django-ish_ legacy service.  

N+1 query issues were scattered across the entire codebase, to the point where tools like [nplusone](https://github.com/jmcarp/nplusone nplusone library) were no longer practical.  
At the same time, even writing small unit tests for domain logic required spinning up Django models, which quickly became time-consuming and painful.

So how did the service end up here?

# The Bad
Again, object—called a Model in Django—takes on two responsibilities; One is defining the schema for storing data in persistent storage, and the other is defining object behavior, in other words, the domain logic.  
On paper this looks convenient, but **it already violates the `SOLID` principles, especially the Single Responsibility Principle**.

This is a well-known drawback of the Active Record pattern.  
It creates a strong binding between the database and the application code.

As a codebase becomes more _Django-ish_, domain logic naturally starts to depend more and more on Django itself, and on data access concerns.  
Before long, **the persistence model is directly exposed to business logic**, and persistence concerns begin leaking everywhere.

## Managing the Persistence Context
Once the persistence model is exposed directly to business logic, data access no longer happens through clearly defined repository calls.  
Instead, it starts happening implicitly—through object field access, iterating over related collections, or calling ORM methods inline.

It’s not that this is always intentional.  
**It’s just very easy to do.**

If this isn’t considered early in development, it quietly turns into legacy and starts spreading across the entire domain logic before anyone really notices.  
A common symptom of this is ad-hoc fixes, like sprinkling `prefetch_related` calls after data has already been fetched.

Once the code reaches this point, handling issues like N+1 queries in a consistent way becomes difficult.  
Even after the problems are visible, tracing their root causes or applying systematic fixes is no longer straightforward.

```python
class OrderService:
    def process_orders(self):
        orders = get_orders()
        
        # Unable to modify the data retrieval logic,
        # a late optimization is applied in the middle of the domain logic
        prefetch_related_objects(orders, "items")

        for order in orders:
            for item in order.items.all():
                self.handle_item(item)
```

When these concerns aren’t handled in a single, cohesive place, developers are forced to keep N+1 issues in mind all the time.  
And inevitably, people make mistakes.  

As this kind of maintenance piles up, small holes start appearing everywhere.  
Eventually, it becomes hard to even tell which hole should be fixed first in order to escape this hell of thousands of queries.

## Test Doubles
The real pain point shows up when you try to write unit tests.  
The most critical issue lies in how difficult it is to **set up test doubles for Django models**.  

In general, when unit testing domain logic, anything outside the domain, such as persistence, is replaced with test doubles.  
With Django models, however, domain logic almost inevitably triggers `QuerySet` or `RelationManager` operations.  
That includes accessing `ManyToMany` relations, reverse `ForeignKey` lookups, or calling methods like `exists()`.

At that point, mocking just the model is no longer enough—you also have to mock QuerySets and relation managers.

```python
class OrderService:
    def process_order(self, order_id):
        order = get_order(order_id)

        if (not order.items.exists()) {
            # Do Something 
        }

        # Do Something 
```
In this example, `order.items` is a `RelatedManager`.
To unit test this logic, you now need to mock not only the Order model, but the RelatedManager itself.

What about the earlier `prefetch_related_objects` example?  
What does that function actually do to the order objects internally?  
If orders is replaced with a mock, which methods are you even supposed to stub to make this test meaningful?

At some point, the alternative starts to look tempting: _just use real Django models_.

But **the scope of the test quietly expands**. You’re no longer testing just domain logic, you’re also validating parts of the persistence layer.  
When such a test fails, identifying the root cause becomes much harder.  And that difficulty directly translates into higher maintenance costs and slower feedback cycles.

As a result, **failures become harder to localize, test maintenance costs increase, and the fast feedback loop that unit tests are supposed to provide is lost**.  
At that point, production issues are only a matter of time.


# Learned
Of course, it wasn’t that the organization made no attempt to isolate persistence concerns. Patterns like the Repository pattern were discussed and even partially applied.  
But once these issues had already spread across the system, fixing them turned out to be extremely difficult.

One thing that i learned was how I think about frameworks.  

Django’s strength is its ability to complete an entire application flow with just a few lines of code. But that strength comes with trade-offs.  
If those trade-offs had been fully acknowledged from the beginning, it would have been possible to write business logic that was far less dependent on Django itself.  

What feels hard to change should be treated as something that must remain changeable—and frameworks are no exception.  
A framework is a tool.  
**Business logic should not be tightly coupled to that tool.**  
