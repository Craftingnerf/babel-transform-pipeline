import { quitWithUseage } from "./utils.js";

const settingsObject = {
    process: null,
    file: null,
    targetFolders: [],
    outputDir: null
}

export function checkRequred(args) {
    if (args.targetFolders.length == 0) {
        quitWithUseage("No folders to target!");
    }
    if (args.outputDir == null) {
        quitWithUseage("No output directory given!");
    }
}

export function parseArgs() {
    // make a clone of the object
    const newSettings = {...settingsObject}
    // the process name is always the first arg
    newSettings.process = process.argv[0];
    newSettings.file = process.argv[1];
    // parse the args
    const args = process.argv.slice(2); // skip the process name
    let outFlag = false;
    for (const arg of args) {
        if (outFlag) {
            newSettings.outputDir = arg;
            outFlag = false;
        } else {
            outFlag = (arg == "-o");
            if (outFlag)
                continue;
            newSettings.targetFolders.push(arg);
        }
    }
    return newSettings;
}
