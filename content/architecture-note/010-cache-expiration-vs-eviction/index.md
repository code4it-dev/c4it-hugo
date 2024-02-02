---
title: "Davide's Code and Architecture Notes - Cache Expiration vs Eviction"
date: 2024-01-30T09:53:01+01:00
url: /architecture-notes/cache-expiration-and-eviction
draft: false
categories:
 - Code and Architecture Notes
tags:
 - Software Architecture
toc: true
summary: "Caching helps your applications be more performant. However, depending on the size of the cache, you'll need to sacrifice some items to make place for other. Let's see some strategies."
images:
 - /architecture-notes/cache-expiration-and-eviction/featuredImage.png
---

Caching is one of the most common tecniques used to improve application performance by storing some data, usually coming from external sources, in a quick-access storage. 

Every call to an API, a database, or any external system, adds some latency to the operation you are executing. Caching these items results in a faster application.

Similarly, if have to perform some heavy calculations, doing them over and over again can be a waste of time. So, you might want to store the precalculated values in a storage to avoid doing these heavy calculations.

With caching, you save the data that is heavy to read or generate in a storage with one important characteristic: it has fast access. **Caching can be done in-memory or by using an external system**; the important part is that you need to be able to get a specific value, which can be accessed using its unique ID, in a fast way.

But storage has a limit, and **you cannot store everything in the cache**. 

In this article, we will learn how to free up some memory by using Cache Expiration and Cache Evition; we will then see the most used Cache Eviction Policies to define how and when we should delete items from the cache.

## Cache Expiration: items are removed based on the TTL

We can assign a **Time-To-Live (TTL)** value to each item stored in the cache. When the TTL value is past, the data is considered expired and is removed from the cache. In this case, we are talking about Cache Expiration.

In C#, you can define the TTL by setting a value to the `AbsoluteExpirationRelativeToNow` property of the `MemoryCacheEntryOptions` class, like in the following example, where the item is set to expire after 3 seconds from its creation.

```cs
var cache = new MemoryCache(new MemoryCacheOptions());
cache.Set("myKey", "myValue", new MemoryCacheEntryOptions()
{
    AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(3)
});

var exist1 = cache.TryGetValue("myKey", out _);
output.WriteLine($"Exists1: {exist1}"); // TRUE

await Task.Delay(3500); // 3,5 seconds: we've now reached the TTL

var exist2 = cache.TryGetValue("myKey", out _);
output.WriteLine($"Exists2: {exist2}"); // FALSE
```

By setting a **short TTL value**, you ensure that the **data in the cache is, in general, always up-to-date**. Having a short TTL is especially useful when you have data that changes frequently, such as stock prices, real-time statistics, or weather data.

By setting a **long TTL value**, you can ensure that the remote resource (for example, the DB) is not called too many times. This is **useful when the data is expected not to change**.
 

### Pros of Cache Expiration

By setting a correct TTL, we can **find the balance between up-to-date data and data access frequency**. Since data is expected to expire automatically after a certain amount of time, **you will not have stale data**.

Also, since you can manually set the TTL, **you can define the expiration policies based on the type of entity being cached**. For example, you may want to store the info about a city (name, region, country, etc.) in a cache item with a long TTL, while storing more "volatile" data (such as stock values) in items with a short TTL. **You have full control on the TTL**.

### Cons of Cache Expiration

There are also some downsides of using Cache Expiration.

If the TTL value is too long, **the data being served can become stale or out-of-date**. You have to tune in the TTL values to get the best result.

Also, if the cache item is accessed constantly, but the underneath value does not change, you'll end up in a loop of *cache expires* -> *access data on the db* -> *store the data in cache* -> *cache expires* which does not add any value, since the data is always the same.

## Cache Eviction: items are removed based on usage policies

While cache expiration is something done automatically based on the TTL, **cache eviction** is the process of removing data from the cache, following certain policies, to make room for new data. This may be necessary when the cache is full, and you need to find the items to sacrifice.

To determine which items must be removed from the cache, we rely on **cache eviction policies** based on the usage of such data.

Nobody stops you from creating custom policies. However, there are some well known patterns that it's interesting to know.

In general, **you should add Cache Eviction policies when you have limited memory available for caching**.

Each of the following policies has an impact on the cache miss/cash hit count. My suggestion is to **keep track of the cache miss ratio** and, if necessary, change the policy used in your system.

### Least Recently Used (LRU) Policy

With **Least Recently Used (LRU)** you remove the items that were used the least recently. 

When the cache is full and a new item needs to be added, LRU evicts the item you haven't used in a while, assuming that, if it hasn't been accessed recenlty, it's probable it won't be accessed soon.

If you suppose that in a certain moment most users will access the same set of data, you can keep in cache these items and remove the ones that are not being accessed.

This policy, in fact, assumes that items recently used are likely to be accessed again soon.

**LRU works well for temporal-related items**, such as recent Tweets, latest news, and so on.

![Least Recently Used (LRU) policy](./lru.png)

In the picture above you can see a cache with a max of three items. Let's see what happens:

1. each item has a time information associated to the entry: T0, T1, T2 represent the last time they were accessed;
2. the system accesses Item2. The cache then updates the T-value, setting it to T3;
3. the system accesses Item3. Again, we update the T-value;
4. the system now tries to access and store Item4. There is no more space in the cache, so we have to remove one item;
5. since we are using LRU, we remove the item with the lowest T-value; in our case, we remove Item1;
6. Item4 can then be stored in cache.

This policy is **not the best when data is accessed following a circular pattern** (Item1, then Item2, then Item3, then again Item1): in this case, you will keep removing and adding the same items over and over again.

With LRU you will probably have **high hit rates**: in fact, since you keep saving the most recently accessed items, you'll have misses only for items that have not been accessed lately.

### Least Frequently Used (LFU) Policy

If you know that some items are accessed more frequently than others, regardless of the temporal usage, then Least Frequently Used (LFU) policy might be the best one to use.

The idea is that data most frequently used will likely be accessed again soon; at the same time, data not very much requested can be removed from cache, since the probability of a user requesting it is quite low.

For each item you also store a counter that tracks of the number of times the data has been requested.

**LFU is great for items that are regularly accessed in several places of the application**, and whose information does not change much during time. For example, say that your website shows info about football matches. LFU can be a good choice to store data about incoming matches and top news: in fact, these items will probably be accessed frequently. At the same time, items like a player's bio are accessed rarely, so they can be removed from the cache without impacting too much the overall performance of the application.

![Least Frequently Used (LFU) policy](./lfu.png)

Let's see a practical example:

1. each item has a **counter** associated to it (in the image above, the F-values represent the frequency); whenever you add a new item to the cache, it's F-value is 1;
2. you access Item2, and increase its F-value;
3. you then access Item3; its frequency counter goes to 2;
4. you try to store Item4, but you have no space. You then have to remove the least frequently accessed item - Item1, in our case - to make space for the new item.

However, **what happens if now you need to load a new item, Item5?** Due to LFU, you'll have to remove Item4, even though it has just been added to the cache. Well, you've just seen a limitation to this algorithm.

### First in, First Out (FIFO) Policy

If you think that older items can be removed to make some space to newer items, then **First in First out (FIFO)** policy it the best one to use.

The idea is to **remove items that have been added to the cache starting from the oldest ones, regardless of their actual usage**.

![First in, First out (FIFO) policy](./fifo.png)

Let's see what happens in the image above:

1. we start with an empty cache;
2. we add Item1 (it's the first item *added* to the cache, hence the A-value to 1);
3. we add Item2;
4. we add Item3;
5. we need to insert a new item. We decide to remove the oldest one: Item1;
6. we add Item4;

But hey! **Isn't it the same as putting a fixed TTL to every item?** If the TTL is fixed, in fact, the first items added to the cache are also the first ones removed. 

### Random Replacement (RR) Policy

When you don't have a specific reason to keep one item instead of another, you can remove random items from the cache. This policy is called **Random Replacement (RR)**.

The idea is simple: we remove random items regardless of the usage. The item removed can then be one of the most used ones or one that hasn't been accessed in a long time.

![Random Replacement (RR) Policy](./rr.png)

This policy works well for items with no particular priority.

## Further readings

In this article, we learned some policies to remove items from the cache. What about adding them? Have you ever heard of "Read-through", "Cache-aside", "Write-through", and "Write-behind"?

🔗 [Server-side caching strategies: how do they work? | Code4IT](https://www.code4it.dev/architecture-notes/caching-strategies/)

https://www.linkedin.com/pulse/unlocking-efficiency-exploring-cache-eviction-policies-baligh-mehrez/

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_

https://redis.com/blog/cache-eviction-strategies/

https://en.wikipedia.org/wiki/Cache_replacement_policies

## Wrapping up

There are some factors that drive the choice of the cache eviction policy to use:

* **Cache size**: The Least Recently Used (LRU) policy is suitable if you have a small cache memory and you want to keep the most accessed data in the cache.
* **Data volatility**: The Least Frequently Used (LFU) policy is suitable if your data updates often and you want to keep the most current data in the cache.
* **Data access patterns**: The Least Recently Used (LRU) policy is suitable if you have predictable data access patterns and you want to keep the data that is likely to be accessed frequently in the cache.

Let's recap the policies.

| **Cache Eviction Policy** | **Short Description** | **Best Use** | **Pros** | **Cons** |
|---------------------------|-----------------------|--------------|----------|----------|
| LRU                       | Least Recently Used    | It is best suited for caches where the most recently accessed items are more likely to be accessed again in the near future. | - Efficient for small caches. <br> - Easy to implement. | - Not suitable for large caches. <br> - Does not consider the frequency of use. |
| LFU                       | Least Frequently Used  | It is best suited for caches where the most frequently accessed items are more likely to be accessed again in the near future. | - Effective for large caches. <br> - Considers the frequency of use. | - Complex to implement. <br> - If not tuned in properly, it may lead to stale data storage. |
| FIFO                      | First In, First Out    | TIt is best suited for caches where the order of insertion is important and the oldest items are less likely to be accessed again in the near future. | - Easy to implement. | - May not be efficient for large caches. <br> - May remove important data. |
| RR                        | Random Replacement     | It is best suited for caches where all items are equally important and there is no need to prioritize any particular item. | - Simple to implement.  | - May not be efficient for large caches. <br> - May remove important data. |
 

One last important thing to notice is that **data can become stale**: imagine if you put in cache an item that is accessed frequently and constantly. That item will never be removed if you use LRU or LFU; it means that if the underneath data has changed, the cache will still hold the old value. So, consider adding also a TTL for each item, to ensure that, sooner or later, all data will be refreshed. **A good combination of TTL and Eviction policy ensures that you have always fresh data with low miss ratio**.

I hope you enjoyed this article! Let's keep in touch on [Twitter](https://twitter.com/BelloneDavide) or [LinkedIn](https://www.linkedin.com/in/BelloneDavide/)! 🤜🤛

Alla prossima!

🐧

- [ ] Grammatica
- [ ] Titoli
- [ ] Frontmatter
- [ ] Immagine di copertina
- [ ] Fai resize della immagine di copertina
- [ ] Metti la giusta OgTitle
- [ ] Bold/Italics
- [ ] Nome cartella e slug devono combaciare
- [ ] Rinomina immagini
- [ ] Trim corretto per bordi delle immagini
- [ ] Alt Text per immagini
- [ ] Pulizia formattazione
  