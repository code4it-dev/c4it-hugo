---
title: "C# Tip: Mark a class as Sealed to prevent subclasses creation"
date: 2024-07-16
url: /csharptips/sealed-classes
draft: false
categories:
  - CSharp Tips
tags:
  - CSharp
toc: false
summary: "The sealed keyword is often ignored, yet it can be important to define a proper class design."
keywords:
  - csharp
  - dotnet
  - sealed
  - keywords
  - class
  - design
  - extensibility
images:
  - /csharptips/sealed-classes/featuredImage.png
---

The O in SOLID stands for the Open-closed principle: according to the official definition, "software entities (classes, modules, functions, etc.) should be open for extension, but closed for modification."

To extend a class, you usually create a subclass, overriding or implementing methods from the parent class.

## Extend functionalities by using subclasses

The most common way to extend a class is to mark it as `abstract` :

```cs
public abstract class MyBaseClass
{
  public DateOnly Date { get; init; }
  public string Title { get; init; }

  public abstract string GetFormattedString();

  public virtual string FormatDate() => Date.ToString("yyyy-MM-dd");
}
```

Then, to extend it you create a subclass and define the internal implementations of the _extention_ points in the parent class:

```cs
public class ConcreteClass : MyBaseClass
{
  public override string GetFormattedString() => $"{Title} | {FormatDate()}";
}
```

As you know, this is the simplest example: overriding and implementing methods from an abstract class.

You can override methods from a concrete class:

```cs
public class MyBaseClass2
{
  public DateOnly Date { get; init; }
  public string Title { get; init; }

  public string GetFormattedString() => $"{Title} ( {FormatDate()} )";

  public string FormatDate() => Date.ToString("yyyy-MM-dd");
}

public class ConcreteClass2 : MyBaseClass2
{
  public new string GetFormattedString() => $"{Title} | {FormatDate()}";
}
```

Notice that even though there are no abstract methods in the base class, you can override the content of a method by using the `new` keyword.

## Prevent the creation of subclasses using the sealed keyword

Especially when exposing classes via NuGet, you want to prevent consumers from creating subclasses and accessing the internal status of the structures you have defined.

To prevent classes from being extended, you must mark your class as `sealed`:

```cs
public sealed class MyBaseClass3
{
  public DateOnly Date { get; init; }
  public string Title { get; init; }

  public string GetFormattedString() => $"{Title} ( {FormatDate()} )";

  public string FormatDate() => Date.ToString("yyyy-MM-dd");
}

public class ConcreteClass3 : MyBaseClass3
{
}
```

This way, even if you declare `ConcreteClass3` as a subclass of `MyBaseClass3`, you won't be able to compile the application:

![Compilation error when trying to extend a sealed class](sealed-class-compilation-error.png)

## 4 reasons to mark a class as sealed

Ok, it's easy to prevent a class from being extended by a subclass. But what are the benefits of having a `sealed` class?

Marking a C# class as `sealed` can be beneficial for several reasons:

1. **Security by design**: By marking a class as sealed, you prevent consumers from creating subclasses that can alter or extend critical functionalities of the base class in unintended ways.
2. **Performance improvements**: The compiler can optimize sealed classes more effectively because it knows there are no subclasses. This will not bring substantial performance improvements, but it can still help if every nanosecond is important.
3. **Explicit design intent**: Sealing the class communicates to other developers that the class is not intended to be extended or modified. If they want to use it, they accept they cannot modify or extend it, as it has been designed in that way by purpose.

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_

## Wrapping up

I hope you enjoyed this article! Let's keep in touch on [Twitter](https://twitter.com/BelloneDavide) or [LinkedIn](https://www.linkedin.com/in/BelloneDavide/)! 🤜🤛

Happy coding!

🐧
