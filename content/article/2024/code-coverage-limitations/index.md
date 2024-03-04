---
title: "Why reaching 100% Code Coverage must NOT be your testing goal (with examples in C#)"
date: 2024-03-04
url: /blog/100-code-coverage-as-target
draft: false
categories:
 - Blog
tags:
 - CSharp
toc: true
summary: "A summary"
images:
 - /blog/100-code-coverage-as-target/featuredImage.png
---


Code coverage is a valuable metric in software development, especially when it comes to testing. It provides insights into how much of your codebase is exercised by your test suite. 
 
However, it's essential to recognize that code coverage alone should not be the ultimate goal of your testing strategy. It has some known limitations, and 100% code coverage does not guarantee that your code is bug-free.

In this article, we'll explore why code coverage matters, its limitations, and how to strike a balance between achieving high coverage and effective testing. We'll use C# to demonstrate when Code Coverage works well and how you can cheat on the result.

## What Is Code Coverage?

Code coverage measures the percentage of code lines, branches, or statements executed during testing. It helps answer questions like:

- How much of my code is tested?
- Are there any untested paths or dead code?
- Which parts of the application need additional test coverage?

In C#, tools like **Cobertura**, **dotCover**, and **Visual Studio's built-in coverage analysis** provide code coverage reports.

You may be tempted to think that the higher the coverage, the better is the quality of your tests. However, we will demonstrate why this assumption is misleading soon.

## Why Code Coverage Matters

Clearly, **if you write valuable tests**, Code Coverage is a great ally. 

A good value of Code Coverage helps you with:

1. **Risk mitigation**: High code coverage reduces the risk of undiscovered defects. If a piece of code isn't covered, it's more likely to harbor bugs.
2. **Preventing regressions**: code is destined to evolve during time. If you ensure that most of your code is covered by tests, whenever you'll add some more code you will discover which parts of the existing system are impacted by your changes.
3. **Quality assurance**: Code coverage ensures that critical parts of your application are tested thoroughly. It's a safety net against regressions.
4. **Guidance for Testing Efforts**: Code coverage highlights areas that need more attention. It guides developers to write additional tests where necessary.

## The Limitations of Code Coverage

While code coverage is valuable, it has limitations:

1. **False Sense of Security**: Achieving 100% coverage doesn't guarantee bug-free software. It's possible to have well-covered code that still contains subtle defects. **This is expecially true when mocking dependencies**.
2. **Focus on Lines, Not Behavior**: Code coverage doesn't consider the quality of tests. It doesn't guarantee that the tests exercise all possible scenarios.
3. **Ignored Edge Cases**: Some code paths (exception handling, rare conditions) are hard to cover. High coverage doesn't necessarily mean thorough testing.

## 3 ways to en

For the sake of this article, I've created a dummy .NET API project with the tipical three layers: controller, service, repository.

It contains a Controller with two endpoints:

```cs
[ApiController]
[Route("[controller]")]
public class UniversalWeatherForecastController : ControllerBase
{
    private readonly IWeatherService _weatherService;

    public UniversalWeatherForecastController(IWeatherService weatherService)
    {
        _weatherService = weatherService;
    }

    [HttpGet]
    public IEnumerable<Weather> Get(int locationId)
    {
        var forecast = _weatherService.ForecastsByLocation(locationId);
        return forecast.ToList();
    }

    [HttpGet("minByPlanet")]
    public Weather GetMinByPlanet(Planet planet)
    {
        return _weatherService.MinTemperatureForPlanet(planet);
    }
}
```

It then uses the Service:

```cs
public class WeatherService : IWeatherService
{
    private readonly IWeatherForecastRepository _repository;

    public WeatherService(IWeatherForecastRepository repository)
    {
        _repository = repository;
    }

    public IEnumerable<Weather> ForecastsByLocation(int locationId)
    {
        ArgumentOutOfRangeException.ThrowIfLessThanOrEqual(locationId, 0);

        Location? searchedLocation = _repository.GetLocationById(locationId);

        if (searchedLocation == null)
            throw new LocationNotFoundException(locationId);

        return searchedLocation.WeatherForecasts;
    }

    public Weather MinTemperatureForPlanet(Planet planet)
    {
        var allCitiesInPlanet = _repository.GetLocationsByPlanet(planet);
        int minTemperature = int.MaxValue;
        Weather minWeather = null;
        foreach (var city in allCitiesInPlanet)
        {
            int temperature =
                city.WeatherForecasts.MinBy(c => c.TemperatureC).TemperatureC;

            if (temperature < minTemperature)
            {
                minTemperature = temperature;
                minWeather = city.WeatherForecasts.MinBy(c => c.TemperatureC);
            }
        }
        return minWeather;
    }
}
```

Which then calls a Repository, omitted for brevity (it's just a bunch on items in a in-memory `List`).

I then created an NUnit test project to generate the unit tests, focusing on the `WeatherService`:

```cs

public class WeatherServiceTests
{
    private readonly Mock<IWeatherForecastRepository> _mockRepository;
    private WeatherService _sut;

    public WeatherServiceTests() => _mockRepository = new Mock<IWeatherForecastRepository>();

    [SetUp]
    public void Setup() => _sut = new WeatherService(_mockRepository.Object);

    [TearDown]
    public void Teardown() =>_mockRepository.Reset();

    // Tests
    
}
```

This class covers two cases, both related to the `ForecastsByLocation` method of the Service.

*Case 1*: when the location exists in the repository, this method must return the related info:

```cs
[Test]
public void ForecastByLocation_Should_ReturnForecast_When_LocationExists()
{
    //Arrange
    var forecast = new List<Weather>
        {
            new Weather{
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(1)),
                Summary = "sunny",
                TemperatureC = 30
            }
        };

    var location = new Location
    {
        Id = 1,
        WeatherForecasts = forecast
    };

    _mockRepository.Setup(r => r.GetLocationById(1)).Returns(location);

    //Act
    var resultForecast = _sut.ForecastsByLocation(1);

    //Assert
    CollectionAssert.AreEquivalent(forecast, resultForecast);
}
```

*Case 2*: when the location does not exist in the repository, the method whould throw a `LocationNotFoundException`:

```cs
[Test]
public void ForecastByLocation_Should_Throw_When_LocationDoesNotExists()
{
    //Arrange
    _mockRepository.Setup(r => r.GetLocationById(1)).Returns<Location?>(null);

    //Act + Assert
    Assert.Catch<LocationNotFoundException>(() => _sut.ForecastsByLocation(1));
}
```

We then can run the Code Coverage report and see the result:

![alt text](initial-code-coverage.png)

We have 16% of lines and 25% of branches covered by tests.

Delving into the details of the `WeatherService` class, we can see that we have reached 100% Code Coverage for the `ForecastsByLocation` method.

![alt text](weather-service-initial-coverage.png)

Can we assume that that method is bug-free? Not at all!

### Not all cases are covered by tests


Let's review the method under test.

```cs
public IEnumerable<Weather> ForecastsByLocation(int locationId)
{
    ArgumentOutOfRangeException.ThrowIfLessThanOrEqual(locationId, 0);

    Location? searchedLocation = _repository.GetLocationById(locationId);

    if (searchedLocation == null)
        throw new LocationNotFoundException(locationId);

    return searchedLocation.WeatherForecasts;
}
```

Our tests only covered two cases:

- the location exists;
- the location does not exist.

Our tests do not cover these cases:

- the `locationId` is less than zero;
- the `locationId` is exactly zero (are we sure that 0 is an invalid `locationId`?)
- the `_repository` throws an exception (right now, that exception is not handled);
- the location exists, but it has no weather forecast info: is it a valid result? Or we should have thrown another custom exception?

So, well, **we have 100% Code Coverage, yet we have plenty of uncovered cases**.

### Cheat on the result by adding pointless tests

There's a simple way to have high Code coverage without worrying of the quality of the tests: calling the methods and ignoring the result.

To demonstrate it, we can create one single test method to reach the 100% coverage for the Repository, without even knowing what it actually does:

```cs
public class WeatherForecastRepositoryTests
{
    private readonly WeatherForecastRepository _sut;

    public WeatherForecastRepositoryTests() =>
        _sut = new WeatherForecastRepository();

    [Test]
    public void TotallyUselessTest()
    {
        _ = _sut.GetLocationById(1);
        _ = _sut.GetLocationsByPlanet(Planet.Jupiter);

        Assert.That(1, Is.EqualTo(1));
    }
}
```

And here we are: we have reached 53% of total code coverage by adding one single test which does not provide any value!

![alt text](image.png)

As you can see, in fact, the WeatherForecastRepository has now reached 100% Code coverage.

![alt text](image-1.png)

Great job! Or is it?

### Cheating by excluding parts of code

In C# there is a handy attribute that you can apply to methods and classes: `ExcludeFromCodeCoverage`.

While this can be useful for classes that you cannot test, it can be used to inflate the code coverage percentage by applying it to classes and methods you don't want to test (maybe because you are lazy?).

We can, in fact, add that attribute to every single class, like this:

```cs

[ApiController]
[Route("[controller]")]
[ExcludeFromCodeCoverage]
public class UniversalWeatherForecastController : ControllerBase
{
    // omitted
}

[ExcludeFromCodeCoverage]
public class WeatherService : IWeatherService
{
    // omitted
}

[ExcludeFromCodeCoverage]
public class WeatherForecastRepository : IWeatherForecastRepository
{
    // omitted
}
```

You can then add the same attribute to all the other classes - even the `Program` class! - to reach 100% code coverage without writing lots of test.

![alt text](./code-coverage-with-everything-excluded.png)

*Note: to reach 100% I had to exclude everything but the tests on the Repository: otherwise, if I had exactly zero methods under tests, the final code coverage would've been 0.*

## Beyond Code Coverage: Effective Testing Strategies

As we saw, high code coverage is not enough. It's a good starting point, but it must not be the final goal.

We can, indeed, focus our efforts in different areas:

1. **Test Quality**: Prioritize writing meaningful tests over chasing high coverage. Focus on edge cases, boundary values, and scenarios that matter to users.
2. **Exploratory Testing**: Manual testing complements automated tests. Exploratory testing uncovers issues that automated tests might miss.
3. **Mutation Testing**: Instead of just measuring coverage, consider mutation testing. It introduces artificial defects and checks if tests catch them.

Finally, my suggestion is to focus on integration tests rather than on unit tests: this testing strategy is called Testing Diamond.

## Further readings

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_

Link a YT

## Wrapping up

Code coverage is a useful metric, but it's not the end goal. Aim for a balance: maintain good coverage while ensuring effective testing. Remember that quality matters more than mere numbers. Happy testing! 🚀

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
- [ ] Pulizia formattazione
- [ ] Add wt.mc_id=DT-MVP-5005077 to links
- [ ] "Code Coverage" sempre maiuscolo
- [ ] Nascondi data coverage dagli screenshot 
- [ ] aggiungi screenshot finale