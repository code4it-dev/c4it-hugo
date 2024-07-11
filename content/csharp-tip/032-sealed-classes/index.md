---
title: "C# Tip: Private Constructor"
date: 2024-07-11 
url: /csharptips/sealed-classes
draft: false
categories:
 - CSharp Tips
tags: 
 - CSharp
toc: false
summary: "A summary"
images:
 - /csharptips/sealed-classes/featuredImage.png
---

The O in SOLID stands for Open-closed principle: by the official definition, "software entities (classes, modules, functions, etc.) should be open for extension, but closed for modification".

To extend a class you usually create a subclass, overriding or implementing methods from the parent class.

## How to override methods by using subclasses

For instance, you can have an abstract class like this:


```cs
public abstract class MyBaseClass
{
    public DateOnly Date { get; init; }
    public string Title { get; init; }

    public abstract string GetFormattedString();

    public virtual string FormatDate() => Date.ToString("yyyy-MM-dd");
}
```

and extend it by creating a subclass and defining its specific implementations of the open points in the parent class:

```cs
public class ConcreteClass : MyBaseClass
{
    public override string GetFormattedString() => $"{Title} | {FormatDate()}";
}
```

Now, this is the simplest example: overriding and implementing methods from an abstract class.

You can actually override methods from a concrete class:

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

Notice that, even though there are no abstract methods in the base class, you can override the content of a method by using the `new` keyword.


## Prevent the creation of subclasses using the sealed keyword

Expecially when exposing classes via NuGet, you want to prevent consumer to create subclasses and access the internal status of the structures you have defined.

To prevent classes to be extended, you must mark your class as `sealed`:

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

![alt text](sealed-class-compilation-error.png)

## Reasons to mark a class as sealed

Ok, it's easy to prevent a class from being extended by a subclass. But what are the benefits of having a `sealed` class?

Marking a C# class as `sealed` can be beneficial for several reasons:

1. **Security by design**: By marking a class as sealed, you prevent consumers from creating subclasses that can alter or extend critical functionalities of the base class in unintended ways.
2. **Performance improvements**: The compiler can optimize sealed classes more effectively because it knows there are no subclasses. This will not bring a huge performance improvements, but still it can help if every nanosecond is important.
3. **Design intent**: Sealing the class communicates to other developers that the class is not intended to be extended or modified. If you want to use it, you accept you cannot modify or extended it, as it has been designed in that way by purpose.
 

## Further readings

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_


## Wrapping up


I hope you enjoyed this article! Let's keep in touch on [Twitter](https://twitter.com/BelloneDavide) or [LinkedIn](https://www.linkedin.com/in/BelloneDavide/)! 🤜🤛

Happy coding!

🐧



- [ ] Grammatica
- [ ] Titoli
- [ ] Frontmatter
- [ ] Immagine di copertina
- [ ] Fai resize della immagine di copertina
- [ ] Metti la giusta OgTitle
- [ ] Bold/Italics
- [ ] Nome cartella e slug devono combaciare
- [ ] Rinomina immagini
- [ ] Trim corretto per bordi delle immagini
- [ ] Alt Text per immagini
- [ ] Rimuovi secrets dalle immagini
- [ ] Controlla se ASP.NET Core oppure .NET
- [ ] Pulizia formattazione
- [ ] Add wt.mc_id=DT-MVP-5005077 to links