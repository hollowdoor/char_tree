char-tree
===

Install
---

`npm install char-tree`

Usage
---

```javascript
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
//Add the array with .push()
ct.push(...data);

console.log(ct.findAll('t'));
//[ 'The Thing', 'The Terminator', 'The Shining' ]
console.log(ct.match('t'));
/*
{ tree:
   { branches: { h: [Object] },
     items: [ 'The Thing', 'The Terminator', 'The Shining' ],
     value: 'T' },
  string: 'T',
  value: 't' }
*/
//The second argument is a separator for words/phrases
console.log(ct.nextPhrase('t', /[ ]+/));
//The
```

About
---

A `CharTree` instance is a [trie](https://en.wikipedia.org/wiki/Trie) structure for finding one, or any phrases in an array that match a string prefix of any length.
