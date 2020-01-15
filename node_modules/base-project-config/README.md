# base-project-config

A project with basic configuration for reusing in another ones.

## How it works

All common needed packages are loaded with this project by dependency, and there is pre-configured npm-scripts so you don't need to write it all by yourself.
This is ideal for projects with these characteristics:

* Using typescript language;
* Using mocha, sinon, chai triad;
* Using editorconfig extensions for vscode;
* Using nyc for coverage;
* Using tslint to ensure sintax;
* Compiled source code will be outputed at build folder;

Look that, if all of this is a must have for you, installing base-project-config will put all this packages automatically in your project with a default recommended configuration, making the creation of a new project much easier.

## How to install it?

```batch
npm install --save-dev base-project-config
```

## How is expected for my project to be organized?

For default configuration, first, you need to run *npx setup-project*, so all the basic files and directories are prepared.
So, the rules are:
* Source code must be in **src** folder;
* Unit tests must be in **test** folder;
* 95% coverage is the minimum expected;
* The main code must be **src/index.ts**;

There is also tslint and tsconfig setup that you can check it out in those files that your project will be enforced to follow, but any configuration you must let different you can, just following the correspondent instructions bellow.

## How to setup project

This command will:
* Add all scripts supported by this package to your package.json
* Create required configuration files

```batch
npx setup-project
```
## How to just create the required config files?

This command will:
* Create .editorconfig;
* Create tslint.json;
* Create test folder if it doesn't exist;
* Create src folder if it doesn't exist;
* Create test/tslint.json;
* Create .travis.yml, ready to integrate with codecov.io;
* Create .codecov.yml

Look that, if you'll upload your project as a public repo, you just need to give permission to travis and codecov and all integration will work and you can put some badges at your project :)

## How to create all config files?

You don't need to do it, as all the default config files can be getted from the package by the npm-scripts, but if you want to customize something, this command will:
* Create all the required config files
* Create tsconfig.json
* Create tsconfig.test.json
* Create .nycrc.json
* Create test/mocha.opts

```batch
npx create-configs
```

## How to just add all scripts?

This command will:
* Add lint script, that runs tslint against your project;
* Add build script, that builds your project;
* Add test script, that runs mocha against your project;
* Add test:coverage script, that runs nyc and mocha against your project;
* Add test:coverage:lcovonly script, that runs nyc generating only lcov report and mocha against your project, without trhowing error for lack of coverage (useful for pipelines);

```batch
npx add-scripts
```

### About test script

The test script runs mocha with a default mocha.opts, where all test/**/*.spec.ts in your project will be ran. Also, before all tests, this script runs a default setup where sinon.restore() is setted after each test case, so you don't have to do it by yourself.
It is recommended, so, to not use sinon.sandbox(), as no test will ran in parallel and mocks with sinon.stub() and similars will be resetted after each test.

Additionaly to test script, if you want to add some setup file before your tests, just add at the test folder any file that ends with **setup.spec.ts** and that's it:
This is useful if you want to use a lib, like sinon-chai, and want to setup it to all your test just in one place.
