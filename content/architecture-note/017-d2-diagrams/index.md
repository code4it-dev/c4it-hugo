---
title: "D2 Diagrams: like Mermaid, but better."
date: 2025-01-20T14:33:17+01:00
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

When defining the architecture of a system, I believe in the adage "a picture is worth a thousand words".

Diagramming helps understanding how the architecture is structured, what are the dependencies between components, how the different components communicate, which are their responsibilities.

A clear architectural diagram can be useful also for planning: once you have a general idea of the components, you can structure the planning according to the module dependencies and the priorities.

A lack of diagramming leads to "just words": how many times have you heard people talk about modules that do not exist or do not work as they were imagining? The whole team can benefit from having a common language and a shared understanding of the parts a system is made of: a clear diagram brings clear thoughts.

I tried several approaches: online tools like Draw.IO, DSL like Structurizr and Mermaid, but I wasn't happy with any of them.

Then I stumbled upon D2: it's rich set of elements make it my new go-to tool for describing architectures. Let's see how it works!


## D2 syntax

Just like the more famous Mermaid, in D2 all the elements and connections are defined as textual nodes.

You can generate your diagram using the [Playground](https://play.d2lang.com/) section available in the official website.

### Elements

Elements are defined as a set of names that can be enriched with a label and other metadata.

Here's an example of the simplest configurations for standalone elements.

```d2
service

user: Application User

job: {
  shape: hexagon
}
```

For each element, you can simply define its internal name (`service`), a label (`user: Application User`) and a shape (`shape: hexagon`).


![alt text](image.png)

### Grouping

Of course, you may want to group elements. You can to that by using an hierarchical structure.

In the following example, the main container represents my Ecommerce application, which is composed of a website and a background job. The website is composed of a frontend, a backend, and a database.


```d2
ecommerce: E-commerce {
  website: User Website {
    frontend
    backend
    database: DB {
      shape: cylinder
    }
  }

  job: {
    shape: hexagon
  }
}
```

As you can see from the diagram definition, elements can be nested in a hierarchical structure using the `{}` symbols. Of course, you can still define styles and labels to nested elements.

![alt text](image-1.png)


### Connections

Clearly, an architectural diagram is useful if it can express connections between elements.

To connect two elements, you must use either the `--`, the `->` or the `<-` connector. Clearly, you have to link their IDs, not their labels.



```d2
ecommerce: E-commerce {
    website: User Website {
        frontend
    backend
    database: DB {
        shape: cylinder
    }
    frontend -> backend
    backend -> database: retrieve records {
        style.stroke: red
    }
  }

  job: {
      shape: hexagon
  }
  job -> website.database: update records
}
```
      
The previous example contains some interesting points.

- Elements within the same container can be referenced directly using the plain ID: `frontend -> backend`.
- You can choose if you want labels applied to a connection: `backend -> database: retrieve records`.
- You can apply styles to a connection: `style.stroke: red`.
- You can create connections between elements from different containers: `job -> website.database`

When referencing items from different containers, you must always include the container ID: `job -> website.database` works, but `job -> database` don't, because `database` is not defined (so it gets created from scratch).

![alt text](image-2.png)



- connection
- side descriptions
- SQL tables
- layout and color
- 

## D2 vs Mermaid: a comparison

## Install D2 on Windows

## Create D2 Diagrams on Visual Studio Code

## Create D2 Diagrams on Obsidian

## Tips for using D2

- prima elenca tutti i componenti e poi elenca le connessioni
- definisci uno stile

## Further readings

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_

https://play.d2lang.com/


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