const extend = require('extend');

const fullBrick = '█';
const halfBrick = '▄';
const miniBrick = '_';
const fadeBrick1 = '▓';
const fadeBrick2 = '▒';
const fadeBrick3 = '░';
const leftBrick = '▌';
const rightBrick = '▐';

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
    const averageMarkChar = options.markerChar || fadeBrick3;
    const usedYAxisVals = [];
    const output = [];
    const line = [];

    // y is going from max bucket size (or a ceiling) to zero in increments of yIncrement
    for (let y = maxBucketSize; y > 0; y -= yIncrement) {
      const lineNumber = Math.ceil(y / yIncrement);
      const lineSize = Math.round(y).toString();
      const isGuide = usedYAxisVals.indexOf(lineSize) === -1 && Math.round(y) % 5 === 0;
      const sep = lineNumber === 1 ? '_' : ( isGuide ? '-' : ' ');

      usedYAxisVals.push(lineSize);

      line.push(` ` + (isGuide
        ? (' '.repeat(Math.max(0, maxBucketSizeLen - lineSize.length)) + lineSize + ' ┤')
        : (' '.repeat(maxBucketSizeLen) + ' │')) + sep);

      for (let x = 0; x < bucketIds.length; x++) {
        const currentBucketSize = _this.getById(bucketIds[x]).getSize();
        const bucketWidth = _this.getMaxIdLength();
        const yCeil = y + yIncrement / 2;
        const yFloor = y - yIncrement / 2;

        let chars = '';

        if (currentBucketSize >= yCeil) { // The bucket is bigger than the ceiling, fill it all
          chars = fullBrick.repeat(bucketWidth);
        } else if (currentBucketSize === y) { // exact match
          chars = halfBrick.repeat(bucketWidth);
        } else if (currentBucketSize < yCeil && currentBucketSize > yFloor) { // the bucket is within the current line window
          const fillRatio = (currentBucketSize - yFloor) / yIncrement; // 0, 0.5, 1

          if (fillRatio > 0.5) { // 0.5 to 1
            if (bucketWidth > 2) {
              chars = halfBrick.repeat(1) + fullBrick.repeat(bucketWidth - 2) + halfBrick.repeat(1);
            } else {
              chars = fullBrick.repeat(bucketWidth);
            }
          } else {
            if (fillRatio < 0.1) { // 0 to 0.1
              chars = miniBrick.repeat(bucketWidth);
            } else { // 0.1 to 0.5
              if (bucketWidth > 2) {
                chars = miniBrick.repeat(1) + halfBrick.repeat(bucketWidth - 2) + miniBrick.repeat(1);
              } else {
                chars = halfBrick.repeat(bucketWidth);
              }
            }
          }
        } else {
          chars = sep.repeat(_this.getMaxIdLength());
        }

        // Use a special character around the base of the mean (will only appear if the mean bucket has items)
        if (options.markAverage && _this.isNumeric()) {
          const mean = _this.getAverage();
          const meanBucketIndex = _this.getIds().map(id => mean - id).filter(id => id >= 0).length - 1;

          if (lineNumber === 1 && x === meanBucketIndex) {
            const meanPercent = (mean - bucketIds[x]) / (bucketIds[x + 1] - bucketIds[x]);
            const charMark = meanPercent ? Math.round(meanPercent * bucketWidth) : 1;
            chars = chars.split('');
            chars[charMark - 1] = averageMarkChar || charMark === 1 ? leftBrick : rightBrick;
            chars = chars.join('');
          }
        }

        line.push(chars + sep);
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
    options = extend({ // defaults
    }, options);

    return _this.getContainer().map(bucket => {
      const id = bucket.getId();
      const size = bucket.getSize();
      const padding = ' '.repeat(_this.getMaxIdLength() - id.length);
      const bar = fullBrick.repeat(size);

      return `${padding}${id} │${bar} ${size}`;
    });
  };

  //-----------------------------------------------------------------------

  return {
    printHorizontal: _printHorizontal,
    printVertical: _printVertical
  };

};
