import { describeStruct, expect, SinonStub, beforeEach } from 'strict-unit-tests';
import { arrayHelper } from '../src/array-helper';
import {stub } from 'sinon';

describeStruct(arrayHelper, 'arrayHelper', () => {
	describe('getIterator', () => {
		let isArray: SinonStub;
		let transformIterator: SinonStub;

		beforeEach(() => {
			isArray = stub(Array, 'isArray');
			transformIterator = stub(arrayHelper, 'transformIterator').returns('transformed value' as any);
		});

		it('should return informed value when it is an array', () => {
			isArray.returns(false);

			const result = arrayHelper.getIterator('orderedEntities value' as any);

			expect(isArray).to.have.callsLike(['orderedEntities value'])
			expect(result).to.be.eq('orderedEntities value');
		});

		it('should return transformed value when it is an array', () => {
			isArray.returns(true);

			const result = arrayHelper.getIterator('orderedEntities value' as any);

			expect(isArray).to.have.callsLike(['orderedEntities value'])
			expect(result).to.be.eq('transformed value');
		});
	});

	describe('transformIterator', () => {
		it('should return informed value when it is an array', () => {
			const value = ['value1', 'value2', 'value3'];

			const result = arrayHelper.transformIterator(value);

			expect(result.next().value).to.be.eq('value1');
			expect(result.next().value).to.be.eq('value2');
			expect(result.next().value).to.be.eq('value3');
			expect(result.next().done).to.be.eq(true);
		});
	});
});
