---
title: "Retrieving your SQL LocalDB Instance Name: A How-To Guide"
date: 2019-05-21
url: /blog/ssms-how-to-get-instance-name
draft: false
categories:
  - Blog
tags:
  - SQL
  - SSMS
  - Database
toc: true
summary: Sometimes, when I open SQL Server Management Studio, I forget about my Local DB instance name. Here's how to retrieve it.
images:
  - /blog/ssms-how-to-get-instance-name/featuredImage.png
---

This article is just a note for something I forget the most: my LocalDB instance names.

Sometimes when I open **SQL Server Management Studio** (SSMS) I lose time thinking and trying to figure out what is the name of my LocalDb.

The solution is simple: open the terminal and run `SQLLocalDb.exe i`, where `i` stands for _information_.

Now you can see the list of configured DBs.

![SQLLocalDb.exe i result](./ssms_result.png "SQLLocalDb result")

**To use it in SSMS remember to use Windows Authentication.**

If you need more info about a specific instance, just run `SQLLocalDB.exe i "InstanceName"` where of course _InstanceName_ must be replaced with the real name you are looking for.

This command displays some info about the specified SQL instance: this info includes the version, the owner and the current state.

![SQL instance details](./ssms_instance_details.png "SQL instance details")

If you want to have a list of all available commands, run `SQLLocalDB.exe -?`. These commands allow you to create and delete SQL instances, stop and start existing instances and so on.

![SQLLocalDB command options](./ssms_command_help.png "SQLLocalDb command options")

It's important to remember that here the spaces are treated as delimiters, so if your DB includes spaces inside its name, you must surround the name with quotes.

_This article first appeared on [Code4IT](https://www.code4it.dev/)_
