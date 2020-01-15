#!/usr/bin/env node
const fs = require('fs');
const baseDir = require('./get-base-dir');

fs.writeFileSync(`${baseDir}/tslint.json`, `{
	"extends": "base-project-config/tslint.json"
}`);

[`${baseDir}/test`, `${baseDir}/src`, `${baseDir}/.vscode`].forEach(x => {
	if (!fs.existsSync(x)) {
		fs.mkdirSync(x);
	}
});

if (!fs.existsSync('src/index.ts')) {
	fs.writeFileSync(`${baseDir}/src/index.ts`, '');
}

fs.writeFileSync(`${baseDir}/test/tslint.json`, `{
	"extends": "base-project-config/tslint.test.json"
}`);

fs.copyFileSync(`${baseDir}/node_modules/base-project-config/.editorconfig`, `${baseDir}/.editorconfig`);
fs.copyFileSync(`${baseDir}/node_modules/base-project-config/.travis.yml`, `${baseDir}/.travis.yml`);
fs.copyFileSync(`${baseDir}/node_modules/base-project-config/.codecov.yml`, `${baseDir}/.codecov.yml`);
fs.copyFileSync(`${baseDir}/node_modules/base-project-config/launch.json`, `${baseDir}/.vscode/launch.json`);
