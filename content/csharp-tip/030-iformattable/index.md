---
title: "C# Tip: IFormattable interface, to define different formats for the same object"
date: 2024-02-19T09:54:22+01:00
url: /csharptips/iformattable-interface
draft: false
categories:
 - CSharp Tips
tags: 
 - CSharp
toc: false
summary: "Same object, different string representations. How do we achieve it in a standardised way?"
images:
 - /csharptips/iformattable-interface/featuredImage.png
---

Even when the internal data is the same, sometimes you can represent it in different ways. Think of the `DateTime` structure: by using different modifiers, you can represent the same date in different formats:

```cs
DateTime dt = new DateTime(2024, 1, 1, 8, 53, 14);

Console.WriteLine(dt.ToString("yyyy-MM-dddd")); //2024-01-Monday
Console.WriteLine(dt.ToString("Y")); //January 2024
```

Same datetime, different formats.

You can further customise it by adding the `CultureInfo`:

```cs
System.Globalization.CultureInfo italianCulture = new System.Globalization.CultureInfo("it-IT");

Console.WriteLine(dt.ToString("yyyy-MM-dddd", italianCulture)); //2024-01-lunedì
Console.WriteLine(dt.ToString("Y", italianCulture)); //gennaio 2024
```

Now, how can we use this behaviour in our custom classes?

## IFormattable interface

Take this simple POCO class:

```cs
public class Person
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateTime BirthDate { get; set; }
}
```

We can make this class implement the `IFormattable` interface so that we can define and use the *advanced* `ToString`:

```cs
public class Person : IFormattable
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateTime BirthDate { get; set; }

    public string ToString(string? format, IFormatProvider? formatProvider)
    {
        // Here, you define how to work with different formats
    }
}
```

Now, we can define the different formats. Since I like to keep the available formats close to the main class, I added a nested class that only exposes the names of the formats.

```cs
public class Person : IFormattable
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateTime BirthDate { get; set; }

    public string ToString(string? format, IFormatProvider? formatProvider)
    {
        // Here, you define how to work with different formats
    }

    public static class StringFormats
    {
        public const string FirstAndLastName = "FL";
        public const string Mini = "Mini";
        public const string Full = "Full";
    }
}
```

Finally, we can implement the `ToString(string? format, IFormatProvider? formatProvider)` method, taking care of all the different formats we support (remember to handle the case when the format is not recognised!)

```cs
public string ToString(string? format, IFormatProvider? formatProvider)
{
    switch (format)
    {
        case StringFormats.FirstAndLastName:
            return string.Format("{0} {1}", FirstName, LastName);
        case StringFormats.Full:
        {
            FormattableString fs = $"{FirstName} {LastName} ({BirthDate:D})";
            return fs.ToString(formatProvider);
        }
        case StringFormats.Mini:
            return $"{FirstName.Substring(0, 1)}.{LastName.Substring(0, 1)}";
        default:
            return this.ToString();
    }
}
```

A few things to notice:

1. I use a `switch` statement based on the values defined in the `StringFormats` subclass. If the format is empty or unrecognised, this method returns the default implementation of `ToString`.
2. You can use whichever way to generate a string, like *string interpolation*, or more complex ways;
3. In the `StringFormats.Full` branch, I stored the string format in a `FormattableString` instance to apply the input `formatProvider` to the final result.

## Calling a custom format of the object

We can try the different formatting options now that we have implemented them all.

Look at how the behaviour changes based on the formatting and input culture (Hint: *venerdí* is the Italian for *Friday*.).

```cs
Person person = new Person
{
    FirstName = "Albert",
    LastName = "Einstein",
    BirthDate = new DateTime(1879, 3, 14)
};

System.Globalization.CultureInfo italianCulture = new System.Globalization.CultureInfo("it-IT");

Console.WriteLine(person.ToString(Person.StringFormats.FirstAndLastName, italianCulture)); //Albert Einstein

Console.WriteLine(person.ToString(Person.StringFormats.Mini, italianCulture)); //A.E

Console.WriteLine(person.ToString(Person.StringFormats.Full, italianCulture)); //Albert Einstein (venerdì 14 marzo 1879)

Console.WriteLine(person.ToString(Person.StringFormats.Full, null)); //Albert Einstein (Friday, March 14, 1879)

Console.WriteLine(person.ToString(Person.StringFormats.Full, CultureInfo.InvariantCulture)); //Albert Einstein (Friday, 14 March 1879)

Console.WriteLine(person.ToString("INVALID FORMAT", CultureInfo.InvariantCulture)); //Scripts.General.IFormattableTest+Person

Console.WriteLine(string.Format("I am {0:Mini}", person)); //I am A.E

Console.WriteLine($"I am not {person:Full}"); //I am not Albert Einstein (Friday, March 14, 1879)
```

Not only that, but now the result can also depend on the Culture related to the current thread:

```cs
       using (new TemporaryThreadCulture(italianCulture))
        {
            Console.WriteLine(person.ToString(Person.StringFormats.Full, CultureInfo.CurrentCulture)); // Albert Einstein (venerdì 14 marzo 1879)
        }

        using (new TemporaryThreadCulture(germanCulture))
        {
            Console.WriteLine(person.ToString(Person.StringFormats.Full, CultureInfo.CurrentCulture)); //Albert Einstein (Freitag, 14. März 1879)
        }

```

(note: `TemporaryThreadCulture` is a custom class that I explained in a previous article - see below)

## Further readings

You might be thinking «wow, somebody still uses `String.Format`? Weird!»

Well, even though it seems an old-style method to generate strings, it's still valid, as I explain here:

🔗[How to use String.Format - and why you should care about it | Code4IT](https://www.code4it.dev/blog/how-to-use-string-format/)

Also, how did I temporarily change the culture of the thread? Here's how:
🔗 [C# Tip: How to temporarily change the CurrentCulture | Code4IT](https://www.code4it.dev/csharptips/change-current-culture-in-using-block/)

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