# strict-unit-tests
[![Build Status](https://travis-ci.com/Farenheith/strict-unit-tests.svg?branch=master)](https://travis-ci.com/Farenheith/strict-unit-tests)
[![codecov](https://codecov.io/gh/Farenheith/strict-unit-tests/branch/master/graph/badge.svg)](https://codecov.io/gh/Farenheith/strict-unit-tests)
[![Maintainability](https://api.codeclimate.com/v1/badges/1f81c6690e7d0feeadaa/maintainability)](https://codeclimate.com/github/Farenheith/strict-unit-tests/maintainability)
[![Packages](https://david-dm.org/Farenheith/strict-unit-tests.svg)](https://david-dm.org/Farenheith/strict-unit-tests)
[![npm version](https://badge.fury.io/js/strict-unit-tests.svg)](https://badge.fury.io/js/strict-unit-tests)

A wrapper for many test related lib to create stricts and enforced unit tests

## How to use it?

First, install it in your project:

```batch
npm i --save-dev strict-unit-tests
```
second, setup your project:

```batch
npx setup-project
```

Create your test/setup.spec.ts in your test folder with this content:
```typescript
import 'strict-unit-tests';

```

That's it. Now you have in your project:
* [typescript](https://www.npmjs.com/package/typescript);
* [ts-node](https://www.npmjs.com/package/ts-node);
* [tslint](https://www.npmjs.com/package/tslint);
* [base-project-config](https://www.npmjs.com/package/base-project-config);
* [mocha](https://www.npmjs.com/package/mocha);
* [sinon](https://www.npmjs.com/package/sinon);
* [chai](https://www.npmjs.com/package/chai);
* [nyc](https://www.npmjs.com/package/nyc);
* [enforced-assertions](https://www.npmjs.com/package/enforced-assertions);
* [strict-mocha-describers](https://www.npmjs.com/package/strict-mocha-describers);
* [sinon-chai-calls-assertion](https://www.npmjs.com/package/sinon-chai-calls-assertion);

All of it proper configured with recommended setup and ready to use.

We'll try to expose all the advantages to use this package in your next typescript project, but you can always get more details about each package used here in they own page. It is important, however, to enforce that it is highly recommended to use the package wrapper to import all your tests libs.

Also, take a look in the test folder, there we'll create a lot of examples of differents use cases.

## Why to use this package?

I love typescript, but one of the pains I feel when I'm coding in it is the lack of enforced standards. Also, having at our disposal the biggest code base on the internet, JavaScript, is good in the majority of time, but it also is a worsening factor in the standardization of the language.

That said, with the collection of libs this package wrap, we're try to enforce guidelines for typescript projects that uses it:
* Configuring default deputation commands;
* Configuring basic npm-scripts;
* Configuring tsconfig and tslint with strong and restrictive rules;
* Enforcing a default directory organization;
* Setting a global behavior for unit tests;
* Using libs to make unit tests more restrictive, rigid and easier to break;

Of course, all of this not ripping off the freedom we have coding in js/ts, as all of this is configurable and you can also use just part of the offered functionalities, but we strongly believe that all the rules enforced here can be suitable for most typescript project, as long it is following SOLID guidelines.


## About unit tests

There are libs used here that we developed to make unit tests even more rigid that deserves a proper introduction.
Let start with **strict-mocha-describers**

### strict-mocha-describers

This lib offers different describers oriented to specific type of objects that helps to prevent **scope invasion**, that is, unit tests are meant to test just an unity of code, everything else must be mocked, specially external dependencies, but also another methods of the same target instance that is not the subject of the test.
To create a unit test suite for a class using this lib, use the following command:

```typescript
function bootstrapFunction(): YourClass {
...
}

describeClass(YourClass, bootstrapFunction, describeMethod => {... 
```

With this method, the setting up of your target instance is controlled internally by the lib. All you need to do to construct it you can do in the booStrapFunction, but for each method test suite, the instance will be prepared to test the method in case.
Look that the callback function receives a method we called **describeMethod**. This method is ready to test each method of the class and must be used in place of traditional describe.
Look that traditional describe still can be used for logical organization, but when creating a suite of tests for a method, use **describeMethod**, as it follows:

```typescript
describeMethod("methodName", it => {...
```

methodName here is enforced to be a valid public method of **YourClass**, but you can also test private methods making a typecast to any of the string.
Also notice that a method **it** is passed to the callback. The difference here for the traditional it is that, this one, receives the target instance of the class for testing.
In this place, if you prefer, you can set the instance to a variable source scoped in the bootstrapFunction. Using the provided **it** the code will look like that:

```typescript
it('should do something', target => {...
```

There you can create your single test case. But what is the big difference with the traditional describers?
At this point, all methods of target throws an error, except for the subject of the test, **methodName**.
This ensure that, no matter what maintenance you do in your code, the test will always break if you forgot to mock some method.

The recommended approach here, so, is to mock just the methods your method calls.
The best place to do it is in a **beforeEach** inside **describeMethod**, like this:

```typescript
beforeEach(() => {
  stub(target, 'calledMethod').returns('mocked result');
});
```

Look that, to mock in a beforeEach, target must be visible, so the approach to use the parameter passed to it is only useful if you don't want to mock anything in the beforeEach.
Notice, also, that even static method will throw error if not mocked, and the recommended way to do it is always using stub. From our experience, stub work well for every case following this organization, and there's no need to have two way of doing the same thing.

The code discussed here, so, would be similar to this:

```typescript
import {
  beforeEach,
  describeClass,
  describeMethod,
  it,
  stub,
  expect,
  getFakeInstance,
} from 'strict-unit-tests';

let target: YourClass;
let service: YourService;
bootstrapFunction() {
  service = getFakeInstance(YourService);
  return target = new Target(service);
}

describeClass(YourClass, bootstrapFunction, describeMethod => {
  describeMethod('methodName', () => {
    beforeEach(() => {
      stub(service, 'serviceCalledMethod').returns('Service mocked result');
      stub(target, 'calledMethod').returns('Mocked result');
    });

    it('should do something', () => {
      ...
      expect(service.serviceCalledMethod).to.have.callsLike([]);
      expect(target.calledMethod).to.have.callsLike([]);
    });
  });
```

As you can see, it's a very straight forward guideline for unit tests. There are elements used in the completed example not discussed before, but they are very simple:
* getFakeInstance: it creates and object with the same method of the informed class, but all throwing error;
* Also, we used traditional it, as we have scoped variable for the target.

I hope this can be useful for you!

Cheers!
