const assert = require('assert');

const BucketContainer = require('../BucketContainerBundle');

describe('yeah', _ => {

    it('should do', done => {
        const buckets = new BucketContainer([1,2,3,2,3,2]);

        buckets.printVertical().forEach(line => {
            console.log(line);
        });
        done();
    });

});