import traverse from "@babel/traverse";
import { parse } from "@babel/parser";
import { generate } from "@babel/generator";

import * as fileHelper from "./FileSystem/fileReaderWriter.js";

function process(code, pass) {
    const ast = parse(code, {sourceType: "unambiguous"});
    traverse(ast, pass);
    return generate(ast).code;
}
function performPass(code, pipeline) {
    for (const pass of pipeline) {
        console.log(`    Processing ${pass.name}`)
        code = process(code, pass.transform);
    }
    return code;
};

function processPipeline(targets, pipeline) {
    targets.forEach((target) => {
        console.log(`Performing passes on ${target.readTarget}`);
        const code = fileHelper.readFile(target.readTarget);
        fileHelper.writeFile(target.writeTarget, performPass(code, pipeline));
    });
}

export {
    processPipeline
};