const assert = require('assert');
const Bucket = require('../Bucket');

describe('Create', _ => {

    it('should create an empty bucket', done => {
        const bucket = new Bucket(10);
        assert.equal(bucket.getSize(), 0);
        done();
    });

    it('should create a bucket and add an item to it', done => {
        const bucket = new Bucket(10, [ 10.1 ]);
        assert.equal(bucket.getSize(), 1);
        done();
    });

    it('should create a bucket and add multiple items to it', done => {
        const bucket = new Bucket('Numbers', [ 1, 2, 3 ]);
        assert.equal(bucket.getSize(), 3);
        done();
    });

});

describe('Get proper statistics', _ => {

    it('should get the sum of the items in the bucket', done => {
        const bucket = new Bucket('Numbers', [ 1, 2, 3 ]);
        assert.equal(bucket.getSum(), 6);
        done();
    });

    it('should get the average of the items in the bucket', done => {
        const bucket = new Bucket('Numbers', [ 1, 2, 3 ]);
        assert.equal(bucket.getAverage(), 2);
        done();
    });

    it('should not get the average of a bucket containing a string', done => {
        const bucket = new Bucket('Numbers', [ 1, 2, 3, 'car' ]);
        try {
            bucket.getAverage();
            assert.equal(true, false);
        } catch(e) {
            assert.equal(e.constructor, Error);
        }
        done();
    });

});