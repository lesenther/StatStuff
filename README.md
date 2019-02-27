StatStuff
====================

A collection of classes for doing basic data analysis.  The initial need for this was to generate some text-based histograms for quick log analysis over SSH, but this could grow for additional analytics tools and so it was left relatively abstract.  

Histogram
----------
The BucketContainer class basically just extends an array element with a few methods to allow it to be better used as a container for histogram data.  The array contains Bucket objects, which are just containers for Item objects.  Buckets have string values for their ids.  Items contain a value, which can either be a string or a number.  

Some of the basic methods make it easier to manipulate these collections, such as 'add' for adding buckets and bucket data to a collect, 'mapIds' for remapping keys, which we automatically merge buckets that get remapped to existing buckets, and 'fillGaps', which will create empty buckets for properly displaying data when using the print methods.  

Usage
------

const buckets = new BucketContainer(['apple','banana','orange','apple','Apple','banana']);

    BucketContainer [
        Bucket { id: 'apple',
          items: [ Item { value: 'apple' }, Item { value: 'apple' } ] },
        Bucket { id: 'banana',
          items: [ Item { value: 'banana' }, Item { value: 'banana' } ] },
        Bucket { id: 'orange',
          items: [ Item { value: 'orange' } ] },
        Bucket { id: 'Apple',
          items: [ Item { value: 'Apple' } ] }
    ]

buckets.mapIds(id => id.toLowerCase());

    BucketContainer [
        Bucket { id: 'apple',
          items: [ Item { value: 'apple' }, Item { value: 'apple' }, Item { value: 'Apple' } ] },
        Bucket { id: 'banana',
          items: [ Item { value: 'banana' }, Item { value: 'banana' } ] },
        Bucket { id: 'orange',
          items: [ Item { value: 'orange' } ] }
    ]

buckets.add(new Bucket('other'));
buckets.mapIds(id => id !== 'apple' ? 'other' : id);

    BucketContainer [
        Bucket { id: 'apple',
          items: [ Item { value: 'apple' }, Item { value: 'apple' }, Item { value: 'Apple' } ] },
        Bucket { id: 'other',
          items: [ Item { value: 'banana' }, Item { value: 'banana' }, Item { value: 'orange' } ] },
    ]
