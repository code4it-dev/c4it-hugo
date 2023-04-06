---
title: 'C# Tip: Access items from end using the ^ operator'
date: 2023-04-05
tags:
- CSharp
url: /csharptips/access-items-from-end
categories:
- CSharp Tips
summary: summary
---

Say that you you have a collection of N items and you need to access a specific item counting from the end of the collection.

Usually, we tend to use .Count or .Length


## Further readings

To populate the lists in our Benchmarks we used `Enumerable.Range`. Do you know how it works? Have a look at this C# tip:

🔗 [C# Tip: LINQ's Enumerable.Range to generate a sequence of consecutive numbers](https://www.code4it.dev/csharptips/enumerable-range)

*This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)*

## Wrapping up

In this article, we've learned that just a minimal change can impact our application performance.

We simply used a different constructor, but the difference is astounding. Clearly, this trick works only if already know the final length of the list (or, at least, an estimation). The more precise, the better!

I hope you enjoyed this article! Let's keep in touch on [Twitter](https://twitter.com/BelloneDavide) or on [LinkedIn](https://www.linkedin.com/in/BelloneDavide/), if you want! 🤜🤛

Happy coding!

🐧
