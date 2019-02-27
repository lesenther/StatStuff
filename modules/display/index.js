const extend = require('extend');

module.exports = _this => {

    /**
     * Get an array containing strings that visually depict the collection 
     * structure of the dataset
     *
     * @param {object} options 
     */
    const _printVertical = (options = {}) => {
        const yIncrement = 1 / options.scaleY || 1;
        const bucketIds = _this.getIds();
        const maxBucketSize = _this.getMaxSize() > 10
        ? Math.ceil(_this.getMaxSize() / 5) * 5
        : _this.getMaxSize();
        const maxBucketSizeLen = maxBucketSize.toString().length;
        const usedId = [];
        const averageMarkChar = options.markerChar || '▒';

        const output = [];
        const line = [];

        for (let y = maxBucketSize; y > 0; y -= yIncrement) {
            const lineNumber = Math.ceil(y / yIncrement);
            const lineSize = Math.round(y).toString();
            const isGuide = usedId.indexOf(lineSize) === -1 && Math.round(y) % 5 === 0;
            const sep = lineNumber === 1 ? '_' : ( isGuide ? '-' : ' ');
            usedId.push(lineSize);

            line.push(` ` + (isGuide
            ? `${' '.repeat(Math.max(0, maxBucketSizeLen - lineSize.length))}${lineSize} ┤`
            : `${' '.repeat(maxBucketSizeLen)} │`) + sep);

            for (let x = 0; x < bucketIds.length; x++) {
                if (_this.getById(bucketIds[x]).getSize() >= y) {
                    let chars = (_this.getById(bucketIds[x]).getSize() === y ? '▄' : '█')
                    .repeat(_this.getMaxIdLength());

                    // Use a special character around the base of the mean (will only appear if the mean bucket has items)
                    if (options.markAverage && _this.isNumeric()) {
                        const mean = _this.getAverage();
                        const meanBucketIndex = _this.getIds().map(id => mean - id).filter(id => id >= 0).length - 1;

                        if (lineNumber === 1 && x === meanBucketIndex) {
                            const meanPercent = (mean - bucketIds[x]) / (bucketIds[x + 1] - bucketIds[x]);
                            const charMark = meanPercent ? Math.round(meanPercent * _this.getMaxIdLength()) : 1;
                            chars = chars.split('');
                            chars[charMark - 1] = averageMarkChar || charMark === 1 ? '▌' : '▐';
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
        line.push(' '.repeat(maxBucketSizeLen + 4));
        bucketIds.forEach(id => {
            line.push(' '.repeat(_this.getMaxIdLength() - id.length) + id + ' ');
        });

        output.push(line.join(''));

        return output;
    };

    /**
     * Get an array containing strings that visually depict the collection
     * structure of the dataset
     * 
     * @param {object} options
     */
    const _printHorizontal = options => {
        options = extend({})
        return _this.getContainer().map(bucket => {
            const id = bucket.getId();
            const size = bucket.getSize();
            const padding = ' '.repeat(_this.getMaxIdLength() - id.length);
            const bar = '█'.repeat(size);

            return `${padding}${id} │${bar} ${size}`;
        });
    };

    //-----------------------------------------------------------------------

    return {
        printHorizontal: _printHorizontal,
        printVertical: _printVertical
    };

};
