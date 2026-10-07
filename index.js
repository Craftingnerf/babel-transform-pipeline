import { parseArgs, checkRequred } from "./src/argsParsing.js";
import { formatArguments } from "./src/FileSystem/formatArgs.js";
import { processPipeline } from "./src/pipeline.js";
import { identifierNormalizer } from "./src/transforms/index.js"

// get the arguments we need
const args = parseArgs();
// make sure we have the minimum required arguments to run
checkRequred(args);
const targets = formatArguments(args);
const identifierSettings = identifierNormalizer.getSettings();
identifierSettings.Functions = identifierNormalizer.CASE_TYPE.snake_case;
const pipeline = [identifierNormalizer.getTransform(identifierSettings)];
processPipeline(targets, pipeline);



