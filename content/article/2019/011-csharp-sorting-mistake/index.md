---
title: C# sorting - a subtle mistake
date: 2019-11-15
url: /blog/csharp-sorting-mistake
draft: false
categories:
  - Blog
tags:
  - CSharp
  - dotnet
toc: true
summary: Is it true that the inverse of a negative number is always a positive number? If you think it's true, you might get a subtle error while implementing comparison.
keywords:
  - csharp
  - sorting
images:
  - /blog/csharp-sorting-mistake/featuredImage.png
---

Recently I've learned a _funny_ (ehm...) thing.

## The guilty

**It isn't true that the inverse of a negative number is a positive number**. Or, equally, that _(x < 0) => (-x > 0)_.

You could say «Hey, -(-5) == 5». Yes, that's true.
We can test it this way:

```cs
[Test]
public void TestInverse()
{
    int x = -5;
    int y = -x;
    Assert.IsTrue(y > 0);
}
```

But what if we consider **edge cases**?

```cs
[Test]
public void TestInverse_EdgeCase()
{
    int x = int.MinValue;
    int y = -x;
    Assert.IsTrue(y > 0);
}
```

It will fail. Miserably.

## The reason

The reason is simple: **the sign occupies space**.
In fact, the range of int is _-2,147,483,648_ to _2,147,483,647_. The inverse of _-2,147,483,648_ would cause overflow and returns the same value.

## The lesson

Why am I pointing at this?

Imagine you are implementing a `CompareTo(x, y)` method, you know, the usual one that returns _0_ if the values are considered equal, _-1_ if x < y and _1_ if x > y.

You could use this method to sort an array.
Now you want to sort that array descending. What to do?

This edge case explains why it is a terrible idea to use `CompareTo(-x, -y)`. Results can be unexpected.

The best solution is to simply switch the parameters: `CompareTo(y, x)`.

_This article first appeared on [Code4IT](https://www.code4it.dev/)_

## Conclusion

This example teaches us that we must know the basics of a language not only in terms of syntax but also in terms of inner handling. If we just used _int_ without knowing how it is made, we would fall into this mistake without knowing why.
