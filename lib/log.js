const EventEmitter = require("events");
const util = require('util');

const logLevels = ["debug", "warn", "info", "error", "none"];

const defaultLevel = 0;

function getLevel(lvl){
    let rt = defaultLevel;
    if(!lvl){
        return rt;
    }
    if(typeof lvl == "string"){
        rt = logLevels.indexOf(lvl.toLowerCase());
        if(rt<0){
            rt = Number(lvl);
        }
    } else {
        rt = Number(lvl);
    }
    if(rt == Number.NaN || rt<0 || rt>(logLevels.length-1)){
        rt = defaultLevel;
    }
    return rt;
}

function buildFilters(filterString){
    let rt = filterString.split(',');
    let res=[];
    rt = rt.map(
            f=>{
            f = f.trim();
    if(f.length){
        res.push( RegExp(f.trim().replace(/\*/gi, '.+')) );
    }
}
)
    return res;
}

function check(loglevel, level, name, filters){
    if(level<loglevel){
        return false;
    }
    if(filters && filters.length){
        for(let i=0; i<filters.length; i++){
            let rx = filters[i];
            rx.lastIndex=0;
            let ok = rx.test(name)
            if(ok){
                return true;
            }
        }
    }
    return false;
}

function dolog(emitter, filters, loglevel, level, loggerName, args){
    if(check(loglevel, level, loggerName, filters)){
        if(level<4){
            let lname = logLevels[level];
            let fname = lname;
            let a = [].slice.apply(args);
            if(level==0){
                fname="log"
            }
            a.unshift(loggerName);
            if(level==3) lname = "\x1b[31m" + lname; // Error = red
            if(level==2) lname = "\x1b[34m" + lname; // Info = blue
            if(level==1) lname = "\x1b[33m" + lname; // Warn = yellow
            a.unshift(lname);
            if(level>0) a.push("\x1b[0m");
            if(!emitter.ignoreConsole){
                console[fname].apply(console, a);
            }
            emitter.emit.apply(emitter, a);
        }
        return true;
    }
    return false;
};

function appendFilters(orig, newFilterString){
    let nf = buildFilters(newFilterString);
    nf.forEach(function(element) {
        orig.push(element);
    });
}

function LogMaster(){
    let self = this;
    EventEmitter.call(this);
    let filters = [];
    let loglevel = defaultLevel;

    function log(level, loggerName, args){
        dolog(self, filters, loglevel, level, loggerName, args);
        runHooks(level, loggerName, args);
    }

    this.setFilter = function(filterString){
        filters=[];
        appendFilters(filters, filterString);
    };
    this.setFilter('*');

    this.level = function(){
        return loglevel;
    };

    this.getLevel = function(){
        return logLevels[loglevel];
    };

    this.setLevel = function(newLevel){
        loglevel = getLevel(newLevel);
    };

    this.create = function(loggerName, uselevel){
        return new Logger(self, log, runHooks, loggerName, uselevel);
    };

    let hooks = [];
    function registerHook(hook, logFn){
        hooks.push(logFn);
    };

    function runHooks(level, name, args){
        hooks.forEach(
            f => {
            f(level, name, args);
    }
    );
    };

    this.createHook = function(){
        return new HookLogger(self, registerHook );
    };

}
util.inherits(LogMaster, EventEmitter);

function Logger(master, logfn, hookFn, loggerName, uselevel) {
    let self = this;
    let filters = [];
    let name = loggerName;
    let loglevel = uselevel != undefined ? getLevel(uselevel) : master.level();

    this.setFilter = function (filterString) {
        filters=[];
        appendFilters(filters, filterString);
    };

    function log(level, args) {
        let rt;
        rt = dolog(master, filters, loglevel, level, name, args);
        if (!rt && typeof logfn == "function") {
            rt == logfn(level, name, args);
        } else {
            hookFn(level, name, args);
        }
    }

    this.level = function () {
        return loglevel;
    };

    this.getLevel = function () {
        return logLevels[loglevel];
    };

    this.setLevel = function (newLevel) {
        loglevel = getLevel(newLevel);
    };

    logLevels.forEach(
        (lname, llevel) => {
        this[lname] = function (){
            log(llevel, arguments);
        };
    });
}

function HookLogger(master, registerFn){
    let self = this;
    EventEmitter.call(this)
    let filters = [];

    appendFilters(filters, '*');

    this.setFilter = function(filterString){
        filters=[];
        appendFilters(filters, filterString);
    };

    function log(level, name, args){
        this.ignoreConsole = true;
        dolog(self, filters, 0, level, name, args);
    }

    registerFn(this, log);
}
util.inherits(HookLogger, EventEmitter);

const logHub = new LogMaster();

module.exports = logHub;


