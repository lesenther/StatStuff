/**
 *
 * @param {*} _this
 */
function mutate(_this) {

    /**
     * Map the ids of all the buckets to new values
     *
     * @param {*} func
     */
    const _mapIds = func => {
        if (typeof func !== 'function') {
            throw new Error(`Bad input: ${typeof func}`);
        }

        _this.getContainer().map(bucket => bucket.setId(func(bucket.getId())));
        _this.rebuild();
    };

    /**
     * Rebuild the buckets to remove duplicates that could have gotten created
     * after using the mapKeys method.
     *
     */
    const _rebuild = _ => {
        _removeDuplicates();
    };

    /**
     *
     * @param {*} _
     */
    const _removeDuplicates = _ => {
        const uniqueBuckets = [];
        const toRemove = [];

        _this.getContainer()
        .forEach(bucket => {
            const duplicate = uniqueBuckets
            .find(_bucket => bucket.getId() === _bucket.getId());

            if (duplicate) {
                bucket.getItems().forEach(item => duplicate.addItem(item));
                toRemove.push(bucket);
            } else {
                uniqueBuckets.push(bucket);
            }
        });

        toRemove.forEach(bucket => _this.remove(bucket));
    };

    /**
     * Warning:  This method is degenerative and loses data
     *
     * @param {*} size
     */
    const setBinSize = (size, offset = 0) => {
       mapKeys(key => Math.floor((key - offset) / size) * size + offset);
    };

    /**
     * 
     * @param {*} limit 
     * @param {*} discardOutliers 
     */
    const setLowerBounds = (limit, discardOutliers = false) => {
        if (!discardOutliers) {
            return _mapIds(id => Math.max(id, limit));
        } else {
            _this.getContainer()
            .filter(bucket => bucket.getIdNumeric() < limit)
            .forEach(bucket => _this.remove(bucket));
        }
    }

    return {
        mapIds: _mapIds,
        scaleIds: factor => _mapIds(id => id * factor),
        rebuild: _rebuild
    };

}

module.exports = mutate;
