module.exports = _this => {

    /**
     * Get an array containing strings that visually depict the collection 
     * structure of the dataset
     *
     * @param {object} options 
     */
    const _printVertical = (options = {}) => {
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
    };

    /**
     * Get an array containing strings that visually depict the collection
     * structure of the dataset
     * 
     * @param {object} options
     */
    const _printHorizontal = options => {
        return _this.getContainer().map(bucket => {
            const id = bucket.getId();
            const size = bucket.getSize();

            return `${' '.repeat(_this.getMaxIdLength() - id.length)}${id} ${'█'.repeat(size)} ${size}`;
        });
    };

    return {
        printHorizontal: _printHorizontal,
        printVertical: _printVertical
    };

};
