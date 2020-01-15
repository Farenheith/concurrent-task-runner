# sinon-chai-calls-assertion
[![Build Status](https://travis-ci.com/Farenheith/sinon-chai-calls-assertion.svg?branch=master)](https://travis-ci.com/Farenheith/sinon-chai-calls-assertion)
[![codecov](https://codecov.io/gh/Farenheith/sinon-chai-calls-assertion/branch/master/graph/badge.svg)](https://codecov.io/gh/Farenheith/sinon-chai-calls-assertion)
[![Maintainability](https://api.codeclimate.com/v1/badges/786f2feef20063142467/maintainability)](https://codeclimate.com/github/Farenheith/sinon-chai-calls-assertion/maintainability)
[![Packages](https://david-dm.org/Farenheith/sinon-chai-calls-assertion.svg)](https://david-dm.org/Farenheith/sinon-chai-calls-assertion)
[![npm version](https://badge.fury.io/js/sinon-chai-calls-assertion.svg)](https://badge.fury.io/js/sinon-chai-calls-assertion)

A simple assertion to validate many aspects of stub calls. It is supposed to use with sinon + chai.

## How it works

### expect(stub).callsLike

Will validate the exactly interaction with the mocked method, which is:
* How many times has been called;
* Which parameters have been passed to it;
* In what order the calls happened.

## How to use?

Just pass the stub in the first parameter and, in the others, arrays with the set of parameters each calls had received.

```
expect(myStub).callsLike(
  ['param1call1', 'param2call1', 'param3call1'],
  ['param1call2', 'param2call2', 'param3call2'],
 );
```

If you want to check if the stub had never been called, pass just the stub:

```
expect(myStub).callsLike();
```

If you expect the stub to have been called with no parameters, pass empty arrays:

```
expect(myStub).callsLike([], [], [])
```
*(in this example, myStub have been called three times with no parameters)*

You can also use sinon matchers to validate the parameters instead of exact values:

```
expect(myStub).callsLike(
  [sinon.match.object, sinon.match.string, sinon.match(/.+foo.+goo/)]
 );
```
