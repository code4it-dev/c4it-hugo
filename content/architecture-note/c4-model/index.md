---
title: "Davide's Code and Architecture Notes - Practical tips for using C4 Model"
date: 2024-08-27T12:33:31+02:00
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

C4 is a renomated way of representing software architectures, describing the different parts via code.

I'm sure you've already have heard of it. But have you ever used it in a real project?

In this article, I will share my experience with it, as well as some practical tips to use it.

## An overview of the C4 Model

The C4 Model is a framework, created by [Simon Brown](https://x.com/simonbrown), used in software architecture to provide a clear and structured way of describing complex software systems. 

By generating diagrams with different levels of abstractions, it provides users different ways to look at how components are organized, how they communicate, and so on.

It consists of four levels of abstraction: Context, Containers, Components, and Code, each serving a distinct purpose.

1. **Context**: This is the highest level of the model and provides a **full-system view**, showing how the software system interacts with external entities such as users, systems, and external services. Just by looking at this level, readers can see what are the external parts that communicate with the software system.

2. **Containers**: The Container level breaks down the system into its major modules, which are typically applications, data stores, microservices, etc. This level outlines the high-level technology choices and how these containers interact with one another.

3. **Components**: The Component level dissects **each container** further to reveal the components within. These components represent the various modules or parts of the container, detailing their responsibilities, interactions, and how they work together to fulfill the container's purpose.

4. **Code**: The most granular level of the C4 Model, the Code level, is sometimes optional but can be incredibly informative. It provides the implementation details of the system's components, often visualized through class or interface diagrams that show the code structure and dependencies. From my experience, since the code changes frequently, this level risks to be outdated; since **wrong info is worse than no info**, I generally choose not to include this level.

![C4 levels | C4Model.org](https://c4model.com/img/c4-overview.png)

The C4 Model is particularly beneficial for several reasons. It helps in creating a common language for team members to discuss architecture, facilitates the onboarding of new developers by providing them with a clear map of the system, and aids in risk identification and threat modeling. 

Moreover, it's flexible enough to be used at various stages of development, from initial design to documenting existing systems. 

The C4 Model's focus on abstraction-first diagramming aligns with how architects and developers conceptualize and build software, making it an intuitive and practical tool in the realm of software architecture.

## Generate diagrams using Structurizr

C4 Model is a way of describing software. But it's not a Language, nor a Tool.

To generate a C4 Model you can use many tools, like [Structurizr](https://structurizr.com/) (created by Simon Brown, the creator of the C4 Model).

You can use Structurizr on cloud or locally. I generally prefer having Structurizr Lite installed on my machine, so that I can generate the diagrams locally and, in case, modify them before saving the changes.

Once you have downloaded 


## Store diagram in source control

- gitignore

## Problems with structurizr

- immagini con nomi non customizzabili
- immagini non navigabili quando diventano png


## Further readings

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_

https://c4model.com/



## Wrapping up


I hope you enjoyed this article! Let's keep in touch on [LinkedIn](https://www.linkedin.com/in/BelloneDavide/) or [Twitter](https://twitter.com/BelloneDavide)! 🤜🤛

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

Appunti:

- Mostra esempio
- installa in locale
- aggiungi a repo, con gitignore
- spiega che è scomodo far rigenerare le immagini
- spiega che alle immagini generate con structurizr non puoi dare un nome specifico
- mostra che le immagini generate non sono navigabili, essendo dei PNG
- mostra altri tool con cui mostrare c4 (eg: https://mermaid.js.org/syntax/c4.html)
- richiede Java 17+

https://www.structurizr.com/
IloGraph: https://www.structurizr.com/dsl?example=big-bank-plc&view=Containers&renderer=ilograph