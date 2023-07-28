---
title: "Advanced Integration Tests with NUnit and .NET 7 API"
date: 2023-07-22T16:45:13+02:00
url: /blog/post-slug
draft: false
categories:
- Blog
tags:
- CSharp
toc: true
summary: "A summary"
---

In a [previous article](https://www.code4it.dev/blog/integration-tests-for-dotnet-api/), we learned a quick way to create Integration tests for .ASP.NET API by using `WebApplicationFactory`. That was a good introductionary article. But now we will delve into more complex topics and examples.

In my opinion, a few Integration tests and just the necessary number of Unit tests are better that hundreds of unit tests and no integration tests at all. In general, the [Testing Diamond should be preferred over the Testing Pyramid](https://www.code4it.dev/architecture-notes/testing-pyramid-vs-testing-diamond/) (well, in most of the cases).

In this article, we are going to create advanced integration tests by defining custom application settings, customizing dependencies to be used only during tests, defining custom logging, and performing complex operations in our tests.

For the sake of this article, I created a sample API application that exposes one single endpoint whose purpose is to retrieve some info about the URL passed as an input. For example,

```plaintext
GET /SocialPostLink?uri=https%3A%2F%2Ftwitter.com%2FBelloneDavide%2Fstatus%2F1682305491785973760
```

will return

```json
{
  "socialNetworkName": "Twitter",
  "sourceUrl": "https://twitter.com/BelloneDavide/status/1682305491785973760",
  "username": "BelloneDavide",
  "id": "1682305491785973760"
}
```

Internally, the code is using the **Chain of responsibility pattern**: there is an handler that "know" if it can handle a specific URL; if it can, it just elaborates the input; otherwise, it calls the next handler;

There is also a Factory that build the chain, and finally a Service that instantiates the factory and then resolves the dependencies.

As you can see, this solution can become complex. We could run lots of Unit tests to validate that the Chain of Responsibility works as expected. We can even write a Unit Tests suite for the Factory.

But, in the end of the day, we don't really care about the internal structure of the project: as long as it works as expected, we could even use a huge `switch` block. So, let's write some Integration Tests.

## IntegrationTestFactory

When creating Integration Tests for .NET APIs you have to instantiate a new instance of `WebApplicationFactory`, a class coming from the `Microsoft.AspNetCore.Mvc.Testing` NuGet Package. 

Since we are going to define it once and reuse it across all the tests, let's create a new class that extends `WebApplicationFactory`, and add some custom behavior in it.

```cs
public class IntegrationTestWebApplicationFactory : WebApplicationFactory<Program>
{

}
```

**Let's focus on the `Program` class**: as you can see, the WebApplicationFactory class requires an entry point. Generally speaking, it's the `Program` class of our application.

If you hover on `WebApplicationFactory<Program>` and  hit *CTRL+.* on Visual Studio, the autocomplete proposes two alternatives: one is the Program class defined in your APIs, the other one is the Program class defined in *Microsoft.VisualStudio.TestPlatform.TestHost*. **Choose the one for your API application**! The WebApplicationFactory class will then instatiate your API following the instructions defined in your Program.cs class, thus resolving all the dependencies and configurations as if you were running your application locally.

**What to do if you don't have the Program class?** If you use top-level statements, you don't have the Program class, because it's "implicit". So you cannot reference the whole class. Unless... You have to create a new `partial class` named `Program`, and leave it empty: this way, you have a class name that can be used to reference the API definition:

```cs
public partial class Program { }
```

Here you can override some definitions of the `WebHost` to be created by calling `ConfigureWebHost`:

```cs
public class IntegrationTestWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
          builder.ConfigureAppConfiguration((host, configurationBuilder) => { });
    }
}
```

Let's learn how to customize it!

## InMemory collection

`WebApplicationFactory` is a class that is highly configurable thanks to the `ConfigureWebHost` method. For instance, you can customize the settings injected in your services.

Usually, you want to rely on the exact same configurations defined in your *appsettings.json* to ensure that the system behaves correctly with the "real" configurations.

But some other times you might want to override a specific configuration key.

The `ConfigureAppConfiguration` method allows you to customize how you manage Configurations by adding or removing sources.

If you want to add some configurations specific to the `IntegrationTestWebApplicationFactory`, you can use `AddInMemoryCollection`, a method that allows you to add configurations in a key-value format:

```cs
protected override void ConfigureWebHost(IWebHostBuilder builder)
{
    builder.ConfigureAppConfiguration((host, configurationBuilder) =>
    {
        configurationBuilder.AddInMemoryCollection(
            new List<KeyValuePair<string, string?>>
            {
                new KeyValuePair<string, string?>("myKey", "myValue")
            });
    });
}
```

Now, even if you had the *myKey* configured in your *appsettings.json* file, the value is now overridden and set to *myValue*.

If you also want to discard all the other exising configuration sources, you can add `configurationBuilder.Sources.Clear();` before `AddInMemoryCollection` and remove all the other exising configurations.

## Custom depenndencies

## Logging

## Calling in-memory API

## testihng on resolved dependencies


## Further readings

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_

https://www.code4it.dev/architecture-notes/testing-pyramid-vs-testing-diamond/

## Wrapping up


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
