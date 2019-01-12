const assert = require('assert');
const Item = require('../Item');

describe('Create', _ => {

    it('should create an item', done => {
        assert.equal(new Item(-1).constructor, Item);
        assert.equal(new Item(0).constructor, Item);
        assert.equal(new Item(123).constructor, Item);
        assert.equal(new Item(12.3).constructor, Item);
        assert.equal(new Item('12.3').constructor, Item);
        assert.equal(new Item('car').constructor, Item);
        done();
    });

    it('should not create item with undefined value', done => {
        try {
            const item = new Item()
            assert.notEqual(item.constructor, Item);
        } catch(e) {
            assert.equal(e.constructor, Error);
        }

        try {
            const item = new Item(undefined);
            assert.notEqual(item.constructor, Item);
        } catch(e) {
            assert.equal(e.constructor, Error);
        }

        done();
    });

    it('should not create item with bad values', done => {
        try {
            const item = new Item({ object: 1 });
            assert.notEqual(item.constructor, Item);
        } catch(e) {
            assert.equal(e.constructor, Error);
        }

        try {
            const item = new Item([ 'array' ]);
            assert.notEqual(item.constructor, Item);
        } catch(e) {
            assert.equal(e.constructor, Error);
        }

        try {
            const item = new Item(function func(){});
            assert.notEqual(item.constructor, Item);
        } catch(e) {
            assert.equal(e.constructor, Error);
        }

        try {
            const item = new Item(true);
            assert.notEqual(item.constructor, Item);
        } catch(e) {
            assert.equal(e.constructor, Error);
        }

        done();
    });

    it('should get the type of an item', done => {
        assert.equal(new Item(10).getType(), 'number');
        assert.equal(new Item(1.2).getType(), 'number');
        assert.equal(new Item('1.2').getType(), 'string');
        done();
    });

    it('should determine if item is numeric', done => {
        assert.equal(new Item(10).isNumeric(), true);
        assert.equal(new Item(1.2).isNumeric(), true);
        assert.equal(new Item('1.2').isNumeric(), true);
        assert.equal(new Item('1.2e2').isNumeric(), true);
        assert.equal(new Item('1.2w3').isNumeric(), false);
        done();
    });

});
