---
title: "How to use IHttpClientFactory and WireMock.NET together using Moq"
date: 2024-10-01
url: /blog/wiremock-ihttpclientfactory-moq
draft: false
categories:
  - Blog
tags:
  - CSharp
  - Tests
toc: true
summary: "WireMock.NET is a popular library used to simulate network communication through HTTP. But there is no simple way to integrate the generated in-memory server with an instance of IHttpClientFactory injected via constructor. Right? Wrong!"
images:
  - /blog/wiremock-ihttpclientfactory-moq/featuredImage.png
keywords:
  - http
  - moq
  - httpclient
  - httpclientfactory
  - csharp
  - dotnet
  - testing
  - unit-tests
  - integration-tests
  - wiremock
---

Testing the integration with external HTTP clients can be a cumbersome task, but most of the time, it is necessary to ensure that a method is able to perform correct operations - not only sending the right information but also ensuring that we are able to read the content returned from the called API.

Instead of spinning up a real server (even if in the local environment), we can simulate a connection to a mock server. A good library for creating temporary in-memory servers is WireMock.NET.

Many articles I read online focus on creating a simple `HttpClient`, using WireMock.NET to drive its behaviour. In this article, we are going to do a little step further: we are going to use WireMock.NET to handle `HttpClient`s generated, using Moq, via `IHttpClientFactory`.

## Explaining the dummy class used for the examples

As per every practical article, we must start with a dummy example.

For the sake of this article, I've created a dummy class with a single method that calls an external API to retrieve details of a book and then reads the returned content. If the call is successful, the method returns an instance of `Book`; otherwise, it throws a `BookServiceException` exception.

Just for completeness, here's the `Book` class:

```cs
public class Book
{
    public int Id { get; set; }
    public string Title { get; set; }
}
```

And here's the `BookServiceException` definition:

```cs
[Serializable]
public class BookServiceException: Exception
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
                return book;
        }
        catch (Exception ex)
        {
                throw new BookServiceException($"There was an error while getting info about the book {id}", ex);
        }
    }
}
```

There are just two things to notice:

- We are injecting an instance of `IHttpClientFactory` into the constructor.
- We are generating an instance of `HttpClient` by **passing a name to the `CreateClient` method of `IHttpClientFactory`**.

Now that we have our cards on the table, we can start!

## WireMock.NET, a library to simulate HTTP calls

[WireMock](https://wiremock.org/) is an open-source platform you can install locally to create a real mock server. You can even create a cloud environment to generate and test HTTP endpoints.

However, for this article we are interested in the **NuGet package that takes inspiration from the WireMock project**, allowing .NET developers to generate disposable in-memory servers: `WireMock.NET`.

To add the library, you must add the `WireMock.NET` NuGet package to your project, for example using `dotnet add package WireMock.Net`.

Once the package is ready, you can generate a test server in your Unit Tests class:

```cs
public class WireMockTests
{
    private WireMockServer _server;

    [OneTimeSetUp]
    public void OneTimeSetUp()
    {
        _server = WireMockServer.Start();
    }

    [SetUp]
    public void Setup()
    {
        _server.Reset();
    }

    [OneTimeTearDown]
    public void OneTimeTearDown()
    {
        _server.Stop();
    }
}
```

You can instantiate a new instance of `WireMockServer` in the `OneTimeSetUp` step, store it in a private field, and make it accessible to every test in the test class.

Before each test run, you can **reset the internal status of the mock server** by running the `Reset()` method. I'd suggest you reset the server to avoid unintentional internal status, but it all depends on what you want to do with the server instance.

Finally, remember to free up resources by calling the `Stop()` method in the `OneTimeTearDown` phase (but not during the `TearDown` phase: you still need the server to be on while running your tests!).

## Basic configuration of HTTP requests and responses with WireMock.NET

The basic structure of the definition of a mock response using WireMock.NET is made of two parts:

1. Within the `Given` method, you define the HTTP Verb and URL path whose response is going to be mocked.
2. Using `RespondWith` you define what the mock server must return when the endpoint specified in the `Given` step is called.

In the next example, you can see that the `_server` instance (the one I instantiated in the `OneTimeSetUp` phase, remember?) must return a specific body (`responseBody`) and the 200 HTTP Status Code when the `/api/books/42` endpoint is called.

```cs
string responseBody = @"
{
""Id"": 42,
""Title"": ""Life, the Universe and Everything""
}
";

_server
 .Given(Request.Create().WithPath("/api/books/42").UsingGet())
 .RespondWith(
  Response.Create()
 .WithStatusCode(200)
 .WithBody(responseBody)
 );
```

Similarly, you can define that an endpoint will return an error by changing its status code:

```cs
_server
.Given(Request.Create().WithPath("/api/books/42").UsingGet())
.RespondWith(
  Response.Create()
 .WithStatusCode(404)
);
```

All in all, both the request and the response are highly customizable: you can add HTTP Headers, delays, cookies, and much more.

Look closely; there's one part that is missing: **What is the full URL?** We have declared only the path (`/api/books/42`) but have no info about the hostname and the port used to communicate.

## How to integrate WireMock.NET with a Moq-driven IHttpClientFactory

In order to have WireMock.NET react to an HTTP call, we have to call the exact URL - even the hostname and port must match. But when we create a mocked `HttpClient` - like we did [in this article](https://www.code4it.dev/blog/testing-httpclientfactory-moq/) - we don't have a real hostname. So, how can we have WireMock.NET and `HttpClient` work together?

The answer is easy: since `WireMockServer.Start()` automatically picks a free port in your localhost, you don't have to guess the port number, but you can reference the current instance of `_server`.

Once the `WireMockServer` is created, **internally it contains the reference to one or more URLs it will use to listen for HTTP requests**, intercepting the calls and **replying in place of a real server**. You can then use one of these ports to configure the `HttpClient` generated by the `HttpClientFactory`.

Let's see the code:

```cs
[Test]
public async Task GetBookById_Should_HandleBadRequests()
{
    string baseUrl = _server.Url;

    HttpClient myHttpClient = new HttpClient() { BaseAddress = new Uri(baseUrl) };

    Mock<IHttpClientFactory> mockFactory = new Mock<IHttpClientFactory>();
    mockFactory.Setup(_ => _.CreateClient("books_client")).Returns(myHttpClient);

    _server
        .Given(Request.Create().WithPath("/api/books/42").UsingGet())
        .RespondWith(
            Response.Create()
            .WithStatusCode(404)
        );

    BookService service = new BookService(mockFactory.Object);

    Assert.CatchAsync<BookServiceException>(() => service.GetBookById(42));
}
```

First we access the base URL used by the mock server by accessing `_server.Url`.

We use that URL as a base address for the newly created instance of `HttpClient`.

Then, we create a mock of `IHttpClientFactory` and configure it to return the local instance of `HttpClient` whenever we call the `CreateClient` method with the specified name.

In the meanwhile, we define how the mock server must behave when an HTTP call to the specified path is intercepted.

Finally, we can pass the instance of the mock `IHttpClientFactory` to the `BookService`.

So, the key part to remember is that you can simply access the `Url` property (or, if you have configured it to handle many URLs, you can access the `Urls` property, that is an array of strings).

## Let WireMock.NET create the HttpClient for you

As suggested by [Stef](https://github.com/StefH) in the comments to this post, there's actually another way to generate the HttpClient with the correct URL: let WireMock.NET do it for you.

Instead of doing

```cs
string baseUrl = _server.Url;

HttpClient myHttpClient = new HttpClient() { BaseAddress = new Uri(baseUrl) };
```

you can simplify the process by calling the `CreateClient` method:

```cs
HttpClient myHttpClient = _server.CreateClient();
```

Of course, you will still have to pass the instance to the mock of `IHttpClientFactory`.

## Further readings

It's important to notice that **WireMock and WireMock.NET are two totally distinct things**: one is a platform, and one is a library, owned by a different group of people, that mimics some functionalities from the platform to help developers write better tests.

WireMock.NET is greatly integrated with many other libraries, such as xUnit, FluentAssertions, and .NET Aspire.

You can find the official repository on GitHub:

🔗 [WireMock.Net | Github](https://github.com/WireMock-Net/WireMock.Net)

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_

It's important to remember that using an `HttpClientFactory` is generally more performant than instantiating a new `HttpClient`. Ever heard of _socket exhaustion_?

🔗 [Use IHttpClientFactory to generate HttpClient instances | Code4IT](https://www.code4it.dev/csharptips/use-httpclientfactory-instead-of-httpclient/)

Finally, for the sake of this article I've used Moq. However, there's a similar library you can use: NSubstitute. The learning curve is quite flat: in the most common scenarios, it's just a matter of syntax usage.

🔗 [Moq vs NSubstitute: syntax cheat sheet | Code4IT](https://www.code4it.dev/blog/moq-vs-nsubstitute-syntax/)

## Wrapping up

In this article, we almost skipped all the basic stuff about WireMock.NET and tried to go straight to the point of integrating WireMock.NET with IHttpClientFactory.

There are lots of articles out there that explain how to use WireMock.NET - just remember that WireMock and WireMock.NET are not the same thing!

I hope you enjoyed this article! Let's keep in touch on [LinkedIn](https://www.linkedin.com/in/BelloneDavide/) or [Twitter](https://twitter.com/BelloneDavide)! 🤜🤛

Happy coding!

🐧
