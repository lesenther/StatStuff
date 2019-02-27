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