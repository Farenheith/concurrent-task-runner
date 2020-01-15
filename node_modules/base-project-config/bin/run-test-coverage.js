#!/usr/bin/env node
const fs = require('fs');

const baseDir = require('./get-base-dir');
if (![
		`${baseDir}/.nycrc.json`, `${baseDir}/.nycrc`, `${baseDir}/.nycrc.yaml`,
		`${baseDir}/.nycrc.yml`, `${baseDir}/nyc.config.js`
	].some(x => fs.existsSync(x))
) {
	process.argv.push('--nycrc-path', `${baseDir}/node_modules/base-project-config/.nycrc.json`);
}

process.argv.push('npm', 'test');

require(`${baseDir}/node_modules/nyc/bin/nyc`);
