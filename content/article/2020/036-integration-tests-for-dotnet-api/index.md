---
title: How to run integration tests for .NET API
date: 2020-08-11
url: /blog/integration-tests-for-dotnet-api
draft: false
categories:
  - Blog
tags:
  - Tests
  - dotnet
  - CSharp
toc: true
summary: Integration tests are useful to check if multiple components fit together well. How can you test your APIs? And how can you mock dependencies?
keywords:
  - dotnet
  - csharp
  - testing
  - integration-tests
  - dependency-injection
  - webapplicationfactory
images:
  - /blog/integration-tests-for-dotnet-api/featuredImage.png
---

You already write Unit tests, right?

But sometimes you want to perform more deep tests, and test not only a small part of your code but the whole execution.

In this article, I'm going to explain how to run integration tests on your APIs without relying on external tools like Postman: all the tests will be defined within the same solution next to your unit tests.

Just as a reminder: **integration tests are used to check that multiple parts of your system work correctly together**; this includes networks, database access, file system and so on. The correctness of single components (meaning single classes and methods) is tested via unit tests.

Time to write some code!

## API setup

I've created a simple API with .NET Core 3.1.

It's really simple: there's only one endpoint, `/api/pokemon/{pokemonName}` which, given a Pokémon name, returns its number and its types.

```cs
[HttpGet]
[Route("{pokemonName}")]
public async Task<ActionResult<PokemonViewModel>> Get(string pokemonName)
{
    var fullInfo = await _pokemonService.GetPokemonInfo(pokemonName);
    if (fullInfo != null)
    {
        return new PokemonViewModel
        {
            Name = fullInfo.Name,
            Number = fullInfo.Order,
            Types = fullInfo.Types.Select(x => x.Type.Name).ToArray()
        };
    }
    else
        return NotFound();
}
```

The `_pokemonService` variable is populated in the constructor via Dependency Injection, and its type is `IPokemonService`.

The `IPokemonService` interface is implemented by the `PokemonService` class, which read data from an external API, _https://pokeapi.co/api_, parses the result, and then returns it with a complex structure. The API controller calls the `GetPokemonInfo` method and maps some of the fields to the view model.

Lastly, let's not forget to define the dependencies in the Startup class:

```cs
public void ConfigureServices(IServiceCollection services)
{
    services.AddControllers();
    services.AddScoped<IPokemonService, PokemonService>();
}
```

That's it! Nothing cumbersome, right?

_TIP: do you know the difference between Scoped and Transient when talking about DI? [Check out this article!](https://www.code4it.dev/blog/dependency-injection-lifetimes "Dependency Injection lifetimes in .NET - my epiphany")_

## In-memory test server

Time for some tests!

Create a new test project within the same solution; you can use your favorite testing framework: there's no difference in using MSTest, NUnit, XUnit, or something else.

When you're done, you need to **install the
Microsoft.AspNetCore.Mvc.Testing package** via NuGet or via CLI.

The purpose of my tests is to instantiate an instance of my APIs in memory, call them, and check the result of the whole process.

First of all, you need to instantiate a new `HttpClient`:

```cs
var factory = new WebApplicationFactory<APIIntegrationTestsExample.Program>();

var client = factory.CreateClient();
```

The variable `factory` creates a [TestServer](https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.testhost.testserver "TestServer class definition") whose starting point is defined in the `APIIntegrationTestsExample.Program` class: this is exactly the one used by the real project, and scaffolded by default by .NET when creating the new project. This assures that **we are using all the real dependencies and configurations**.

Finally, I've created the HTTP client that can be used to interact with my API; you can do it in the simplest way you can imagine:

```cs
 HttpResponseMessage sutHttpResponse = await client.GetAsync($"/api/pokedex/magmar");
```

Here I have called the endpoint exposed by my in-memory server and stored the result in the `sutHttpResponse` variable. Now I can check whatever I want, from status code to content:

```cs
string stringContent = await sutHttpResponse.Content.ReadAsStringAsync();

var sutObjectResult = JsonSerializer.Deserialize<PokemonViewModel>(stringContent, new JsonSerializerOptions
{
    PropertyNameCaseInsensitive = true
});

Assert.AreEqual("Magmar", sutObjectResult.Name, true);

Assert.IsTrue(sutHttpResponse.IsSuccessStatusCode);
```

## Mocking dependencies

There might be cases where you want to mock a dependency to avoid connections with external resources, like a database or an external API. In this case, I want to replace the PokemonService class with a mocking one. This can be a concrete class, defined in your test library, or a mock created with external tools like _Moq_ and _NSubstitute_.

Once you have defined the mocking class, that I called MockPokemonService, you can replace the creation of the HttpClient object:

```cs
var client = factory.WithWebHostBuilder(builder =>
{
    // Microsoft.AspNetCore.TestHost;
    builder.ConfigureTestServices(services =>
    {
        services.AddScoped<IPokemonService, MockPokemonService>();
    });
}).CreateClient();
```

In this way, you can customize the client by adding additional services, thanks to the `ConfigureTestServices` method defined in the _Microsoft.AspNetCore.TestHost_ namespace. **Notice that you must use ConfigureTestServices, not ConfigureServices!**

This will override only the specified dependency with the specified one.

I used this method in a project to remove the dependencies from an external API which returned a very complicated JSON file and replace that remote data with an in-memory copy, [using a JSON manifest file as a static resource](https://www.code4it.dev/blog/mock-dependency-with-manifest-resources "How to mock dependencies with Manifest resources").

## Conclusion

You should care not only to write unit tests but also the other types (integration tests, end-to-end tests and so on).

Here we've seen how to instantiate a TestServer to call our APIs and check the results.

An idea can be to instantiate the HttpClient in the constructor or in the test setup, and write tests on different inputs.

Have you ever used it?

[On the Microsoft documentation](https://docs.microsoft.com/en-us/aspnet/core/test/integration-tests "Integration tests explanation on Microsoft docs") you'll find a complete description of Integration tests with C#.

If you want to see this example, head to [my GitHub repo!](https://github.com/code4it-dev/APIIntegrationTestsExample "APIIntegrationTestsExample repository on GitHub")

Happy coding!
