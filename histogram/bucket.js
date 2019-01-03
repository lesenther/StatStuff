/**
 * Bucket for grouping the quanity of a collection by it's key
 * 
 * @param {String|Number} key The key id for the bucket
 * @param {Number} value The quantity in the collection as an integer
 */
function Bucket(key, value) {
    value = parseInt(value);

    if (isNaN(value) || !key.toString().length) {
        throw new Error(`Bad input params: ${key}, ${value}`);
    }

    this.key = key;
    this.value = value;

    return this;
};

module.exports = Bucket;
