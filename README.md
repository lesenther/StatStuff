Basic Data Analysis
====================

A collection of classes for doing basic data analysis.  The initial need for this was to generate some text-based histograms for quick log analysis, but this could grow for additional analytics tools and so it was left relatively abstract.  

Histogram
----------
The BucketContainer class basically just extends an array element with a few methods to allow it to be better used as a container for histogram data.  The array contains Bucket objects, which have key and value properties, where the key is the item being grouped and the value is the quantity of the collection.  The key can be either a number, including integers and floats, or a string (case-sensitive) and the value must be an integer.

Some of the basic methods make it easier to manipulate these collections, such as 'add' for adding buckets and bucket data to a collect, 'mapKeys' for remapping keys, which we automatically merge buckets that get remapped to existing buckets, and 'fillGaps', which will create empty buckets for properly displaying data when using the print methods.  

Usage
------

const buckets = new BucketContainer(['apple','banana','orange','apple','Apple','banana']);

    [
        { key: 'apple',
          value: 2 },
        { key: 'banana',
          value: 2 },
        { key: 'orange',
          value: 1 },
        { key: 'Apple',
          value: 1 }
    ]

buckets.mapKeys(key => key.toLowerCase());

    [
        { key: 'apple',
          value: 3 },
        { key: 'banana',
          value: 2 },
        { key: 'orange',
          value: 1 }
    ]

