---
title: "C# Tip: Format Interpolated Strings"
date: 2023-05-02
url: /csharptips/format-interpolated-strings
draft: false
categories:
  - CSharp Tips
tags:
  - CSharp
toc: true
summary: Interpolated strings are those built with the `$` symbol, that you can use to create strings using existing variables or properties. Did you know that you can apply custom formattings to such values?
images:
  - /csharptips/format-interpolated-strings/featuredImage.png
---

As you know, there are many ways to "create" strings in C#. You can use a `StringBuilder`, you can simply concatenate strings, or you can use _interpolated_ strings.

Interpolated? WHAT? I'm pretty sure that you've already used interpolated strings, even if you did not know the "official" name:

```cs
int age = 31;
string bio = $"Hi, I'm {age} years old";
```

That's it: an interpolated string is one where you can reference a variable or a property within the string definition, using the `$` and the `{}` operators to generate such strings.

Did you know that you can even format how the interpolated value must be rendered when creating the string? It's just a matter of specifying the format after the `:` sign:

## Formatting dates

The easiest way to learn it is by formatting dates:

```cs
DateTime date = new DateTime(2021,05,23);

Console.WriteLine($"The printed date is {date:yyyy-MM-dd}"); //The printed date is 2021-05-23
Console.WriteLine($"Another version is {date:yyyy-MMMM-dd}"); //Another version is 2021-May-23

Console.WriteLine($"The default version is {date}"); //The default version is 23/05/2021 00:00:00
```

Here we have `date:yyyy-MM-dd` which basically means "format the `date` variable using the `yyyy-MM-dd` format".

There are, obviously, different ways to format dates, as described on the [official documentation](https://learn.microsoft.com/en-us/dotnet/standard/base-types/custom-date-and-time-format-strings). Some of the most useful are:

- `dd`: day of the month, in number (from 01 to 31);
- `ddd`: abbreviated day name (eg: Mon)
- `dddd`: complete day name (eg: Monday)
- `hh`: hour in a 12-hour clock (01-> 12)
- `HH`: hour in a 24-hour clock (00->23)
- `MMMM`: full month day

and so on.

## Formatting numbers

Similar to dates, we can format numbers.

For example, we can format a `double` number as currency or as a percentage:

```cs
var cost = 12.41;
Console.WriteLine($"The cost is {cost:C}"); // The cost is £12.41

var variation = -0.254;
Console.WriteLine($"There is a variation of {variation:P}"); //There is a variation of -25.40%
```

Again, there are lots of different ways to format numbers:

- `C`: currency - it takes the current culture, so it may be Euro, Yen, or whatever currency, depending on the process' culture;
- `E`: exponential number, used for scientific operations
- `P`: percentage: as we've seen before `{1:P}` represents 100%;
- `X`: hexadecimal

## Further readings

There are too many formats that you can use to convert a value to a string, and we cannot explore all of them here.

But still, you can have a look at several ways to format date and time in C#

🔗 [Custom date and time format strings | Microsoft Docs](https://learn.microsoft.com/en-us/dotnet/standard/base-types/custom-date-and-time-format-strings)

and, obviously, to format numbers

🔗 [Standard numeric format strings | Microsoft Docs](https://learn.microsoft.com/en-us/dotnet/standard/base-types/standard-numeric-format-strings)

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_

Finally, remember that interpolated strings are not the only way to build strings upon variables; you can (and should!) use `string.Format`:

🔗 [How to use String.Format - and why you should care about it | Code4IT](https://www.code4it.dev/blog/how-to-use-string-format/)

## Wrapping up

I hope you enjoyed this article! Let's keep in touch on [Twitter](https://twitter.com/BelloneDavide) or on [LinkedIn](https://www.linkedin.com/in/BelloneDavide/), if you want! 🤜🤛

Happy coding!

🐧
