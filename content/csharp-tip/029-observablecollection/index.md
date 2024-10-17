---
title: "C# Tip: ObservableCollection - a data type to intercept changes to the collection"
date: 2024-01-23
url: /csharptips/observablecollection
draft: false
categories:
  - CSharp Tips
tags:
  - CSharp
toc: false
summary: "`ObservableCollection<T>` is a data type that allows you to react when an item is added or removed from the collection. Let's learn more!"
keywords:
  - csharp
  - dotnet
  - collections
  - generics
  - observablecollection
  - reactive-programming
  - icollection
  - events
images:
  - /csharptips/observablecollection/featuredImage.png
---

Imagine you need a way to raise events whenever an item is added or removed from a collection.

Instead of building a new class from scratch, you can use `ObservableCollection<T>` to store items, raise events, and act when the internal state of the collection changes.

In this article, we will learn how to use `ObservableCollection<T>`, an out-of-the-box collection available in .NET.

## Introducing the ObservableCollection type

`ObservableCollection<T>` is a generic collection coming from the `System.Collections.ObjectModel` namespace.

It allows the most common operations, such as `Add<T>(T item)` and `Remove<T>(T item)`, as you can expect from most of the collections in .NET.

Moreover, it implements two interfaces:

- `INotifyCollectionChanged` can be used to **raise events when the internal collection is changed**.
- `INotifyPropertyChanged` can be used to **raise events when one of the properties of the changes**.

Let's see a simple example of the usage:

```cs
var collection = new ObservableCollection<string>();

collection.Add("Mario");
collection.Add("Luigi");
collection.Add("Peach");
collection.Add("Bowser");

collection.Remove("Luigi");

collection.Add("Waluigi");

_ = collection.Contains("Peach");

collection.Move(1, 2);
```

As you can see, we can do all the basic operations: add, remove, swap items (with the `Move` method), and check if the collection contains a specific value.

You can **simplify the initialization by passing a collection in the constructor**:

```cs
 var collection = new ObservableCollection<string>(new string[] { "Mario", "Luigi", "Peach" });

 collection.Add("Bowser");

 collection.Remove("Luigi");

 collection.Add("Waluigi");

 _ = collection.Contains("Peach");

 collection.Move(1, 2);
```

## How to intercept changes to the underlying collection

As we said, this data type implements `INotifyCollectionChanged`. Thanks to this interface, we can add **event handlers** to the `CollectionChanged` event and see what happens.

```cs
var collection = new ObservableCollection<string>(new string[] { "Mario", "Luigi", "Peach" });
collection.CollectionChanged += WhenCollectionChanges;

Console.WriteLine("Adding Bowser...");
collection.Add("Bowser");
Console.WriteLine("");


Console.WriteLine("Removing Luigi...");
collection.Remove("Luigi");
Console.WriteLine("");

Console.WriteLine("Adding Waluigi...");
collection.Add("Waluigi");
Console.WriteLine("");

Console.WriteLine("Searching for Peach...");
var containsPeach = collection.Contains("Peach");
Console.WriteLine("");

Console.WriteLine("Swapping items...");
collection.Move(1, 2);
```

The `WhenCollectionChanges` method accepts a `NotifyCollectionChangedEventArgs` that gives you info about the intercepted changes:

```cs
private void WhenCollectionChanges(object? sender, NotifyCollectionChangedEventArgs e)
{
    var allItems = ((IEnumerable<object>)sender)?.Cast<string>().ToArray() ?? new string[] { "<empty>" };
    Console.WriteLine($"> Currently, the collection is {string.Join(',', allItems)}");

    Console.WriteLine($"> The operation is {e.Action}");

    var previousItems = e.OldItems?.Cast<string>()?.ToArray() ?? new string[] { "<empty>" };
    Console.WriteLine($"> Before the operation it was {string.Join(',', previousItems)}");


    var currentItems = e.NewItems?.Cast<string>()?.ToArray() ?? new string[] { "<empty>" };
    Console.WriteLine($"> Now, it is {string.Join(',', currentItems)}");
}
```

Every time an operation occurs, we write some logs.

The result is:

```txt
Adding Bowser...
> Currently, the collection is Mario,Luigi,Peach,Bowser
> The operation is Add
> Before the operation it was <empty>
> Now, it is Bowser

Removing Luigi...
> Currently, the collection is Mario,Peach,Bowser
> The operation is Remove
> Before the operation it was Luigi
> Now, it is <empty>

Adding Waluigi...
> Currently, the collection is Mario,Peach,Bowser,Waluigi
> The operation is Add
> Before the operation it was <empty>
> Now, it is Waluigi

Searching for Peach...

Swapping items...
> Currently, the collection is Mario,Bowser,Peach,Waluigi
> The operation is Move
> Before the operation it was Peach
> Now, it is Peach
```

Notice a few points:

- **the `sender` property holds the current items in the collection**. It's an `object?`, so you have to cast it to another type to use it.
- the `NotifyCollectionChangedEventArgs` has different meanings depending on the operation:
  - when adding a value, `OldItems` is null and `NewItems` contains the items added during the operation;
  - when removing an item, `OldItems` contains the value just removed, and `NewItems` is `null`.
  - when swapping two items, both `OldItems` and `NewItems` contain the item you are moving.

## How to intercept when a collection property has changed

To execute events when a property changes, we need to add a delegate to the `PropertyChanged` event. However, it's not available directly on the `ObservableCollection` type: you first have to cast it to an `INotifyPropertyChanged`:

```cs
var collection = new ObservableCollection<string>(new string[] { "Mario", "Luigi", "Peach" });
(collection as INotifyPropertyChanged).PropertyChanged += WhenPropertyChanges;

Console.WriteLine("Adding Bowser...");
collection.Add("Bowser");
Console.WriteLine("");


Console.WriteLine("Removing Luigi...");
collection.Remove("Luigi");
Console.WriteLine("");

Console.WriteLine("Adding Waluigi...");
collection.Add("Waluigi");
Console.WriteLine("");

Console.WriteLine("Searching for Peach...");
var containsPeach = collection.Contains("Peach");
Console.WriteLine("");

Console.WriteLine("Swapping items...");
collection.Move(1, 2);
```

We can now specify the `WhenPropertyChanges` method as such:

```cs
private void WhenPropertyChanges(object? sender, PropertyChangedEventArgs e)
{
    var allItems = ((IEnumerable<object>)sender)?.Cast<string>().ToArray() ?? new string[] { "<empty>" };
    Console.WriteLine($"> Currently, the collection is {string.Join(',', allItems)}");
    Console.WriteLine($"> Property {e.PropertyName} has changed");
}
```

As you can see, we have again the `sender` parameter that contains the collection of items.

Then, we have a parameter of type `PropertyChangedEventArgs` that we can use to get the name of the property that has changed, using the `PropertyName` property.

Let's run it.

```txt
Adding Bowser...
> Currently, the collection is Mario,Luigi,Peach,Bowser
> Property Count has changed
> Currently, the collection is Mario,Luigi,Peach,Bowser
> Property Item[] has changed

Removing Luigi...
> Currently, the collection is Mario,Peach,Bowser
> Property Count has changed
> Currently, the collection is Mario,Peach,Bowser
> Property Item[] has changed

Adding Waluigi...
> Currently, the collection is Mario,Peach,Bowser,Waluigi
> Property Count has changed
> Currently, the collection is Mario,Peach,Bowser,Waluigi
> Property Item[] has changed

Searching for Peach...

Swapping items...
> Currently, the collection is Mario,Bowser,Peach,Waluigi
> Property Item[] has changed
```

As you can see, for every add/remove operation, we have two events raised: one to say that the `Count` has changed, and one to say that the internal `Item[]` is changed.

However, notice what happens in the Swapping section: since you just change the order of the items, the `Count` property does not change.

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_

## Final words

As you probably noticed, **events are fired after the collection has been initialized.** Clearly, it considers the items passed in the constructor as the initial state, and all the subsequent operations that mutate the state _can_ raise events.

Also, notice that events are fired only if the reference to the value changes. If the collection holds more complex classes, like:

```cs
public class User
{
    public string Name { get; set; }
}
```

No event is fired if you change the value of the `Name` property of an object already part of the collection:

```cs
var me = new User { Name = "Davide" };
var collection = new ObservableCollection<User>(new User[] { me });

collection.CollectionChanged += WhenCollectionChanges;
(collection as INotifyPropertyChanged).PropertyChanged += WhenPropertyChanges;

me.Name = "Updated"; // It does not fire any event!
```

Notice that **`ObservableCollection<T>` is not thread-safe**! You can find an [interesting article](https://www.meziantou.net/thread-safe-observable-collection-in-dotnet.htm) by Gérald Barré (aka Meziantou) where he explains a thread-safe version of `ObservableCollection<T>` he created. Check it out!

As always, I suggest exploring the language and toying with the parameters, properties, data types, etc.

You'll find lots of exciting things that may come in handy.

I hope you enjoyed this article! Let's keep in touch on [Twitter](https://twitter.com/BelloneDavide) or [LinkedIn](https://www.linkedin.com/in/BelloneDavide/)! 🤜🤛

Happy coding!

🐧
