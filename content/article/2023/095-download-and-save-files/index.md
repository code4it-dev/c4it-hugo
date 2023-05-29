---
title: "How to download an online file and store it on file system with C#"
date: 2023-05-09
url: /blog/download-and-save-files
draft: false
categories:
  - Blog
tags:
  - CSharp
toc: true
summary: "Downloading a file from a remote resource seems an easy task: download the byte stream and copy it to a local file. Beware of edge cases!"
---

Downloading files from an online source and saving them on the local machine seems an easy task.

And guess what? _It is!_

In this article, we will learn how to download an online file, perform some operations on it - such as checking its file extension - and store it in a local folder. We will also learn how to deal with edge cases: what if the file does not exist? Can we overwrite existing files?

## How to download a file stream from an online resource using HttpClient

Ok, this is easy. If you have the file URL, it's easy to just download it using `HttpClient`.

```cs
HttpClient httpClient = new HttpClient();
Stream fileStream = await httpClient.GetStreamAsync(fileUrl);
```

Using `HttpClient` can cause some trouble, especially when you have a huge computational load. As a matter of fact, using `HttpClientFactory` is preferred, as we've already explained [in a previous article](https://www.code4it.dev/csharptips/use-httpclientfactory-instead-of-httpclient/).

But, ok, it looks easy - way too easy! There are two more parts to consider.

### How to handle errors while downloading a stream of data

You know, shit happens!

There are at least 2 cases that stop you from downloading a file: the file does not exist or the file requires authentication to be accessed.

In both cases, an `HttpRequestException` exception is thrown, with the following stack trace:

```plaintext
at System.Net.Http.HttpResponseMessage.EnsureSuccessStatusCode()
at System.Net.Http.HttpClient.GetStreamAsyncCore(HttpRequestMessage request, CancellationToken cancellationToken)
```

As you can see, **we are implicitly calling `EnsureSuccessStatusCode`** while getting the stream of data.

You can tell the consumer that we were not able to download the content in two ways: throw a _custom_ exception or return `Stream.Null`. We will use `Stream.Null` for the sake of this article.

Note: **always throw custom exceptions and add context to them**: this way, you'll add more useful info to consumers and logs, and you can hide implementation details.

So, let me refactor the part that downloads the file stream and put it in a standalone method:

```cs
async Task<Stream> GetFileStream(string fileUrl)
{
    HttpClient httpClient = new HttpClient();
    try
    {
        Stream fileStream = await httpClient.GetStreamAsync(fileUrl);
        return fileStream;
    }
    catch (Exception ex)
    {
        return Stream.Null;
    }
}
```

so that we can use `Stream.Null` to check for the existence of the stream.

## How to store a file in your local machine

Now we have our stream of data. We need to store it somewhere.

We will need to copy our input stream to a `FileStream` object, placed within a `using` block.

```cs
using (FileStream outputFileStream = new FileStream(path, FileMode.Create))
{
    await fileStream.CopyToAsync(outputFileStream);
}
```

### Possible errors and considerations

When creating the `FileStream` instance, we have to pass the constructor both the full path of the image, with also the file name, and `FileMode.Create`, which tells the stream what type of operations should be supported.

`FileMode` is an enum coming from the `System.IO` namespace, and has different values. Each value fits best for some use cases.

```cs
public enum FileMode
{
    CreateNew = 1,
    Create,
    Open,
    OpenOrCreate,
    Truncate,
    Append
}
```

Again, there are some edge cases that we have to consider:

- **the destination folder does not exist**: you will get an `DirectoryNotFoundException` exception. You can easily fix it by calling `Directory.CreateDirectory` to generate all the hierarchy of folders defined in the path;
- **the destination file already exists**: depending on the value of `FileMode`, you will see a different behavior. `FileMode.Create` overwrites the image, while `FileMode.CreateNew` throws an `IOException` in case the image already exists.

## Full Example

It's time to put the pieces together:

```cs
async Task DownloadAndSave(string sourceFile, string destinationFolder, string destinationFileName)
{
    Stream fileStream = await GetFileStream(sourceFile);

    if (fileStream != Stream.Null)
    {
        await SaveStream(fileStream, destinationFolder, destinationFileName);
    }
}

async Task<Stream> GetFileStream(string fileUrl)
{
    HttpClient httpClient = new HttpClient();
    try
    {
        Stream fileStream = await httpClient.GetStreamAsync(fileUrl);
        return fileStream;
    }
    catch (Exception ex)
    {
        return Stream.Null;
    }
}

async Task SaveStream(Stream fileStream, string destinationFolder, string destinationFileName)
{
    if (!Directory.Exists(destinationFolder))
        Directory.CreateDirectory(destinationFolder);

    string path = Path.Combine(destinationFolder, destinationFileName);

    using (FileStream outputFileStream = new FileStream(path, FileMode.CreateNew))
    {
        await fileStream.CopyToAsync(outputFileStream);
    }
}
```

## Bonus tips: how to deal with file names and extensions

You have the file URL, and you want to get its extension and its plain file name.

You can use some methods from the `Path` class:

```cs
string image = "https://website.come/csharptips/format-interpolated-strings/featuredimage.png";
Path.GetExtension(image); // .png
Path.GetFileNameWithoutExtension(image); // featuredimage
```

But not every image has a file extension. For example, Twitter cover images have this format: *https://pbs.twimg.com/profile_banners/1164441929679065088/1668758793/1080x360*

```cs
string image = "https://pbs.twimg.com/profile_banners/1164441929679065088/1668758793/1080x360";
Path.GetExtension(image); // [empty string]
Path.GetFileNameWithoutExtension(image); // 1080x360
```

## Further readings

As I said, you should not instantiate a `new HttpClient()` every time. You should use `HttpClientFactory` instead.

If you want to know more details, I've got an article for you:

🔗 [C# Tip: use IHttpClientFactory to generate HttpClient instances | Code4IT](https://www.code4it.dev/csharptips/use-httpclientfactory-instead-of-httpclient/)

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_

## Wrapping up

This was a quick article, quite easy to understand - I hope!

My main point here is that not everything is always as easy as it seems - you should always consider edge cases!

I hope you enjoyed this article! Let's keep in touch on [Twitter](https://twitter.com/BelloneDavide) or on [LinkedIn](https://www.linkedin.com/in/BelloneDavide/), if you want! 🤜🤛

Happy coding!

🐧
