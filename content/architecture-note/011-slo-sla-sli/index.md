---
title: "Davide's Code and Architecture Notes - Understanding SLO, SLA, and SLI"
date: 2024-03-14T15:37:25+01:00
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

In the world of software engineering, three acronyms are critical in the design and maintenance of reliable systems: SLO (Service Level Objective), SLA (Service Level Agreement), and SLI (Service Level Indicator). 

These terms are interconnected, yet they serve distinct purposes within the lifecycle of software services. Understanding these three acronyms is crucial to design the "right" system: in fact, when designing software architecture, we should care both of the functional and non-functional requirements.

Is this article, we will learn what SLO, SLA, and SLI are, and how they affect the software development lifecycle and the choices in system design.

## Service Level Objective (SLO)

An SLO is a target level of service between a service provider and the end user that is measured by **specific metrics**. 

It represents the desired goal in terms of some metrics (usually, performance and reliability) that the service aims to achieve. 

You can have a SLO value for each metric that is important for you and for your customers.

Examples are: 

- 99.999% availability during a specific time period;
- requests to a web service should have a latency of less than 300 milliseconds for 99% of requests;
- requests *to a specific endpoint* should have latency of less than 100 milliseconds for 99.9% of requests;
- 99.9% of requests must return a successful status code.

It's important here to notice that **SLOs are specific, detailed, and measurable**. For example, it's "300 milliseconds for 99% of requests": we have specified both the exact value of the latency and the percentage of requests that must follow this rule.

Wouldn't it be different if we said "requests should be generally fast"? It's too vague, so it cannot be measured.

What are some strategies to keep track of SLO?

1. **Create a dashboard** to measure each of the SLOs you have defined, and send alert in case you a reaching a risky value;
2. **Define fitness functions** to validate the quality of the releases: you can ensure that new releases do not degrade existing values of the SLOs even before releasing the changes;
3. Design the application architecture with the SLO values in mind: for example, if you need to ensure low latency for the requests, you can design the communication between services to be asynchronous, or you can decide to deploy the datacenter close to the users' location.

## Service Level Indicator (SLI)

An SLI is a quantifiable measure of some aspect of the level of service that is provided.

It could be the percentage of uptime, the response time, or the rate of error messages. SLIs are used to objectively measure the performance of the service against the defined SLOs.

So, while SLO is the final goal, SLI is the actual value of the measurement.

For example, if your system has not downtime at all, you can have 100% uptime as a SLI, but 90% uptime as a SLO.

How can you define SLI?

Again, use measurable metrics and dashboard.

For example, you can use Health Checks to ensure that your system is up and running. You can keep track of the duration of each single request. You can define custom metrics that you need to ensure the SLO are met.

## Service Level Agreement (SLA)

An SLA is a formal agreement between a service provider and the customer. 

It outlines the expected level of service, the metrics by which this service is measured, and the penalties or remedies if the agreed-upon levels are not achieved. 

Unlike SLOs, SLAs are legally binding and include consequences for non-compliance.

Again, to ensure that SLA is met, you have to provide values for each measure agreed. The more detailed the metrics, the better.

It's important to highlight that, if your product does not meet the SLA, you may incur in penatlies, fees, and everthing legally part of the contract.

A typical exaple of SLA is the responsiveness of the tech support: in the SLA definition you can define that, in case of a ticket opened by your customers, you have to close the ticket by 24 hours. 


## Impact on Software Architecture Decisions

The interplay between SLOs, SLAs, and SLIs significantly influences software architecture decisions. 

Here's how:

- **Reliability and Performance Metrics**: SLOs and SLIs help architects determine the reliability and performance metrics that the system must meet. This influences the choice of technologies and patterns that can achieve these metrics.
- **Scalability**: To meet SLOs, the system may need to handle a high number of requests per second, which requires scalable architectures such as microservices or serverless computing.
- **Redundancy and Failover Mechanisms**: The need to comply with SLAs may lead to implementing redundancy and failover mechanisms to ensure high availability and minimize downtime.
- **Monitoring and Alerting Systems**: SLIs necessitate robust monitoring and alerting systems to track the performance of the service in real-time and notify when SLOs are at risk of being breached.
- **Resource Allocation**: Meeting SLOs can affect how resources are allocated, leading to decisions about load balancing, database sharding, or the use of content delivery networks (CDNs).
- **Cost Considerations**: The penalties associated with SLAs can impact cost considerations, influencing the architecture to be more cost-efficient while still meeting service levels.



## Further readings

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_

https://www.atlassian.com/incident-management/kpis/sla-vs-slo-vs-sli

## Wrapping up

In conclusion, SLOs, SLAs, and SLIs are not just operational metrics; they are pivotal in shaping the software architecture. They ensure that the system is designed with a clear understanding of the expected service levels, and they provide a framework for maintaining and improving the service post-deployment. 

By aligning architectural decisions with these objectives and agreements, organizations can create resilient, performant, and user-centric software services.

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
 