---
title: "C# Tip: How to create Unit Tests for Model Validation"
date: 2023-10-24
url: /csharptips/unit-test-model-validation
draft: false
categories:
  - CSharp Tips
tags:
  - CSharp
  - Dotnet
  - Tests
toc: false
summary: "As you know, you should always validate input models. Therefore, you should create Unit Tests to test the data validation. Let's learn!"
keywords:
  - csharp
  - dotnet
  - testing
  - code-quality
  - unit-tests
  - design
  - data
  - validation
  - extensibility
  - model
  - ivalidatableobject
images:
  - /csharptips/unit-test-model-validation/featuredImage.png
---

Model validation is fundamental to any project: it brings **security** and **robustness** acting as a first shield against an invalid state.

You should then add Unit Tests focused on model validation. In fact, when defining the input model, you should always consider both the valid and, even more, the invalid models, **making sure that all the invalid models are rejected**.

_BDD_ is a good approach for this scenario, and you can use _TDD_ to implement it gradually.

Okay, but how can you validate that the models and model attributes you defined are correct?

Let's define a simple model:

```cs
public class User
{
    [Required]
    [MinLength(3)]
    public string FirstName { get; set; }

    [Required]
    [MinLength(3)]
    public string LastName { get; set; }

    [Range(18, 100)]
    public int Age { get; set; }
}
```

Have we defined our model correctly? **Are we covering all the edge cases?** A well-written Unit Test suite is our best friend here!

We have two choices: we can write Integration Tests to send requests to our system, which is running an in-memory server, and check the response we receive. Or we can **use the internal `Validator` class**, the one used by ASP.NET to validate input models, to create slim and fast Unit Tests. Let's use the second approach.

Here's a utility method we can use in our tests:

```cs
public static IList<ValidationResult> ValidateModel(object model)
{
    var results = new List<ValidationResult>();

    var validationContext = new ValidationContext(model, null, null);

    Validator.TryValidateObject(model, validationContext, results, true);

    if (model is IValidatableObject validatableModel)
       results.AddRange(validatableModel.Validate(validationContext));

    return results;
}
```

In short, we create a **validation context** without any external dependency, focused only on the input model: `new ValidationContext(model, null, null)`.

Next, we **validate each field** by calling `TryValidateObject` and store the validation results in a list, `result`.

Finally, if the Model implements the `IValidatableObject` interface, which exposes the `Validate` method, we call that `Validate()` method and store the returned validation errors in the final `result` list created before.

As you can see, we can handle both validation coming from attributes on the fields, such as `[Required]`, and custom validation defined in the model class's `Validate()` method.

Now, we can use this method to verify whether the validation passes and, in case it fails, which errors are returned:

```cs
[Test]
public void User_ShouldPassValidation_WhenModelIsValid()
{
    var model = new User { FirstName = "Davide", LastName = "Bellone", Age = 32 };
    var validationResult = ModelValidationHelper.ValidateModel(mode);
    Assert.That(validationResult, Is.Empty);
}

[Test]
public void User_ShouldNotPassValidation_WhenLastNameIsEmpty()
{
    var model = new User { FirstName = "Davide", LastName = null, Age = 32 };
    var validationResult = ModelValidationHelper.ValidateModel(mode);
    Assert.That(validationResult, Is.Not.Empty);
}


[Test]
public void User_ShouldNotPassValidation_WhenAgeIsLessThan18()
{
    var model = new User { FirstName = "Davide", LastName = "Bellone", Age = 10 };
    var validationResult = ModelValidationHelper.ValidateModel(mode);
    Assert.That(validationResult, Is.Not.Empty);
}
```

## Further readings

Model Validation allows you to create _more_ robust APIs. To improve robustness, you can follow **Postel's law**:

🔗 [Postel's law for API Robustness | Code4IT](https://www.code4it.dev/architecture-notes/postel-law-for-api-robustness/)

_This article first appeared on [Code4IT 🐧](https://www.code4it.dev/)_

Model validation, in my opinion, is one of the cases where Unit Tests are way better than Integration Tests. This is a perfect example of _Testing Diamond_, the best (in most cases) way to structure a test suite:

🔗 [Testing Pyramid vs Testing Diamond (and how they affect Code Coverage) | Code4IT](https://www.code4it.dev/architecture-notes/testing-pyramid-vs-testing-diamond/)

If you still prefer writing Integration Tests for this kind of operation, you can rely on the `WebApplicationFactory` class and use it in your NUnit tests:

🔗 [Advanced Integration Tests for .NET 7 API with WebApplicationFactory and NUnit | Code4IT](https://www.code4it.dev/blog/advanced-integration-tests-webapplicationfactory/)

## Wrapping up

Model validation is crucial. Testing the correctness of model validation can make or break your application. Please don't skip it!

I hope you enjoyed this article! Let's keep in touch on [Twitter](https://twitter.com/BelloneDavide) or [LinkedIn](https://www.linkedin.com/in/BelloneDavide/)! 🤜🤛

Happy coding!

🐧
