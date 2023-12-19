---
title: "4 ways to create Unit Tests without Interfaces in C#"
date: 2023-12-12
url: /blog/unit-tests-without-interfaces
draft: false
categories:
  - Blog
tags:
  - CSharp
  - Dotnet
  - Tests
toc: true
summary: "C# devs have the bad habit of creating interfaces for every non-DTO class because «we need them for mocking!». Are you sure it's the only way?"
images:
  - /blog/unit-tests-without-interfaces/featuredImage.png
---

One of the most common traits of C# developers is the **excessive usage of interfaces**.

For every non-DTO class we define, we usually also create the related interface. Most of the time, we don't need it because we have multiple implementations of an interface. Instead, **we say that we need an interface to enable mocking**.

That's true; it's pretty straightforward to mock an interface: lots of libraries, like Moq and NSubstitute, allow you to create mocks and pass them to the class under test. What if there were another way?

In this article, we will learn how to have complete control over a dependency while having the concrete class, and not the related interface, injected in the constructor.

## C# devs always add interfaces, just in case

If you're a developer like me, you've been taught something like this:

> One of the SOLID principles is Dependency Inversion; to achieve it, you need Dependency Injection. The best way to do that is by creating an interface, injecting it in the consumer's constructor, and then mapping the interface and the concrete class.

Sometimes, somebody explains that **we don't need interfaces to achieve Dependency Injection**. However, there are generally two arguments proposed by those who keep using interfaces everywhere: the "in case I need to change the database" argument and, even more often, the "without interfaces, I cannot create mocks".

Are we sure?

### The "Just in case I need to change the database" argument

One phrase that I often hear is:

> Injecting interfaces allows me to change the concrete implementation of a class without worrying about the caller. You know, just in case I had to change the database engine...

Yes, that's totally right - using interfaces, you can change the internal implementation in a bat of an eye.

Let's be honest: **in all your career, how many times have you changed the underlying database?** In my whole career, it happened just once: we tried to build a solution using Gremlin for CosmosDB, but it turned out to be too expensive - so we switched to a simpler MongoDB.

But, all in all, it wasn't _only_ thanks to the interfaces that we managed to switch easily; it was because we strictly separated the classes and did not leak the models related to Gremlin into the core code. We structured the code with a sort of Hexagonal Architecture, way before this term became a trend in the tech community.

Still, **interfaces can be helpful, especially when dealing with multiple implementations of the same methods** or when you want to wrap your head around the methods, inputs, and outputs exposed by a module.

### The "I need to mock" argument

Another one I like is this:

> Interfaces are necessary for mocking dependencies! Otherwise, how can I create Unit Tests?

Well, I used to agree with this argument. I was used to mocking interfaces by using libraries like Moq and defining the behaviour of the dependency using the `SetUp` method.

It's still a valid way, but my point here is that that's not the only one!

One of the simplest trick is to mark your classes as `abstract`. But... this means you'll end up with every single class marked as abstract. Not the best idea.

We have other tools in our belt!

## A realistic example: Dependency Injection without interfaces

Let's start with a _real-ish_ example.

We have a `NumbersRepository` that just exposes one method: `GetNumbers()`.

```cs
public class NumbersRepository
{
    private readonly int[] _allNumbers;

    public NumbersRepository()
    {
        _allNumbers = Enumerable.Range(0, int.MaxValue).ToArray();
    }

    public IEnumerable<int> GetNumbers() => Random.Shared.GetItems(_allNumbers, 50);
}
```

Generally, one would be tempted to add an interface with the same name as the class, `INumbersRepository`, and include the `GetNumbers` method in the interface definition.

We are not going to do that - the interface is not necessary, so why clutter the code with something like that?

Now, for the consumer. We have a simple `NumbersSearchService` that accepts, via Dependency Injection, an instance of `NumbersRepository` (yes, the concrete class!) and uses it to perform a simple search:

```cs
public class NumbersSearchService
{
    private readonly NumbersRepository _repository;

    public NumbersSearchService(NumbersRepository repository)
    {
        _repository = repository;
    }

    public bool Contains(int number)
    {
        var numbers = _repository.GetNumbers();
        return numbers.Contains(number);
    }
}
```

To add these classes to your ASP.NET project, you can add them in the DI definition like this:

```cs
builder.Services.AddSingleton<NumbersRepository>();
builder.Services.AddSingleton<NumbersSearchService>();
```

Without adding any interface.

Now, how can we test this class without using the interface?

## Way 1: Use the "virtual" keyword in the dependency to create stubs

We can create a subclass of the dependency, even if it is a concrete class, by overriding just some of its functionalities.

For example, we can choose to mark the `GetNumbers` method in the `NumbersRepository` class as `virtual`, making it easily overridable from a subclass.

```diff
public class NumbersRepository
{
    private readonly int[] _allNumbers;

    public NumbersRepository()
    {
        _allNumbers = Enumerable.Range(0, 100).ToArray();
    }

-    public IEnumerable<int> GetNumbers() => Random.Shared.GetItems(_allNumbers, 50);
+    public virtual IEnumerable<int> GetNumbers() => Random.Shared.GetItems(_allNumbers, 50);
}
```

Yes: **we can mark a method as `virtual` even if the class is concrete!**

Now, in our Unit Tests, we can create a subtype of `NumbersRepository` to have complete control of the `GetNumbers` method:

```cs
internal class StubNumberRepo : NumbersRepository
{
    private IEnumerable<int> _numbers;

    public void SetNumbers(params int[] numbers) => _numbers = numbers;

    public override IEnumerable<int> GetNumbers() => _numbers;
}
```

We have overridden the `GetNumbers` method, but to do so, we had to include a new method, `SetNumbers`, to define the expected result of the former method.

We then can use it in our tests like this:

```cs
[Test]
public void Should_WorkWithStubRepo()
{
    // Arrange
    var repository = new StubNumberRepo();
    repository.SetNumbers(1, 2, 3);
    var service = new NumbersSearchService(repository);

    // Act
    var result = service.Contains(3);

    // Assert
    Assert.That(result, Is.True);
}
```

You now have the full control over the subclass. But **this approach comes with a problem**: if you have multiple methods marked as `virtual`, and you are going to use all of them in your test classes, then you will need to override every single method (to have control over them) and work out how to decide whether to use the concrete method or the stub implementation.

For example, we can update the `StubNumberRepo` to let the consumer choose if we need the dummy values or the base implementation:

```cs
internal class StubNumberRepo : NumbersRepository
{
    private IEnumerable<int> _numbers;
    private bool _useStubNumbers;

    public void SetNumbers(params int[] numbers)
    {
        _numbers = numbers;
        _useStubNumbers = true;
    }

    public override IEnumerable<int> GetNumbers()
    {
        if (_useStubNumbers)
            return _numbers;
        return base.GetNumbers();
    }
}
```

With this approach, by default, we use the concrete implementation of `NumbersRepository` because `_useStubNumbers` is `false`. If we call the `SetNumbers` method, we also specify that we don't want to use the original implementation.

## Way 2: Use the virtual keyword in the service to avoid calling the dependency

Similar to the previous approach, we can mark some methods **of the caller** as `virtual` to allow us to change parts of our class while keeping everything else as it was.

To achieve it, we have to refactor a little our Service class:

```diff
public class NumbersSearchService
{
    private readonly NumbersRepository _repository;

    public NumbersSearchService(NumbersRepository repository)
    {
        _repository = repository;
    }

    public bool Contains(int number)
    {
-       var numbers = _repository.GetNumbers();
+       var numbers = GetNumbers();
        return numbers.Contains(number);
    }

+    public virtual IEnumerable<int> GetNumbers() => _repository.GetNumbers();
}
```

The key is that we moved the calls to the external references to a separate method, marking it as `virtual`.

This way, we can create a stub class of the Service itself without the need to stub its dependencies:

```cs
internal class StubNumberSearch : NumbersSearchService
{
    private IEnumerable<int> _numbers;
    private bool _useStubNumbers;

    public StubNumberSearch() : base(null)
    {
    }

    public void SetNumbers(params int[] numbers)
    {
        _numbers = numbers.ToArray();
        _useStubNumbers = true;
    }

    public override IEnumerable<int> GetNumbers()
        => _useStubNumbers ? _numbers : base.GetNumbers();
}
```

The approach is almost identical to the one we saw before. The difference can be seen in your tests:

```cs
[Test]
public void Should_UseStubService()
{
    // Arrange
    var service = new StubNumberSearch();
    service.SetNumbers(12, 15, 30);

    // Act
    var result = service.Contains(15);

    // Assert
    Assert.That(result, Is.True);
}
```

There is a problem with this approach: many devs (correctly) add null checks in the constructor to ensure that the dependencies are not null:

```cs
public NumbersSearchService(NumbersRepository repository)
{
    ArgumentNullException.ThrowIfNull(repository);
    _repository = repository;
}
```

While this approach makes it safe to use the `NumbersSearchService` reference within the class' methods, it also stops us from creating a `StubNumberSearch`. Since we want to create an instance of `NumbersSearchService` without the burden of injecting all the dependencies, we call the base constructor passing `null` as a value for the dependencies. If we validate against null, the stub class becomes unusable.

There's a simple solution: adding a **protected empty constructor**:

```cs
public NumbersSearchService(NumbersRepository repository)
{
    ArgumentNullException.ThrowIfNull(repository);
    _repository = repository;
}

protected NumbersSearchService()
{
}
```

We mark it as `protected` because we want that only subclasses can access it.

## Way 3: Use the "new" keyword in methods to hide the base implementation

Similar to the `virtual` keyword is the `new` keyword, which can be applied to methods.

We can then remove the `virtual` keyword from the base class and hide its implementation by marking the overriding method as `new`.

```diff
public class NumbersSearchService
{
    private readonly NumbersRepository _repository;

    public NumbersSearchService(NumbersRepository repository)
    {
        ArgumentNullException.ThrowIfNull(repository);
        _repository = repository;
    }

    public bool Contains(int number)
    {
        var numbers = _repository.GetNumbers();
        return numbers.Contains(number);
    }

-    public virtual IEnumerable<int> GetNumbers() => _repository.GetNumbers();
+    public IEnumerable<int> GetNumbers() => _repository.GetNumbers();
}
```

We have restored the original implementation of the Repository.

Now, we can update the stub by adding the `new` keyword.

```diff
internal class StubNumberSearch : NumbersSearchService
{
    private IEnumerable<int> _numbers;
    private bool _useStubNumbers;

    public void SetNumbers(params int[] numbers)
    {
        _numbers = numbers.ToArray();
        _useStubNumbers = true;
    }

-    public override IEnumerable<int> GetNumbers() => _useStubNumbers ? _numbers : base.GetNumbers();
+    public new IEnumerable<int> GetNumbers() => _useStubNumbers ? _numbers : base.GetNumbers();
}
```

We haven't actually solved any problem except for one: we can now avoid cluttering all our classes with the `virtual` keyword.

> **A question for you!** Is there any difference between using the `new` and the `virtual` keyword? When you should pick one instead of the other? Let me know in the comments section! 📩

## Way 4: Mock concrete classes by marking a method as virtual

Sometimes, I hear developers say that _mocks are the absolute evil_, and you should never use them.

Oh, come on! Don't be so silly!

That's true, when using mocks you are writing tests on a irrealistic environment. But, well, that's exactly the point of having mocks!

If you think about it, at school, during Science lessons, we were taught to do our scientific calculations using approximations: ignore the air resistance, ignore friction, and so on. We knew that that world did not exist, but we removed some parts to make it easier to validate our hypothesis.

In my opinion, it's the same for testing. Mocks are useful to have full control of a _specific_ behaviour. Still, **only relying on mocks makes your tests pretty brittle: you cannot be sure that your system is working under real conditions.**

That's why, as I explained [in a previous article](https://www.code4it.dev/architecture-notes/testing-pyramid-vs-testing-diamond/), I prefer the Testing Diamond over the Testing Pyramid. In many real cases, five Integration Tests are more valuable than fifty Unit Tests.

But still, mocks can be useful. How can we use them if we don't have _interfaces_?

Let's start with the basic example:

```cs
public class NumbersRepository
{
    private readonly int[] _allNumbers;

    public NumbersRepository()
    {
        _allNumbers = Enumerable.Range(0, 100).ToArray();
    }

    public IEnumerable<int> GetNumbers() => Random.Shared.GetItems(_allNumbers, 50);
}

public class NumbersSearchService
{
    private readonly NumbersRepository _repository;

    public NumbersSearchService(NumbersRepository repository)
    {
        ArgumentNullException.ThrowIfNull(repository);
        _repository = repository;
    }

    public bool Contains(int number)
    {
        var numbers = _repository.GetNumbers();
        return numbers.Contains(number);
    }
}
```

If we try to use Moq to create a mock of `NumbersRepository` (again, the concrete class) like this:

```cs
[Test]
public void Should_WorkWithMockRepo()
{
    // Arrange
    var repository = new Moq.Mock<NumbersRepository>();
    repository.Setup(_ => _.GetNumbers()).Returns(new int[] { 1, 2, 3 });
    var service = new NumbersSearchService(repository.Object);

    // Act
    var result = service.Contains(3);

    // Assert
    Assert.That(result, Is.True);
}
```

It will fail with this error:

> System.NotSupportedException : Unsupported expression: _ => _.GetNumbers()
> Non-overridable members (here: NumbersRepository.GetNumbers) may not be used in setup / verification expressions.

This error occurs because the implementation `GetNumbers` is fixed as defined in the `NumbersRepository` class and cannot be overridden.

Unless you mark it as `virtual`, as we did before.

```diff
public class NumbersRepository
{
    private readonly int[] _allNumbers;

    public NumbersRepository()
    {
        _allNumbers = Enumerable.Range(0, 100).ToArray();
    }

-    public IEnumerable<int> GetNumbers() => Random.Shared.GetItems(_allNumbers, 50);
+    public virtual IEnumerable<int> GetNumbers() => Random.Shared.GetItems(_allNumbers, 50);
}
```

Now the test passes: **we have successfully mocked a concrete class!**

## Further readings

Testing is a crucial part of any software application. I personally write Unit Tests even for throwaway software - this way, I can ensure that I'm doing the correct thing without the need for manual debugging.

However, one part that is often underestimated is the code quality of tests. **Tests should be written even better than production code.** You can find more about this topic here:

🔗 [Tests should be even more well-written than production code | Code4IT](https://www.code4it.dev/cleancodetips/tests-should-be-readable-too/)

Also, Unit Tests are not enough. You should probably write more Integration Tests than Unit Tests. This one is a testing strategy called Testing Diamond.

🔗 [Testing Pyramid vs Testing Diamond (and how they affect Code Coverage) | Code4IT](https://www.code4it.dev/architecture-notes/testing-pyramid-vs-testing-diamond/)

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_

Clearly, you can write Integration Tests for .NET APIs easily. In this article, I explain how to create and customize Integration Tests using NUnit:

🔗 [Advanced Integration Tests for .NET 7 API with WebApplicationFactory and NUnit | Code4IT](https://www.code4it.dev/blog/advanced-integration-tests-webapplicationfactory/)

## Wrapping up

In this article, we learned that it's not necessary to create interfaces for the sake of having mocks.

We have different other options.

Honestly speaking, I'm still used to creating interfaces and using them with mocks.

I find it easy to do, and this approach provides a quick way to create tests and drive the behaviour of the dependencies.

Also, I recognize that interfaces created for the sole purpose of mocking are quite pointless: we have learned that there are other ways, and we should consider trying out these solutions.

Still, interfaces are quite handy for two "non-technical" reasons:

- using interfaces, you can understand in a glimpse what are the operations that you can call in a clean and concise way;
- interfaces and mocks allow you to easily use TDD: while writing the test cases, you also define what methods you need and the expected behaviour. I know you can do that using stubs, but I find it easier with interfaces.

I know, this is a controversial topic - **I'm not saying that you _should_ remove all your interfaces (I think it's a matter of personal taste, somehow!), but with this article, I want to highlight that you _can_ avoid interfaces.**

I hope you enjoyed this article! Let's keep in touch on [Twitter](https://twitter.com/BelloneDavide) or [LinkedIn](https://www.linkedin.com/in/BelloneDavide/)! 🤜🤛

Happy coding!

🐧
