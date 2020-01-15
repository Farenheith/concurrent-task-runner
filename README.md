# concurrent-task-runner

[![Build Status](https://travis-ci.com/Farenheith/concurrent-task-runner.svg?branch=master)](https://travis-ci.com/Farenheith/concurrent-task-runner)
[![codecov](https://codecov.io/gh/Farenheith/concurrent-task-runner/branch/master/graph/badge.svg)](https://codecov.io/gh/Farenheith/concurrent-task-runner)
[![Maintainability](https://api.codeclimate.com/v1/badges/587d2512da5d8a892778/maintainability)](https://codeclimate.com/github/Farenheith/concurrent-task-runner/maintainability)
[![Packages](https://david-dm.org/Farenheith/concurrent-task-runner.svg)](https://david-dm.org/Farenheith/concurrent-task-runner)
[![npm version](https://badge.fury.io/js/concurrent-task-runner.svg)](https://badge.fury.io/js/concurrent-task-runner)

A lib to run concurrent promises in a controlled pace and number

## How it works?

It uses [P-Queue](https://www.npmjs.com/package/p-queue) to control the number of executed promises, but with a more restrictive scenario: all the promises are of the same type

## How to use:

* Instantiate ConcurrentTaskRunner like this:
```typescript
const taskRunner = new ConcurrentTaskRunner(entities, 10, doWork)
```

Where **doWork** is function that receives an element of entities and returns a Promise and **10** is the number of maximum concurrent tasks. Then, just make it run:

```typescript
await taskRunner.run();
```

That's it! You're done!

## Non parallelizable tasks

You can indicate to COncurrentTaskRunner that some promises must not be parallelized. How?

* You need to, first, guarantee that entities is ordered in such a way that all non parallelizable elements are together!
* Inform a fourth parameter: a function that receives an element of entities and returns an grouping id. This id will be used by **ConcurrentTaskRunner** to know when the non parallelizable tasks of the current round has ended;
* **doWork** can also receives a second parameter: cache. It's starts as an empty object, and you can fill it with whathever you want to use between calls of the non parallelizable sequence;

Example:
```typescript
const taskRunner = new ConcurrentTaskRunner(entities, 10, doWork, (x) => x.groupId);
```

