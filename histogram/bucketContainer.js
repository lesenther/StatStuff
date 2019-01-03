const Bucket = require('./bucket');

/**
 * BucketContainer.js
 * 
 * Text-based histograms for quick data analysis.
 * 
 */
function BucketContainer(inputData) {

    /**
     * Container for main collection of buckets
     * 
     */
    const _data = [];

    //----------------------------------------------------------------------
    // Create methods
    //----------------------------------------------------------------------

    /**
     * Add a key and value to the dataset.  Creates a new bucket if it doesn't exist,
     * otherwise adds value to existing bucket.
     * 
     * @param {String|Number} key Key id for the target bucket
     * @param {Number} value Value for the bucket (defaults to 1)
     */
    const _add = (key, value = 1) => {
        value = parseInt(value);
        
        if (isNaN(value)) {
            return false;
        }

        const bucket = _getByKey(key);

        if (!bucket) {
            _data.push(new Bucket(key, value));
        } else {
            _update(key, bucket.value + value);
        }
    };

    /**
     * Increment the value of the specified bucket key by 1.
     * 
     * @param {String|Number} key Key id for the target bucket
     */
    const _increment = key => {
        _add(key, 1);
    };

    /**
     * Decrement the value of the specified bucket key by 1.
     * 
     * @param {String|Number} key Key id for the target bucket
     */
    const _decrement = key => {
        _update(key, _data.getByKey(key).value - 1);
    };
    
    /**
     * Import raw data into buckets, clearing old buckets.
     * 
     * @param {Array} data Array containing strings or numbers to group into buckets
     */
    const _import = (data, preserveOriginalData = false) => {
        _clearData();
        data.forEach(_increment);

        if (!preserveOriginalData) {
            inputData = data;
        }
    };
    
    /**
     * Automatically create buckets from the min key value to the max key value 
     * according to the increment
     * 
     * @param {Number} increment The amount by which to add to the key
     * @param {Number} value The value which to set for the key
     */
    const _fillGaps = (increment = 1, value = 0) => {

        if (_data.filter(bucket => isNaN(bucket.value)).length) {
            throw new Error('Non-numeric values can not exist in the dataset')
        }

        for (let key = _getMinKey(); key <= _getMaxKey(); key = key + increment) {
            if (!_getByKey(key)) {
                _add(key, _getByKey(key).value || value);
            }
        }
    }

    //----------------------------------------------------------------------
    // Read methods
    //----------------------------------------------------------------------

    /**
     * Get a bucket by key
     * 
     * @param {String|Number} key Key id for the target bucket
     */
    const _getByKey = key => _getByProp('key', key);
    
    /**
     * 
     * @param {*} value 
     */
    const _getByValue = value => _getByProp('value', value);
    
    /**
     * 
     * @param {String|Number} key Key id for the target bucket
     */
    const _getIndexOfKey = key => _data.findIndex(bucket => bucket.key === key);
    
    /**
     * 
     * @param {*} value 
     */
    const _getIndexOfValue = value => _data.findIndex(bucket => bucket.value === value);

    /**
     * 
     */
    const _getKeys = _ => _data.map(bucket => bucket.key);
    
    /**
     * 
     */
    const _getValues = _ => _data.map(bucket => bucket.value);
    
    /**
     * 
     * @param {*} prop 
     * @param {*} value 
     */
    const _getByProp = (prop, value) => {
        const index = _data.findIndex(bucket => bucket[prop] === value);
        
        return (index !== -1) ? _data[index] : false;
    };

    /**
     * 
     * @param {String|Number} key Key id for the target bucket
     */
    const _getAllByKey = key => {
        return _data.filter(bucket => bucket.key === key);
    };

    /**
     * 
     * @param {String|Number} key Key id for the target bucket
     */
    const _hasDupes = key => {
        return (_data.filter(bucket => bucket.key === key).length > 1);
    };

    //----------------------------------------------------------------------
    // Update methods
    //----------------------------------------------------------------------

    /**
     * Update a bucket setting it's value to a new one.
     * 
     * @param {String|Number} key Key id for the target bucket
     * @param {*} value 
     */
    const _update = (key, value) => {
        const index = _data.getIndexOfKey(key);

        if (index === -1) {
            _add(key, value);
        } else {
            _data[index].value = value;
        }
    };

    //----------------------------------------------------------------------
    // Delete method
    //----------------------------------------------------------------------

    /**
     * Remove a single bucket from the dataset.
     * 
     * @param {String|Number} key Key id for the target bucket
     */
    const _delete = key => {
        const index = _data.getIndexOfKey(key);
        
        if (index !== -1) {
            _data.splice(index, 1);
        }
    };

    /**
     * Remove all the data in the dataset
     * 
     */
    const _clearData = _ => {
        _data.splice(0, _data.length);
    };

    //----------------------------------------------------------------------
    // Sorting method
    //----------------------------------------------------------------------

    /**
     * Sort the bins in the dataset alpha-numerically
     * 
     * @param {String} prop Property by which to sort the buckets by, either 'key' or 'value'.
     */
    const _sortByProp = prop => {
        _data.sort((a, b) => {
            a = a[prop], b = b[prop];
            if (isNaN(a) && isNaN(b)) {
                return a > b ? 1 : -1;
            }

            if (isNaN(a)) {
                return 1;
            }

            if (isNaN(b)) {
                return -1;
            }
             
            return +a > +b ? 1 : -1;
        });
    };

    //----------------------------------------------------------------------
    // Mutation methods
    //----------------------------------------------------------------------

    /**
     * Map a specific property of all the buckets.
     * 
     * @param {*} prop 
     * @param {*} func 
     */
    const _mapProp = (prop, func) => {
        if (typeof func !== 'function') {
            throw new Error(`Bad input: ${typeof func}`);
        }

        _data.map(bucket => {
            if (typeof bucket[prop] === 'undefined') {
                throw new Error(`Unknown property:  ${prop}`);
            }

            bucket[prop] = func(bucket[prop]);
        });

        _rebuild();
    };

    /**
     * Rebuild the buckets to remove duplicates that could get created 
     * after using the mapKeys method.
     * 
     */
    const _rebuild = _ => {
        const newData = [];

        _data.forEach(bucket => {
            for (let i = 0; i < bucket.value; i++) {
                newData.push(bucket.key);
            }
        });

        _import(newData, true);
    };

    /**
     * Map the keys of all the buckets according to the specified function
     * 
     * @param {Function} func The function by which to map the keys
     */
    const _mapKeys = func => _mapProp('key', func);

    /**
     * Map the values of all the buckets according to the specified function
     * 
     * @param {Function} func The function by which to map the keys
     */
    const _mapValues = func => _mapProp('value', func);

    /**
     * Scale the values of all the buckets by the specified factor
     * 
     * @param {Number} factor The factor by which to scale the values
     */
    const _scaleValues = factor => _mapValues(value => value * factor);

    //----------------------------------------------------------------------
    // Stats methods
    //----------------------------------------------------------------------
    
    /**
     * Get the minimum key in the collection
     * 
     */
    const _getMinKey = _ => Math.min(..._data.map(bucket => bucket.key));
    
    /**
     * Get the maximum key in the collection
     * 
     */
    const _getMaxKey = _ => Math.max(..._data.map(bucket => bucket.key));
    
    /**
     * Get the minimum value in the collection
     * 
     */
    const _getMinValue = _ => Math.min(..._data.map(bucket => bucket.value));
    
    /**
     * Get the maximum value in the collection
     * 
     */
    const _getMaxValue = _ => Math.max(..._data.map(bucket => bucket.value));
    
    /**
     * Get the minimum key length in the collection
     * 
     */
    const _getMinKeyLength = _ => Math.min(..._data.map(bucket => bucket.key.toString().length));
    
    /**
     * Get the maximum key length in the collection
     * 
     */
    const _getMaxKeyLength = _ => Math.max(..._data.map(bucket => bucket.key.toString().length));
    
    /**
     * Get the minimum value length in the collection
     * 
     */
    const _getMinValueLength = _ => Math.min(..._data.map(bucket => bucket.value.toString().length));
    
    /**
     * Get the maximum value length in the collection
     * 
     */
    const _getMaxValueLength = _ => Math.max(..._data.map(bucket => bucket.value.toString().length));
    
    /**
     * Get various stats for the raw data in the collection
     * 
     */
    const _getStatsRaw = {
        min: Math.min(...inputData),
        max: Math.max(...inputData),
        size: inputData.length,
        mean: _ => (inputData.reduce((a, b) => a + b) / inputData.length),
    };  

    //----------------------------------------------------------------------
    // Display methods
    //----------------------------------------------------------------------

    /**
     * Get an array containing strings that visually depict the collection 
     * structure of the dataset
     * 
     * @param {object} options 
     */
    const _printHorizontal = options => {
        return _data.map(bucket => {
            const key = bucket.key.toString();
            const value = bucket.value;

            return `${' '.repeat(_getMaxKeyLength() - key.length)}${key} ${'█'.repeat(value)} ${value}`;
        });
    };

    /**
     * Get an array containing strings that visually depict the collection 
     * structure of the dataset
     * 
     * @param {object} options 
     */
    const _printVertical = options => {
        const maxKeyLen = _getMaxKeyLength();
        const maxVal = _getMaxValue();
        const maxValLen = _getMaxValueLength();
        const steps = Math.floor(maxVal / 4);
        const output = [];
        const yIncrement = (options && options.scaleY) ? 1 / options.scaleY : 1;
    
        for (let y = maxVal; y > 0; y = y - yIncrement) {
            const lineNumber = Math.round(y / yIncrement);
            let line = ` ` + ((y % steps) 
                ? `${' '.repeat(maxValLen)} │`
                : `${' '.repeat(maxValLen - y.toString().length)}${y} ┤`) +
                '' + ((lineNumber === 1) ? '_' : ' ');
    
            for (let x = 0; x < _data.length; x++) {
                const sep = (lineNumber === 1) ? '_' : ' ';
    
                if (_data[x].value >= y) {
                    let char = (_data[x].value === y) ? '▄' : '█';
                    let chars = char.repeat(maxKeyLen);

                    // Add a mark for around the mean
                    const mean = _getStatsRaw.mean();
                    const meanBucketIndex = _getKeys().map(key => mean - key).filter(key => key >= 0).length - 1;

                    if (lineNumber === 1 && x === meanBucketIndex) {
                        const meanPercent = (mean - _data[x].key) / (_data[x + 1].key - _data[x].key);
                        const charMark = meanPercent ? Math.round(meanPercent * maxKeyLen) : 1;
                        chars = chars.split('');
                        chars[charMark - 1] = charMark === 1 ? '▌' : '▐';
                        chars = chars.join('');
                    }
    
                    line += chars + sep;
                } else {
                    line += sep.repeat(maxKeyLen + 1);
                }
            }
    
            output.push(line);
        }
    
        line = ` ${' '.repeat(maxValLen + 3)}`;
        _data.forEach(bucket => {
            const key = bucket.key.toString();
            line += ' '.repeat(maxKeyLen - key.length) + key + ' ';
        });
    
        output.push(line);
    
        return output;
    };

    //----------------------------------------------------------------------
    // Exposed methods
    //----------------------------------------------------------------------

    // Create
    _data.add = _add;
    _data.import = _import;
    _data.fillGaps = _fillGaps; // Array.fill exists
    _data.increment = _increment;
    _data.decrement = _decrement;

    // Read
    _data.getKeys = _getKeys;
    _data.getValues = _getValues;
    _data.getByKey = _getByKey;
    _data.getByValue = _getByValue;
    _data.getIndexOfKey = _getIndexOfKey;
    _data.getIndexOfValue = _getIndexOfValue;

    // Update
    _data.update = _update;

    // Delete
    _data.delete = _delete;
    _data.clear = _clearData;

    // Stats
    _data.getStats = _getStatsRaw;
    _data.getMinKey = _getMinKey;
    _data.getMaxKey = _getMaxKey;
    _data.getMinValue = _getMinValue;
    _data.getMaxValue = _getMaxValue;
    _data.getMinKeyLength = _getMinKeyLength;
    _data.getMaxKeyLength = _getMaxKeyLength;
    _data.getMinValueLength = _getMinValueLength;
    _data.getMaxValueLength = _getMaxValueLength;

    // Mutators
    _data.mapKeys = _mapKeys;
    _data.mapValues = _mapValues;
    _data.scaleValues = _scaleValues;
    _data.rebuild = _rebuild;

    // Sorting
    _data.sortKeys = _ => _sortByProp('key');
    _data.sortValues = _ => _sortByProp('value');

    // Display
    _data.printHorizontal = _printHorizontal;
    _data.printVertical = _printVertical;

    //----------------------------------------------------------------------
    // Constructor
    //----------------------------------------------------------------------

    if (inputData && inputData.length) {
        _import(inputData);
    }
    
    return _data;
}

module.exports = BucketContainer;
