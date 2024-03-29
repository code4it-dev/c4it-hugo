---
title: "Clean code tip: How to choose meaningful names?"
date: 2021-05-25
url: /cleancodetips/choose-meaningful-names
draft: false
categories:
  - Clean Code Tips
tags:
  - Clean Code
toc: true
summary: Choosing meaningful names takes time! Time spent finding good names is time saved trying to figure out what you meant.
images:
  - /cleancodetips/choose-meaningful-names/featuredImage.png
---

One of the fundamentals of clean code is: use meaningful names.

But choosing meaningful names takes time!

Time spent finding good names is time saved trying to figure out what you meant.

How to approach it? Good names do not come on the first try!

My suggestion is: at first, write down the code as it comes.

```cs
public static string Get(string input)
{
  char[] arr = new char[input.Length];
  int i = input.Length - 1;
  foreach (var e in input)
  {
    arr[i] = e;
    i--;
  }

  return new String(arr);
}
```

And then, when you have _almost_ everything clear, choose better names for

- classes
- methods
- parameters
- variables
- namespaces
- libraries

```cs
public static string GetReversedString(string originalString)
{
  char[] reversedChars = new char[originalString.Length];
  int currentIndex = originalString.Length - 1;
  foreach (var currentChar in originalString)
  {
    reversedChars[currentIndex] = currentChar;
    currentIndex--;
  }

  return new String(reversedChars);
}
```

Probably, you'll never reach perfection. Sad, but true.

You might want to add some tests to your code, right? RIGHT??

A good moment to choose better names is while writing test: at that moment your tests act as Clients to your production code, so if you find that the name of the method does not fully represent its meaning, or the parameter names are misleading, this is a good moment to improve them.

And don't forget about private variables and methods!

So, what is "a good name"?

A good name should express:

- its meaning (what a method does?)
- its scope (for items in loops, even `var i = 0` is acceptable, if the scope is small)
- what it represents (`originalString` is, of course, the original string)

👉 Let's discuss it [on Twitter](https://twitter.com/BelloneDavide/status/1334909329573433345) or on the comment section below!

🐧

_This article first appeared on [Code4IT](https://www.code4it.dev/)_
