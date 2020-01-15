# enforced-assertions
[![Build Status](https://travis-ci.com/Farenheith/enforced-assertions.svg?branch=master)](https://travis-ci.com/Farenheith/enforced-assertions)
[![codecov](https://codecov.io/gh/Farenheith/enforced-assertions/branch/master/graph/badge.svg)](https://codecov.io/gh/Farenheith/enforced-assertions)
[![Maintainability](https://api.codeclimate.com/v1/badges/4eb6dc0a216ab5e5558c/maintainability)](https://codeclimate.com/github/Farenheith/enforced-assertions/maintainability)
[![Packages](https://david-dm.org/Farenheith/enforced-assertions.svg)](https://david-dm.org/Farenheith/enforced-assertions)
[![npm version](https://badge.fury.io/js/enforced-assertions.svg)](https://badge.fury.io/js/enforced-assertions)

A simple lib to enforce the assertion of any stub created. Intended to be used with mocha, sinon, chai triad

## How it works

Just insert the following command inside the callback of the describe you want to enforce, as the first command:

```typecript
enforceStubsAssertions(sinon, chai);
```

You can also call this line in a setup file of the tests outside any describe, so, all your tests will have this enforcing.
With this, if you declare a stub, you need to test it in an assertion or your test will throw an error.

After all, if you'll not test your stub, why did you stub it at all?
The idea of this package is that, probably, the lack of a assertion for a specific stub may be covering an unexpected behavior.

For this to work, the assertion must be something like this:

```typescript
expect(myStub)... your assertion here ...
```

You can accomplish this using libs like [sinon-chai](https://github.com/domenic/sinon-chai), or [sinon-chai-calls-assertion](https://github.com/Farenheith/sinon-chai-calls-assertion)

Something like this will not be detected:

```typescript
expect(myStub.callcout).to.be.eq(1);
```

I'm really sorry, I did try to make it work with all possible assertions, but I couldn't achieve it, so, if you like the idea of this package, for now, something like the first example will be needed.

Example with sinon-chai:

```typescript
expect(myStub).to.have.been.calledOnce;
```

Example with sinon-chai-calls-assertion:

```typescript
expect(myStub).to.have.callsLike([])
```
