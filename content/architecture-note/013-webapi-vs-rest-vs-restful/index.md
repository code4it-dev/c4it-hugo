---
title: "Davide's Code and Architecture Notes - Web APIs vs REST APIs vs pseudo-REST APIs"
date: 2024-07-26
url: /architecture-notes/webapi-vs-rest-vs-pseudo-rest
draft: false
categories:
 - Code and Architecture Notes
tags:
 - Software Architecture
 - API
 - REST
toc: true
summary: "When describing a web service, people often use the wrong terms. Are you really creating a REST API, or is it some sort of pseudo-REST? "
images:
 - /architecture-notes/webapi-vs-rest-vs-pseudo-rest/featuredImage.png
---

_The first version of this article contained a lot of misinterpretations of what REST means, including the fact that REST and RESTful are separate things. A huge thanks to [Andrea Chiarelli](https://www.linkedin.com/in/andreachiarelli/) for pointing it out. I had to rewrite the article almost thoroughly in order to remove all the confusion I tried to clear out, but instead, I helped spread._

In a world full of acronyms and terms, some nuances can get lost. 

People claim they're developing REST APIs even though their APIs do not follow the REST principles. Maybe their APIs are inspired by REST principles, but they are still not REST APIs.

In this article, we will explain the differences and similarities between the three approaches to exposing services and data over the network.

## What are Web APIs?

API stands for Application Programming Interface. It's a common term that indicates how to interact with a system by specifying its list of operations, inputs, and outputs.

A specific type of API is the Web API: a **Web API** is an interface that allows communication between different software applications **over the web**.

**Communication occurs via HTTP or HTTPS**, and data can be exchanged in several formats, such as JSON, XML, or even plain text.

**Not every Web API is also a REST API**: we'll learn why in a second.

## What are REST APIs?

In REST APIs, **everything revolves around the idea of a _resource_**: your APIs do not expose endpoints that represent generic operations (`/getItem`), but using a combination of URL and HTTP method, you can define everything you can do _with a resource_.

REST is an **architectural pattern** that, to be followed, requires you to follow some principles:

- **Statelessness**: Each request from the client must contain all necessary information; **the server doesn't store the client state**. There is no context shared across different requests, making the system easier to scale and maintain.
- **Cacheability**: Responses can be cached to improve performance. You can use the ETag header to understand whether the cache is valid.
- **Resource-Based**: REST APIs expose resource operations via URL, and clients interact with these resources using standard HTTP methods. Each HTTP method has a specific meaning (so, put short, if you are using a POST to retrieve an entity's information, you are not adhering to the REST specification)
- **Uniform Interface**: Resources are exposed via a consistent representation (using URLs). In general, you want your URLs to be structured like `/{resource-type}/{id}`; for example, information about the book with ID 555 should be retrieved at the URL `/book/555` (notice that it's `book`, singular, and not `books`).
- **Operations via HTTP methods**: You must use standard HTTP methods (GET, POST, PUT, DELETE) to represent the operations on a resource. For example, GET must retrieve information, while DELETE must be used delete an entity. You must not use GET to delete a resource.
- **Scalability**: REST APIs are lightweight and scalable.

**REST is an acronym that means "REpresentational State Transfer"**. Let's focus on each word of the acronym. 

**"RE" stands for REpresentational**: this means that you are not accessing the resources directly, but you are referring to a **representation** of such entities. Working with representations and not with direct access allows you to decouple client and server, bringing also the benefit of scalability. 

**"ST" stands for State Transfer**: your APIs must include all the information to retrieve everything correlated to the resource in a self-explaining way. For example, suppose that you have a `GET /book/42`. This endpoint should return something like:


```json
{
    "id": 42,
    "title": "The Hitchhiker's Guide to the Galaxy",
    "authorName": "Douglas Adams",
    "publicationYear": 1979,
    "genre": "comedy",
    "links": [
 {
            "href": "https://api.mylibrary.com/book/42",
            "rel": "self"
 },
 {
            "href": "https://api.mylibrary.com/author/123",
            "rel": "author"
 },
 {
            "href": "https://api.mylibrary.com/genres/861",
            "rel": "genre"
 }
 ]
}
```

This list of endpoints stored in the `links` section allows clients to navigate to the details of the entities related to this book. These links form the so-called **HATEOAS** (_Hypermedia as the Engine of Application State_), and allow clients to navigate to all the entities related to the retrieved one without having previous knowledge of the other endpoints exposed by the system.

HATEOAS is a fundamental part of REST, since it allows clients to access the state of the resource (remember the "S" in "REST"?).

## What are pseudo-REST APIs?

The harsh reality is that **most of us write pseudo-REST APIs**.

Most teams develop the usual type of APIs using some REST practices but do not thoroughly implement the architectural pattern.

I bet most of you use HTTP Verbs to perform CRUD operations on your entity. 

But I can also imagine that you don't implement HATEOAS and don't provide **content negotiation**.

The truth is that you either create a REST API or you don't. There is no such thing as REST-ish API.

![There is no such thing as pseudo-REST](yoda.png)

## Further readings

REST APIs were first described by Dr Roy Fielding in his doctorial dissertation. The original paper is available online:

🔗 [Architectural Styles and the Design of Network-based Software Architectures | Roy Thomas Fielding](https://ics.uci.edu/~fielding/pubs/dissertation/fielding_dissertation.pdf)

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_

When you create a resource using REST APIs you should also return the reference to the details of the newly created resource. In ASP.NET, it's easy: you can use `CreatedAtAction` and `CreatedAtRoute`.

🔗 [Getting resource location with CreatedAtAction and CreatedAtRoute action results | Code4IT](https://www.code4it.dev/blog/createdatroute-createdataction/)

[Andrea Chiarelli](https://www.linkedin.com/in/andreachiarelli/), who helped me understand that the first version of this article was wrong and misleading, wrote a great article explaining what REST really means. It's written in Italian, but I'm sure you'll be able to translate it using an online tool.

🔗 [Tutti quanti voglion fare REST | Andrea Chiarelli](https://www.html.it/articoli/cos-e-rest-caratteristiche/)


## Wrapping up

Understanding the correct terminology helps us use a shared language, avoiding misunderstandings.

Even if you don't need to know all the details of the REST principles, it's important to at least know that not all Web APIs are REST APIs.

I hope you enjoyed this article! Let's keep in touch on [Twitter](https://twitter.com/BelloneDavide) or [LinkedIn](https://www.linkedin.com/in/BelloneDavide/)! 🤜🤛

Happy coding!

🐧


## A final personal note

As I wrote at the beginning of this article, the first version of this blog post, instead of clarifying what is and what is not REST, helped spread misinformation.

Unfortunately, online, there is so much content that explains that REST and RESTful APIs are separate things, some sort of "RESTful is a REST API with all the parts implemented", that I fell into the trap as well.

**I apologize to all of you, my dear readers.** I will do my best to avoid a situation like this will happen again, studying even more before writing my articles.

Again, a huge thank you to Andrea. I invite you to comment on my (and others') articles and videos to tell when we are wrong - one of the reasons I write is to clear my mind around certain topics, and having people correcting you is a great way to learn.

Sorry again,
Davide