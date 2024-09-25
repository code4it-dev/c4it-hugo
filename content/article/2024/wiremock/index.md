---
title: "How to integrate WireMock and IHttpClientFactory using Moq"
date: 2024-09-23T10:43:17+02:00
url: /blog/post-slug
draft: false
categories:
 - Blog
tags:
 - CSharp
toc: true
summary: "A summary"
images:
 - /blog/post-slug/featuredImage.png
---


Testing the integration with external HTTP clients can be a cumbersome task, but most of the times it is necessary to ensure that a method is able to perform correct operations - not only sending the right information, but also ensuring that whe are able to read the content retuned from an API.

Instead of spinning up a real server (even if in the local environment), we can simulate a connection to a mock server. A good library to create in-memory, temporary servers is WireMock. 

In many articles, the focus in on creating a simple `HttpClient`, using WireMock to drive its behavior. In this article, we are going to do a little step further: we are going to use WireMock to handle `HttpClient`s generated, using Moq, via `IHttpClientFactory`.

## A dummy service

As per every practical article, we have to start with a dummy example.

For the sake of this article, I've created a dummy class with a single method that calls an external API to retrieve details of a book and then reads the retuned content. If the call was successful, the method returns an instance of `Book`; otherwise, it throws a `BookServiceException` exception.

Just for completeness, here's the `Book` class:

```cs
public class Book
{
    public int Id { get; set; }
    public string Title { get; set; }
}
```

and here's the `BookServiceException` definition:

```cs
[Serializable]
public class BookServiceException : Exception
{
    public BookServiceException(string message, Exception inner) : base(message, inner) { }
    protected BookServiceException(
        System.Runtime.Serialization.SerializationInfo info,
        System.Runtime.Serialization.StreamingContext context) : base(info, context) { }
}
```

Finally, we have our main class: 

```cs
public class BookService
{
    private readonly IHttpClientFactory _httpClientFactory;

    public BookService(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    public async Task<Book> GetBookById(int id)
    {

        string url = $"/api/books/{id}";
        HttpClient httpClient = _httpClientFactory.CreateClient("books_client");

        try
        {
            Book? book = await httpClient.GetFromJsonAsync<Book>(url);
            if (book is null)
                throw new BookServiceException("The received book is null");

            return book;
        }
        catch (BookServiceException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw new BookServiceException($"There was an error while getting info about the book {id}", ex);
        }
    }
}
```

There are just two things to notice:

- we are injecting an instance of `IHttpClientFactory` in the constructor.
- we are generating an instance of `HttpClient` by specifying a name to the `CreateClient` method of `IHttpClientFactory`.

Now that we have our cards on the table, we can start!

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
- [ ] Alt Text per immagini
- [ ] Trim corretto per bordi delle immagini
- [ ] Rimuovi secrets dalle immagini
- [ ] Controlla se ASP.NET Core oppure .NET
- [ ] Pulizia formattazione
- [ ] Add wt.mc_id=DT-MVP-5005077 to links


## Appunti iniziali

usa HttpClientFactory 

https://code-maze.com/integration-testing-wiremock-dotnet/