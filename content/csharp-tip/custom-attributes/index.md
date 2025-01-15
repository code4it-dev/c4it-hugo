---
title: "C# Tip: Custom Attributes"
date: 2025-01-14T14:36:50+01:00
url: /csharptips/post-slug
draft: false
categories:
 - CSharp Tips
tags: 
 - CSharp
toc: false
summary: "A summary"
images:
 - /csharptips/post-slug/featuredImage.png
keywords:
 - csharp
---

In C#, attributes are used to describe the meaning of some elements such as classes, methods, and interface.

I'm sure you've already used them before. Examples are:

- the `[Required]` attibute when you define the properties of a model to be validated;
- the `[Test]` attribute when creating Unit Tests using NUnit;
- the `[Get]` and the `[FromBody]` attributes used to define API endpoints.

As you can see, all the attributes do not specify the behavior, but rather they express the meaning of a specific element.

In this article, we are going to learn how to create custom attributes in C#, and we will learn an interesting usage of such custom attributes.

## A custom attibute inherits from System.Attribute

Creating a custom attribute is pretty straightforward: you just need to create a class that inherits from `System.Attribute`. 


```cs
[AttributeUsage(AttributeTargets.Interface | AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
public class ApplicationModuleAttribute : Attribute
{
    public Module BelongingModule { get; }

    public ApplicationModuleAttribute(Module belongingModule)
    {
        BelongingModule = belongingModule;
    }
}

public enum Module
{
    Authentication,
    Catalogue,
    Cart,
    Payment
}
```

Make sure that the name of the class ends with the suffix `-Attribute`: in this way, you can use the attibute using the short form `[ApplicationModule]` rather than using the whole class name (attributes can be resolved by convention).

A custom attibute can have one or more constructors, depending on the expected usage, and can expose one or more properties. In this example, I created a constructor that accepts an enum.
I can then use this attibute by calling `[ApplicationModule(Module.Cart)]`.


## Define where a custom attribute can be applied

Have a look at the attribute applied to the class definition:

```cs
[AttributeUsage(AttributeTargets.Interface | AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
```

This attributes tells us that the `ApplicationModule` can be applied to intefaces, classes, and methods. `System.AttributeTargets` is an enum that enlists all the points you can attach an attribute. 

The `AttributeTargets` enum is defined as:

```cs
[Flags]
public enum AttributeTargets
{
    Assembly = 1,
    Module = 2,
    Class = 4,
    Struct = 8,
    Enum = 16,
    Constructor = 32,
    Method = 64,
    Property = 128,
    Field = 256,
    Event = 512,
    Interface = 1024,
    Parameter = 2048,
    Delegate = 4096,
    ReturnValue = 8192,
    GenericParameter = 16384,
    All = 32767
}
```

Have you noticed it? It's actually a Flagged enum, whose values are powers of 2: this trick allows us to join two or more values using the OR operator.

There's another property to notice: `AllowMultiple`. When set to `true`, this property tells us that it's possible to use apply than one attributes to the same element, like this:


```cs
[ApplicationModule(Module.Cart)]
[ApplicationModule(Module.Catalogue)]
public class ItemDetailsService { }
```

Or, if you want, you can inline them:

```cs
[ApplicationModule(Module.Cart), ApplicationModule(Module.Catalogue)]
public class ItemDetailsService { }
```

## A practical example

You can use custom attributes to declare which components or business area an element belongs to.

In the previous example, I defined an enum that enlists all the business modules supported by my application:

```cs
public enum Module
{
    Authentication,
    Catalogue,
    Cart,
    Payment
}
```

This way, whenever I define an interface, I can explicitly tell which components it belongs to:


```cs
[ApplicationModule(Module.Catalogue)]
public interface IItemDetails
{
    [ApplicationModule(Module.Catalogue)]
    string ShowItemDetails(string itemId);
}

[ApplicationModule(Module.Cart)]
public interface IItemDiscounts
{
    [ApplicationModule(Module.Cart)]
    bool CanHaveDiscounts(string itemId);
}
```

Not only that: I can have one single class implement both interfaces, and mark it as related to both the Catalogue and the Cart areas.


```cs
[ApplicationModule(Module.Cart)]
[ApplicationModule(Module.Catalogue)]
public class ItemDetailsService : IItemDetails, IItemDiscounts
{
    [ApplicationModule(Module.Catalogue)]
    public string ShowItemDetails(string itemId) => throw new NotImplementedException();

    [ApplicationModule(Module.Cart)]
    public bool CanHaveDiscounts(string itemId) => throw new NotImplementedException();
}
```

Notice that I also explicitly enriched the two inner methods with the related attribute - even if it's not necessary.




- definisci custom attribute
- spiega AttributeTargets (flagged enum!)
- applica attributo a interfaccia, classe e metodo
- usa esempio per ricavare tutti gli attributi di uno specifico metodo
- spiega che si puó usare per generare documentazione automatizzata e per creare architectural tests.

## Further readings

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_


## Wrapping up


I hope you enjoyed this article! Let's keep in touch on [LinkedIn](https://www.linkedin.com/in/BelloneDavide/), [Twitter](https://twitter.com/BelloneDavide) or [BlueSky](https://bsky.app/profile/bellonedavide.bsky.social)! 🤜🤛

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


## Appunti


```cs
  //
  // Summary:
  //     Specifies the application elements on which it is valid to apply an attribute.
  [Flags]
  public enum AttributeTargets
  {
      Assembly = 1,
      Module = 2,
      Class = 4,
      Struct = 8,
      Enum = 16,
      Constructor = 32,
      Method = 64,
      Property = 128,
      Field = 256,
      Event = 512,
      Interface = 1024,
      Parameter = 2048,
      Delegate = 4096,
      ReturnValue = 8192,
      GenericParameter = 16384,
      All = 32767
  }
```

Definizione attributo:


```cs
[AttributeUsage(AttributeTargets.Interface | AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
public class ApplicationModuleAttribute : Attribute
{
    public Module BelongingModule { get; }

    public ApplicationModuleAttribute(Module belongingModule)
    {
        BelongingModule = belongingModule;
    }
}

public enum Module
{
    Authentication,
    Catalogue,
    Cart,
    Payment
}
```

Utilizzo attributo:

```cs
[ApplicationModule(Module.Catalogue)]
public interface IItemDetails
{
    [ApplicationModule(Module.Catalogue)]
    string ShowItemDetails(string itemId);
}

[ApplicationModule(Module.Cart)]
public interface IItemDiscounts
{
    [ApplicationModule(Module.Cart)]
    bool CanHaveDiscounts(string itemId);
}

[ApplicationModule(Module.Cart)]
[ApplicationModule(Module.Catalogue)]
public class ItemDetailsService : IItemDetails, IItemDiscounts
{
    [ApplicationModule(Module.Catalogue)]
    public string ShowItemDetails(string itemId) => throw new NotImplementedException();

    [ApplicationModule(Module.Cart)]
    public bool CanHaveDiscounts(string itemId) => throw new NotImplementedException();
}
```