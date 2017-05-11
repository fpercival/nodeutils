var assert = require('assert');

var L = require('../index').log;

var log = console.log;
var info = console.info;
var err = console.error;
var warn = console.warn;

function pthru(cf, f){
    return function(){
//        cf.apply(console, arguments);
        f.apply(undefined, arguments);
    };
}

function overrideConsole(l, i, e, w){
    console.log = log;
    console.info = info;
    console.error = err;
    console.warn = warn;
    if(l) console.log = pthru(log, l);
    if(i) console.info = pthru(info, i);
    if(e) console.error = pthru(err, e);
    if(w) console.warn = pthru(warn, w);
}

function tstFunc(obj, fn){
    it('should have '+fn, function(){
        assert.notEqual(obj[fn], undefined);
        assert.equal(typeof obj[fn], 'function');
    });
}

describe('log', function() {

    it('should exist', function(){
        assert.notEqual(L, undefined);
    });

    tstFunc(L, 'setFilter');
    tstFunc(L, 'level');
    tstFunc(L, 'getLevel');
    tstFunc(L, 'setLevel');
    tstFunc(L, 'create');
    tstFunc(L, 'createHook');

    it('should get loggers', function(){
        let count=0;

        L.create('logger:1');
        L.create('logger:2');
        L.create('logger:3');
        L.create('logger:4');

        L.get(/logger.+/, function(lgr){
            count++;
        });

        L.get('logger:1', function(lgr){
            count++;
        });

        assert.equal(count, 5);

        assert.equal( L.get(/logger.+/).length, 4);
        assert.ok( L.get('logger:1') );
    });


    describe('scope logger', function(){
        let S = L.create('test');
        tstFunc(S, 'setFilter');
        tstFunc(S, 'level');
        tstFunc(S, 'getLevel');
        tstFunc(S, 'setLevel');
        S.setFilter('*');
        it('should debug', function( done ){
            overrideConsole(
                function(m){
                    assert.equal(arguments[0], 'debug');
                    assert.equal(arguments[1], 'test');
                    assert.equal(arguments[2], 'hi');
                    overrideConsole();
                    done();
                }
            );
            S.debug('hi');
            overrideConsole();
        });

        it('should info', function( done ){
            overrideConsole(
                null,
                function(m){
                    assert.notEqual(arguments[0].indexOf('info'), -1);
                    assert.equal(arguments[1], 'test');
                    assert.equal(arguments[2], 'hi');
                    overrideConsole();
                    done();
                }
            );
            S.info('hi');
            overrideConsole();
        });

        it('should error', function( done ){
            overrideConsole(
                null,
                null,
                function(m){
                    assert.notEqual(arguments[0].indexOf('error'), -1);
                    assert.equal(arguments[1], 'test');
                    assert.equal(arguments[2], 'hi');
                    overrideConsole();
                    done();
                }
            );
            S.error('hi');
            overrideConsole();
        });

        it('should warn', function( done ){
            overrideConsole(
                null,
                null,
                null,
                function(m){
                    assert.notEqual(arguments[0].indexOf('warn'), -1);
                    assert.equal(arguments[1], 'test');
                    assert.equal(arguments[2], 'hi');
                    overrideConsole();
                    done();
                }
            );
            S.warn('hi');
            overrideConsole();
        });
    });

});
