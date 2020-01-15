const fs = require('fs')
const baseDir = __dirname.substring(0, __dirname.lastIndexOf('/node_modules/'));
const tsConfig = `${baseDir}/tsconfig.test.json`;
const project = fs.existsSync(tsConfig) ?
	tsConfig :
	'./node_modules/base-project-config/tsconfig.test.json';
require('ts-node').register({ project });
