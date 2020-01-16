"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const p_queue_1 = require("p-queue");
const array_helper_1 = require("./array-helper");
class ConcurrentTaskRunner {
    /**
     * @param orderedEntities An array with the entities that will be the input for the work to be done. This array must be ordered by the grouping id, if you want to use getGroupid param
     * @param concurrency The number of maximum concurrent tasks
     * @param doWork A function that results in the promise to be queued
     * @param getGroupId A function that returns a grouping Id: entities with same grouping id will never run concurrently. If you don't inform this parameter, all entities can ran concurrently
     */
    constructor(orderedEntities, concurrency, doWork, getGroupId = (entity) => entity) {
        this.doWork = doWork;
        this.getGroupId = getGroupId;
        this.orderedEntities = array_helper_1.arrayHelper.getIterator(orderedEntities);
        this.queue = new p_queue_1.default({
            autoStart: true,
            concurrency,
        });
    }
    createNextTask(entity) {
        const nextEntities = [];
        let next = this.orderedEntities.next();
        while (!next.done && this.isFromSameGroup(entity, next.value)) {
            nextEntities.push(next.value);
            next = this.orderedEntities.next();
        }
        return () => this.doWorkGroup(entity, nextEntities);
    }
    async doWorkGroup(entity, nextEntities) {
        const cache = {};
        await this.doWork(entity, cache);
        for (const nextEntity of nextEntities) {
            await this.doWork(nextEntity, cache);
        }
    }
    isFromSameGroup(entity1, entity2) {
        return this.getGroupId(entity1) === this.getGroupId(entity2);
    }
    /**
     * Runs the tasks
     */
    async run() {
        let next = this.orderedEntities.next();
        while (!next.done) {
            this.queue.add(this.createNextTask(next.value));
            next = this.orderedEntities.next();
        }
        return this.queue.onIdle();
    }
}
exports.ConcurrentTaskRunner = ConcurrentTaskRunner;
//# sourceMappingURL=concurrent-task-runner.js.map