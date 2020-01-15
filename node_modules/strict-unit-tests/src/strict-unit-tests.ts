import * as chai from 'chai';
import * as sinon from 'sinon';
import { callsLike } from 'sinon-chai-calls-assertion';
import { enforceStubsAssertions } from 'enforced-assertions';
export { match, SinonStub } from 'sinon';
export { expect } from 'chai';
export { before, after, beforeEach, afterEach, describe, it } from 'mocha';
export { stubSuperConstructor } from 'sinon-chai-calls-assertion';
export * from 'strict-mocha-describers';

export function stub<T, K extends keyof T>(obj?: T, method?: K) {
	return sinon.stub(obj!, method!) as sinon.SinonStub;
}

chai.use(callsLike);
enforceStubsAssertions(sinon, chai);
