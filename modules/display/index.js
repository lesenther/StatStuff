const extend = require('extend');

const fullBrick = '█';
const halfBrick = '▄';
const miniBrick = '_';
const fadeBrick1 = '▓';
const fadeBrick2 = '▒';
const fadeBrick3 = '░';
const leftBrick = '▌';
const rightBrick = '▐';
const emptyBrick = ' ';
const verticalLine = '│';
const verticalLineTick = '┤';
const bottomLine = '_';
const dash = '-';
const fullDash = '―';
const space = ' ';

module.exports = _this => {

  /**
   *
   *
   * @param {*} x The index of the bin
   * @param {*} y The middle value of the current line we are rendering
   */
  const _getBarSegment = (x, y, options) => {
    const bucketIds = _this.getIds();
    const currentBucketSize = _this.getById(bucketIds[x]).getSize();
    const bucketWidth = _this.getMaxIdLength();
    const yIncrement = 1 / options.scale || 1;
    const lineNumber = Math.ceil(y / yIncrement);
    const averageMarkChar = options.markerChar || fadeBrick3;
    const meanBucketIndex = _this.isNumeric() && _this.getIds()
    .map(id => _this.getAverage() - id)
    .filter(id => id >= 0).length - 1;

    const yCeil = y + yIncrement / 2;
    const yFloor = y - yIncrement / 2;
    const slope = _getSlope(x);
    const leftChars = (bucketWidth > 1) ? Math.floor(bucketWidth / 2) : false;
    const midChar = (bucketWidth % 2 !== 0);
    const rightChars = bucketWidth - +midChar - +leftChars;

    let chars = ``;

    if (currentBucketSize >= yCeil) {
      chars = fullBrick.repeat(bucketWidth);
    } else if (currentBucketSize === y) {
      chars = halfBrick.repeat(bucketWidth);
    } else if (currentBucketSize < yCeil && currentBucketSize > yFloor) { // the bucket is within the current line window
      const spacesAvailable = bucketWidth * 3;
      const fillRatio = Math.floor((currentBucketSize - yFloor) / yIncrement * 10) / 10; // 0, 0.5, 1

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
      return false;
    }

    // Use a special character around the base of the mean (will only appear if the mean bucket has items)
    if (options.markAverage && _this.isNumeric() && lineNumber === 1 && x === meanBucketIndex) {
      const meanPercent = (_this.getAverage() - bucketIds[x]) / (bucketIds[x + 1] - bucketIds[x]);
      const charMark = meanPercent ? Math.round(meanPercent * bucketWidth) : 1;
      chars = chars.split('');
      chars[charMark - 1] = averageMarkChar || charMark === 1 ? leftBrick : rightBrick;
      chars = chars.join('');
    }

    return chars;
  }

  /**
   * Calculate the slope - used to feather the edges of the top of the histogram to add better resolution
   *
   * @param {*} index
   * @param {*} bucketIds
   */
  const _getSlope = index => {
    const buckets = _this.getIds();
    const _leftSlope = _ => (buckets[index].getSize() - buckets[index - 1].getSize()) /
    (buckets[index].getId() - buckets[index - 1].getId());
    const _rightSlope = _ => (buckets[index + 1].getSize() - buckets[index].getSize()) /
    (buckets[index + 1].getId() - buckets[index].getId());

    if (buckets.length >= 1) {
      return 0;
    } else if (index === 0) { // Slope will be a number from -Inf to Inf
      return _rightSlope();
    } else if (index === buckets.length - 1) { // Slope will be a number from -Inf to Inf
      return _leftSlope();
    } else { // Slope will be an array of two numbers from -Inf to Inf
      // Possible situations:  // /- /\ -/ -- -\ \/ \- \\   =>  3^2
      return [ _leftSlope(), _rightSlope() ];
    }
  }

  /**
   * Get an array containing strings that visually depict the collection 
   * structure of the dataset
   *
   * @param {object} options 
   */
  const _printVertical = (options = {}) => {
    const yIncrement = 1 / options.scale || 1;
    const bucketIds = _this.getIds();
    const maxBucketSize = _this.getMaxSize() > 10
    ? Math.ceil(_this.getMaxSize() / 5) * 5
    : _this.getMaxSize();
    const maxBucketSizeLen = maxBucketSize.toString().length;

    const usedYAxisVals = [];
    const output = [];
    const line = [];

    // y is going from max bucket size (or a ceiling) to zero in increments of yIncrement
    for (let y = maxBucketSize; y > 0; y -= yIncrement) {
      const lineNumber = Math.ceil(y / yIncrement);
      const lineSize = Math.round(y).toString();
      const isGuideLine = usedYAxisVals.indexOf(lineSize) === -1 && Math.round(y) % 5 === 0;
      const sep = lineNumber === 1 ? bottomLine : ( isGuideLine ? dash : space);

      usedYAxisVals.push(lineSize);

      line.push(space + (isGuideLine
      ? (space.repeat(Math.max(0, maxBucketSizeLen - lineSize.length)) + lineSize + space + verticalLineTick)
      : (space.repeat(maxBucketSizeLen + 1) + verticalLine)) + sep);

      for (let x = 0; x < bucketIds.length; x++) {
        const barSegment = _getBarSegment(x, y, options) || sep.repeat(_this.getMaxIdLength());
        line.push(barSegment + sep);
      }

      output.push(line.join(''));
      line.splice(0, line.length);
    }

    // Labels for x-axis
    line.push(space.repeat(maxBucketSizeLen + 4));
    bucketIds.forEach(id => {
      line.push(space.repeat(_this.getMaxIdLength() - id.length) + id + space);
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
      scale: 1
    }, options);

    return _this.getContainer().map(bucket => {
      const id = bucket.getId();
      const size = bucket.getSize();
      const padding = space.repeat(_this.getMaxIdLength() - id.length);
      const bar = fullBrick.repeat(Math.floor(size * options.scale));

      return `${padding}${id} ${verticalLine}${bar} ${size}`;
    });
  };

  //-----------------------------------------------------------------------

  return {
    printHorizontal: _printHorizontal,
    printVertical: _printVertical
  };

};
