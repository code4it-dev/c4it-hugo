---
title: "Davide's Code and Architecture Notes - Arc42 Documentation, for a comprehensive description of your project"
date: 2024-07-02
url: /architecture-notes/arc42-documentation
draft: false
categories:
  - Code and Architecture Notes
tags:
  - Software Architecture
  - Documentation
toc: true
summary: "How is your project structured? What are the driving forces? If you don't know how to express this info, you should try the Arc42 template to create a strong foundation for your documentation."
images:
  - /architecture-notes/arc42-documentation/featuredImage.png
---

When dealing with big projects, one of the most critical parts is writing the proper documentation.

Yes, building the project is undoubtedly difficult. But once it's online and you have ensured it works, you can feel safe.
Unless, months later, you have to modify it and remember how it works, why it's structured that way, and so on.

There are several ways to document a software project. In this article, we will discuss Arc42, a structured template that allows you to detail all the necessary information related to the hows and whys.

## What is a Arc42 template

Arc42 is a template for documenting a software system in a future-proof way. **It can be used for free, even for commercial use**, and it can be generated using tools like Confluence, Microsoft Word, and plain Markdown files.

Arc42 provides a set of predefined sections you can fill in, organizing your system knowledge into different parts, each focused on a specific aspect of the architecture.

## Sections of a Arc42 document

There are 12 sections in an Arc42 document:

![Arc42 sections overview](https://arc42.org/images/arc42-overview-V8.png)

Each section focuses on one particular aspect; since this is incremental documentation, **you should review the content of each part regularly** to see if some parts are misaligned with the current status of the system.

### Introduction & Goals

The _Introduction and Goals section_ is a top-level description of the project. It aims to specify why this system was created and what the development team must consider when working with it.

In this section, you should include:

- a short description of the project, **the functional requirements and the driving forces**;
- links to external documents, such as the requirement specification document, third-party documentation, and other external links;
- a description of the reasons this project exists and/or needs to be modified
- the list of the **top 5 quality attributes** with the highest importance, such as availability, scalability, security, and so on;
- a list of stakeholders that need to be aware of the design of the architecture: developers, managers, security teams, and so on. For each person/team, you should specify the role and why they should be involved in the architecture description.

### Architecture Constraints

The _Architecture Constraint section_ lists all the constraints to be considered when designing the architecture.

These constraints can be related to costs, security, internal policies, laws, etc.

You can group these constraints by area (technical limitations, business constraints, etc.), and for each of them, you should **specify the reason for this constraint and the consequences**.

### Context & Scope

The _Context and Scope section_ details your system's scope to clarify what your company's responsibilities are and what is delegated to third parties.

In this section, you can **specify the external interfaces** to describe how other systems can communicate with yours.

Enlisting all your external interfaces allows you to make sure you are exposing the right operations and that these operations are coherent with the business domain.

If it helps, you can use UML diagrams to represent how other systems communicate with yours.

It's important to **specify the data types in input and output**. One common mistake is to communicate the data format poorly (for example, assuming the dates are exchanged as UTC strings when, in reality, they are Unix Timestamps): the more details about the data format, the better.

### Solution Strategy

The _Solution Strategy section_ is a short description of the fundamental choices made to define the system's architecture.

This section is less related to business scenarios, but it's focused on the technological aspects, such as:

- tech stack decisions;
- what are the different services defined within the architecture, and how they communicate;
- which are the most important design or architectural patterns used for this system;
- what are the quality criteria to reach, and how you're expecting to achieve these goals.

This section provides a high-level view of these aspects: you can describe them in better detail on other pages (not necessarily as part of this Arc42 document).

### Building Block View

The _Building Block View section_ shows the different blocks that build up the system.

There is no specific definition of a building block: it can be a class, a module, or a library — whatever is useful for understanding how your architecture is structured.

Ideally, you should **consider this view as a hierarchical description of the components of your software**: you can use the C4 model, for example, or generate layered diagrams using UML or similar formats.

![Arc42 building block view](https://docs.arc42.org/images/05-building-block-hierarchy.png)

You can also add the interface definitions of the functionalities exposed by each module so that it becomes evident what's the purpose of each block.

Then, for each block, you should also declare:

- what's the purpose of that module;
- if there are performance constraints or characteristics (for example: there are predefined SLAs);
- if there are known issues or problems with the module.

### Runtime View

The _Runtime View section_ describes how the building blocks communicate and interact.

In this section, **you should not describe every single scenario** - otherwise, you will lose time and focus on useless details - but rather, you should pick the most architecturally relevant to showcase how such components communicate.

There are many ways to describe how components interact: flow charts, sequence diagrams, state machines, and whatever you think is the best way to clearly represent the interaction between components.

### Deployment View

The _Deployment View section_ describes everthing necessary to understand how the infrastructure is defined.

Here you should list information about:

- available environments
- network topologies
- infrastructure components (such as queues, serverless components, databases)
- info about replication, load balancing, scaling rules;
- containers and orchestrators;

In general, you should describe **everything necessary to understand how your architecture is built and distributed** - even hardware items, if necessary.

Again, there are no strict rules for designing the Deployment View. You can use, for example, a combination of tables and UML diagrams or any architectural diagram that allows you to understand how your infrastructure is deployed.

### Crosscutting Concepts

In the _Crosscutting Concepts section_, you should — obviously — list and explain the crosscutting concerns, which are all the parts that are not related to a single module but are shared across the whole system.

Examples are:

- logging
- security
- UX concepts
- relevant design and architectural patterns

and, in general, explain how you treat specific topics, such as transaction handling, validation, exception handling, and localization, so that you have a **common guideline that brings homogeneity** to the way you approach such concepts.

Some practical examples of things you should describe in this section are:

- logs format and libraries (for example: are you using [Serilog](https://www.code4it.dev/blog/logging-with-serilog-and-seq/) as a logging library?)
- common data format (for instance: [how do you format dates and GUIDs](https://www.code4it.dev/blog/5-things-about-guid-in-csharp/#4-a-guid-has-multiple-formats)?)
- are you using Correlation IDs? If so, [how do you propagate Correlation IDs](https://www.code4it.dev/blog/propagate-httpheader-and-correlation-id/)  through your applications?

### Architectural Decisions

In the _Architectural Decisions section_, you should describe the most relevant decisions you've taken that have shaped the current architecture.

Other than just the decisions, you should also explain why you made this choice, and what are the consequences.

You can **structure this section using the [ADR](https://www.code4it.dev/architecture-notes/architecture-decision-records/) structure**.

### Quality Requirements

The _Quality Requirements section_ contains a description of the quality requirements to be considered for this project.

While in the Introduction & Goals section, we've described the most important requirements, here we can list all of them by also specifying, when possible, the concrete requirements in terms of performance, response times, and so on.

You can **use a quality attribute utility tree**, as defined in the [Architecture Tradeoff Analysis Method](https://insights.sei.cmu.edu/library/architecture-tradeoff-analysis-method-collection), to visually represent the quality attributes and their categorization.

### Risks & Technical Debt

In the _Risks & Technical Debt section_, you must list all the known technical risks, ordered by priority.

Having risks and technical debt **listed in order of priority** allows you to always be aware of potential risks and, as a consequence, plan fixes and operations accordingly.

When risks are documented, all the internal stakeholders can be aware of them. You can then demonstrate that you need time and money to resolve these issues.

For each identified risk, you should also provide a Risk Level (Critical, High, Medium, Low), and explain how you can resolve or reduce it.

### Glossary

The _Glossary section_ may be often overlooked, but it's one of the most important ones.

In the Glossary you share common terms, explaining their meaning and, when possible, their **synonyms**.

A Glossary is crucial when onboarding new people on the project because it provides guidance on some terms or acronyms that you may find obvious but can be tricky for new joiners.

You can decide to store all the items in a single table, ordered by term, or in several tables, each representing a subdomain of the application.

## How to generate a Arc42 document

An Arc42 is a generic guideline — you can create it yourself without the need for external tools.

However, at the [Download page](https://arc42.org/download) of the Arc42 website you can find some handy templates for Microsoft Word, Markdown files, Confluence, and more.

## Further readings

In this article, we've mentioned that one of the most important parts is to define why some choices were made to better express the rationale behind the choice.

There is a practical way to keep track of decisions, reasons, and updates: Architecture Decision Records:

🔗 [Tracking decision with Architecture Decision Records (ADRs) | Code4IT](https://www.code4it.dev/architecture-notes/architecture-decision-records/)

Some of your constraints can be defined by a legal document you've signed with third parties. You must then keep an eye on SLI, SLO, and SLA. What are they?

🔗 [Introducing SLI, SLO, and SLA | Code4IT](https://www.code4it.dev/architecture-notes/sli-vs-slo-vs-sla/)

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_

## Wrapping up

This article was a simple introduction to the Arc42 template. However, you can read more on the [official website](https://arc42.org/overview), where you can also find tips and tricks and best practices in creating this kind of document.

I hope you enjoyed this article! Let's keep in touch on [Twitter](https://twitter.com/BelloneDavide) or [LinkedIn](https://www.linkedin.com/in/BelloneDavide/)! 🤜🤛

Happy coding!

🐧

- [ ] Nome cartella e slug devono combaciare
- [ ] Pulizia formattazione
