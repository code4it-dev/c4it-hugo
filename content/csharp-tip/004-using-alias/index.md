---
title: "C# tip: define Using Aliases to avoid ambiguity"
date: 2021-09-21
url: /csharptips/using-alias
draft: false
categories:
  - CSharp Tips
tags:
  - CSharp
toc: true
summary: Sometimes we need to use objects with the same name but from different namespaces. How to remove that ambiguity? By Using Aliases!
keywords:
  - csharp
  - dotnet
  - keyword
  - alias
  - using
  - namespace
  - maintainability
images:
  - /csharptips/using-alias/featuredImage.png
---

You may have to reference classes or services that come from different namespaces or packages, but that have the same name. It may become tricky to understand which reference refers to a specific type.

Yes, you could **use the fully qualified name** of the class. Or, you could use **namespace aliases** to write cleaner and easier-to-understand code.

It's just a matter of modifying your `using` statements. Let's see how!

## The general approach

Say that you are working on an application that receives info about football matches from different sources using NuGet packages, and then manipulates the data to follow some business rules.

Both services, **ShinyData** and **JuanStatistics** (totally random names!), provide an object called `Match`. Of course, those objects live in their specific namespaces.

Since you are using the native implementation you cannot rename the classes to avoid ambiguity. So you'll end up with code like this:

```cs
void Main()
{
    var shinyMatch = new ShinyData.Football.Statistics.Match();
    var juanMatch = new JuanStatistics.Stats.Football.Objects.Match();
}
```

Writing the fully qualified namespace every time can easily become boring. The code becomes less readable too!

Luckily we have **2 solutions**. Or, better, a solution that we can apply in two different ways.

## Namespace aliases - a cleaner solution

The following solution will not work:

```cs
using ShinyData.Football.Statistics;
using JuanStatistics.Stats.Football.Objects;

void Main()
{
    var shinyMatch = new Match();
    var juanMatch = new Match();
}
```

because, of course, the compiler is not able to understand the exact type of `shinyMatch` and `juanMatch`.

But we can use a nice functionality of C#: **namespace aliases**. It simply means that **we can name an imported namespace** and use the alias to reference the related classes.

### Using alias for the whole namespace

```cs
using Shiny = ShinyData.Football.Statistics;
using Juan = JuanStatistics.Stats.Football.Objects;

void Main()
{
    var shinyMatch = new Shiny.Match();
    var juanMatch = new Juan.Match();
}
```

This simple trick boosts the readability of your code.

### Using alias for a specific class

Can we go another step further? Yes! **We can even specify aliases for a specific class!**

```cs
using ShinyMatch = ShinyData.Football.Statistics.Match;
using JuanMatch = JuanStatistics.Stats.Football.Objects.Match;

void Main()
{
    var shinyMatch = new ShinyMatch();
    var juanMatch = new JuanMatch();
}
```

Now we can create an instance of `ShinyMatch` which, since it is an alias listed among the `using` statements, is of type `ShinyData.Football.Statistics.Match`.

### Define alias for generics

Not only you can use it to specify a simple class, but only for generics.

Say that the ShinyData namespace defines a generic class, like `CustomDictionary<T>`. You can reference it just as you did before!

```cs
using ShinyMatch = ShinyData.Football.Statistics.Match;
using JuanMatch = JuanStatistics.Stats.Football.Objects.Match;
using ShinyDictionary = ShinyData.Football.Statistics.CustomDictionary<int>;

void Main()
{
    var shinyMatch = new ShinyMatch();
    var juanMatch = new JuanMatch();

    var dictionary = new ShinyDictionary();
}
```

Unluckily we have **some limitations**:

- we must always specify the inner type of the generic: `CustomDictionary<int>` is valid, but `CustomDictionary<T>` is not valid
- we cannot use as inner type a class defined with an alias: `CustomDictionary<ShinyMatch>` is invalid, unless we use the fully qualified name

## Conclusion

We've seen how we can define namespace aliases to simplify our C# code: just add a name to an imported namespace in the `using` statement, and reference it on your code.

**What would you reference, the namespace or the specific class?**

👉 Let's discuss it [on Twitter](https://twitter.com/BelloneDavide/status/1343606638280765440 "Original tweet on Twitter") or on the comment section below.

🐧
