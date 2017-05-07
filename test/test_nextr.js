var assert = require('assert');

var nextr = require('../index').nextr;

describe('nextr', function() {

    it('should exist', function(){
        assert.notEqual(nextr, undefined);
    });

    it('should itterate whole array', function(done){
        var arr = [1,2,3,4];
        var count=0;
        nextr(arr,
            function(itm, next, indx){ count++; next(); },
            function(cnt){
                assert.equal(count, arr.length );
                done();
            }
        );
    });

    it('should itterate null values', function(done){
        var arr = [1,2,null,4];
        var count=0;
        nextr(arr,
            function(itm, next, indx){ count++; next(); },
            function(cnt){
                assert.equal(count, arr.length );
                done();
            }
        );
    });

    it('should be stoppable', function(done){
        var arr = [1,2,3,4];
        var count=0;
        nextr(arr,
            function(itm, next, indx){
                count++;
                if(count==2){
                    next(true);
                } else {
                    next();
                }
            },
            function(cnt){
                assert.equal(count, 2);
                done();
            }
        );
    });

});
