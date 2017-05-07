# nodeutils
My node helpers

## Install

    npm install https://github.com/fpercival/nodeutils.git

## Usage

### extend
Extend object from other objects

    let extend = require('nodeutils').extend;

    let dest = {x:4, y:20};
    extend(dest, {z:20}, {y:5});

    assert.equal(dest.y, 5);
    assert.equal(dest.z, 20);


### nextr
Ensures functions are called synchronously.

Signature: nextr( items, eachFunc, doneFunc )

-items: Array of items to be processed

-eachFunc: function called for each item. Function is passed the current item and a function to call when processing is complete. If the 'next' function is passed 'true', the processing is cancelled and doneFunc is called if provided.

-doneFunc: (optional) function called after all items have been processed.




    let nextr = require('nodeutils').nextr;

    const arr = [1, 2, 5, 4];
    let res = '';
    nextr(
        arr,
        function(item, next){
            setTimeout( function(){
                res = res + item;
                console.log(res);
                next();
            }, 100);
        },
        function(){
            console.log('result: '+res);
        },
    );
    // Prints
    // '1'
    // '12'
    // '125'
    // '1254'
    // 'result: 1254'

### log
A scoped logger that can filtered globally or within each scope.

Global logger

The global logger emits events for messages based on level.

    let log = require('nodeutils').log;

    function toConsole(){ console.log.apply(console, arguments); };

    log.on('debug', toConsole );
    log.on('warn', toConsole );
    log.on('info', toConsole );
    log.on('error', toConsole );

Scoped logger

    let log1 = log.create('log:scope1');
    log1.debug('debug info');
    log1.warn('Watch out !!');
    log1.info('FYI');
    log1.error('Something went wrong', new Error('oops') );

Set logging level

Log level can be set globally or seperately per scope. Default level is 'debug'

    log.setLevel('debug');  // emits debug, warn, info & error
    log.setLevel('warn');  // emits warn, info & error
    log.setLevel('info');  // emits info & error
    log.setLevel('error');  // emits error
    log.setLevel('none');  // emits no messages

Filtering

Messages can be filtered based on the scope name.

    let log1 = log.create('log:scope1');
    let log2 = log.create('log:scope2');

    // Using a wildcard
    log.setFilter('log:*'); // Will emit messages from log1 & log2
    log.setFilter('*scope2'); // Will only emit messages from log2




