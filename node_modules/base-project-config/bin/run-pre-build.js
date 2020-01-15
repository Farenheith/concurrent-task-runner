#!/usr/bin/env node

const baseDir = require('./get-base-dir');
process.argv.push('-f', `${baseDir}/node_modules/base-project-config/gulpfile-clear.js`);

require(`${baseDir}/node_modules/gulp/bin/gulp`);
