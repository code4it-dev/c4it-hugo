---
title: "Davide's Code and Architecture Notes - Fitness Functions"
date: 2024-12-16T15:35:37+01:00
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
keywords:
 - software-architecture
---

Just creating an architecture is not enough: you should also make sure that the stuffs you are building are, in the end, the stuffs needed by your system.

Is your system fast enough? Is it passing all the security checks? What about testability, maintainability, and other *-ilities*?

Fitness functions are parts of the architecture that allow you to create sort of tests that validate that the system respects all the non-functional requirements defined upfront. 

Let's learn more!


## What are fitness functions?

An architecture is made of two main categories of requirements: functional requirements and non-functional requirements.

Functional requirements are the most easy to define and to test: if one of the requirements is "a user with role Admin must be able to see all data", then writing a suite of tests for this specific requirement is pretty straightforward.

Non-functional requirements are as important as functional requirements, but are often overlooked or not detailed. "The system must be fast": ok, how fast? What do you mean with "fast"? What is an acceptable value of "fast"?

If we don't have a clear understanding of non-functional requirements, then it's impossible to write such tests.

## Why are fitness functions crucial for our architecture

## You already use fitness functions, but you didn't know



## Further readings

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_


## Wrapping up


I hope you enjoyed this article! Let's keep in touch on [LinkedIn](https://www.linkedin.com/in/BelloneDavide/), [Twitter](https://twitter.com/BelloneDavide) or [BlueSky](https://bsky.app/profile/bellonedavide.bsky.social)! 🤜🤛  

Happy coding!

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
- [ ] Rimuovi secrets dalle immagini 
- [ ] Pulizia formattazione
- [ ] Add wt.mc_id=DT-MVP-5005077 to links