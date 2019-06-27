const assert = require('assert');
const BucketContainer = require('../');

describe('Plotting functions', _ => {

    it('should print a vertical histogram', done => {
        const buckets = new BucketContainer([ 4, 2, 2, 3, 3, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 5, 1, 4, 2, 2, 3, 3, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 5, 1, 4, 2, 2, 3, 3, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 5, 1, 4, 2, 2, 3, 3, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 5, 1, 4, 2, 2, 3, 3, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 5, 1 ]);
        buckets.mapIds(value => parseInt(value).toFixed(2));
        buckets.sortById();

        buckets.printVertical({ markAverage: true, scaleY: 0.15 })
        .forEach((line, index) => {
          console.log(line);
        });
        buckets.printHorizontal()
        .forEach((line, index) => {
          console.log(line);
        });
        done();
    });

});
