
function printUsage() {
    console.log("Useage: node index.js -o [Output] [Directories]");
    console.log("");
    // console.log("Options:");
    // console.log("    -o [Directory] - Specify output directory");
}

function quitWithUseage(message) {
    console.log(message);
    printUsage();
    quitWithMessage("",1);
}

function quitWithMessage(message, code=0) {
    console.log(message);
    process.exit(code);
}

// formatted like the following
// {line: Num, column: Num}
function locToString(loc) {
    return `${loc.line}:${loc.column}`;
}

export {
    printUsage,
    quitWithUseage,
    quitWithMessage,
    locToString,
}