---
title: "Clean Code Tip: Avoid mental mappings"
date: 2022-01-25
url: /cleancodetips/avoid-mental-mappings
draft: false
categories:
  - Clean Code Tips
tags:
  - Clean Code
toc: true
summary: Mental mappings are a good way to write shorter code that you, and only you, can understand. Prefer clarity over brevity!
images:
  - /cleancodetips/avoid-mental-mappings/featuredImage.png
---

Every name must be meaningful and clear. If names are not obvious, other developers (or your future self) may misinterpret what you were meaning.

Avoid using mental mapping to abbreviate names, unless the abbreviation is obvious or common.

Names should not be based on mental mapping, even worse without context.

## Bad mental mappings

Take this **bad** example:

```cs
public void RenderWOSpace()
```

What is a _WOSpace_? Without context, readers won't understand its meaning. Ok, some people use _WO_ as an abbreviation of _without_.

So, a better name is, of course:

```cs
public void RenderWithoutSpace()
```

## Acceptable mappings

Some abbreviations are quite obvious and are totally fine to be used.

For instance, standard abbreviations, like _km_ for _kilometer_.

```cs
public int DistanceInKm()
```

or variables used, for instance, in a loop:

```cs
for (int i = 0; i <; 100; i++){}
```

or in lambdas:

```cs
int[] collection = new int[] { 2, 3, 5, 8 };
collection.Where(c => c < 5);
```

**It all depends on the scope**: the narrower the scope, the _meaningless_ (don't get me wrong!) can be the variable.

## An edge case

Sometimes, a common (almost obvious) abbreviation can have multiple meanings. **What does DB mean?** **Database? Decibel?** It all depends on the context!

So, a `_dbConnection` obviously refers to the database. But a `defaultDb`, is the default decibel value or the default database?

_This article first appeared on [Code4IT](https://www.code4it.dev/)_

## Conclusion

As usual, clarity is the key for good code: a name, may it be for classes, modules, or variables, should be explicit and obvious to everyone.

So, always [use meaningful names](https://www.code4it.dev/cleancodetips/choose-meaningful-names "Clean code tips: use meaningful names - Code4IT")!

Happy coding!

🐧
