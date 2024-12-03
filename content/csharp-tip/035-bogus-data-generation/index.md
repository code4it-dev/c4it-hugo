---
title: "C# Tip: 2 ways to generate realistic data using Bogus"
date: 2024-12-03
url: /csharptips/bogus-data-generation
draft: false
categories:
 - CSharp Tips
tags: 
 - CSharp
toc: false
summary: "Bogus is a library that generates realistic values for your data. When populating fake user names, instead of Foo and Bar, you can have John and Sarah. Let's see two ways to define and reuse a Faker definition."
images:
 - /csharptips/bogus-data-generation/featuredImage.png
keywords:
    - csharp
    - dotnet
    - bogus
    - data
    - library
---

In a previous article, we delved into the creation of realistic data using Bogus, an open-source library that allows you to generate data with plausible values.

Bogus contains several properties and methods that generate realistic data such as names, addresses, birthdays, and so on.

In this article, we will learn two ways to generate data with Bogus: both ways generate the same result; the main change is on the reusability and the modularity. But, in my opinion, it's just a matter of preference: there is no approach *absolutely* better than the other. However, both methods can be preferred in specific cases. 

For the sake of this article, we are going to use Bogus to generate instances of the `Book` class, defined like this:

```cs
public class Book
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public int PagesCount { get; set; }
    public Genre[] Genres { get; set; }
    public DateOnly PublicationDate { get; set; }
    public string AuthorFirstName { get; set; }
    public string AuthorLastName { get; set; }
}

public enum Genre
{
    Thriller, Fantasy, Romance, Biography
}
```

## Expose a Faker inline or with a method

It is possible to create a specific object that, using a Builder approach, allows you to generate one or more items of a specified type.

It all starts with the `Faker<T>` generic type, where `T` is the type you want to generate.

Once you create it, you can define the rules to be used when initializing the properties of a `Book` by using methods such as `RuleFor` and `RuleForType`.

```cs
public static class BogusBookGenerator
{
    public static Faker<Book> CreateFaker()
    {
        Faker<Book> bookFaker = new Faker<Book>()
         .RuleFor(b => b.Id, f => f.Random.Guid())
         .RuleFor(b => b.Title, f => f.Lorem.Text())
         .RuleFor(b => b.Genres, f => f.Random.EnumValues<Genre>())
         .RuleFor(b => b.AuthorFirstName, f => f.Person.FirstName)
         .RuleFor(b => b.AuthorLastName, f => f.Person.LastName)
         .RuleFor(nameof(Book.PagesCount), f => f.Random.Number(100, 800))
         .RuleForType(typeof(DateOnly), f => f.Date.PastDateOnly());

        return bookFaker;
    }
}
```

In this way, thanks to the static method, you can simply create a new instance of `Faker<Book>`, ask it to generate one or more books, and enjoy the result:

```cs
Faker<Book> generator = BogusBookGenerator.CreateFaker();
var books = generator.Generate(10);
```
Clearly, it's not necessary for the class to be marked as `static`: it all depends on what you need to achieve!

## Expose a subtype of Faker, specific for the data type to be generated

If you don't want to use a method (static or not static, it doesn't matter), you can define a subtype of `Faker<Book>` whose customization rules are all defined in the constructor.

```cs
public class BookGenerator : Faker<Book>
{
    public BookGenerator()
    {
        RuleFor(b => b.Id, f => f.Random.Guid());
        RuleFor(b => b.Title, f => f.Lorem.Text());
        RuleFor(b => b.Genres, f => f.Random.EnumValues<Genre>());
        RuleFor(b => b.AuthorFirstName, f => f.Person.FirstName);
        RuleFor(b => b.AuthorLastName, f => f.Person.LastName);
        RuleFor(nameof(Book.PagesCount), f => f.Random.Number(100, 800));
        RuleForType(typeof(DateOnly), f => f.Date.PastDateOnly());
    }
}
```

Using this way, you can simply create a new instance of `BookGenerator` and, again, call the `Generate` method to create new book instances.

```cs
var generator = new BookGenerator();
var books = generator.Generate(10);
```

## Method vs Subclass: When should we use which?

As we saw, both methods bring the same result, and their usage is almost identical.

So, which way should I use?

**Use the method** approach (the first one) when you need:

- **Simplicity**: If you need to generate fake data quickly and your rules are straightforward, using a method is the easiest approach.
- **Ad-hoc Data Generation**: Ideal for one-off or simple scenarios where you don’t need to reuse the same rules across your application.

Or **use the subclass** (the second approach) when you need:

- **Reusability**: If you need to generate the same type of fake data in multiple places, defining a subclass allows you to encapsulate the rules and reuse them easily.
- **Complex scenarios and extensibility**: Better suited for more complex data generation scenarios where you might have many rules or need to extend the functionality.
- **Maintainability**: Easier to maintain and update the rules in one place.

## Further readings

If you want to learn a bit more about Bogus and use it to populate data used by Entity Framework, I recently published an article about this topic:

 🔗[Seeding in-memory Entity Framework with realistic data with Bogus | Code4IT](https://www.code4it.dev/blog/seed-inmemory-entityframework-bogus/)

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_

But, clearly, the best place to learn about Bogus is by reading the official documentation, that you can find on GitHub.

🔗 [Bogus repository | GitHub](https://github.com/bchavez/Bogus/)

## Wrapping up

This article sort of complements [the previous article about Bogus](https://www.code4it.dev/blog/seed-inmemory-entityframework-bogus/).

I think Bogus is one of the best libraries in the .NET universe, as having realistic data can help you improve the intelligibility of the test cases you generate. Also, Bogus can be a great tool when you want to showcase demo values without accessing real data.

I hope you enjoyed this article! Let's keep in touch on [LinkedIn](https://www.linkedin.com/in/BelloneDavide/), [Twitter](https://twitter.com/BelloneDavide) or [BlueSky](https://bsky.app/profile/bellonedavide.bsky.social)! 🤜🤛

Happy coding!

🐧
