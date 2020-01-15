#!/usr/bin/env node
var npmAddScript = require('npm-add-script');

npmAddScript({ key: 'lint', value: 'run-lint', force: true });
npmAddScript({ key: 'prebuild', value: 'run-pre-build', force: true });
npmAddScript({ key: 'build', value: 'run-build', force: true });
npmAddScript({ key: 'test:coverage', value: 'run-test-coverage', force: true });
npmAddScript({ key: 'test:coverage:lcovonly', value: 'run-test-lcov', force: true });
npmAddScript({ key: 'test', value: 'run-test', force: true });
