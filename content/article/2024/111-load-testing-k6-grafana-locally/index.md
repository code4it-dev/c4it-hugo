---
title: "How to run basic Load Tests locally with K6, Prometheus, and Grafana"
date: 2024-02-06T11:58:31+01:00
url: /blog/post-slug
draft: false
categories:
 - Blog
tags:
 - CSharp
toc: true
summary: "A summary"
images:
 - /blog/post-slug/featuredImage.png
---

Understanding how the

## Install and configure Prometheus

## Install and configure Grafana

## Install and configure K6

## Run the tests


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
- [ ] Alt Text per immagini
- [ ] Trim corretto per bordi delle immagini
- [ ] Rimuovi secrets dalle immagini
- [ ] Controlla se ASP.NET Core oppure .NET
- [ ] Pulizia formattazione
- [ ] Add wt.mc_id=DT-MVP-5005077 to links

```md
===== Installa Prometheus =====

https://prometheus.io/download/#prometheus

scarica zip e lancia exe con .\prometheus.exe --web.enable-remote-write-receiver per abilitare l'endpoint di receiver

Accedi a prometheus sotto http://localhost:9090/

======= Installa K6 ======

winget install k6 --source winget

======= Inizializza K6 ========

Crea file di config, in una cartella (usando CMD, non Powershell, a meno che non setti il comando globalmente) lanciando

k6 new

Di default, ci sono 10 VU (virtual user) e lo script dura 30 secondi

====== Lancia k6 ======

k6 run script.js

questo poi mostra i risultati a console, in maniera testuale
https://k6.io/docs/get-started/results-output/

aggiungi i custom metric per capire meglio il dettaglio:

https://k6.io/docs/using-k6/metrics/reference/

======

https://stackoverflow.com/questions/76679217/how-to-configure-grafana-agent

===== Installa Grafana ======

installa pacchetto msi
Disponibile sotto http://localhost:3000/, accedi con admin - admin.

Sotto Connections, aggiungi Prometheus come data source, specificando Localhost:9090

Sotto dashboards, crea quella di default di Prometheus

```
