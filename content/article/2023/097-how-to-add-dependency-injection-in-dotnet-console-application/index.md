---
title: "How to add Dependency Injection in a .NET7 Console Application"
date: 2023-05-30
url: /blog/how-to-add-dependency-injection-in-dotnet-console-application
draft: false
categories:
- Blog
tags:
- CSharp
- dotNET
toc: true
summary: "A summary"
---

Sometimes, you just want to create a console application to run a complex script. Just because it is a "simple" console application, it doesn't mean that you should not use best practices, such as using Dependency Injection.

Also, you might want to test the code: Depencency Injection allows you to test the behavior of a class without having a strict dependency to the referenced concrete classes: you can use stubs and mocks, instead.

In this article, we're going to learn how to add Dependency Injection in a .NET 7 console application. The same approach can be used for other versions of .NET.

We're going to start small, with the basic parts, and gradually move on to more complex scenarios: configurations and logging.

We will use a simple, silly console application: we will inject a bunch of services, and print a message on console.

We have a root class:

```cs
public class NumberWorker
{
    private readonly INumberService _service;

    public NumberWorker(INumberService service) => _service = service;

    public void PrintNumber()
    {
        var number = _service.GetPositiveNumber();
        Console.WriteLine($"My wonderful number is {number}");

    }
}
```

that injects an `INumberService`, implemented by `NumberService`:

```cs
public interface INumberService
{
    int GetPositiveNumber();
}

public class NumberService : INumberService
{
    private readonly INumberRepository _repo;

    public NumberService(INumberRepository repo) => _repo = repo;

    public int GetPositiveNumber()
    {
        int number = _repo.GetNumber();
        return Math.Abs(number);
    }
}
```

which, in turn, uses an `INumberRepository` implemented by `NumberRepository`:

```cs
public interface INumberRepository
{
    int GetNumber();
}

public class NumberRepository : INumberRepository
{
    public int GetNumber()
    {
        return -42;
    }
}
```

Now, we have to build the dependency tree and inject such services.

## How to create an IHost to use a host for a Console Application

The first step to take is to install some NuGet packages that will allow us to add a custom `IHost` container, so that we can add Dependency Injection and all the customization we usually add in projects that have a StartUp (or a Program) class, such as .NET APIs.

We need to install 2 NuGet packages: *Microsoft.Extensions.Hosting.Abstractions* and *Microsoft.Extensions.Hosting* will be used to create a new `IHost` that will be used to build the dependencies tree.

By navigating your csproj file, you should be able to see something like this:

```xml
<ItemGroup>
    <PackageReference Include="Microsoft.Extensions.Hosting" Version="7.0.1" />
    <PackageReference Include="Microsoft.Extensions.Hosting.Abstractions" Version="7.0.0" />
</ItemGroup>
```

Now we are ready to go! First, add the following `using` statements:

```cs
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
```

and then, within the Program class, add this method:

```cs
private static IHost CreateHost() => 
  Host.CreateDefaultBuilder()
      .ConfigureServices((context, services) =>
      {
          services.AddSingleton<INumberRepository, NumberRepository>();
          services.AddSingleton<INumberService, NumberService>();
          services.AddSingleton<NumberWorker>();
      })     
      .Build();
}
```

`Host.CreateDefaultBuilder()` creates the default `IHostBuilder` - similar to the `IWebHostBuilder`, but without any reference to web components.

Then we add all the dependencies, using `services.AddSingleton<T, K>`. **Notice** that, since we are building the dependency tree and we need a root, even `NumberWorker` is added (using `services.AddSingleton<NumberWorker>()`).

Finally, once we have everything in place, we call `Build()` to create a new instance of `IHost`.

Now, we have to run it!

In the `Main` method, create the host by calling `CreateHost()`. Then, by using the `ActivatorUtilities` class (coming from the *Microsoft.Externsions.DependencyInjection* namespace), create a new instance of `NumberWorker`, so that you can call `PrintNumber()`;

```cs
private static void Main(string[] args)
{
  IHost host = CreateHost();
  NumberWorker worker = ActivatorUtilities.CreateInstance<NumberWorker>(host.Services);
  worker.PrintNumber();
}
```

Now you are ready to run the application, and see the message on console:

![Basic result on Console](./basic-result-on-console.png)


## Add appsettings.json

## Add Serilog logging



## Resolve DI




```cs


using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

internal class Program
{
  private static async Task Main(string[] args)
  {
    IHost host = CreateHost();

    TaxonomyLoader worker = ActivatorUtilities.CreateInstance<TaxonomyLoader>(host.Services);

    bool tagsImported = await worker.ImportTaxonomyTags();
  }

  private static IHost CreateHost() => Host.CreateDefaultBuilder()
                  .ConfigureServices((context, services) =>
                  {
                    services.Configure<MongoDbConfig>(context.Configuration.GetSection("TagsDbStorage"));

                    services.AddSingleton<ITaxonomyRepository, MongoDbTaxonomyRepository>();
                    services.AddSingleton<ITaxonomyTagsSource, FileSystemTaxonomyTagsSource>();
                    services.AddSingleton<TaxonomyLoader>();
                  })
                  .UseSerilog((context, services, configuration) => configuration
                      .ReadFrom.Configuration(context.Configuration)
                      .ReadFrom.Services(services)
                      .Enrich.FromLogContext()
                      .WriteTo.Console()
                      .WriteTo.File($"report-{DateTimeOffset.UtcNow.ToString("yyyy-MM-dd-HH-mm-ss")}.txt", restrictedToMinimumLevel: LogEventLevel.Warning)
                      )
                  .Build();
}
```

## Further readings

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_


## Wrapping up


I hope you enjoyed this article! Let's keep in touch on [Twitter](https://twitter.com/BelloneDavide) or [LinkedIn](https://www.linkedin.com/in/BelloneDavide/)! 🤜🤛

Happy coding!

🐧


[ ] Titoli

[ ] Grammatica

[ ] Bold/Italics

[ ] Alt Text per immagini

[ ] Frontmatter

[ ] Nome cartella e slug devono combaciare

[ ] Immagine di copertina
