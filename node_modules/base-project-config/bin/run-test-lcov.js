#!/usr/bin/env node
process.argv.push('--reporter=lcovonly');
process.argv.push('--lines=0');
process.argv.push('--branches=0');
process.argv.push('--functions=0');
require('./run-test-coverage');
