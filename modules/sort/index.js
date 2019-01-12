module.exports = _this => {

    /**
     * Sort the buckets in the container alpha-numerically by the specified property.
     *
     * @param {*} func
     */
    const _sortBy = func => {
        _this.getContainer().sort((a, b) => {
            if (func && typeof func === 'function') {
                a = func(a), b = func(b);
            }

            return isNaN(a) && isNaN(b) ? (a > b ? 1 : -1)
            : (isNaN(a) ? 1 : (isNaN(b) ? -1 : (+a > +b ? 1 : -1)));
        });
    };

    return {
        sortBy: _sortBy,
        sortById: _ => _sortBy(bucket => bucket.getId()),
        sortBySize: _ => _sortBy(bucket => bucket.getSize())
    };

};
