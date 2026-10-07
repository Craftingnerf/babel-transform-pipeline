import * as fileHelper from "./fileReaderWriter.js";

function formatArguments(args) {
    // expecting the args object from the src/argsParsing file
    const processTargets = [];
    for (const dir of args.targetFolders) {
        fileHelper.getAllChildFiles(dir).forEach((file) => {
            processTargets.push({
                readTarget: file,
                writeTarget: fileHelper.joinPaths(args.outputDir, file)
            })
        })
    }
    return processTargets;
}

export {
    formatArguments
}