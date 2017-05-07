function nextr(items, mainFunc, doneFunc ){
    var i=-1;
    function nxt(cancel){
        i++;
        if(i<items.length && !cancel){
            mainFunc( items[i], nxt, i );
        } else {
            if(doneFunc) doneFunc(i);
        }
    }
    nxt();
}

module.exports = nextr;

