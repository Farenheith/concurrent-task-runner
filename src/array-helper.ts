export const arrayHelper = {
	getIterator<TEntity>(orderedEntities: Iterator<TEntity> | TEntity[]): Iterator<TEntity> {
		if (!Array.isArray(orderedEntities)) {
			return orderedEntities;
		}

		return arrayHelper.transformIterator(orderedEntities);
	},

	*transformIterator<TEntity>(orderedEntities: TEntity[]): Iterator<TEntity> {
		const iterator = orderedEntities.entries();
		let next = iterator.next();

		while (!next.done) {
			yield next.value[1];
			next = iterator.next();
		}
	}
}
