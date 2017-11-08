const CharTree = require('../').CharTree;
let data = [
    'The Thing',
    'The Terminator',
    'Super man',
    'Legend of Sleepy Hollow',
    'The Shining',
    'Fifty Shades of Grey'
];

const ct = new CharTree();
ct.push(...data);

console.log(ct.findAll('t'));
console.log(ct.match('t'));
console.log(ct.nextPhrase('t', /[ ]+/));
