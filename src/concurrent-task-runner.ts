import PQueue from 'p-queue';

export class ConcurrentTaskRunner<TEntity, TCache> {
  private currentIndex = 0;
  private readonly queue: PQueue;

	/**
	 * @param orderedEntities An array with the entities that will be the input for the work to be done. This array must be ordered by the grouping id, if you want to use getGroupid param
	 * @param concurrency The number of maximum concurrent tasks
	 * @param doWork A function that results in the promise to be queued
	 * @param getGroupId A function that returns a grouping Id: entities with same grouping id will never run concurrently. If you don't inform this parameter, all entities can ran concurrently
	 */
  constructor(
    private readonly orderedEntities: TEntity[],
    concurrency: number,
    private readonly doWork: (entity: TEntity, cache: TCache) => PromiseLike<void>,
    private readonly getGroupId: (entity: TEntity) => unknown = (entity) => entity,
  ) {
    this.queue = new PQueue({
      autoStart: true,
      concurrency,
    });
  }

  private getNextTasks() {
    const entity = this.orderedEntities[this.currentIndex];
    this.currentIndex++;
    const nextEntities: TEntity[] = [];
    while (this.currentIndex < this.orderedEntities.length
      && this.isFromSameGroup(entity, this.orderedEntities[this.currentIndex])
    ) {
      nextEntities.push(this.orderedEntities[this.currentIndex]);
      this.currentIndex++;
    }

    return () => this.doWorkGroup(entity, nextEntities);
  }

  private async doWorkGroup(entity: TEntity, nextEntities: TEntity[]) {
    const cache = {} as TCache;
    await this.doWork(entity, cache);

    for (const nextEntity of nextEntities) {
      await this.doWork(nextEntity, cache);
    }
  }

  private isFromSameGroup(entity1: TEntity, entity2: TEntity) {
    return this.getGroupId(entity1) === this.getGroupId(entity2);
  }

	async run() {
    while (this.currentIndex < this.orderedEntities.length) {
      this.queue.add(this.getNextTasks());
    }

    return this.queue.onIdle();
  }
}
