---
title: "C# tip: String.IsNullOrEmpty or String.IsNullOrWhiteSpace?"
date: 2021-07-06
url: /csharptips/string-isnullorempty-isnullorwhitespace
draft: false
categories:
  - CSharp Tips
tags:
  - CSharp
toc: true
summary: Is your string really empty, or has it hidden characters? With String.IsNullOrEmpty and String.IsNullOrWhiteSpace you can find it
keywords:
  - csharp
  - dotnet
  - string
  - performance
  - string-isnullorempty
  - string-isnullorwhitespace
images:
  - /csharptips/string-isnullorempty-isnullorwhitespace/featuredImage.png
---

Imagine this: you have created a method that creates a new user in your system, like this:

```cs
void CreateUser(string username)
{
    if (string.IsNullOrEmpty(username))
        throw new ArgumentException("Username cannot be empty");

    CreateUserOnDb(username);
}

void CreateUserOnDb(string username)
{
    Console.WriteLine("Created");
}
```

It looks quite safe, right? Is the first check enough?

Let's try it: `CreateUser("Loki")` prints _Created_, while `CreateUser(null)` and `CreateUser("")` throw an exception.

What about `CreateUser(" ")`?

Unfortunately, it prints _Created_: this happens because the string is not actually empty, but it is composed of invisible characters.

**The same happens with escaped characters too!**

To avoid it, you can replace `String.IsNullOrEmpty` with `String.IsNullOrWhiteSpace`: this method performs its checks on invisible characters too.

So we have:

```cs
String.IsNullOrEmpty(""); //True
String.IsNullOrEmpty(null); //True
String.IsNullOrEmpty("   "); //False
String.IsNullOrEmpty("\n"); //False
String.IsNullOrEmpty("\t"); //False
String.IsNullOrEmpty("hello"); //False
```

but also

```cs
String.IsNullOrWhiteSpace("");//True
String.IsNullOrWhiteSpace(null);//True
String.IsNullOrWhiteSpace("   ");//True
String.IsNullOrWhiteSpace("\n");//True
String.IsNullOrWhiteSpace("\t");//True
String.IsNullOrWhiteSpace("hello");//False
```

As you can see, the two methods behave in a different way.

If we want to see the results in a tabular way, we have:

| value     | IsNullOrEmpty | IsNullOrWhiteSpace |
| --------- | ------------- | ------------------ |
| `"Hello"` | false         | false              |
| `""`      | true          | true               |
| `null`    | true          | true               |
| `" "`     | false         | true               |
| `"\n"`    | false         | true               |
| `"\t"`    | false         | true               |

_This article first appeared on [Code4IT](https://www.code4it.dev/)_

## Conclusion

**Do you have to replace all `String.IsNullOrEmpty` with `String.IsNullOrWhiteSpace`?** **Probably yes**, unless you have a specific reason to consider the latest three values in the table as valid characters.

![Do you have to replace it everything?](https://media.giphy.com/media/SVgKToBLI6S6DUye1Y/giphy.gif)

More on this topic can be found [here](https://www.code4it.dev/blog/csharp-check-if-string-is-empty "How to check if a string is really empty with C#")

👉 Let's discuss it [on Twitter](https://twitter.com/BelloneDavide/status/1335941631724429312 "Original tweet on Twitter") or on the comment section below.

🐧
