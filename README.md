# concurrent-task-runner

A lib to run concurrent promises in a controlled pace and number

## How it works?

It uses [P-Queue](https://www.npmjs.com/package/p-queue) to control the number of executed promises, but with a more restrictive scenario: all the promises are of the same type

## How to use:

* Instantiate the
