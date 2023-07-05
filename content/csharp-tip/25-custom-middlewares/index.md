---
title: "C# Tip: 2 ways to define ASP.NET Core custom Middleware"
date: 2023-07-04
url: /csharptips/custom-middleware
categories:
  - CSharp Tips
tags:
  - CSharp
  - dotNET
summary: "Customizing the behavior of an HTTP request is easy: you can use a middleware defined as a delegate or as a class."
---

Sometimes you need to create custom logic that must be applied to all HTTP requests received by your ASP.NET Core application. In these cases, you can create a custom *middleware*: pieces of code that are executed sequentially for all incoming requests.

**The order of middlewares matters**. Here's a nice schema published on the [Microsoft website](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/middleware/index/_static/middleware-pipeline.svg):

![Middleware order](./middleware-pipeline.svg)

A Middleware, in fact, can manipulate the incoming `HttpRequest` and the resulting `HttpResponse` objects.

In this article, we're gonna learn 2 ways to create a middleware in .NET.

## Middleware as inline delegates

The easiest way is to define a **delegate function** that must be defined **after** building the `WebApplication`.

By calling the `Use` method, you can update the `HttpContext` object passed as a first parameter.

```cs
app.Use(async (HttpContext context, Func<Task> task) =>
{
    context.Response.Headers.TryAdd("custom-header", "a-value");

    await task.Invoke();
});
```

Note that you have to call the `Invoke` method to call the next middleware.

There is a similar overload that accepts in input a `RequestDelegate` instance instead of `Func<Task>`, but it is considered to be less performant: you should, in fact, use the one with `Func<Task>`.

## Middleware as standalone classes

The alternative to delegates is by defining a custom class.

You can call it whatever you want, but you have some constraints to follow when creating the class:

* it must have a public constructor with a single parameter whose type is `RequestDelegate` (that will be used to invoke the next middleware);
* it must expose a public method named `Invoke` or `InvokeAsync` that accepts as a first parameter an `HttpContext` and returns a `Task`;

Here's an example:

```cs
public class MyCustomMiddleware
{
    private readonly RequestDelegate _next;

    public MyCustomMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        context.Response.Headers.TryAdd("custom-name", "custom-value");
        await _next(context);
    }
}
```

Then, to add it to your application, you have to call

```cs
app.UseMiddleware<MyCustomMiddleware>();
```

## Delegates or custom classes?

Both are valid methods, but each of them performs well in specific cases.

**For simple scenarios, go with inline delegates**: they are easy to define, easy to read, and quite performant. But they are a bit **difficult to test**.

**For complex scenarios, go with custom classes**: this way you can define complex behaviors in a single class, organize your code better, **use Dependency Injection to pass services and configurations to the middleware**. Also, defining the middleware as a class makes it **more testable**. The downside is that, as of .NET 7, **using a middleware resides on reflection**: `UseMiddleware` invokes the middleware by looking for a public method named `Invoke` or `InvokeAsync`. So, theoretically, using classes is less performant than using delegates (I haven't benchmarked it yet, though!).

## Wrapping up

On Microsoft documentation you can find a well-explained introduction to Middlewares:

🔗 [ASP.NET Core Middleware | Microsoft docs](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/middleware)

And some suggestions on how to write a custom middleware as standalone classes:

🔗 [Write custom ASP.NET Core middleware | Microsoft docs](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/middleware/write)

I hope you enjoyed this article! Let's keep in touch on [Twitter](https://twitter.com/BelloneDavide) or [LinkedIn](https://www.linkedin.com/in/BelloneDavide/)! 🤜🤛

Happy coding!

🐧

[ ] Nome cartella e slug devono combaciare
[ ] Immagine di copertina
[ ] Pulizia formattazione
