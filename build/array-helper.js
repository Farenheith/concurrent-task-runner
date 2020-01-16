"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayHelper = {
    getIterator(orderedEntities) {
        if (!Array.isArray(orderedEntities)) {
            return orderedEntities;
        }
        return exports.arrayHelper.transformIterator(orderedEntities);
    },
    *transformIterator(orderedEntities) {
        const iterator = orderedEntities.entries();
        let next = iterator.next();
        while (!next.done) {
            yield next.value[1];
            next = iterator.next();
        }
    }
};
//# sourceMappingURL=array-helper.js.map