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

Especially when talking about *microservices*, many articles and videos focus on an architectural element that, in their opinion, is the best solution for building such applications: *API Gateways*.

Yes, they are actually useful, but they are not the solution to every architectural problem.

In this article, we are going to learn what are API Gateways, what are their pros and cons, why you should not confuse them with Load Balancers, and more.

## What is an API Gateway?

Imagine that your application is made of several web services and APIs. Each of them will be deployed on a separate host, therefore having a different URL.

While it can be useful for internal development - you have a clear separation of operations available in your system - it can become cumbersome for the developers that have to integrate all those endpoints in their application.

That's where API Gateways come to play: they add a sort of *facade* in front of your set of APIs to uniform the access to your system. 

Say that you've built an Hotel booking system that is made of 3 services:

- BookingAPI, deployed at *https://bookings.mycompany.org/api*
- SearchAPI, deployed at *https://mycompany.org/search/api* 
- DiscountAPI, deployed at *https://discounts.mycompany.org/v1/api* (notice the *v1*)

By adding an API Gateway you can hide these APIs behind a single host, like *https://api.mycompany.org/*.



èèèèèèèèèèèèèèèè AGGIUNGI IMMAGINE èèèèèèèèèèèèèèèèèè

As per every thing in the world, there are advantages and disadvantages.

## Advantages of an API Gateway

That's right, API Gateways have lots of advantages. It's not a coincindence that they are being used in many architectures.

Let's see some of the best characteristics of an API Gateway.

### Internal API security

Since your internal APIs are hidden behind an API Gateway, you make them *less* discoverable by intruders that might want to access your systems and data.

Let's go back to the Hotel Booking system in oure example. External users will only see the *api.mycompany.com* host, without exposing the internal API services. This **reduces the attack surface**.

You can also **centralize Access Control Policies** by adding them to the API Gateway and have them applied to all the APIs behind the Gateway.

Finally, you can monitor in a single place all the incoming requests and analyse the traffic to spot unusual behavior.

### Reduce complexity

There are some concerns that are shared to all the APIs within the same system, such as **rate limiting**, **throttling**, and **access control**.

With API Gateways, you can **centralize the settings** for such common concerns in a single point. For example, once you have defined some rate limiting policies on your Gateway, you can have the same settings automatically applied to every internal API endpoint (well, not "physically" applied to the internal APIs, but, since the Gateway block some incoming requests, they will not reach the internal systems as well). 

API Gateways also help with **service documentation**: since you have all the internal services listed in the API Gateway, just by looking at its configurations you can see which are the other deployed APIs and what is their host name.

òòòòòòòòòòòòòòòòòòòòòò DISEGNOO òòòòòòòòòòòòòòòòòòòòòòòòòò


### Enhanced performance

Depending on the vendor, you can have different tools to improve the overall performance.

For example, you can **cache responses** to get quicker response times, or you can apply uniformed **data compressions**.

Some vendors allow you to have multiple instances of the same service available behind the API Gateway, acting as a sort of Load Balancer.

Another powerful technique you can implement is [SSL Termination](https://www.code4it.dev/blog/overview-api-gateways/#ssl-termination). In a basic architecture, if you have to communicate securely with 3 systems to aggregate the result you have to validate the SSL connection three times. With SSL Termination, you can move these operations on the API Gateway component and avoid doing that in all the other services, making the application more performant.

òòòòòòòòòòòòòòòòòòòòòò DISEGNOO òòòòòòòòòòòòòòòòòòòòòòòòòò

### Flexibility

Since API Gateways act as a facade in front of other services, you can integrate services that work with different protocols or formats.

For example, you can have one service that exposes GraphQL APIs, another one that works with GRPC communication, and have both exposed as REST APIs using the API Gateway as a sort of wrapper/converter to and from such formats.

Hiding the real API endpoints behind a Gateway also allows you to implement [API Composition](https://www.code4it.dev/blog/overview-api-gateways/#api-composition), which is a technique that allows you to aggregate the results from different internal API calls and return the caller only the final result (as opposed as making the client call 3 services and then compose the result afterward).

òòòòòòòòòòòòòòòòòDISEGNOOOòòòòòòòòòòòòòòòòòòòòòòòòòòòòò


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

This processing, this routing, adds some network latency. Maybe it's not noticeable, but it depends on the Gateway you choose, the underlying infrastructure, and the processing done by the Gateway.

### Vendor Lock-in

Once you have deployed and configured an API Gateway, it might be difficult to move to another vendor's. 

You risk vendor lock-in, with all the consequences: if the price goes up, of if they remove some functionalities that you needed, you have to come up with a solution to migrate that specific part of your infrastructure to another vendor.

It might not be so easy - one simple way to mitigate the risk it to **make your systems platform agnostic** and create e2e tests that validate the routing and the functionalities.

## API Gateway VS Load Balancer

Some people I know, and the authors of some articles I read, use API Gateway and Load Balancer as synonyms.

Let me get it straigh: **they are not the same!**

Yes, they both are components that work with incoming requests. But they serve two totally different purposes.

While Load Balancers "just" spread incoming requests across multiple instances of the same service, API Gateways act as a facade in front of different types of services.

They are two totally different components of an architecture. 

Some vendors provide both functionalities, some other don't. So, don't mix the two meanings, and try to use the correct wording.

## API Gateway vendors

Here is a list of some API gateway vendors, with their prices, pros, and cons.

Notice: I haven't tried all these vendors. The info in this list come primarily from their official documentation and, in some case, from other resources that compare such products.

- **[Kong](https://konghq.com/products/kong-gateway)**: It's an Open Source product that provides features such as authentication, rate limiting, logging, caching, and more. It is written in Lua and runs on top of Nginx.
    - Price: Kong offers a free community edition and a paid enterprise edition.
    - Pros: Kong is easy to install and configure, supports a wide range of plugins and integrations, and has a large and active community.
    - Cons: Kong may have performance issues when handling large volumes of traffic, requires Nginx as a dependency, and has limited support for GraphQL, available only for the enterprise edition.
- **[Tyk](https://tyk.io/)**: It's a light-weight API gateway written in Go. It offers features such as API analytics, developer portal, dashboard, security, and more. It can be deployed on-premises, in the cloud, or as a hybrid.
    - Price: Tyk offers a 5-weeks free trial and four payment tiers. The Starter edition starts from $600 per month for up to 10 million API calls.
    - Pros: Tyk is fast, scalable, and flexible, and has a rich set of features and plugins.
    - Cons: Even though Tyk is open source, it does not have a free tier.
- **[Express Gateway](https://www.express-gateway.io/)**: An API gateway that is based on Express.js. It provides dynamic routing, access control, and API management in a single package. It is written in JavaScript.
    - Price: Express Gateway is free and open source.
    - Pros: Express Gateway is simple to use and customize, supports Node.js ecosystem and middleware, and it can be easily extended with plugins.
    - Cons: Express Gateway may not be suitable for complex scenarios, lacks some advanced features such as caching (which is in the Medium Term roadmap).
- **[Zuul](https://github.com/Netflix/zuul)**: An open source API gateway that is part of the Netflix OSS stack. It provides dynamic routing, resiliency, security, and monitoring for microservices. It is written in Java and can be integrated with other Netflix components.
    - Price: Zuul is free and open source.
    - Pros: Zuul is robust, reliable, and battle-tested by Netflix, supports filters for request processing.
    - Cons: Zuul has limited documentation.
- **[Azure API Management](https://azure.microsoft.com/en-us/pricing/details/api-management/)**: It offers features such as developer portal, gateway, policies, throttling, caching, and more.
    - Price: Azure API Management offers a free tier and several paid tiers. The paid tiers start from $0.07 per hour for the Developer tier and go up to $3.83 per hour for the Premium tier.
    - Pros: Azure API Management is easy to integrate with other Azure services, supports multiple protocols and formats, and has a rich set of features and policies.
    - Cons: Azure API Management may have a complex pricing model and it requires Azure Active Directory for authentication.
- **[Amazon API Gateway](https://aws.amazon.com/api-gateway/)**: It provides full lifecycle API management, from design and development to security and analytics.
    - Price: Amazon API Gateway offers a free tier and a pay-as-you-go model. The pay-as-you-go model charges per million API calls received, plus data transfer and caching fees.
    - Pros: Amazon API Gateway is scalable, reliable, and secure, supports serverless architectures and WebSocket APIs.
    - Cons: Amazon API Gateway may have a steep learning curve for beginners, requires AWS Lambda for custom logic, and has limited documentation and support. It has a complex pricing tier.
- **[Google Cloud API Gateway](https://cloud.google.com/api-gateway)**:  It supports OpenAPI Specification v2 and gRPC APIs.
    - Price: Google Cloud API Gateway offers tiers based on the number of API calls. From 0 to 2 million calls, the service is free. From 2 million to 1 billion calls, you pay $3.00 per million API calls, while from 1 billion on you pay $1.5 per million API calls. 
    - Pros: Google Cloud API Gateway is easy to use and deploy, supports multiple authentication methods and protocols, and integrates well with other Google Cloud services.
    - Cons: It has limited plugins and integrations.


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

https://www.code4it.dev/blog/overview-api-gateways/

https://www.code4it.dev/blog/intro-azure-api-management/