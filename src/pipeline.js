import traverse from "@babel/traverse";
import { parse } from "@babel/parser";
import { generate } from "@babel/generator";
import * as Logger from "./logger.js";

import * as fileHelper from "./FileSystem/fileReaderWriter.js";

const codeGenSettings = {
    comments: true
}
const log = new Logger.Logger("Pipeline", Logger.logLevel.DEBUG);
function process(code, pass, filename) {
    // console.log(pass);
    const ast = parse(code, {sourceType: "unambiguous"});
    traverse(ast, pass);
    const generated = generate(ast, {sourceMaps: true, sourceFileName: filename});
    return generated.code;
}
function performPass(code, pipeline, filename) {
    for (const pass of pipeline) {
        log.log(`Processing ${pass.name}`, 1)
        code = process(code, pass.transform, filename);
    }
    return code;
};

function processPipeline(targets, pipeline) {
    targets.forEach((target) => {
        log.log(`Running passes on ${target.readTarget}`);
        const code = fileHelper.readFile(target.readTarget);
        fileHelper.writeFile(target.writeTarget, performPass(code, pipeline, target.readTarget));
    });
}

export {
    processPipeline,
    codeGenSettings
};