var assert = require('assert');

var extend = require('../index').extend;

describe('extend', function() {

    it('should exist', function(){
        assert.notEqual(extend, undefined);
    });

    it('should extend', function(){
        var a = {a:2}, b={b:5};
        extend(a, b);
        assert.equal(a.a, 2);
        assert.equal(a.b, 5);
    });

    it('should overwrite', function(){
        var a = {a:2, b:10}, b={b:5};
        extend(a, b);
        assert.equal(a.a, 2);
        assert.equal(a.b, 5);
    });

    it('should extend deep', function(){
        var a = {a:2, b:10}, b={b: { c:5, d:{e:10}}};
        extend(a, b);
        assert.equal(a.b.c, 5);
        assert.equal(a.b.d.e, 10);
        assert.equal(JSON.stringify(b).indexOf('__deepcop'), -1);
    });

    it('should override deep', function(){
        var a = {a:2, b:{c:4, d:2, f:8}}, b={b: { c:5, d:{e:10}}};
        extend(a, b);
        assert.equal(a.b.c, 5);
        assert.equal(a.b.d.e, 10);
        assert.equal(a.b.f, 8);
    });

    it('should copy array', function(){
        var a = {a:2, b:{c:4, d:2, f:8}}, b={b: [2, {a:4}]};
        extend(a, b);
        assert.equal(a.a, 2);
        assert.equal(a.b[0], 2);
        assert.equal(a.b[1].a, 4);
    });

    it('should deep copy array', function(){
        var a = {a:2, b:{c:4, d:2, f:8}}, b={b: [2, [3, [4, {a:8}]]]};
        extend(a, b);
        assert.equal(a.a, 2);
        assert.equal(a.b[0], 2);
        assert.equal(a.b[1][0], 3);
        assert.equal(a.b[1][1][0], 4);
        assert.equal(a.b[1][1][1].a, 8);
    });

});