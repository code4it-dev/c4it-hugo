---
title: "C# Tip: Use custom Equality comparers in Nunit tests"
date: 2023-06-13
url: /csharptips/nunit-equals-custom-comparer
categories: 
  - CSharp Tips
tags:
  - CSharp
  - Testing
summary: "When writing unit tests, there are smarter ways to check if two objects are equal than just comparing every field one by one."
---

When writing unit tests, you might want to check that the result returned by a method is equal to the one you're expecting.

```cs
[Test]
public void Reverse_Should_BeCorrect()
{
  string input = "hello";
  string result = MyUtils.Reverse(input);

  Assert.That(result, Is.EqualTo("olleh"));
}
```

This approach works pretty fine unless you want to check values on complex types with no equality checks.

```cs
public class Player
{
  public int Id { get; set; }
  public string UserName { get; set; }
  public int Score { get; set; }
}
```

Let's create a dummy method that clones a player:

```cs
public static Player GetClone(Player source) 
  => new Player
    {
      Id = source.Id,
      UserName = source.UserName,
      Score = source.Score
    };
```

and call it this way:

```cs
[Test]
public void GetClone()
{
  var originalPlayer = new Player { Id = 1, UserName = "me", Score = 1 };

  var clonedPlayer = MyUtils.GetClone(originalPlayer);

  Assert.That(clonedPlayer, Is.EqualTo(originalPlayer));
}
```

Even though logically `originalPlayer` and `clonedPlayer` are equal, they are not the same: the test will fail!

Lucky for us, we can specify the comparison rules!

## Equality function: great for simple checks

Say that we don't want to check that all the values match. We only care about `Id` and `UserName`.

When we have just a few fields to check, we can use a function to specify that two items are equal:

```cs
[Test]
public void GetClone_WithEqualityFunction()
{
  var originalPlayer = new Player { Id = 1, UserName = "me", Score = 1 };

  var clonedPlayer = MyUtils.GetClone(originalPlayer);

  Assert.That(clonedPlayer, Is.EqualTo(originalPlayer).Using<Player>(
    (Player a, Player b) => a.Id == b.Id && a.UserName == b.UserName)
    );
}
```

Clearly, if the method becomes unreadable, you can refactor the comparer function as so:

```cs
[Test]
public void GetClone_WithEqualityFunction()
{
  var originalPlayer = new Player { Id = 1, UserName = "me", Score = 1 };

  var clonedPlayer = MyUtils.GetClone(originalPlayer);

  Func<Player, Player, bool> comparer = (Player a, Player b) => a.Id == b.Id && a.UserName == b.UserName;

  Assert.That(clonedPlayer, Is.EqualTo(originalPlayer).Using<Player>(comparer));
}
```

## EqualityComparer class: best for complex scenarios

If you have a complex scenario to validate, you can create a custom class that implements the `IEqualityComparer` interface.  Here, you have to implement two methods: `Equals` and `GetHashCode`.

Instead of just implementing the same check inside the `Equals` method, we're gonna try a different approach: we're gonna use `GetHashCode` to determine how to identify a Player, by generating a string used as a simple identifier, and then we're gonna use the HashCode of the result string for the actual comparison:


```cs
public class PlayersComparer : IEqualityComparer<Player>
{
    public bool Equals(Player? x, Player? y)
    {
        return
            (x is null && y is null)
            ||
            GetHashCode(x) == GetHashCode(y);
    }

    public int GetHashCode([DisallowNull] Player obj)
    {
        return $"{obj.Id}-{obj.UserName}".GetHashCode();
    }
}
```

Clearly, I've also added a check on nullability: `(x is null && y is null)`.

Now we can instantiate a new instance of `PlayersComparer` and use it to check whether two players are equivalent:

```cs
[Test]
public void GetClone_WithEqualityComparer()
{
    var originalPlayer = new Player { Id = 1, UserName = "me", Score = 1 };

    var clonedPlayer = MyUtils.GetClone(originalPlayer);

    Assert.That(clonedPlayer, Is.EqualTo(originalPlayer).Using<Player>(new PlayersComparer()));
}
```

Of course, you can customize the `Equals` method to use whichever condition to validate the equivalence of two instances, depending on your business rules. For example, you can say that two vectors are equal if they have the exact same length and direction, even though the start and end points are different. 

❓ A question for you: where would you put the equality check: in the production code or in the tests project? 

## Wrapping up

As we've learned in this article, there are smarter ways to check if two objects are equal than just comparing every field one by one.

I hope you enjoyed this article! Let's keep in touch on [Twitter](https://twitter.com/BelloneDavide) or [LinkedIn](https://www.linkedin.com/in/BelloneDavide/)! 🤜🤛

Happy coding!

🐧
