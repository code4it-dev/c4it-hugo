---
title: "C# Tip: How to create Custom Attributes, and why they are useful"
date: 2025-01-21
url: /csharptips/create-custom-csharp-attributes
draft: false
categories:
  - CSharp Tips
tags:
  - CSharp
toc: false
summary: "Applying custom attributes to C# classes and interfaces can be useful for several reasons. Let's learn how to create Custom Attributes in C#, and let's explore some practical usage!"
images:
  - /csharptips/create-custom-csharp-attributes/featuredImage.png
keywords:
  - csharp
  - attributes
  - modularity
  - utilities
---

In C#, attributes are used to describe the meaning of some elements, such as classes, methods, and interfaces.

I'm sure you've already used them before. Examples are:

- the `[Required]` attribute when you define the properties of a model to be validated;
- the `[Test]` attribute when creating Unit Tests using NUnit;
- the `[Get]` and the `[FromBody]` attributes used to define API endpoints.

As you can see, all the **attributes do not specify the behaviour, but rather, they express the meaning of a specific element**.

In this article, we will learn how to create custom attributes in C# and some possible interesting usages of such custom attributes.

## Create a custom attribute by inheriting from System.Attribute

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

Ideally, the class name should end with the suffix `-Attribute`: in this way, you can use the attribute using the short form `[ApplicationModule]` rather than using the whole class name, like `[ApplicationModuleAttribute]`. In fact, C# attributes can be resolved by convention.

Depending on the expected usage, a custom attribute can have one or more constructors and can expose one or more properties. In this example, I created a constructor that accepts an enum.
I can then use this attribute by calling `[ApplicationModule(Module.Cart)]`.

## Define where a Custom Attribute can be applied

Have a look at the attribute applied to the class definition:

```cs
[AttributeUsage(AttributeTargets.Interface | AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
```

This attribute tells us that the `ApplicationModule` can be applied to interfaces, classes, and methods.

`System.AttributeTargets` is an enum that enlists all the points you can attach to an attribute. The `AttributeTargets` enum is defined as:

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

Have you noticed it? It's actually a **Flagged enum**, whose values are powers of 2: this trick allows us to join two or more values using the OR operator.

There's another property to notice: `AllowMultiple`. When set to `true`, this property tells us that it's possible to use apply more than one attribute of the same type to the same element, like this:

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

## Practical usage of Custom Attributes

You can use custom attributes to declare which components or business areas an element belongs to.

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

Not only that: I can have one single class implement both interfaces and mark it as related to both the Catalogue and the Cart areas.

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

## Further readings

As you noticed, the `AttributeTargets` is a Flagged Enum. Don't you know what they are and how to define them? I've got you covered! I wrote two articles about Enums, and you can find info about Flagged Enums in both articles:

🔗 [5 things you should know about enums in C# | Code4IT](https://www.code4it.dev/blog/5-things-enums-csharp/)

and
🔗 [5 more things you should know about enums in C# | Code4IT](https://www.code4it.dev/blog/5-more-things-about-enums-csharp/)

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_

There are some famous but not-so-obvious examples of attributes that you should know: `DebuggerDisplay` and `InternalsVisibleTo`.

`DebuggerDisplay` can be useful for improving your debugging sessions.

🔗 [Simplify debugging with DebuggerDisplay attribute dotNET | Code4IT](https://www.code4it.dev/blog/debuggerdisplay-attribute/)

`IntenalsVisibleTo` can be used to give access to `internal` classes to external projects:;for example, you can use that attribute when writing unit tests.

🔗 [Testing internal members with InternalsVisibleTo | Code4IT](https://www.code4it.dev/blog/testing-internals-with-internalsvisibleto/)

## Wrapping up

In this article, I showed you how to create custom attributes in C# to specify which modules a class or a method belongs to. This trick can be useful if you want to speed up the analysis of your repository: if you need to retrieve all the classes that are used for the _Cart_ module (for example, because you want to move them to an external library), you can just search for `Module.Cart` across the repository and have a full list of elements.

In particular, this approach can be useful for the exposed components, such as API controllers. Knowing that two or more modules use the same Controller can help you understand if a change in the API structure is necessary.

Another good usage of this attribute is automatic documentation: you could create a tool that automatically enlists all the interfaces, API endpoints, and classes grouped by the belonging module. The possibilities are infinite!

I hope you enjoyed this article! Let's keep in touch on [LinkedIn](https://www.linkedin.com/in/BelloneDavide/), [Twitter](https://twitter.com/BelloneDavide) or [BlueSky](https://bsky.app/profile/bellonedavide.bsky.social)! 🤜🤛

Happy coding!

🐧
