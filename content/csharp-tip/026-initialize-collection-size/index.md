---
title: "C# Tip: Improve memory allocation by initializing collection size"
date: 2023-09-26
url: /csharptips/initialize-collection-size
draft: false
categories:
  - CSharp Tips
tags:
  - CSharp
  - dotNET
toc: true
summary: "Sometimes just a minor change can affect performance. Here's a simple trick: initialize your collections by specifying the initial size!"
keywords:
  - csharp
  - dotnet
  - generics
  - collections
  - performance
  - memory
  - allocation
  - list
  - initialization
  - benchmark
  - benchmarkdotnet
images:
  - /csharptips/initialize-collection-size/featuredImage.png
---

When you initialize a collection, like a `List`, you create it with the default size.

Whenever you add an item to a collection, .NET checks that there is enough capacity to hold the new item. If not, it _resizes_ the collection by doubling the inner capacity.

Resizing the collection takes time and memory.

Therefore, when possible, you should initialize the collection with the expected number of items it will contain.

## Initialize a List

In the case of a `List`, you can simply replace `new List<T>()` with `new List<T>(size)`. By specifying the initial size in the constructor's parameters, you'll have a good performance improvement.

Let's create a benchmark using BenchmarkDotNet and .NET 8.0.100-rc.1.23455.8 (at the time of writing, .NET 8 is still in preview. However, we can get an idea of the average performance).

The benchmark is pretty simple:

```cs
[MemoryDiagnoser]
public class CollectionWithSizeInitializationBenchmarks
{
    [Params(100, 1000, 10000, 100000)]
    public int Size;

    [Benchmark]
    public void WithoutInitialization()
    {
        List<int> list = new List<int>();

        for (int i = 0; i < Size; i++)
        {

            list.Add(i);
        }
    }

    [Benchmark(Baseline = true)]
    public void WithInitialization()
    {
        List<int> list = new List<int>(Size);

        for (int i = 0; i < Size; i++)
        {
            list.Add(i);
        }
    }
}
```

The only difference is in the list initialization: in the `WithInitialization`, we have `List<int> list = new List<int>(Size);`.

Have a look at the benchmark result, split by time and memory execution.

Starting with the **execution time**, we can see that without list initialization, we have an average **1.7x performance degradation**.

| Method                | Size   |           Mean | Ratio |
| --------------------- | ------ | -------------: | ----: |
| WithoutInitialization | 100    |     299.659 ns |  1.77 |
| WithInitialization    | 100    |     169.121 ns |  1.00 |
| WithoutInitialization | 1000   |   1,549.343 ns |  1.58 |
| WithInitialization    | 1000   |     944.862 ns |  1.00 |
| WithoutInitialization | 10000  |  16,307.082 ns |  1.80 |
| WithInitialization    | 10000  |   9,035.945 ns |  1.00 |
| WithoutInitialization | 100000 | 388,089.153 ns |  1.73 |
| WithInitialization    | 100000 | 227,040.318 ns |  1.00 |

If we talk about **memory allocation**, we waste an overage of **2.5x** memory if compared to collections with size initialized.

| Method                | Size   | Allocated | Alloc Ratio |
| --------------------- | ------ | --------: | ----------: |
| WithoutInitialization | 100    |    1184 B |        2.60 |
| WithInitialization    | 100    |     456 B |        1.00 |
| WithoutInitialization | 1000   |    8424 B |        2.08 |
| WithInitialization    | 1000   |    4056 B |        1.00 |
| WithoutInitialization | 10000  |  131400 B |        3.28 |
| WithInitialization    | 10000  |   40056 B |        1.00 |
| WithoutInitialization | 100000 | 1049072 B |        2.62 |
| WithInitialization    | 100000 |  400098 B |        1.00 |

## Initialize an HashSet

Similar to what we've done with `List`'s, we can see significant improvements when initializing correctly other data types, such as `HashSet`'s.

Let's run the same benchmarks, but this time, let's initialize a `HashSet<int>` instead of a `List<int>`.

The code is pretty similar:

```cs
 [Benchmark]
 public void WithoutInitialization()
 {
     var set = new HashSet<int>();

     for (int i = 0; i < Size; i++)
     {
         set.Add(i);
     }
 }

 [Benchmark(Baseline = true)]
 public void WithInitialization()
 {
     var set = new HashSet<int>(Size);

     for (int i = 0; i < Size; i++)
     {
         set.Add(i);
     }
 }
```

What can we say about performance improvements?

If we talk about execution time, we can see an average of **2x** improvements.

| Method                | Size   |           Mean | Ratio |
| --------------------- | ------ | -------------: | ----: |
| WithoutInitialization | 100    |     1,122.2 ns |  2.02 |
| WithInitialization    | 100    |       558.4 ns |  1.00 |
| WithoutInitialization | 1000   |    12,215.6 ns |  2.74 |
| WithInitialization    | 1000   |     4,478.4 ns |  1.00 |
| WithoutInitialization | 10000  |   148,603.7 ns |  1.90 |
| WithInitialization    | 10000  |    78,293.3 ns |  1.00 |
| WithoutInitialization | 100000 | 1,511,011.6 ns |  1.96 |
| WithInitialization    | 100000 |   810,657.8 ns |  1.00 |

If we look at memory allocation, if we don't initialize the `HashSet`, we are slowing down the application by a factor of **3x**. Impressive!

| Method                | Size   |  Allocated | Alloc Ratio |
| --------------------- | ------ | ---------: | ----------: |
| WithoutInitialization | 100    |    5.86 KB |        3.28 |
| WithInitialization    | 100    |    1.79 KB |        1.00 |
| WithoutInitialization | 1000   |   57.29 KB |        3.30 |
| WithInitialization    | 1000   |   17.35 KB |        1.00 |
| WithoutInitialization | 10000  |  526.03 KB |        3.33 |
| WithInitialization    | 10000  |  157.99 KB |        1.00 |
| WithoutInitialization | 100000 |  4717.4 KB |        2.78 |
| WithInitialization    | 100000 | 1697.64 KB |        1.00 |

## Wrapping up

Do you need other good reasons to initialize your collection capacity when possible? 😉

I used BenchmarkDotNet to create these benchmarks. If you want an introduction to this tool, you can have a look at how I used it to measure the performance of Enums:

🔗 [Enum.HasFlag performance with BenchmarkDotNet | Code4IT](https://www.code4it.dev/blog/hasflag-performance-benchmarkdotnet/)

I hope you enjoyed this article! Let's keep in touch on [Twitter](https://twitter.com/BelloneDavide) or [LinkedIn](https://www.linkedin.com/in/BelloneDavide/)! 🤜🤛

Happy coding!

🐧
