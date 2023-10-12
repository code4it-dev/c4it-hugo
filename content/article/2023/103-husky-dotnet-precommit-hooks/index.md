---
title: "Performing operations before Git Commit using Husky.NET pre-commit hooks"
date: 2023-10-12T09:58:15+02:00
url: /blog/husky-dotnet-precommit-hooks
draft: false
categories:
- Blog
tags:
- git
- dotnet
toc: true
summary: "A summary"
images:
 - /blog/husky-dotnet-precommit-hooks/featuredImage.png
---

If you need to run operations before completing a Git Commit, you can rely on Git Hooks.

Git hooks are scripts that run automatically every time a particular event occurs in a Git repository. They let you customize Git’s internal behavior and trigger customizable actions at key points in the development life cycle.

Extending Git hooks allows to to plug in custom functionalities to the regular Git flow, such as git message validation, code formatting, and so on.

I've already described how to use [Husky with NPM](https://www.code4it.dev/blog/conventional-commit-with-githooks/), but here I'm gonna use [Husky.NET](https://alirezanet.github.io/Husky.Net/), the version of Husky created for .NET-based applications.

## Client-side Git Hooks

As we said, Git Hooks are actions that run during specific phases of Git operations.

Git hooks fall into 4 categories:

- client-side hooks related to the committing workflow: they are all executing when you run `git commit` on your local repository.
- client-side hooks related to the email workflow: they are executed when running `git am`, which is a command that allows you integrate mails and git repositories (I've never used it. If you are interested in this functionality, [here's the official documentation](https://git-scm.com/docs/git-am))
- client-side hooks related to other operations: these hooks run locally when performing operations like `git rebase`.
- server-side hooks: they run after a commit is received on the remote repository, and they can reject a `git push` operation.

Let's focus on the client-side hooks that run when you commit changes using `git commit`.

| Hook name |  Description |
| --------- |  ----------- |
| **pre-commit** | This hook is the first invoked by `git commit` (if you don't use the `-m` flag, it is invoked before asking you to insert a commit message) and can be used to inspect the snapshot that is about to be committed. |
| **prepare-commit-msg** | This hook is invoked by `git commit` and can be used to edit the default commit message in case of auto-generated commit messages. |
| **commit-msg** | This hook is invoked by `git commit` and can be used to validate or modify the commit message after it is entered by the user. |
| **post-commit** | This hook is invoked *after* the `git commit` execution has run correctly, and it is generally used to fire notifications. |

## How to install Husky.NET

The tool must be installed in the root folder of the solution.

You first have to create a tool-manifest file in the root folder by running:

```cmd
dotnet new tool-manifest
```

This command creates a file named *dotnet-tools.json* under the *.config* folder: this file is used to list the external tools used by dotnet.

After running the command, you will see that the *dotnet-tools.json* file contains this element:

```json
{
  "version": 1,
  "isRoot": true,
  "tools": {}
}
```

Now you can add Husky as a dotnet tool by running

```cmd
dotnet tool install Husky
```

After running the command, the file will contain something like this:

```json
{
  "version": 1,
  "isRoot": true,
  "tools": {
    "husky": {
      "version": "0.6.2",
      "commands": [
        "husky"
      ]
    }
  }
}
```

Now that we add it to our dependencies, we can add Husky to an existing .NET application by running

```cmd
dotnet husky install
```

If you open the root folder you should be able to see these 3 folders:

- `.git`, that contains the info about the git repository;
- `.config` that contains the description of the tools, such as dotnet-tools;
- `.husky` that contains the files we are going to use to define our Git hooks.

Finally, you can add a new hook by running, for example,

```cmd
dotnet husky add pre-commit -c "echo 'Hello world!'"
git add .husky/pre-commit
```

This fill create a new file, _pre-commit_ (without file extension), under the `.husky` folder. 

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

## husky task runner examples -------------------
## Note : for local installation use 'dotnet' prefix. e.g. 'dotnet husky'

## run all tasks
#husky run

### run all tasks with group: 'group-name'
#husky run --group group-name

## run task with name: 'task-name'
#husky run --name task-name

## pass hook arguments to task
#husky run --args "$1" "$2"

## or put your custom commands -------------------
#echo 'Husky.Net is awesome!'

echo 'Hello world!'
```

The content, here, is pretty useless: you can customize that hook.

Notice that it also generated a `task-runner.json` file: we will use it later.

## Create custom scripts

To customize the script, open the file located at `.husky/pre-commit`.

Here you can add whatever you want.

In the example below, I run commands that compile the code, format the text (using `dotnet format` with the rules defined in the .editorconfig file), and then run all the tests.

```cmd
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo 'Building code'
dotnet build

echo 'Formatting code'
dotnet format

echo 'Running tests'
dotnet test
```

Then, add it to Git, and you are ready to go. 🚀 **But wait...**

## How to handle dotnet format with Husky.NET

There is a problem with the approach in the example above.

Let's simulate a usage flow:

1. you modify a C# class
2. you run `git commit -m "message"`
3. the pre-commit hook runs `dotnet build`
4. the pre-commit hook runs `dotnet format`
5. the pre-commit hook runs `dotnet test`

What is the final result?

Since `dotnet format` modifies the source files, and given that the snapshot has already been created, all **the modified files will not be part of the final commit**!

Also, `dotnet format` executes linting on every file in the solution, not only those that are part of the current snapshot. The operation might then take a lot of time, depending on the size of the repository, and most of the times it will happen that there will not be any updated files (because you formatted everthing in a previous run).

We have to work out a way to fix this issue. I'll suggest three approaches.

### Add all the files

The first approach is quite simple: run `git add .` after `dotnet format`.

So, the flow become:

1. you modify a C# class
2. you run `git commit -m "message"`
3. the pre-commit hook runs `dotnet build`
4. the pre-commit hook runs `dotnet format`
5. the pre-commit hook runs `git add .`
6. the pre-commit hook runs `dotnet test`
7. git creates the commit bundle

This is the simplest approach, but it has some downsides:

- `dotnet format` is executed on every file in the solution, making each commit slower and slower;
- `git add .` adds to the current snapshot all the files modified, even those you did not add to this commit on purpose (maybe because you have updated many files and you want to create two distinct commits)

So, it works, but we can do better.

### Don't modify

You can add the `--verify-no-changes` to the `dotnet format` command: this flag returns an error in case at least one file needs to be updated because of a formatting rule.

Let's see how the flow changes if one file needs to be formatted.

1. you modify a C# class
2. you run `git commit -m "message"`
3. the pre-commit hook runs `dotnet build`
4. the pre-commit hook runs `dotnet format --verify-no-changes`
5. the pre-commit hook returns an error, and aborts the operation;
6. you run `dotnet format` on the whole solution;
7. you run `git add .`
8. you run `git commit -m "message"`
9. the pre-commit hook runs `dotnet build`
10. the pre-commit hook runs `dotnet format --verify-no-changes`. Now there is nothing to format, and we can proceed
11. the pre-commit hook runs `dotnet test`
12. git creates the commit bundle


Notice that, this way, if there is somthing to format, the whole commit is aborted. You will then have to run `dotnet format` on the whole solution, fix the errors, add the changes, and restart the flow.

It's a longer process, but it allows you to have control on the formatting. 

Also, you won't risk to include in the snapshot files that you want to keep staged so that you can add them to a subsequent commit.


### How to run Husky.NET scripts only on the updated files

The third approach is the most complex, but with the best result.

If you recall, while initializing, Husky added two files in the `.husky` folder: `pre-commit` and `task-runner.json`.

The key to this solution is the `task-runner.json` file: this file allows you to create custom scripts with a name, a group, the command to be executed, and its related parameters.

By default, you will see this content:

```json
{
   "tasks": [
      {
         "name": "welcome-message-example",
         "command": "bash",
         "args": [ "-c", "echo Husky.Net is awesome!" ],
         "windows": {
            "command": "cmd",
            "args": ["/c", "echo Husky.Net is awesome!" ]
         }
      }
   ]
}
```

To make sure that `dotnet format` runs only on the staged files, you must create a new task like this:

```json
{
    "name": "dotnet-format-staged-files",
    "group": "pre-commit-operations",
    "command": "dotnet",
    "args": ["format", "--include", "${staged}"],
    "include": ["**/*.cs", "**/*.vb"]
}
```

Here we have specified a name, `dotnet-format-staged-files`, the command to run, `dotnet`, with some parameters, listed in the `args` array. Notice that we can filter the list of files to be formatted by using the `${staged}` parameters, that is populated by Husky.NET.

We have also added this task to a group, named `pre-commit-operations`, that we can use to reference a list of tasks to be executed together.

If you want to run a specific task you can use `dotnet husky run --name taskname`. In this specific case, the command will be `dotnet husky run --name dotnet-format-staged-files`

If you want to run a set of tasks belonging to the same group, you can run `dotnet husky run --group groupname`. In this specific case, the command will be `dotnet husky run --group pre-commit-operations`.

The last step is to call these tasks from within our `pre-commit` file. So, replace the old `dotnet format` command with one of the two commands listed above.

## Final result and optimizations

Now that we have everything in place, we can optimize the script to make it faster.

Let's see which parts we can optimize.

The fist step is the *build phase*. For sure, we have to run `dotnet build` to see if the project builds correctly. You can consider adding the `--no-restore` flag to skip the `restore` step before building.

Then we have the *format phase*: we can avoid formatting every file using one of the steps defined before. I'd go with the third approach we saw.

Then, we have the *test phase*. We can add both the `--no-restore` and the `--no-build` flag to the command, since we have already built everything before. But wait! The format phase updated the content of our files, so we still have to build the whole solution. Unless we swap the *build* and the *format* phases.

So, here we have the final `pre-commit` file:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo 'Ready to commit changes!'

echo 'Format'

dotnet husky run --name dotnet-format-staged-files

echo 'Build'

dotnet build --no-restore

echo 'Test'

dotnet test --no-restore

echo 'Completed pre-commit changes'
```

Yes, I know that when you run `dotnet test` you also build the solution, but I prefer having two separate steps just for clarity!

Ah, and **don't remove the `#!/bin/sh` at the beginning of the script**!

## Skip git hooks

To trigger the hook, just run `git commit -m "message"`. **Before** completing the commit, the hook will run all the commands. **If one of them fails, the whole commit operation is aborted**.

There are cases when you have to skip the validation. For example, if you have integration tests that rely on an external source that is currently offline. In that case, some tests will fail, and you won't be able to commit your code until the external system comes back.

You can skip the commit validation by adding the `--no-verify` flag:

```cmd
git commit -m "my message" --no-verify
```

## Further readings

Husky.NET is a porting of the Husky tool that we already used in a previous article, where we used it as an NPM dependency. In that article, we also learned how to customize Conventional Commits using Git hooks.

🔗 [How to customize Conventional Commits in a .NET application using GitHooks | Code4IT](https://www.code4it.dev/blog/conventional-commit-with-githooks/)

As we learned, there are many more Git hooks that we can use. You can see the full list on the Git documentation:

🔗 [Customizing Git - Git Hooks | Git docs](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_

Of course, if you want to get the best out of Husky.NET, I suggest you have a look at the official documentation:

🔗 [Husky.Net documentation](https://alirezanet.github.io/Husky.Net/)

One last thing: we installe Husky.NET using dotnet tools. If you want to learn more about this topic, I found a nice article online that you might want to read:

🔗 [Using dotnet tools | Gustav Ehrenborg](https://dev.to/gutsav/using-dotnet-tools-46ln)

## Wrapping up


I hope you enjoyed this article! Let's keep in touch on [Twitter](https://twitter.com/BelloneDavide) or [LinkedIn](https://www.linkedin.com/in/BelloneDavide/)! 🤜🤛

Happy coding!

🐧


[ ] Titoli
[ ] Frontmatter
[ ] Rinomina immagini
[ ] Alt Text per immagini
[ ] Grammatica
[ ] Bold/Italics
[ ] Nome cartella e slug devono combaciare
[ ] Immagine di copertina
[ ] Rimuovi secrets dalle immagini
[ ] Pulizia formattazione
[ ] Controlla se ASP.NET Core oppure .NET
[ ] Metti la giusta OgTitle
[ ] Fai resize della immagine di copertina