const assert = require('assert');
const skewnorm = require('skew-normal-random');
const BucketContainer = require('../');

describe('Sorting functions', _ => {

    it('should sort string keys alphabetically', done => {
        const buckets = new BucketContainer([ 'z', 'b', 'x', 'c', 'y', 'a', 'z' ]);
        buckets.sortById();

        assert.equal(buckets.getIds().join(''), 'abcxyz');
        done();
    });

    it('should sort integer keys numerically', done => {
        const buckets = new BucketContainer([ 4, 3, 2, 1, 5, 4 ]);
        buckets.sortById();

        assert.equal(buckets.getIds().join(''), '12345');
        done();
    });

    it('should sort floating point keys numerically', done => {
        const buckets = new BucketContainer([ 4.2, 3.2, 2.2, 1.2, 5.2, 4.1 ]);
        buckets.sortById();

        assert.equal(buckets.getIds().join(''), '1.22.23.24.14.25.2');
        done();
    });

    it('should sort mixed int and float keys numerically', done => {
        const buckets = new BucketContainer([ 4.2, '3', 2.2, '1.2', 5.2, 4.1 ]);
        buckets.sortById();

        assert.equal(buckets.getIds().join(''), '1.22.234.14.25.2');
        done();
    });

});

describe('Grouping functions', _ => {

    it('should create buckets', done => {
        const buckets = new BucketContainer([ 1, 2, 3, 4, 2, 2 ]);

        assert.equal(buckets.getById(2).getSize(), 3);
        done();
    });

    it('should put random integers into buckets', done => {
        const sampleData = skewnorm
        .rvSkewNorm(1000, 6, 5, 2, 0, 20)
        .map(val => Math.floor(val));

        const buckets = new BucketContainer(sampleData);

        buckets.getContainer().forEach(bucket => {
            assert.equal(bucket.getSize(), sampleData.filter(n => n.toString() === bucket.getId()).length);
        });
        done();
    });

    it('should put random floats into buckets', done => {
        const sampleData = skewnorm
        .rvSkewNorm(1000, 6, 5, 2, 0, 20)
        .map(val => val * 10)
        .map(val => Math.floor(val))
        .map(val => (val / 10).toFixed(1));

        const buckets = new BucketContainer(sampleData);

        buckets.getContainer().forEach(bucket => {
            assert.equal(bucket.getSize(), sampleData.filter(n => n.toString() === bucket.getId()).length);
        });
        done();
    });

    it('should put random strings into buckets', done => {
        const sampleData = `The unanimous Declaration of the thirteen united States of America, When in the Course of human events, it becomes necessary for one people to dissolve the political bands which have connected them with another, and to assume among the powers of the earth, the separate and equal station to which the Laws of Nature and of Nature's God entitle them, a decent respect to the opinions of mankind requires that they should declare the causes which impel them to the separation. We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness.--That to secure these rights, Governments are instituted among Men, deriving their just powers from the consent of the governed, --That whenever any Form of Government becomes destructive of these ends, it is the Right of the People to alter or to abolish it, and to institute new Government, laying its foundation on such principles and organizing its powers in such form, as to them shall seem most likely to effect their Safety and Happiness. Prudence, indeed, will dictate that Governments long established should not be changed for light and transient causes; and accordingly all experience hath shewn, that mankind are more disposed to suffer, while evils are sufferable, than to right themselves by abolishing the forms to which they are accustomed. But when a long train of abuses and usurpations, pursuing invariably the same Object evinces a design to reduce them under absolute Despotism, it is their right, it is their duty, to throw off such Government, and to provide new Guards for their future security.--Such has been the patient sufferance of these Colonies; and such is now the necessity which constrains them to alter their former Systems of Government. The history of the present King of Great Britain is a history of repeated injuries and usurpations, all having in direct object the establishment of an absolute Tyranny over these States. To prove this, let Facts be submitted to a candid world.He has refused his Assent to Laws, the most wholesome and necessary for the public good.He has forbidden his Governors to pass Laws of immediate and pressing importance, unless suspended in their operation till his Assent should be obtained; and when so suspended, he has utterly neglected to attend to them.He has refused to pass other Laws for the accommodation of large districts of people, unless those people would relinquish the right of Representation in the Legislature, a right inestimable to them and formidable to tyrants only.He has called together legislative bodies at places unusual, uncomfortable, and distant from the depository of their public Records, for the sole purpose of fatiguing them into compliance with his measures.He has dissolved Representative Houses repeatedly, for opposing with manly firmness his invasions on the rights of the people.He has refused for a long time, after such dissolutions, to cause others to be elected; whereby the Legislative powers, incapable of Annihilation, have returned to the People at large for their exercise; the State remaining in the mean time exposed to all the dangers of invasion from without, and convulsions within.He has endeavoured to prevent the population of these States; for that purpose obstructing the Laws for Naturalization of Foreigners; refusing to pass others to encourage their migrations hither, and raising the conditions of new Appropriations of Lands.He has obstructed the Administration of Justice, by refusing his Assent to Laws for establishing Judiciary powers.He has made Judges dependent on his Will alone, for the tenure of their offices, and the amount and payment of their salaries.He has erected a multitude of New Offices, and sent hither swarms of Officers to harrass our people, and eat out their substance.He has kept among us, in times of peace, Standing Armies without the Consent of our legislatures.He has affected to render the Military independent of and superior to the Civil power.He has combined with others to subject us to a jurisdiction foreign to our constitution, and unacknowledged by our laws; giving his Assent to their Acts of pretended Legislation: For Quartering large bodies of armed troops among us: For protecting them, by a mock Trial, from punishment for any Murders which they should commit on the Inhabitants of these States: For cutting off our Trade with all parts of the world: For imposing Taxes on us without our Consent: For depriving us in many cases, of the benefits of Trial by Jury: For transporting us beyond Seas to be tried for pretended offences For abolishing the free System of English Laws in a neighbouring Province, establishing therein an Arbitrary government, and enlarging its Boundaries so as to render it at once an example and fit instrument for introducing the same absolute rule into these Colonies: For taking away our Charters, abolishing our most valuable Laws, and altering fundamentally the Forms of our Governments: For suspending our own Legislatures, and declaring themselves invested with power to legislate for us in all cases whatsoever.He has abdicated Government here, by declaring us out of his Protection and waging War against us.He has plundered our seas, ravaged our Coasts, burnt our towns, and destroyed the lives of our people.He is at this time transporting large Armies of foreign Mercenaries to compleat the works of death, desolation and tyranny, already begun with circumstances of Cruelty & perfidy scarcely paralleled in the most barbarous ages, and totally unworthy the Head of a civilized nation.He has constrained our fellow Citizens taken Captive on the high Seas to bear Arms against their Country, to become the executioners of their friends and Brethren, or to fall themselves by their Hands.He has excited domestic insurrections amongst us, and has endeavoured to bring on the inhabitants of our frontiers, the merciless Indian Savages, whose known rule of warfare, is an undistinguished destruction of all ages, sexes and conditions.In every stage of these Oppressions We have Petitioned for Redress in the most humble terms: Our repeated Petitions have been answered only by repeated injury. A Prince whose character is thus marked by every act which may define a Tyrant, is unfit to be the ruler of a free people.Nor have We been wanting in attentions to our Brittish brethren. We have warned them from time to time of attempts by their legislature to extend an unwarrantable jurisdiction over us. We have reminded them of the circumstances of our emigration and settlement here. We have appealed to their native justice and magnanimity, and we have conjured them by the ties of our common kindred to disavow these usurpations, which, would inevitably interrupt our connections and correspondence. They too have been deaf to the voice of justice and of consanguinity. We must, therefore, acquiesce in the necessity, which denounces our Separation, and hold them, as we hold the rest of mankind, Enemies in War, in Peace Friends. We, therefore, the Representatives of the United States of America, in General Congress, Assembled, appealing to the Supreme Judge of the world for the rectitude of our intentions, do, in the Name, and by Authority of the good People of these Colonies, solemnly publish and declare, That these United Colonies are, and of Right ought to be Free and Independent States; that they are Absolved from all Allegiance to the British Crown, and that all political connection between them and the State of Great Britain, is and ought to be totally dissolved; and that as Free and Independent States, they have full Power to levy War, conclude Peace, contract Alliances, establish Commerce, and to do all other Acts and Things which Independent States may of right do. And for the support of this Declaration, with a firm reliance on the protection of divine Providence, we mutually pledge to each other our Lives, our Fortunes and our sacred Honor.`
        .toLowerCase()
        .replace(/[^\w\s]|_/g, '')
        .replace(/\s+/g, ' ')
        .split(' ');

        const buckets = new BucketContainer(sampleData);

        buckets.getContainer().forEach(bucket => {
            assert.equal(bucket.getSize(), sampleData.filter(n => n === bucket.getId()).length);
        });
        done();
    });

    it('should put string numbers, integers and floats of the same value into different groups', done => {
        const buckets = new BucketContainer([ 1, '1', 1.0, '1.000', 1.0000, '1', '1.00', '1.000' ]);

        assert.equal(buckets.getById(1).getSize(), 5);
        assert.equal(buckets.getById('1.00').getSize(), 1);
        assert.equal(buckets.getById('1.000').getSize(), 2);
        done();
    });

});

describe('Mutation functions', _ => {

    it('should scale values', done => {
        const buckets = new BucketContainer([ 1, 2, 2, 3, 3, 3, 4, 4, 4, 4 ]);

        buckets.scaleIds(2);
        assert.equal(buckets.getIds().join(''), '2468');
        buckets.scaleIds(.5);
        assert.equal(buckets.getIds().join(''), '1234');
        done();
    });

    it('should fill the gaps with increments of 10', done => {
        const buckets = new BucketContainer([ 10, 50 ]);
        buckets.fillGaps(10);

        assert.equal(buckets.getSize(), 5);
        done();
    });

    it('should remove duplicate buckets', done => {
        const buckets = new BucketContainer([1, 1.1, 1.2, 1.3 ]);
        buckets.mapIds(id => Math.floor(id));

        assert.equal(buckets.getIds().length, 1);
        assert.equal(buckets.getById(1).getId(), 1);
        assert.equal(buckets.getById(1).getSize(), 4);
        done();
    });

    it('should remove all the data', done => {
        const buckets = new BucketContainer([1, 1.1, 1.2, 1.3 ]);
        buckets.removeAll();

        assert.equal(buckets.getIds().length, 0);
        done();
    });

    it('should delete a single bucket', done => {
        const buckets = new BucketContainer([1, 1.1, 1.2, 1.3 ]);
        buckets.remove(buckets.getById(1.2));

        assert.equal(buckets.getIds().length, 3);
        done();
    });

});

describe('Statistic functions', _ => {

    it('should get the correct max id length', done => {
        const buckets = new BucketContainer([ 1, 2, 2, 3, 3, 3, 'hello' ]);

        assert.equal(buckets.getMaxIdLength(), 5);
        done();
    });

    it('should get the correct max bucket value', done => {
        const buckets = new BucketContainer([ 1, 2, 2, 3, 3, 3, 'hello', 3 ]);

        assert.equal(buckets.getMaxSize(), 4);
        done();
    });

});

describe('Display functions', _ => {

    it('should print a horizontal histogram', done => {
        const buckets = new BucketContainer([ 3, 2, 2, 3, 1, 3, 3, 3, 4, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 3, 3, 2, 2, 2 ]);
        buckets.mapIds(id => parseInt(id).toFixed(2));
        buckets.sortById();
        const expectedOutput = [
            '1.00 █████ 5',
            '2.00 ████████ 8',
            '3.00 █████████ 9',
            '4.00 ██ 2'
        ];

        buckets.printHorizontal()
        .forEach((line, index) => {
            assert.equal(line, expectedOutput[index]);
        });
        done();
    });

    it('should print a vertical histogram', done => {
        const buckets = new BucketContainer([ 4, 2, 2, 3, 3, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 5, 1 ]);
        buckets.mapIds(value => parseInt(value).toFixed(2));
        buckets.sortById();
        const expectedOutput = [
           ' 7 ┤------▄▄▄▄----------------',
           ' 6 ┤------████-▄▄▄▄-----------',
           ' 5 ┤------████-████-----------',
           ' 4 ┤------████-████-----------',
           ' 3 ┤------████-████-----------',
           ' 2 ┤------████-████-▄▄▄▄------',
           ' 1 ┤_▄▄▄▄_██▐█_████_████_▄▄▄▄_',
           '     1.00 2.00 3.00 4.00 5.00 '
        ];

        buckets.printVertical()
        .forEach((line, index) => {
            assert.equal(line, expectedOutput[index]);
        });
        done();
    });

});
