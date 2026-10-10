export class Logger {
    static logLevel = Object.freeze({
        ERROR:0,
        WARN:1,
        DEBUG:2,
        VERBOSE:3,
    });
    constructor(name, level = Logger.logLevel.DEBUG, showFuncNames = true) {
        this.name = name;
        this.level = level;
        this.showFuncNames = showFuncNames;
    }
    static getLine(offset = 0){
        const funcName = Logger.getLine.name;
        const err = new Error();
        // remove the starting 'Error' line
        const lines = err.stack.split("\n").slice(1);
        const ln = lines.find(ln => !ln.includes(funcName));
        if (ln == undefined)
            return;
        const idx = lines.indexOf(ln);
        const callerLine = lines[idx+offset].trim();
        
        const parts = callerLine.trim().split(":");
        
        const parenStrip = /[\(\)]/g;
        const locationObj = {
            line: parts[parts.length - 2].replaceAll(parenStrip, ""),
            column: parts[parts.length - 1].replaceAll(parenStrip, "")
        }
        
        locationObj.func = callerLine.trim().split(" ")[1];
        // if it found the file, then its not a function call
        if (locationObj.func.includes("file://")) {
            locationObj.file = locationObj.func.split("://")[1];
            locationObj.func = undefined;
        } else {
            // still want the file data
            locationObj.file = callerLine.trim().split("(")[1]
                .split(")")[0].replace("file://", "");
        }
        // need to strip the ':line:column' from the data
        // for simplicity, we split it first, then operate on it
        locationObj.file = locationObj.file.split(":");
        locationObj.file = locationObj.file.slice(0, locationObj.file.length - 2).join(":");
        locationObj.file = locationObj.file.split("/");
        locationObj.file = locationObj.file[locationObj.file.length - 1];
        return locationObj;
    }
    locationObjStr(offset = 0) {
        const obj = Logger.getLine(1+offset);
        if (this.showFuncNames && obj.func != undefined)
            return `[${obj.func}() ${obj.file} ${obj.line}:${obj.column}]`
        return `[${obj.file} ${obj.line}:${obj.column}]`
    }
    
    static indentStr(indent) {
        let out = "";
        for (let i = 0; i < indent-1; i++)
            out += "    ";
        if (indent != 0)
            out += "    "
        return out;
    }
    nameStr(indent = 0) {
        return `${Logger.indentStr(indent)}[${this.name}]`;
    }
    verbose(message, indent = 0) {
        if (Logger.logLevel.VERBOSE <= this.level)
            console.log(this.nameStr(indent), '[VERBOSE]', this.locationObjStr(1), message);
    }
    debug(message, indent = 0) {
        if (Logger.logLevel.DEBUG <= this.level)
            console.debug(this.nameStr(indent), '[DEBUG]', this.locationObjStr(1), message);
    }
    warn(message, indent = 0) {
        if (Logger.logLevel.WARN <= this.level)
            console.warn(this.nameStr(indent), '[WARN]', this.locationObjStr(1), message);
    }
    error(message, indent = 0) {
        if (Logger.logLevel.ERROR <= this.level)
            console.error(this.nameStr(indent), '[ERROR]', this.locationObjStr(1), message);
    }
}