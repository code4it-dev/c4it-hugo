---
title: "Davide's Code and Architecture Notes - Introducing SLI, SLO, and SLA"
date: 2024-03-19
url: /architecture-notes/sli-vs-slo-vs-sla
draft: false
categories:
  - Code and Architecture Notes
tags:
  - Software Architecture
toc: true
summary: "Non-functional requirements. How can you ensure you meet them? Let's understand SLO, SLA, and SLI, and how they affect your SDLC."
keywords:
  - software-architecture
  - systemdesign
  - architecture
  - slo
  - sla
  - sli
  - performance
  - documentation
  - constraint
  - architectural-characteristics
images:
  - /architecture-notes/sli-vs-slo-vs-sla/featuredImage.png
---

In the world of software engineering, three acronyms are critical in the design and maintenance of reliable systems: SLO (Service Level Objective), SLA (Service Level Agreement), and SLI (Service Level Indicator).

These terms are interconnected, yet they serve distinct purposes within the lifecycle of software services. Understanding these three acronyms is crucial to designing the "right" system: in fact, when designing software architecture, we should consider both functional and non-functional requirements.

In this article, we will learn what SLO, SLA, and SLI are, and how they affect the software development lifecycle and the choices in system design.

## Service Level Indicator (SLI) - what to monitor

An SLI is a **quantifiable measure** of some aspect of the level of service that is provided.

It could be the percentage of uptime, the response time, or the rate of error messages. SLIs are used to objectively measure the service's performance, and it's used to validate SLOs.

How can you keep track of SLIs?

- Thoroughly define the metrics to be checked: for example, talking about "HTTP errors" is not clear enough: what kind of errors? 404, 401, and 500 are all status codes that represent errors but whose occurrence may or may not indicate errors in your system.
- **Define fitness functions** to validate the quality of the code releases: you can ensure that new releases do not degrade existing values of the SLIs even before releasing the changes;
  Use and track the correct metrics: with all the new features we have in the Observability fields, we can track everything we need.

## Service Level Objective (SLO) - the final target

An SLO (Service Level Objective) is a target level of service between a service provider and the end user that is measured by specific metrics.

It represents the **desired goal in terms of some metrics** (usually, performance and reliability) that the service aims to achieve.

You can have a SLO value for each metric that is important for you and your customers.

Examples are:

- 99.999% availability during a specific time period;
- requests to a web service should have a latency of less than 300 milliseconds for 99% of requests;
- requests _to a specific endpoint_ should have latency of less than 100 milliseconds for 99.9% of requests;
- 99.9% of requests must return a successful status code.

It's important to note that **SLOs are specific, detailed, and measurable**. For example, it's "300 milliseconds for 99% of requests": we have specified both the exact latency value and the percentage of requests that must follow this rule.

Wouldn't it be different if we said, "Requests should be generally fast"? It's too vague, so it cannot be measured.

What are some ways to keep track of SLO?

- **Create a dashboard** to measure each of the SLOs you have defined; then, you can send alerts in case the value reaches a threshold value;
- Design the application architecture with the SLO values in mind: for example, if you need to ensure low latency for the requests, you can design the communication between services to be asynchronous, or you can decide to deploy the application close to the users' location.

In short, while SLI is the actual value of the measurement, SLO is the final goal to reach for that SLI.

For example, if your system has not had any downtime, you can have 100% uptime as an SLI (the actual value) even if you defined the SLO to be 90% uptime during that time period.

## Service Level Agreement (SLA) - the legal constraints and consequences

An SLA is a **formal agreement** between a service provider and the customer.

Unlike SLOs, SLAs are legally binding and include consequences for non-compliance.

Again, to ensure that SLA is met, you have to provide values for each measure agreed upon. The more detailed the metrics, the better.

It's important to highlight that if your product does not meet the SLA, you may incur penalties, fees, and everything else legally part of the contract.

An example of an SLA definition is tech support's responsiveness: in the SLA definition, you can define that when a customer opens a ticket, you have to close it within 24 hours.

## Impacts on Software Architecture decisions

The interplay between SLOs, SLAs, and SLIs significantly influences software architecture decisions.

Examples are:

- **Reliability and Performance Metrics**: SLOs and SLIs help architects determine the reliability and performance metrics that the system must meet. This influences the choice of technologies and patterns that can achieve these metrics. Microservice or Monolith? C# or Rust? On-prem or Cloud?
- **Scalability**: To meet SLOs, the system may need to handle a high number of requests per second, which requires scalable architectures such as microservices or serverless computing.
- **Redundancy and Failover Mechanisms**: The need to comply with SLAs may lead to implementing redundancy and failover mechanisms to ensure high availability and minimize downtime.
- **Monitoring and Alerting Systems**: SLIs necessitate robust monitoring and alerting systems to track the performance of the service in real-time and notify when SLOs are at risk of being breached.
- **Resource Allocation**: Meeting SLOs can affect how resources are allocated, leading to decisions about load balancing, database sharding, or the use of content delivery networks (CDNs).
- **Cost Considerations**: The penalties associated with SLAs can impact cost considerations, influencing the architecture to be more cost-efficient while still meeting service levels.

## Further readings

I've read lots of interesting articles about SLI, SLO, and SLA. However, my favourite article is the one available at Atlassian's blog.

🔗 [SLA vs. SLO vs. SLI: What’s the difference? | Atlassian](https://www.atlassian.com/incident-management/kpis/sla-vs-slo-vs-sli)

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_

We learned that SLO helps us define our architectural characteristics. How can we keep track of the decisions we make when designing the architecture? We can use ADRs: textual documents that clarify our choices (and the reasons behind these decisions).

🔗 [Tracking decision with Architecture Decision Records (ADRs) | Code4IT](https://www.code4it.dev/architecture-notes/architecture-decision-records/)

## Wrapping up

In conclusion, SLOs, SLAs, and SLIs are not just operational metrics; they are key in shaping and designing the software architecture. They ensure that the system is designed with a clear understanding of the expected service levels and non-functional requirements, and they provide a framework for maintaining and improving the service post-deployment.

Teams must ensure that the architectural decisions are aligned with these objectives and agreements.

I hope you enjoyed this article! Let's keep in touch on [Twitter](https://twitter.com/BelloneDavide) or [LinkedIn](https://www.linkedin.com/in/BelloneDavide/)! 🤜🤛

Happy coding!

🐧
