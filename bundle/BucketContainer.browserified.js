(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

const Item = require('./Item');

/**
 * Bucket for grouping items
 *
 * @param {String} id The id for the bucket
 * @param {Number} value The quantity in the collection as an integer
 */

class Bucket {

    /**
     * Create a new bucket.
     *
     * @param {String} id
     * @param {Array} data
     */
    constructor(id, data = []) {

        /**
         * Container for item objects.
         */
        const _items = [];

        /**
         * Function to access protected container.
         */
        this.getItems = _ => _items;

        this.setId(id);
        this.load(data);
    }

    /**
     * Get the id of the bucket.
     */
    getId() {
        return this.id;
    }

    /**
     * Set the id of the bucket.
     *
     * @param {String} id
     */
    setId(id) {
        id = id.toString().trim();

        if (!id.length) {
            throw new Error(`Invalid id!`);
        }

        this.id = id;

        return this;
    }

    /**
     * Add an item to the bucket
     *
     * @param {Item} item
     */
    addItem(item) {
        this.getItems().push(item);

        return this;
    }

    /**
     * Remove an item from the bucket
     *
     * @param {Item} item
     */
    removeItem(item) {
        const itemIndex = this.getItems().findIndex(_item => item.getValue() === _item.getValue());
        this.getItems().splice(itemIndex, 1);

        return this;
    }

    /**
     */
    getItemValues() {
        return this.getItems().forEach(item => item.getValue());
    }

    /**
     * Remove all items from the bucket.
     */
    removeAll() {
        this.getItems().splice(0, this.getSize());

        return this;
    }

    /**
     * Get the number of items inside the bucket.
     */
    getSize() {
        return this.getItems().length;
    }

    /**
     * Check if any of the items in the bucket are non-numeric.

     */
    isNumeric() {
        return this.getItems().filter(item => !item.isNumeric()).length === 0;
    }

    /**
     * Get the sum of the items inside the bucket if they're all numeric.
     */
    getSum() {
        if (!this.isNumeric()) {
            throw new Error(`Not all items are numeric!`);
        }

        return this.getItems().reduce((sum, item) => sum + item.getValueNumeric(), 0);
    }

    /**
     * Get the average of the items in the bucket if numeric.
     */
    getAverage() {
        return this.getSum() / this.getSize();
    }

    /**
     * Automatically create and add items to the bucket
     *
     * @param {Array} data
     */
    load(data) {
        if (data && data.constructor === Array) {
            data.forEach(datum => {
                this.addItem(new Item(datum));
            });
        }

        return this;
    }

};

module.exports = Bucket;

},{"./Item":2}],2:[function(require,module,exports){
'use strict';

/**
 * Item Class for storing a unit of raw data, which could be a number
 * or a string.
 *
 */
class Item {

    /**
     * 
     * @param {*} value
     */
    constructor(value) {
        const validInputTypes = [ 'string', 'number' ];

        if (validInputTypes.indexOf(typeof value) === -1) {
            throw new Error('Bad input value type');
        }

        this.value = value;
    }

    getValue() {
        return this.value;
    }

    getValueNumeric() {
        if (!this.isNumeric()) {
            throw new Error('Value is not numeric');
        }

        if (this.getType() === 'number') {
            return this.getValue();
        }

        return parseFloat(this.getValue().replace(/[^\d\.\-eE+]/g, ''));
    }

    getType() {
        return typeof this.getValue();
    }

    isNumeric() {
        return !isNaN(this.getValue());
    }
}

module.exports = Item;

},{}],3:[function(require,module,exports){
(function (global){
'use strict';

const modclass = require('./modclass.bundle.js');

/**
 * BucketContainer.js
 *
 */
class BucketContainer {

    /**
     * Automatically create items and put into buckets by adding an array of input data.
     *
     * @param {Array} data Input data either as a standard array containing strings or numbers, or an associative array containing values and their quantities.
     */
    constructor(data = [], dump = false) {

        /**
         * Container for storing bucket objects.
         */
        const _container = [];

        /**
         * Get the original data the object was constructed with.
         */
        this.getRawData = _ => data;

        /**
         * Get the primary container array.
         */
        this.getContainer = _ => _container;

        // Attach method modules and automatically inject container
        modclass(this);

        // Load data into the container
        this.load(data);
    }

}

global.BucketContainer = BucketContainer;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./modclass.bundle.js":4}],4:[function(require,module,exports){
const Bucket = require('../Bucket');
const Item = require('../Item');

module.exports = _this => { const _modclass = {
	add: bucket => _this.getContainer().push(bucket),
	createItemAddBucket: value => {
        const item = new Item(value);
        const existingBucket = _this.getById(value);

        if (existingBucket) {
            existingBucket.addItem(item);
        } else {
            const bucket = new Bucket(value);
            bucket.addItem(item);
            _this.add(bucket);
        }
    },
	fillGaps: increment => {
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
    },
	load: (data) => {
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
    },
	printHorizontal: options => {
        return _this.getContainer().map(bucket => {
            const id = bucket.getId();
            const size = bucket.getSize();

            return `${' '.repeat(_this.getMaxIdLength() - id.length)}${id} ${'█'.repeat(size)} ${size}`;
        });
    },
	printVertical: (options = {}) => {
        const output = [];
        const yIncrement = (options && options.scaleY) ? 1 / options.scaleY : 1;
        const ids = _this.getIds();
        const yMax = _this.getMaxSize() > 10 ? Math.ceil(_this.getMaxSize() / 5) * 5 : _this.getMaxSize();
        const yMaxStrLen = yMax.toString().length;

        let line = [];

        for (let y = yMax; y > 0; y = Math.round(y - yIncrement)) {
            const yAxisVal = y % Math.floor(yMax / 5) === 0;
            const sep = (y === 1) ? '_' : ( yAxisVal ? '-' : ' ');

            line.push(` ` + (yAxisVal
            ? `${' '.repeat(Math.max(0, yMaxStrLen - y.toString().length))}${y} ┤`
            : `${' '.repeat(yMaxStrLen)} │`) + sep);

            for (let x = 0; x < ids.length; x++) {
                if (_this.getById(ids[x]).getSize() >= y) {
                    let chars = (_this.getById(ids[x]).getSize() === y ? '▄' : '█')
                    .repeat(_this.getMaxIdLength());

                    // Use a special character around the base of the mean (will only appear if the mean bucket has items)
                    if (options.markAverage && _this.isNumeric()) {
                        const mean = _this.getAverage();
                        const meanBucketIndex = _this.getIds().map(id => mean - id).filter(id => id >= 0).length - 1;

                        if (y === 1 && x === meanBucketIndex) {
                            const meanPercent = (mean - ids[x]) / (ids[x + 1] - ids[x]);
                            const charMark = meanPercent ? Math.round(meanPercent * _this.getMaxIdLength()) : 1;
                            chars = chars.split('');
                            chars[charMark - 1] = '▒';//charMark === 1 ? '▌' : '▐';
                            chars = chars.join('');
                        }
                    }

                    line.push(chars + sep);
                } else {
                    line.push(sep.repeat(_this.getMaxIdLength() + 1));
                }
            }

            output.push(line.join(''));
            line.splice(0, line.length);
        }

        // Labels for x-axis
        line.push(' '.repeat(yMaxStrLen + 4));
        ids.forEach(id => {
            line.push(' '.repeat(_this.getMaxIdLength() - id.length) + id + ' ');
        });

        output.push(line.join(''));
    
        return output;
    },
	mapIds: func => {
        if (typeof func !== 'function') {
            throw new Error(`Bad input: ${typeof func}`);
        }

        _this.getContainer().map(bucket => bucket.setId(func(bucket.getId())));
        _this.rebuild();
    },
	scaleIds: factor => _mapIds(id => id * factor),
	rebuild: _ => {
        _removeDuplicates();
    },
	getAverage: _ => _this.getSum() / _this.getSizeItems(),
	getById: id => {
        const index = _this.getContainer().findIndex(bucket => bucket.getId() === id.toString());

        return (index !== -1) ? _this.getContainer()[index] : false;
    },
	getIds: _ => _this.getContainer().map(bucket => bucket.getId()),
	getSize: _ => _this.getContainer().length,
	getSizes: _ => _this.getContainer().map(bucket => bucket.getSize()),
	getSizeItems: _ => _this.getContainer().reduce((total, bucket) => total + bucket.getSize(), 0),
	getSum: _ => {
        if (!_this.isNumeric()) {
            throw new Error('Some values are not numeric');
        }

        return _this.getContainer().reduce((total, bucket) => total + bucket.getSum(), 0);
    },
	getSumSizes: _ => _this.getSizes().reduce((total, size) => total + size, 0),
	isNumeric: _ => _this.getContainer().filter(bucket => !bucket.isNumeric()).length === 0,
	remove: bucket => {
        const index = _this.getContainer().findIndex(_bucket => _bucket === bucket);

        if (index !== -1) {
            _this.getContainer().splice(index, 1);
        }

        return _this;
    },
	removeAll: _ => {
        _this.getContainer().splice(0, _this.getSize());

        return _this;
    },
	sortBy: func => {
        _this.getContainer().sort((a, b) => {
            if (func && typeof func === 'function') {
                a = func(a), b = func(b);
            }

            return isNaN(a) && isNaN(b) ? (a > b ? 1 : -1)
            : (isNaN(a) ? 1 : (isNaN(b) ? -1 : (+a > +b ? 1 : -1)));
        });
    },
	sortById: _ => _sortBy(bucket => bucket.getId()),
	sortBySize: _ => _sortBy(bucket => bucket.getSize()),
	getMinId: _ => Math.min(..._this.getContainer().map(bucket => bucket.getId())),
	getMaxId: _ => Math.max(..._this.getContainer().map(bucket => bucket.getId())),
	getMinSize: _ => Math.min(..._this.getContainer().map(bucket => bucket.getSize())),
	getMaxSize: _ => Math.max(..._this.getContainer().map(bucket => bucket.getSize())),
	getMinIdLength: _ => Math.min(..._this.getContainer().map(bucket => bucket.getId().toString().length)),
	getMaxIdLength: _ => Math.max(..._this.getContainer().map(bucket => bucket.getId().toString().length)),
	getMinSizeLength: _ => Math.min(..._this.getContainer().map(bucket => bucket.getSize().toString().length)),
	getMaxSizeLength: _ => Math.max(..._this.getContainer().map(bucket => bucket.getSize().toString().length)),
	};
	for (let prop in _modclass) { _this[prop] = _modclass[prop]; }
};
},{"../Bucket":1,"../Item":2}]},{},[3]);
