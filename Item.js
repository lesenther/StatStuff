'use strict';

/**
 * Item Class for storing a unit of raw data, which could be a number
 * or a string.
 *
 */
class Item {

    /**
     * 
     * @param {*} value
     */
    constructor(value) {
        const validInputTypes = [ String, Number ];

        if (typeof value === 'undefined') {
            throw new Error('Input value must be defined');
        }

        if (!validInputTypes.find(type => value.constructor === type)) {
            throw new Error('Bad input value type');
        }

        this.value = value;
    }

    getValue() {
        return this.value;
    }

    getValueNumeric() {
        if (!this.isNumeric()) {
            throw new Error('Value is not numeric');
        }

        if (this.getType() === 'number') {
            return this.getValue();
        }

        return parseFloat(this.getValue().replace(/[^\d\.\-eE+]/g, ''));
    }

    getType() {
        return typeof this.getValue();
    }

    isNumeric() {
        return !isNaN(this.getValue());
    }
}

module.exports = Item;
