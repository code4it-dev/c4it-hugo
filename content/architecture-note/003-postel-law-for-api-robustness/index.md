---
title: "Postel's law for API Robustness"
date: 2023-04-18
url: /architecture-notes/postel-law-for-api-robustness
draft: false
categories:
  - Code and Architecture Notes
tags:
  - Software Architecture
  - API
toc: true
summary: "A system should be **robust**: it should be able to resist change and, well, not generate regressions. Postel's law helps define a mindset to create robust APIs."
---

When designing and building Web APIs, we should follow Postel's law to make our API more robust.

Given the original definition, the law states that you must

> Be conservative in what you do, be liberal in what you accept from others

But it is often reworded as

> be conservative in what you send, be liberal in what you accept

Ok, what? But what does it actually mean?

## Robustness: a Software Quality Attribute

Before talking about Postel's law, we should spend just a few words about robustness.

It's quite difficult to find a definition of robustness. But we can say that _robustness is the property of a system not to break in case of minor changes_.

Note that **Robustness and Reliability are not the same thing**: a system is reliable if it can properly work for a certain period of time under some conditions: for example, a reliable system should be able to work in case of unexpected errors, should be available to users, and so on. Robustness is a slightly different Quality Attribute.

Now, there's a problem with Robustness as a Quality Attribute: it's difficult to measure it. So? Should we really care about it? YES.

## Postel's law applied to APIs

Let's get back to Postel's law.

It was first introduced in the [RFC definition of TCP](https://datatracker.ietf.org/doc/html/rfc761#section-2.10), in 1980.

That section (which is quite short, indeed) states that:

> TCP implementations should follow a general principle of robustness:
> be conservative in what you do, be liberal in what you accept from others.

This was a golden rule used to define the TCP protocol, but it has been adapted to API definitions (well, with a bit of common sense):

> be conservative in what you send, be liberal in what you accept

What does it mean, in the end?

Let me explain it with an example: you are building an API used to integrate a bookstore.

It exposes only one method:

```plaintext
GET /books
```

with some query string parameters: name and year. This endpoint returns a list of books.

Now, how can we make this endpoint robust?

### Be conservative in what you send

When a client calls you, do not change the returned result to avoid breaking changes.

So, for example, if your endpoint returns

```json
{
  "id": 123,
  "title": "My wonderful book"
}
```

consider that all the callers expect to have those two fields with those exact names.

Postel's law says that you should not change the names of existing properties: this will make your system robust and **prevent regressions**.

Clearly, the more fields you expose, the higher the probability to add regressions; return only the really necessary fields!

Some basic rules to "be conservative":

1. do not change the name of existing properties;
2. do not change the type of existing properties: if you've defined `year` as a number, don't change it to a string;
3. APIs should return only necessary properties: the more fields you add, the higher the probability to create regressions.

### Be liberal in what you accept

On the other side, we should not be too strict in what our system should accept.

Here's a valid API call to our system:

```plaintext
GET /books?name=eragon&year=2002
```

how can we _be liberal in what we accept_?

For example, we _should not_ return Bad Request in the case the caller adds some not recognized parameters:

```plaintext
GET /books?name=eragon&year=2002&not_existing_property=value
```

_not_existing_property_ is not one of the parameters supported by our API: we should simply ignore it.

Some basic rules to "be liberal":

1. ignore not supported parameters (not only valid for query string but also for HTTP headers and HTTP body);
2. don't let everything pass: **always validate the input**;
3. accept different data types; say that your system treats years as numbers: if the caller sends you a year as a string, try to convert it as an integer;

## How to embrace change?

Ok, but our systems need to evolve - they cannot be frozen in eternity. How can we make our systems able to evolve but still robust?

First of all, we should follow the basic rules listed above. But then we need some ways to develop new functionalities without impacting the clients.

A good first approach is by using **Feature Flags**: we can develop new functionalities and enable them only when they're thoroughly tested (**we should also test against regressions**). Then we can release this new functionality only to a subset of total users to see if we've actually missed something.

Clearly, good **versioning** is crucial: clients should be able to understand which functionalities and changes are available in a specific version.

And, finally, instead of removing stuff, such as API endpoints or parameters, we should **deprecate** them and tell the consumers that we will remove them in a future _version_ of the API.

In the end, the golden rule is: **communicate clearly**. Good internal documentation, clear communication with clients, and so on.

In this way, we make our APIs robust and reliable.

## Further readings

The RFC 761 that described TCP and that contains the first definition of Postel's law is public:

🔗 [Robustness Principle | RFC 761](https://datatracker.ietf.org/doc/html/rfc761#section-2.10)

On IBM's website, you can find even more details about robustness and Postel's law. If you are interested in this topic, I highly recommend having a look at this article:

🔗 [Robustness | IBM Cloud](https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-robustness)

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_

Finally, here's another interesting content about Robustness and Postel's law, with some examples in Java:

🔗 [Why you should follow the robustness principle in your APIs | Jose Coscia](https://engineering.klarna.com/why-you-should-follow-the-robustness-principle-in-your-apis-b77bd9393e4b)

As we said, it's important to communicate clearly what endpoints, parameters, and returned objects are available on our APIs. A good way to do that in .NET applications is by using Swagger. In particular, you might want to add different documentation based on different versions. Here's a quick tip on how to specify versions on Swagger

🔗 [Understanding Swagger integration in .NET Core | Code4IT](https://www.code4it.dev/blog/swagger-integration/#include-swagger-in-the-project)

## Wrapping up

In this article, we've learned that Postel's law helps us set a path to create robust APIs.

In short, we have to validate our inputs, be explicit in what we accept and what we return, and do our best not to generate regressions.

I hope you enjoyed this article! Let's keep in touch on [Twitter](https://twitter.com/BelloneDavide) or on [LinkedIn](https://www.linkedin.com/in/BelloneDavide/), if you want! 🤜🤛

Happy coding!

🐧
