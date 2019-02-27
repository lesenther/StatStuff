const { exec } = require('child_process');

const BucketContainer = require('./BucketContainer');

(_ => {
    new BucketContainer()
    .__modclass.createBundle({
        filename: `modclass.bundle.js`,
        cloneClass: true,
        overwrite: true,
        outputDir: './bundle',
        dependencies: [ { name: 'Bucket', path: '../Bucket' }, { name: 'Item', path: '../Item' } ],
        excludeProps: [ 'getRawData', 'getContainer' ]
    })
    .then(_ => {
        exec(`browserify ./bundle/BucketContainer.bundle.js -o ./bundle/BucketContainer.browserified.js`);
    });
})();
