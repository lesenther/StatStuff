module.exports = _this => {

    /**
     * Remove a bucket from the container.
     */
    const _remove = bucket => {
        const index = _this.getContainer().findIndex(_bucket => _bucket === bucket);

        if (index !== -1) {
            _this.getContainer().splice(index, 1);
        }

        return _this;
    };

    /**
     * Remove all the buckets from the container.
     *
     */
    const _removeAll = _ => {
        _this.getContainer().splice(0, _this.getSize());

        return _this;
    };

    return {
        remove: _remove,
        removeAll: _removeAll
    };
};