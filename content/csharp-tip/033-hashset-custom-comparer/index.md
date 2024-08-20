---
title: "C# Tip: Hashset Custom Comparer"
date: 2024-08-16T14:48:45+02:00
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

Sometimes, object instances can be considered equals even though some of their properties are different. Consider a movie translated into different languages: the Italian and the French version are different, but the movie is the same. 

If we want to store unique values in a collection, we can use an `HashSet<T>`. But how can we store items in a HashSet when we have a custom way to define if two objects are equal?

In this article, we will learn a few ways to add custom comparers when using an `HashSet`.

Let's start with a dummy class: `Pirate`.

```cs
public class Pirate
{
    public int Id { get; }
    public string Name { get; }

    public Pirate(int id, string username)
    {
        Id = id;
        Name = username;
    }
}
```

I'm going to add some instances of Pirate to an HashSet. Please, note that there are two pirates whose ID is 4:

```cs
List<Pirate> mugiwara = new List<Pirate>()
{
    new Pirate(1, "Luffy"),
    new Pirate(2, "Zoro"),
    new Pirate(3, "Nami"),
    new Pirate(4, "Sanji"),
    new Pirate(5, "Chopper"),
    new Pirate(6, "Robin"),
    new Pirate(4, "Duval"),
};

HashSet<Pirate> hashSet = new HashSet<Pirate>();

foreach (var pirate in mugiwara)
{
    hashSet.Add(pirate);
}

_output.WriteAsTable(hashSet);
```

(I *really* hope you'll get the reference 😂)

Now, what will we print on console? (ps: `output` is just a wrapper around some functionalities provided by [Spectre.Console](https://spectreconsole.net/))

![HashSet result when no equality rule is defined](hashset-no-equality.png)

As you can see, we have both Sanji and Duval: even though their Id are the same, those are two distinct objects. Also, we haven't told HashSet that the Id property must be used as a Discriminator.

## Using a custom IEqualityComparer

In order to add a custom way to tell the HashSet that two objects can be treated as equal, we can define a custom comparer: it's nothing but a class that implements the `IEqualityComparer<T>` interface, where `T` is the name of the class we are working on.

```cs
public class PirateComparer : IEqualityComparer<Pirate>
{
    bool IEqualityComparer<Pirate>.Equals(Pirate? x, Pirate? y)
    {
        Console.WriteLine($"Equals: {x.Name} vs {y.Name}");
        return x.Id == y.Id;
    }

    int IEqualityComparer<Pirate>.GetHashCode(Pirate obj)
    {
        Console.WriteLine("GetHashCode " + obj.Name);
        return obj.Id.GetHashCode();
    }
}
```

The first method, `Equals`, compares two instances of a class to tell if they are equal, following the custom rules we write.

The second method, `GetHashCode`, defines a way to build an HashCode of an object given it's internal status. In this case, I'm saying that the HashCode of a Pirate object is just the HashCode of its Id property.

To include this custom comparer, you must add a new instance of `PirateComparer` to the HashSet declaration:

```cs
HashSet<Pirate> hashSet = new HashSet<Pirate>(new PirateComparer());
```

Let's run the example again, and admire the result:

![HashSet result with custom comparer](hashset-with-comparer.png)

As you can see, there is only one item whose Id is 4: Sanji.

Have a look at the message I printed when executing `Equals` and `GetHashCode`.

```plain
GetHashCode Luffy
GetHashCode Zoro
GetHashCode Nami
GetHashCode Sanji
GetHashCode Chopper
GetHashCode Robin
GetHashCode Duval
Equals: Sanji vs Duval
```

Every time we insert an item, we call the `GetHashCode` method to generate an internal ID used by the HashSet to check if that item already exists.

As stated by [Microsoft's documentation](https://learn.microsoft.com/en-us/dotnet/fundamentals/runtime-libraries/system-object-gethashcode?wt.mc_id=DT-MVP-5005077),

> Two objects that are equal return hash codes that are equal. However, the reverse is not true: equal hash codes do not imply object equality, because different (unequal) objects can have identical hash codes. 

This means that if the Hash Code is already used, it's not guaranteed the the objects are equal. That's why we need to implement the `Equals` method (hint: you should not just compare the HashCode of the two objects!).



## Can we implement IEqualityComparer on our class?

It makes sense to move the IEqualityComparer closer to the Pirate class, so that it can be reused across multiple HashSets.

```cs
public class Pirate : IEqualityComparer<Pirate>
{
    public int Id { get; }
    public string Name { get; }

    public Pirate(int id, string username)
    {
        Id = id;
        Name = username;
    }

    bool IEqualityComparer<Pirate>.Equals(Pirate? x, Pirate? y)
    {
        Console.WriteLine($"Equals: {x.Name} vs {y.Name}");
        return x.Id == y.Id;
    }

    int IEqualityComparer<Pirate>.GetHashCode(Pirate obj)
    {
        Console.WriteLine("GetHashCode " + obj.Name);
        return obj.Id.GetHashCode();
    }
}
```

Does it work? Surprisingly, no!

> .....

So, you should always explicitly pass KJFLEKJRLKEJLK


## Further readings

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_


## Wrapping up


I hope you enjoyed this article! Let's keep in touch on [LinkedIn](https://www.linkedin.com/in/BelloneDavide/) or [Twitter](https://twitter.com/BelloneDavide)! 🤜🤛

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