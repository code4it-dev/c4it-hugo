---
title: "Davide's Code and Architecture Notes - Arc42 Documentation"
date: 2024-06-26T16:04:37+02:00
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

When dealing with big projects, one of the most critical parts is writing the right documentation.


Yes, building the project is surely difficult. But once it's online and you have ensured it works, you can feel safe. Until, months later, you have to modify it, and remember how it works, why it's structured that way, and so on.

There are several ways to document a software project. In this article, we will talk about Arc42, a structured template that allows you to detail all the necessary info relate to the hows and the whys.

## Arc42

Arc42 is a template for documenting a software system in a future-proof way. You can use it for free, even for commercial use, and it can be generated using tools like Confluence, Microsoft Word, and plain Markdown files.

Arc42 provides a set of predefined sections that you can fill in, organizing your system knowledge in different parts, each focused on a specific aspect of the architecture.

## Sections of a Arc42 document

There are 12 sections in an Arc42 document:

![Arc42 sections overview](https://arc42.org/images/arc42-overview-V8.png)

Each section focuses on one particular aspect; since this is an incremental documentation, you should review the content of each part often to see if some parts are misaligned with the current status of the system.

### Introduction & Goals

The Introduction and Goals section is a top-level description of the project, and aims at specifying why this systems has been created in first place and what the development team must consider when working with the system.

In this section you should include:

- a short description of the project, of the functional requirements and the driving forces;
- links to external documents, such as the requirement specification document, third-party documentation, and other external links;
- a description of the reasons this project exists and/or needs to be modified
- the list of the **top 5 quality attributes** with the highest importance, such as availability, scalability, security, and so on;
- a list of stakeholders that need to be aware of the design of the architecture: developers, managers, security teams, and so on. For each person/team, you should specify the role and the reason they should be involved in the architecture description.

### Architecture Constraints

The Architecture Constraint section list all the constraints that have to be considered when designing the architecture.

These constraints can be about costs, security, internal policies, laws, and so on.

You can group these constraints by area (technical constraints, business constraints, etc.), and, for each of them, you should specify the reason of this constraint and the consequences.

### Context & Scope

The Context and Scope section details your system's scope to clarify what are your responsibilities and what delegated to third parties.

In this section you can then specify the external interfaces to describe how other systems can communicate with yours. 

Enlisting all your external interfaces allows you to make sure you are exposing the right operations and that these operations are coherent with the business domain.

If it helps, you can use UML diagrams to represent how other systems communicate with yours.

It's important to specify the data types in input and in output: one common mistake is to communicate badly the data format (for example, assuming the dates are exchanged as UTC string, while in reality they are Unix Timestamps): the more details about the data format, the better.

### Solution strategy

The Solution Strategy block is a short description of the fundamental choises done to define the system's architecture. 

This is less related to business scenarios, but it's focused on the technological aspects, such as:

- tech stack decisions;
- what are the different services defined within the architecture, and how they communicate;
- which are the most important design or architectural patterns used for this system;
- what are the quality criteria to reach, and how you're expecting to achieve these goals.

This section is a high-level view of these aspects, so that you can detail them better in other specific pages (not necessarily as part of this Arc42 document).

### Building Block view

The Building Block View section shows the different blocks that build up the system.

There is no specific definition of what a building block is: it can be a class, a module, a library... whatever can be useful for understanding how your architecture is structured.

Ideally, you should consider this view as a hierarchical description of the components of your software: you can use the C4 model, for example, or generate layered diagrams using UML or similar formats.

![Arc42 building block view](https://docs.arc42.org/images/05-building-block-hierarchy.png)

You can also add the interface definitions of the functionalities exposed by each module, so that it becomes evindent what's the purpose of each block.

The, for each block, you should also declare:

- what's the purpose of that module;
- if there are performance constraints or characteristics (for example: the have a predefined SLA);
- if there are known issues or problems with the module.

### Runtime View

### Deployment View

### Crosscutting Concepts

### Architectural decisions

### QUality Requirements

### Risks & Technical Debt

### Glossary


## How to generate an Arc42 document


## Further readings

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_


## Wrapping up


I hope you enjoyed this article! Let's keep in touch on [Twitter](https://twitter.com/BelloneDavide) or [LinkedIn](https://www.linkedin.com/in/BelloneDavide/)! 🤜🤛

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


https://hsc.aim42.org/documentation/hsc_arc42#_design_decisions

https://arc42.org/overview

Download template
https://arc42.org/download

