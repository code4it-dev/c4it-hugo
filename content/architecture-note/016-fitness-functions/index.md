---
title: "Fitness Functions in Software Architecture: measuring things to ensure prosperity"
date: 2025-01-07
url: /architecture-notes/fitness-functions
draft: false
categories:
 - Code and Architecture Notes
tags:
 - Software Architecture
toc: true
summary: "Non-functional requirements matter, but we often forget to validate them. You can measure them by setting up Fitness Functions."
images:
 - /architecture-notes/fitness-functions/featuredImage.png
keywords:
 - software-architecture
 - code-coverage
 - requirements
 - non-functional requirements
 - nfr
 - quality
---

Just creating an architecture is not enough; you should also make sure that the pieces of stuff you are building are, in the end, the once needed by your system.

Is your system fast enough? Is it passing all the security checks? What about testability, maintainability, and other *-ilities*?

Fitness Functions are components of the architecture that do not execute functional operations, but, using a set of tests and measurements, allow you to validate that the system respects all the non-functional requirements defined upfront.

## Fitness Functions: because non-functional requirements matter

An architecture is made of two main categories of requirements: *functional* requirements and *non-functional* requirements.

Functional requirements are the most easy to define and to test: if one of the requirements is "a user with role Admin must be able to see all data", then writing a suite of tests for this specific requirement is pretty straightforward.

**Non-functional requirements are, for sure, as important as functional requirements**, but are often overlooked or not detailed. "The system must be fast": ok, *how fast*? What do you mean with "fast"? What is an acceptable value of "fast"?

If we don't have a clear understanding of non-functional requirements, then it's impossible to measure them.

And once we have defined a way to measure them, how can we ensure that we are meeting our expectations? Here's where Fitness Functions come in handy.

In fact, Fitness Functions are specific components that focus on non-functional requirements, executing some calculations and providing metrics that help architects and developers ensure that the system's architecture aligns with business goals, technical requirements, and other quality attributes.

## Why Fitness Functions are crucial for future-proof architectures

When creating an architecture, you must think of the most important *-ilities* for that specific case. How can you ensure that the technical choices we made meet the expectations?

By being related to specific and measurable metrics, Fitness Functions provide a way to assess the architecture's quality and performance, reducing the reliance on subjective opinions by using objective measurements. A metric can be a simple number (e.g., "maximum number of requests per second"), a percentage value (like "percentage of code covered by tests") or other values that are still measurable.

Knowing how the system behaves in regards to these measures allows architects to work on the continuous improvement of the system: teams can **identify areas for improvement and make decisions based not on personal opinion but on actual data to enhance the system**. 

Having a centralized place to view the historical values of a measure helps understanding if you have done progresses or, as time goes by, the quality has degraded. 

Still talking about the historical values of the measures, having a clear understanding of what is the current status of such metrics can help in identifying potential issues early in the development process, allowing teams to address them before they become critical problems. 

For example, by using Fitness Functions, you can ensure that the system is able to handle a certain amount of users per second: having proper measurements, you can identify which functionalities are less performant and, in case of high traffic, may bring the whole system down.

## You are already using Fitness Functions, but you didn't know

Fitness Functions sound like complex things to handle. 

Even though **you can create your own functions**, most probably you are already using them without knowing it. Lots of tools are available out there that cover several metrics, and I'm sure you've already used some of them (or, at least, you've already heard of them).

Tools like [SonarQube](https://docs.sonarsource.com/sonarqube-community-build/) and [NDepend](https://www.ndepend.com/) use Fitness Functions to evaluate code quality based on metrics such as code complexity, duplication, and adherence to coding standards. Those metrics are calculated based on static analysis of the code, and teams can define thresholds under which a system can be at risk of losing maintainability. **An example of metric related to code quality is Code Coverage**: the higher, the better (even though [100% of code coverage does not guarantee your code is healthy](https://www.code4it.dev/blog/code-coverage-must-not-be-the-target/)).

Tools like [JMeter](https://jmeter.apache.org/) or [K6](https://k6.io/) help you measure system performance under various conditions: having a history of load testing results can help ensure that, as you add new functionalities to the system, the performance on some specific modules does not downgrade.

All in all, **most of the Fitness Functions can be set to be part of CI/CD pipelines**: for example, you can configure a CD pipeline to block the deployment of the code on a specific system if the load testing results of the new code are worse than the previous version. Or you could block a Pull Request if the code coverage percentage is getting lower.

## Further readings

A good way to start experimenting with Load Testing is by running them locally. A nice open-source project is K6: you can install it on your local machine, define the load phases, and analyze the final result.

🔗 [Getting started with Load testing with K6 on Windows 11 | Code4IT](https://www.code4it.dev/blog/k6-load-testing/)

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_

But, even if you don't really care about load testing (maybe because your system is not expected to handle lots of users), I'm sure you still care about code quality and their tests. When using .NET, you can collect code coverage reports using Cobertura. Then, if you are using Azure DevOps, you may want to stop a Pull Request if the code coverage percentage has decreased. 

Here's how to do all of this:

🔗 [Cobertura, YAML, and Code Coverage Protector: how to view Code Coverage report on Azure DevOps | Code4IT](https://www.code4it.dev/blog/code-coverage-on-azure-devops-yaml-pipelines/)

## Wrapping up

Sometimes, there are things that we use every day, but we don't know how to name them: Fitness Functions are one of them - and they are the foundation of future-proof software systems.

You can create your own Fitness Functions based on whatever you can (and need to) measure: from average page loading to star-rated customer satisfaction. In conjunction with a clear dashboard, you can provide a clear view of the history of such metrics.

I hope you enjoyed this article! Let's keep in touch on [LinkedIn](https://www.linkedin.com/in/BelloneDavide/), [Twitter](https://twitter.com/BelloneDavide) or [BlueSky](https://bsky.app/profile/bellonedavide.bsky.social)! 🤜🤛  

Happy coding!

🐧
