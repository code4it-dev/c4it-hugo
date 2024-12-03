---
title: "C# Tip: Use TestCase to run similar unit tests with NUnit"
date: 2023-11-28
url: /csharptips/nunit-testcase
draft: false
categories:
  - CSharp Tips
tags:
  - CSharp
  - Tests
toc: false
summary: "Learn how to organize similar unit tests using the `TestCase` attribute in NUnit!"
keywords:
  - csharp
  - dotnet
  - testing
  - unit-tests
  - nunit
  - testcase
images:
  - /csharptips/nunit-testcase/featuredImage.png
---

In my opinion, Unit tests should be well structured and written even better than production code.

In fact, **Unit Tests act as a first level of documentation of what your code does** and, if written properly, can be the key to fixing bugs quickly and without adding regressions.

One way to improve readability is by grouping similar tests that only differ by the initial input but **whose behaviour is the same**.

Let's use a dummy example: some tests on a simple `Calculator` class that only performs sums on int values.

```cs
public static class Calculator
{
    public static int Sum(int first, int second) => first + second;
}
```

One way to create tests is by creating one test for each possible combination of values:

```cs
public class SumTests
{

    [Test]
    public void SumPositiveNumbers()
    {
        var result = Calculator.Sum(1, 5);
        Assert.That(result, Is.EqualTo(6));
    }

    [Test]
    public void SumNegativeNumbers()
    {
        var result = Calculator.Sum(-1, -5);
        Assert.That(result, Is.EqualTo(-6));
    }

    [Test]
    public void SumWithZero()
    {
        var result = Calculator.Sum(1, 0);
        Assert.That(result, Is.EqualTo(1));
    }
}
```

However, it's not a good idea: you'll end up with lots of identical tests (_DRY_, remember?) that add little to no value to the test suite. Also, this approach forces you to add a new test method to every new kind of test that pops into your mind.

When possible, we should generalize it. With NUnit, we can use the `TestCase` attribute to **specify the list of parameters passed in input** to our test method, including the expected result.

We can then simplify the whole test class by creating only one method that accepts the different cases in input and runs tests on those values.

```cs
[Test]
[TestCase(1, 5, 6)]
[TestCase(-1, -5, -6)]
[TestCase(1, 0, 1)]
public void SumWorksCorrectly(int first, int second, int expected)
{
    var result = Calculator.Sum(first, second);
    Assert.That(result, Is.EqualTo(expected));
}
```

By using `TestCase`, you can cover different cases by simply adding a new case without creating new methods.

Clearly, don't abuse it: use it only to **group methods with similar behaviour** - and don't add `if` statements in the test method!

There is a more advanced way to create a TestCase in NUnit, named `TestCaseSource` - but we will talk about it in a future C# tip 😉

## Further readings

If you are using NUnit, I suggest you read this article about custom equality checks - you might find it handy in your code!

🔗 [C# Tip: Use custom Equality comparers in Nunit tests | Code4IT](https://www.code4it.dev/csharptips/nunit-equals-custom-comparer/)

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_

## Wrapping up

I hope you enjoyed this article! Let's keep in touch on [Twitter](https://twitter.com/BelloneDavide) or [LinkedIn](https://www.linkedin.com/in/BelloneDavide/)! 🤜🤛

Happy coding!

🐧
