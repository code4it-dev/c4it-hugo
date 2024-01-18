---
title: "C# Tip: Observable Collection"
date: 2024-01-18T14:09:12+01:00
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
---

Imagine you need a way to raise events whenever an item is added or removed to a collection.

Instead of building a new class from scratch, you can use `ObservableCollection<T>` to store items, raise events, and act when the internal state of the collection changes.

In this article, we will learn how to use `ObservableCollection<T>`, an out-of-the-box collection available in .NET.

## Introducing ObservableCollection

`ObservableCollection<T>` is a generic collection coming from the `System.Collections.ObjectModel` namespace.

It allows the most common operations such as `Add<T>(T item)` and `Remove<T>(T item)`, as you can expect from most of the collections in .NET.

However, it implements two interfaces:

- `INotifyCollectionChanged` can be used to raise events when the internal collection is changed.
- `INotifyPropertyChanged` can be used to raise events when one of the properties of the changes.

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

You can simplify the initialization by passing a collection in the constructor:

```cs
 var collection = new ObservableCollection<string>(new string[] { "Mario", "Luigi", "Peach" });

 collection.Add("Bowser");

 collection.Remove("Luigi");

 collection.Add("Waluigi");

 _ = collection.Contains("Peach");

 collection.Move(1, 2);
```

## Intercepting changes to the inner collection

As we said, this data type implements `INotifyCollectionChanged`. Thanks to this interface, we can add **events handlers** to the `CollectionChanged` event and see what happened.

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

The `WhenCollectionChanges` delegate exposes a `NotifyCollectionChangedEventArgs` that gives you info about the previous and the current items in the collection:

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

So, every time an operation occurs, we we some logs.

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

- the `sender` property holds the current items in collection. It's an `object?`, so you have to cast it to another type to use it.
- the `NotifyCollectionChangedEventArgs` has differetn meanings depending on the operation:
  - when adding a value, `OldItems` is null and `NewItems` contains the items added during the operation;
  - when removing an item, `OldItems` contains the value just removed, and `NewItems` is `null`.
  - when swapping two items, both `OldItems` and `NewItems` contain the item you are moving.

## Property changed

To execute events when a property changes we need to add a delegate to the `PropertyChanged` event. However, it's not available directly on the `ObservableCollection` type: you first have to cast it to an `INotifyPropertyChanged`:

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

As you can see, for every add/remove operation we have two events raised: one to say that the `Count` has changed, one to say that the internal `Item[]` are changed.

However, notice what happens in the Swapping section: you just change the order of the items, so the `Count` property does not change.


_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_

## Wrapping up

As always, my suggestion is to explore the language and toy with the parameters, properties, data types, and so on.

You'll find lots of interesting things that may come in handy.

I hope you enjoyed this article! Let's keep in touch on [Twitter](https://twitter.com/BelloneDavide) or [LinkedIn](https://www.linkedin.com/in/BelloneDavide/)! 🤜🤛

Happy coding!

🐧



[ ] Titoli
[ ] Frontmatter
[ ] Rinomina immagini
[ ] Alt Text per immagini
[ ] Grammatica
[ ] Bold/Italics
[ ] Nome cartella e slug devono combaciare
[ ] Immagine di copertina
[ ] Rimuovi secrets dalle immagini
[ ] Pulizia formattazione
[ ] Metti la giusta OgTitle
[ ] Fai resize della immagine di copertina