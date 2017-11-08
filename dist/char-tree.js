(function (exports) {
'use strict';

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var arguments$1 = arguments;

	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments$1[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

var CharTree = function CharTree(){
    this.tree = {branches: {}, items: []};
};
CharTree.prototype.empty = function empty (){
    this.tree = {branches: {}, items: []};
};
CharTree.prototype.push = function push (){
        var this$1 = this;
        var datas = [], len = arguments.length;
        while ( len-- ) datas[ len ] = arguments[ len ];

    datas.forEach(function (data){

        var next = this$1.tree;
        var list = data.split('');

        list.forEach(function (ch){
            var key = ch.toLowerCase();
            next = (next.branches[key] = next.branches[key] || Object.create(null));
            next.branches = next.branches || Object.create(null);
            next.items = next.items || [];
            next.items.push(data);
            next.value = ch;
        });

        next.leaf = true;
    });
};
CharTree.prototype.remove = function remove (){
        var this$1 = this;
        var datas = [], len = arguments.length;
        while ( len-- ) datas[ len ] = arguments[ len ];

    datas.forEach(function (data){
        var next = this$1.tree, last;
        var list = data.split('');

        for(var i=0; i<list.length; i++){
            var char = list[i];
            var key = char.toLowerCase();
            var index = (void 0);

            last = next;
            next = next.branches[key];

            if(next === void 0) { break; }

            if((index = next.items.indexOf(data.value)) !== -1){
                next.items.splice(index, 1);
                if(!next.items.length){
                    delete last.branches[key];
                }else{
                    next = next.branches[key];
                }
            }

        }
    });
};
CharTree.prototype.match = function match (value){
    var list = value.split('').map(function (v){ return v.toLowerCase(); });

    var next = this.tree,
        len = list.length + 1,
        last,
        string = '';

    if(!list.length) { return {tree: null, string: string, value: value}; }

    for(var i=0; i<len; i++){
        last = next;
        next = next.branches[list[i]];
        if(!next){
            if(list[i] !== void 0) { last = null; }
            break;
        }else{
            string += next.value;
        }
    }

    return {tree: last, string: string, value: value};
};
CharTree.prototype.findAll = function findAll (value){
    var ref = this.match(value);
        var tree = ref.tree;
    if(!tree) { return []; }
    return [].concat(tree.items);
};
CharTree.prototype.nextPhrase = function nextPhrase (value, sep){

    var ref = this.match(value);
        var tree = ref.tree;
        var string = ref.string;
        var result = string;

    var iter = function (next){

        if(next.leaf){
            return result;
        }

        var keys = Object.keys(next.branches);
        for(var key in next.branches){
            if(sep.test(key)){
                return result + key;
            }
            result += next.branches[key].value;
            return iter(next.branches[key])

        }
    };

    return iter(tree);
};

function charTreeMixin(dest){
    return objectAssign(dest, {
        nextPhrase: function nextPhrase(value, sep){
            return this.charTree.nextPhrase(value, sep);
        },
        match: function match(value){
            if ( value === void 0 ) value = '';

            return this.charTree.match(value);
        },
        findAll: function findAll(value){
            return this.charTree.findAll(value);
        },
        push: function push(){
            var this$1 = this;
            var values = [], len = arguments.length;
            while ( len-- ) values[ len ] = arguments[ len ];

            values.forEach(function (value){
                this$1.charTree.push(value);
            });
            return this;
        },
        pushAll: function pushAll(values){
            (ref = this.charTree).push.apply(ref, values);
            var ref;
        },
        empty: function empty(){
            this.charTree.empty();
            return this;
        },
        initCharTree: function initCharTree(){
            return this.charTree = new CharTree();
        }
    });
}

exports.CharTree = CharTree;
exports.charTreeMixin = charTreeMixin;

}((this.charTree = this.charTree || {})));
//# sourceMappingURL=char-tree.js.map
