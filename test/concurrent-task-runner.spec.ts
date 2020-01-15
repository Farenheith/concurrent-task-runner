import { it } from 'mocha';
import { expect } from 'chai';
import * as PQueue from 'p-queue';
import { ConcurrentTaskRunner } from '../src/concurrent-task-runner';
import { describeClass } from 'strict-unit-tests';
import { arrayHelper } from '../src/array-helper';
import { stub, SinonStub } from 'sinon';
let orderedEntities: any[];
let target: ConcurrentTaskRunner<any, any>;
let onIdle: SinonStub;
let add: SinonStub;
let defaultBkp: any;

function bootStrapper() {
	orderedEntities = 'orderedEnttities value' as any;
	const getGroupId = () => Promise.resolve();
	const doWork = () => Promise.resolve();
	add = stub().named('add') as any;
	onIdle = stub().named('onIdle') as any;
	defaultBkp = PQueue.default;
	(PQueue as any).default = stub().returns({ add, onIdle});
	stub(arrayHelper, 'getIterator').returns('getIterator result' as any);
	target = new ConcurrentTaskRunner(orderedEntities, 10, doWork, getGroupId);

	expect(PQueue.default).to.have.callsLike([{
		autoStart: true,
		concurrency: 10,
	}]);
	expect(arrayHelper.getIterator).to.have.callsLike([
		'orderedEnttities value'
	]);
	expect(target['orderedEntities']).to.be.eq('getIterator result' as any);
	return target;
}

describeClass(ConcurrentTaskRunner, bootStrapper, describe => {
	afterEach(() => {
		(PQueue as any).default = defaultBkp;
	});

	describe('constructor' as any, () => {
		it('should instantiate with default function as getGroupId', () => {
			target = new ConcurrentTaskRunner(orderedEntities, 10, () => Promise.resolve());

			expect(target['getGroupId']('test')).to.be.eq('test');
		})
	});

  describe('createNextTask' as any, () => {
    it('should group items from same group and call doWorkGroup', async () => {
			const item1 = {
				groupId: 'groupA',
				info: 'item1',
			};
			const item2 = {
				groupId: 'groupA',
				info: 'item2',
			};
			const item3 = {
				groupId: 'groupA',
				info: 'item3',
			};
			const item4 = {
				groupId: 'groupB',
				info: 'item4',
			};
      (target as any).orderedEntities = (function* () {
        yield {
          groupId: 'group0',
          info: 'item0',
        };
        yield item1;
        yield item2;
        yield item3;
        yield item4;
			})();
      stub(target, 'doWorkGroup' as any).returns(Promise.resolve('doWorkResult'));
      stub(target, 'isFromSameGroup' as any).callsFake((a, b) => a.groupId === b.groupId);
			target['currentIndex'] = 1;
			target['orderedEntities'].next()
			const next = target['orderedEntities'].next();

      const result = await target['createNextTask'](next.value);

			expect(onIdle).to.have.callsLike();
			expect(add).to.have.callsLike();
      expect(await result()).to.be.eq('doWorkResult');
      expect(target['isFromSameGroup']).to.have.callsLike(
				[item1, item2],
				[item1, item3],
				[item1, item4],
			);
      expect(target['doWorkGroup']).to.have.callsLike([item1, [item2, item3]]);
    });
  });

  describe('doWorkGroup' as any, () => {
    it('should run the task and chain the following ones for parallelization', async () => {
      const doWork = stub(target, 'doWork' as any).callsFake(async (_a, b) => {
        b.cacheInfo = 'processed';
      });

      const result = await target['doWorkGroup']('job1', ['job2', 'job3', 'job4']);

			expect(onIdle).to.have.callsLike();
			expect(add).to.have.callsLike();
      expect(result).to.be.undefined;
      expect(doWork).to.have.callsLike(
        ['job1', { cacheInfo: 'processed' }],
        ['job2', { cacheInfo: 'processed' }],
        ['job3', { cacheInfo: 'processed' }],
				['job4', { cacheInfo: 'processed' }],
			);
    });
  });

  describe('isFromSameGroup' as any, () => {
		let getGroupId: SinonStub;

		beforeEach(() => {
      getGroupId = stub(target, 'getGroupId' as any);
		});
    it('should return false for different groupids', async () => {
			getGroupId.callsFake((x: any) => x);

      const result = target['isFromSameGroup']('job1', 'job2');

      expect(result).to.be.false;
      expect(getGroupId).to.have.callsLike(
				['job1'], ['job2'],
			);
			expect(onIdle).to.have.callsLike();
			expect(add).to.have.callsLike();
    });

    it('should return true for same groupids', async () => {
      getGroupId.callsFake((x: any) => typeof x);
      const result = target['isFromSameGroup']('job1', 'job2');

			expect(onIdle).to.have.callsLike();
			expect(add).to.have.callsLike();
      expect(result).to.be.true;
      expect(getGroupId).to.have.callsLike(
				['job1'], ['job2'],
			);
    });
  });

  describe('run', () => {
    it('should create a PromisePool and start it', async () => {
			let current: string;
			(target as any).orderedEntities = (function *() {
				yield current = 'Job1';
				yield current = 'Job2';
				yield current = 'Job3';
			})();
      onIdle.returns(Promise.resolve());
      add.returns(Promise.resolve());
      const createNextTask = stub(target, 'createNextTask' as any).callsFake(() => {
        return `run${current}` as any;
      });

      const result = await target.run();

      expect(onIdle).to.have.callsLike([]);
      expect(result).to.be.undefined;
      expect(createNextTask).to.have.callsLike(['Job1'], ['Job2'], ['Job3']);
      expect(add).to.have.callsLike(
				['runJob1'], ['runJob2'], ['runJob3'],
			);
    });
  });
});
