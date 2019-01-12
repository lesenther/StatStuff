const BucketContainer = require('./BucketContainer');
const bucketContainerObject = new BucketContainer();
bucketContainerObject.__modclass.createBundle({
    cloneClass: true,
    overwrite: true,
    dependencies: [ { name: 'Bucket' }, { name: 'Item' } ],
    excludeProps: [ 'getRawData', 'getContainer' ]
});