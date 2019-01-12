const Bucket = require('../../Bucket');
const Item = require('../../Item');

/**
 *
 * @param {*} _this
 */
function create(_this) {

    /**
     *
     * @param {*} value
     */
    const _createItemAddBucket = value => {
        const item = new Item(value);
        const existingBucket = _this.getById(value);

        if (existingBucket) {
            existingBucket.addItem(item);
        } else {
            const bucket = new Bucket(value);
            bucket.addItem(item);
            _this.add(bucket);
        }
    };

    /**
     * Automatically create buckets from the min key value to the max key value 
     * according to the increment
     * 
     * @param {Number} increment The amount by which to add to the key
     */
    const _fillGaps = increment => {
        if (!_this.isNumeric()) {
            throw new Error('Non-numeric values can not exist in the dataset');
        }

        for (let id = _this.getMinId(); id <= _this.getMaxId(); id = id + increment) {
            const bucket = _this.getById(id);

            if (!bucket) {
                const newBucket = new Bucket(id);
                _this.add(newBucket);
            }
        }
    };

    /**
     * Load raw data into buckets, clearing old buckets.
     * 
     * @param {Array} data Array containing strings or numbers to group into buckets
     */
    const _load = (data) => {
        if (!data || data.constructor !== Array) {
            throw new Error('Bad input.  Array expected');
        }

        if (_this.getContainer().length) {
            _this.removeAll();
        }

        // Standard array
        if (data.length) {
            data.forEach((value, index) => {
                _this.createItemAddBucket(value);
            });

        // Assosiative array
        } else {
            for(let e in data) {
                const size = parseInt(data[e]);

                if (isNaN(size)) {
                    return;
                }

                for (let i = 0; i < parseInt(size, 10); i++) {
                    _this.createItemAddBucket(e);
                }
            }
        }
    };

    return {
        add: bucket => _this.getContainer().push(bucket),
        createItemAddBucket: _createItemAddBucket,
        fillGaps: _fillGaps,
        load: _load
    };

}

module.exports = create;
