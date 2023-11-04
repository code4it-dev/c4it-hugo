---
title: "Davide's Code and Architecture Notes - 4 algorithms to implement Rate Limiting"
date: 2023-11-03
url: /architecture-notes/post-slug
draft: false
categories:
 - Code and Architecture Notes
tags:
 - Software Architecture
toc: true
summary: "A summary"
images:
 - /architecture-notes/post-slug/featuredImage.png
---

When developing any type of API application, regardless of it being a monolith, a microservice, a distributed system, or whatever, you should add some sort of Rate Limit.

Rate Limiting is just a way to say the caller "Hey, stop, you're calling me too many times!". At a first sight, it's easy. What do we mean by "too many times"?

In this article, we will learn what is Rate Limiting, what problems it solves, and we will learn the main four algorithms to determine if the caller has reached the limit.

## What is Rate Limit

As we said earlier, Rate Limiting is a way to stop clients from calling our systems too many times.

Considering that every request to our system occupies part of our resources, if we have too many requests at the same time we could end up with the whole system down. Sure, we could add a [L4 or L7 Load Balancer](https://www.code4it.dev/architecture-notes/l4-vs-l7-load-balancers/) to our system, but it might not be enough.

Adding Rate Limiting has some benefits:

1. it shields you from **DDoS** - if an attacker tries to impact your system calling your APIs so much times that the whole system goes down, thanks to Rate Limiting you have a way to reduce the number of performed operations (clearly, you can't stop the client from calling you - you just stop before executing the whole operation).
2. You add a security layer preventing **Brute force attacks**: if an attacker tries to steal the identity of a person trying all the possible passwords (using password spray), your Rate Limit policies stop them from trying too many tentatives.
3. if part of the system is degradated and it cannot process a request quickly, a client could add a retry policy. If the caller calls you too many times, it might affect the already degradated component, making it unable to handle any request.

To make sure the client knows that you are not processing its requests because it tried to call your systems too many times, you have to **use the correct HTTP Response code: 429 Too Many Requests**. This way, the caller can implement a retry logic that takes into consideration that, if the call was not successful, it might be due to the number of subsequent calls. **The response should also include a *Retry-After* HTTP header** to tell the client how much time to wait before the next request.


## Rate Limiting algorithms

Now, what strategies do we have to implement rate limit?

Let's see the 4 algorithms!

### Fixed-window rate limiting (todo)

This algorithm restricts the number of requests allowed during a given time window, such as one minute or one hour. The time frame is defined by the server, and it's the same for all the clients

Say that we define that we can accept 100 requests every minute. Then, after the minute passes, we can accept 100 more.

You can choose two types of fixed-window rate limiting: user-based and server-based. **User-based fixed-window rate limiting** allows any user to perform, in our example, 100 requests per minute. **Server-based fixed-window** rate limiting defines that the whole server is capable of processing 100 requests per minute, regardless of the caller.

This algorithm is simple to implement, but it has some drawbacks. One is that it can allow bursts of requests at the beginning or end of each window, which can overload the system. Also, if the requests are throttled to the next minute, you end up adding and adding more requests to the beginning of the next minute, causing a burst of requests that the system might not be able to handle.

]]]]]]]]]]]]]]]]]]]DISEGNOOOO[[[[[[[[[[[[[[[[[[[

### Sliding-window Rate Limiting

This algorithm divides the time into fixed intervals, such as seconds or minutes, and each interval starts with the first request request of the client.

If the timeframe is 100 requests per minute, we can have:

- ClientA, that makes the first request at 09:00:05, can call the system 100 times until 09:01:05.
- ClientB, that makes the first request at 09:00:38, can call the system 100 times until 09:01:38.

So, both clients can call the system 100 times per minute, but their time frames are independent one each other.

This algorithm is more fair than the fixed-window algorithm, as it considers the request history of each independent client in a sliding window rather than a fixed window. 

However, given that you must now store info about the request counters related to each client, it is also more complex and resource-intensive to implement.

### Leaky bucket rate limiting

This algorithm simulates a leaky bucket that can hold a fixed number of requests. 

Each request fills one slot in the bucket, and each slot leaks out at a constant rate. For example, if the bucket size is 100 requests and the leak rate is 10 requests per second, then any client that sends more than 10 requests per second will fill up the bucket and be blocked or throttled until some slots leak out. 

This algorithm smooths out bursts of requests and ensures a steady flow of traffic. However, it can also introduce latency and queueing for clients that send requests faster than the leak rate.  

### Token bucket


## Further readings

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_

https://www.imperva.com/learn/application-security/rate-limiting/

https://www.tibco.com/reference-center/what-is-rate-limiting


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
[ ] Metti la giusta OgTitle
[ ] Fai resize della immagine di copertina


# bozza


- **Leaky bucket rate limiting**: This algorithm simulates a leaky bucket that can hold a fixed number of requests. Each request fills one slot in the bucket, and each slot leaks out at a constant rate. For example, if the bucket size is 100 requests and the leak rate is 10 requests per second, then any client that sends more than 10 requests per second will fill up the bucket and be blocked or throttled until some slots leak out. This algorithm smooths out bursts of requests and ensures a steady flow of traffic. However, it can also introduce latency and queueing for clients that send requests faster than the leak rate.  

- **Token bucket rate limiting**: This algorithm is similar to the leaky bucket algorithm, but instead of filling slots with requests, it consumes tokens from a bucket. Each request requires one token to be processed, and the bucket has a fixed capacity of tokens. The bucket also replenishes tokens at a constant rate. For example, if the bucket capacity is 100 tokens and the replenish rate is 10 tokens per second, then any client that sends more than 10 requests per second will consume all the tokens and be blocked or throttled until some tokens are replenished. This algorithm allows bursts of requests up to the bucket capacity, but also limits the average request rate to the replenish rate. It can also handle multiple request sizes by requiring different numbers of tokens for different types of requests.  
 

These are some of the common algorithms used for rate limiting in APIs and web applications. Depending on the use case and requirements, different algorithms may have different advantages and disadvantages. Therefore, it is important to choose an appropriate algorithm that suits your needs and goals.

: https://www.imperva.com/learn/application-security/rate-limiting/
: https://nordicapis.com/different-algorithms-to-implement-rate-limiting-in-apis/