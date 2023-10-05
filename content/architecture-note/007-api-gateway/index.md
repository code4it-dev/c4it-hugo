---
title: "Davide's Code and Architecture Notes - API Gateways are NOT the solution for every problem."
date: 2023-10-04T16:24:47+02:00
url: /architecture-notes/post-slug
draft: false
categories:
- Code and Architecture Notes
tags:
- Software Architecture
- API Gateway
toc: true
summary: "A summary"
images:
- /architecture-notes/post-slug/featuredImage.png
---

Especially when talking about *microservices*, many articles and videos focus on an architectural element that, in their opinion, is the silver bullet for building such applications: *API Gateways*.

Yes, they are actually useful, but they are not the solution to every architectural problem.

In this article, we are going to learn what are API Gateways, what are their pros and cons, why you should not confuse them with Load Balancers, and more.

## What is an API Gateway?

Imagine that your application is made of several web services and APIs. Each of them will be deployed on a separate host, therefore having a different URL.

While it can be useful for internal development - you have a clear separation of operations available in your system - it can become cumbersome for developers to integrate all those endpoints in their application.

That's where API Gateways come to play: they add a sort of *facade* in front of your set of APIs to uniform the access to your system. 

Say that our Hotel booking system is made of 3 services:

- BookingAPI, deployed at *https://bookings.mycompany.org/api*
- SearchAPI, deployed at *https://mycompany.org/search/api* 
- DiscountAPI, deployed at *https://discounts.mycompany.org/v1/api* (notice the *v1*)

By adding an API Gateway we can hide these APIs behind a single host, like *https://api.mycompany.org/*.

As per every thing in the world, there are advantages and disadvantages.


èèèèèèèèèèèèèèèè AGGIUNGI IMMAGINE èèèèèèèèèèèèèèèèèè

## Advantages of an API Gateway

### Internal API security


Since your internal APIs are hidden behind an API Gateway, you make them *less* discoverable by intruders that might want to access your systems and data.

External users will only see the *api.mycompany.com* host, without exposing the internal API services. This **reduces the attack surface**.

You can also centralize Access Control Policies by adding them to the API Gateway and have them applied to all the APIs behind the Gateway.

### Reduce complexity


There are some concerns that are shared to all the APIs within the same system, such as **rate limiting** and versioning.

With API Gateways, you can centralize the settings for such common concerns in a single point. For example, once you have defined some rate limiting policies on your Gateway, you can have the same settings automatically applied to every internal API endpoint. 

API Gateways also help with **service documentation**: since you have all the internal services listed in the API Gateway, just by looking at its configurations you can see which are the other deployed APIs and what is their host name.

### Enhanced performance


Depending on the vendor, you can have different tools to improve the overall performance.

For example, you can cache responses to get quicker response times, or you can apply uniformed data compressions.

Some vendors allow you to have multiple instances of the same service available behind the API Gateway, acting as a sort of Load Balancer.

### Flexibility


Since API Gateways act as a facade in front of other services, you can integrate services that work with different protocols or formats.

For example, you can have one service that exposes GraphQL APIs, another one that works with GRPC communication, and have both exposed as REST APIs using the API Gateway as a sort of wrapper/converter to and from such formats.

## Disadvangages

### Single point of failure


Since we placed an API Gateway in front of all the other API applications, all the external communication passes through the Gateway.

This means that if the API Gateway is unavailable, the whole system becomes unavailable too, even though the single APIs are still up and running.

So, when using an API Gateway:

- beware of the settings: an error can have consequences on the whole system;
- ensure that the Gateway can handle the incoming load of requests: if the API Gateway cannot cope with the number of incoming requests, it may become unavailable and make the whole system offline.
- ensure that you have some sort of protection against DDoS attacks (see the previous point). 

### Increased latency


An API Gateways is an additional hop in the API processing: when a client wants to call an API application, it first must call the API Gateway which, in turn, will call the internal API.

This processing, this routing, add some network latency. Maybe it's not noticeable, but it depends on the Gateway you choose, the underlying infrastructure, and the processing done by the Gateway.

### Vendor Lock-in


Once you have deployed and configured an API Gateway, it might be difficult to move to another vendor's. You risk vendor lock-in, with all the consequences: if the price goes up, of if they remove some functionalities that you needed, you have to come up with a solution to migrate that specific part of your infrastructure to another vendor.

## API Gateway VS Load Balancer

Some people I know, and the authors of some articles I read, use API Gateway and Load Balancer as synonyms.

Let me get it straigh: **they are not the same!**

Yes, they both are components that work with incoming requests. But they serve two totally different purposes.

While Load Balancers "just" spread incoming requests across the internal nodes of a service, API Gateways act as a facade in front of different types of services.

They are two totally different components of an architecture. 

## Further readings

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_


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
[ ] OgImage
[ ] Aggiungi tabella di recap con immagine