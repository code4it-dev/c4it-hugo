---
title: "C# Tip: Path.Combine and Path.Join are similar but way different."
date: 2024-06-25
url: /csharptips/path-combine-vs-path-join
draft: false
categories:
 - CSharp Tips
tags: 
 - CSharp
toc: false
summary: "When composing the path to a folder or file location, the `Path` class can come in handy. `Path.Join` and `Path.Combine` may look similar, but their behavior differ in an unexpected way."
images:
 - /csharptips/path-combine-vs-path-join/featuredImage.png
---


When you need to compose the path to a folder or file location, you can rely on the `Path` class. It provides several static methods to create, analyze and modify strings that represent a file system.

`Path.Join` and `Path.Combine` look similar, yet they have some important differences that you should know to get the result you are expecting.

## Path.Combine: take from the last absolute path

`Path.Combine` concatenates several strings into a single string that represents a file path.

```cs
Path.Combine("C:", "users", "davide");
// C:\users\davide
```

However, there's a tricky behaviour: if any argument other than the first contains an absolute path, all the previous parts are discarded, and the returned string starts with the last absolute path:

```cs
Path.Combine("foo", "C:bar", "baz");
// C:bar\baz

Path.Combine("foo", "C:bar", "baz", "D:we", "ranl");
// D:we\ranl
```

## Path.Join: take everything 

`Path.Join` does not try to return an absolute path, but it just joins the string using the OS path separator:

```cs
Path.Join("C:", "users", "davide");
// C:\users\davide
```

This means that if there is an absolute path in any argument position, all the previous parts are not discarded:

```cs
Path.Join("foo", "C:bar", "baz");
// foo\C:bar\baz

Path.Join("foo", "C:bar", "baz", "D:we", "ranl");
// foo\C:bar\baz\D:we\ranl
```

## Final comparison

As you can see, the behaviour is slightly different. 

Let's see a table where we call the two methods using the same input strings:

| | **Path.Combine** | **Path.Join** |
|--|--|--|
| `["singlestring"]` | `singlestring` | `singlestring` |
| `["foo", "bar", "baz"]` | `foo\bar\baz` | `foo\bar\baz` |
| `["foo", " bar ", "baz"]` | `foo\ bar \baz` | `foo\ bar \baz` |
| `["C:", "users", "davide"]` | `C:\users\davide` | `C:\users\davide` |
| `["foo", "  ", "baz"]` | `foo\  \baz` | `foo\  \baz` |
| `["foo", "C:bar", "baz"]` | `C:bar\baz` | `foo\C:bar\baz` |
| `["foo", "C:bar", "baz", "D:we", "ranl"]` | `D:we\ranl` | `foo\C:bar\baz\D:we\ranl` |
| `["C:", "/users", "/davide"]` | `/davide` | `C:/users/davide` |
| `["C:", "users/", "/davide"]` | `/davide` | `C:\users//davide` |
| `["C:", "\users", "\davide"]` | `\davide` | `C:\users\davide` |

Have a look at some specific cases:

- neither methods handle white and empty spaces: `["foo", "  ", "baz"]` are transformed to `foo\  \baz`. Similarly, `["foo", " bar ", "baz"]` are combined into `foo\ bar \baz`, without removing the head and trail whitespaces. So, **always remove white spaces and empty values!**
- `Path.Join` handles in a not-so-obvious way the case of a path starting with `/` or `\`: if a part starts with `\`, it is included in the final path; if it starts with `/`, it is escaped as `//`. This behaviour depends on the path separator used by the OS: in my case, I'm running these methods using Windows 11.

Finally, always remember that **the path separator depends on the Operating System** that is running the code. Don't assume that it will always be `/`: this assumption may be correct for one OS but wrong for another one.

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_

## Wrapping up

As we have learned, `Path.Combine` and `Path.Join` look similar but have profound differences.

Dealing with path building may look easy, but it hides some complexity. Always remember to:

- **validate and clean your input** before using either of these methods (remove empty values, white spaces, and head or trailing path separators);
- always **write some Unit Tests** to cover all the necessary cases;

I hope you enjoyed this article! Let's keep in touch on [Twitter](https://twitter.com/BelloneDavide) or [LinkedIn](https://www.linkedin.com/in/BelloneDavide/)! 🤜🤛

Happy coding!

🐧
