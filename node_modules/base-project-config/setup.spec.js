const sinon = require('sinon');
const { afterEach } = require('mocha');

afterEach(() => {
	sinon.restore();
});
