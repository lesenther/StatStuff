module.exports = _this => {

    return {
        getMinId: _ => Math.min(..._this.getContainer().map(bucket => bucket.getId())),
        getMaxId: _ => Math.max(..._this.getContainer().map(bucket => bucket.getId())),
        getMinSize: _ => Math.min(..._this.getContainer().map(bucket => bucket.getSize())),
        getMaxSize: _ => Math.max(..._this.getContainer().map(bucket => bucket.getSize())),
        getMinIdLength: _ => Math.min(..._this.getContainer().map(bucket => bucket.getId().toString().length)),
        getMaxIdLength: _ => Math.max(..._this.getContainer().map(bucket => bucket.getId().toString().length)),
        getMinSizeLength: _ => Math.min(..._this.getContainer().map(bucket => bucket.getSize().toString().length)),
        getMaxSizeLength: _ => Math.max(..._this.getContainer().map(bucket => bucket.getSize().toString().length))
    };
};
