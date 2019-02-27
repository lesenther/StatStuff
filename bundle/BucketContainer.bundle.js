'use strict';

const modclass = require('./modclass.bundle.js');

/**
 * BucketContainer.js
 *
 */
class BucketContainer {

    /**
     * Automatically create items and put into buckets by adding an array of input data.
     *
     * @param {Array} data Input data either as a standard array containing strings or numbers, or an associative array containing values and their quantities.
     */
    constructor(data = [], dump = false) {

        /**
         * Container for storing bucket objects.
         */
        const _container = [];

        /**
         * Get the original data the object was constructed with.
         */
        this.getRawData = _ => data;

        /**
         * Get the primary container array.
         */
        this.getContainer = _ => _container;

        // Attach method modules and automatically inject container
        modclass(this);

        // Load data into the container
        this.load(data);
    }

}

global.BucketContainer = BucketContainer;
