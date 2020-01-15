#!/usr/bin/env node
const fs = require('fs');

const baseDir = require('./get-base-dir');
if (!fs.existsSync(`${baseDir}/tsconfig.json`)) {
	process.argv.push('-p', `${baseDir}/node_modules/base-project-config/tsconfig.json`);
}

require(`${baseDir}/node_modules/typescript/bin/tsc`);
