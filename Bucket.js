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
        this.getItems().slice(itemIndex, 1);

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
