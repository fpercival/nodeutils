function copyarray(arr){
    var rt = [], i=0, obj, nobj;
    for(;i<arr.length; i++){
        obj = arr[i];
        if(obj instanceof Array){
            nobj = copyarray(obj);
        } else if(typeof obj == "object"){
            nobj = {};
            extend(nobj, obj);
        } else {
            nobj = obj;
        }
        rt.push(nobj);
    }
    return rt;
}

function extend(dst){
    var i, src, pn;
    for(i=1; i<arguments.length; i++){
        src = arguments[i];
        for(pn in src){
            if(src[pn] instanceof Array){
                dst[pn] = copyarray(src[pn]);
            } else if(typeof src[pn] == "object"){
                if(!src.__deepcop){
                    src.__deepcop=true;
                    if(typeof dst[pn] != "object"){
                        dst[pn] = {};
                    }
                    extend(dst[pn], src[pn]);
                    delete(src.__deepcop);
                }
            } else {
                dst[pn] = src[pn];
            }
        }
    }
}

module.exports = extend;
