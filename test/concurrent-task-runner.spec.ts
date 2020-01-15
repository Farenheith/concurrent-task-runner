import { it } from 'mocha';
import { expect } from 'chai';
import * as PQueue from 'p-queue';
import { ConcurrentTaskRunner } from '../src/concurrent-task-runner';
import { describeClass, SinonStub, stub } from 'strict-unit-tests';

let orderedEntities: any[];
let target: ConcurrentTaskRunner<any, any>;
let onIdle: SinonStub;
let add: SinonStub;
let defaultBkp: any;

function bootStrapper() {
	orderedEntities = [];
	const getGroupId = () => undefined;
	const doWork = () => Promise.resolve();
	add = stub().named('add') as any;
	onIdle = stub().named('onIdle') as any;
	defaultBkp = PQueue.default;
	(PQueue as any).default = stub().returns({ add, onIdle});
	target = new ConcurrentTaskRunner(orderedEntities, 10, getGroupId, doWork);

	expect(PQueue.default).to.have.callsLike([{
		autoStart: true,
		concurrency: 10,
	}]);
	return target;
}

describeClass(ConcurrentTaskRunner, bootStrapper, describe => {
	afterEach(() => {
		(PQueue as any).default = defaultBkp;
	});

  describe('getNextTasks' as any, () => {
    it('should group items from same group and call doWorkGroup', async () => {
      orderedEntities.push(
        {
          groupId: 'group0',
          info: 'item0',
        },
        {
          groupId: 'groupA',
          info: 'item1',
        },
        {
          groupId: 'groupA',
          info: 'item2',
        },
        {
          groupId: 'groupA',
          info: 'item3',
        },
        {
          groupId: 'groupB',
          info: 'item4',
        },
      );
      stub(target, 'doWorkGroup' as any).returns(Promise.resolve('doWorkResult'));
      stub(target, 'isFromSameGroup' as any).callsFake((a, b) => a.groupId === b.groupId);
      target['currentIndex'] = 1;

      const result = await target['getNextTasks']();

			expect(onIdle).to.have.callsLike();
			expect(add).to.have.callsLike();
      expect(await result()).to.be.eq('doWorkResult');
      expect(target['isFromSameGroup']).to.have.callsLike(
				[orderedEntities[1], orderedEntities[2]],
				[orderedEntities[1], orderedEntities[3]],
				[orderedEntities[1], orderedEntities[4]],
			);
      expect(target['doWorkGroup']).to.have.callsLike([orderedEntities[1], [orderedEntities[2], orderedEntities[3]]]);
			expect(target['currentIndex']).to.be.eq(4);
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
			orderedEntities.push('job1', 'job2', 'job3');
      onIdle.returns(Promise.resolve());
      add.returns(Promise.resolve());
      const getNextTasks = stub(target, 'getNextTasks' as any).callsFake(() => {
        target['currentIndex']++;
        return `runJob${target['currentIndex']}`;
      });

      const result = await target.run();

      expect(onIdle).to.have.callsLike([]);
      expect(result).to.be.undefined;
      expect(getNextTasks).to.have.callsLike([], [], []);
      expect(add).to.have.callsLike(
				['runJob1'], ['runJob2'], ['runJob3'],
			);
    });
  });
});
