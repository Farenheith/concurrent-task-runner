export declare class ConcurrentTaskRunner<TEntity, TCache> {
    private readonly doWork;
    private readonly getGroupId;
    private readonly queue;
    private readonly orderedEntities;
    /**
     * @param orderedEntities An array with the entities that will be the input for the work to be done. This array must be ordered by the grouping id, if you want to use getGroupid param
     * @param concurrency The number of maximum concurrent tasks
     * @param doWork A function that results in the promise to be queued
     * @param getGroupId A function that returns a grouping Id: entities with same grouping id will never run concurrently. If you don't inform this parameter, all entities can ran concurrently
     */
    constructor(orderedEntities: Iterator<TEntity> | TEntity[], concurrency: number, doWork: (entity: TEntity, cache: TCache) => PromiseLike<void>, getGroupId?: (entity: TEntity) => unknown);
    private createNextTask;
    private doWorkGroup;
    private isFromSameGroup;
    /**
     * Runs the tasks
     */
    run(): Promise<void>;
}
