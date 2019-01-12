module.exports = _this => {
``
    /**
     *
     * @param {*} id
     */
    const _getById = id => {
        const index = _this.getContainer().findIndex(bucket => bucket.getId() === id.toString());

        return (index !== -1) ? _this.getContainer()[index] : false;
    }

    /**
     * If all items are numeric, get the total value of all the items.
     *
     */
    const _getSum = _ => {
        if (!_this.isNumeric()) {
            throw new Error('Some values are not numeric');
        }

        return _this.getContainer().reduce((total, bucket) => total + bucket.getSum(), 0);
    };

    return {
        getAverage: _ => _this.getSum() / _this.getSizeItems(),
        getById: _getById,
        getIds: _ => _this.getContainer().map(bucket => bucket.getId()),
        getSize: _ => _this.getContainer().length,
        getSizes: _ => _this.getContainer().map(bucket => bucket.getSize()),
        getSizeItems: _ => _this.getContainer().reduce((total, bucket) => total + bucket.getSize(), 0),
        getSum: _getSum,
        getSumSizes: _ => _this.getSizes().reduce((total, size) => total + size, 0),
        isNumeric: _ => _this.getContainer().filter(bucket => !bucket.isNumeric()).length === 0
    };

};
