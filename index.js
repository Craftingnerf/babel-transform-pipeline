import { parseArgs, checkRequred } from "./src/argsParsing.js";
import { formatArguments } from "./src/FileSystem/formatArgs.js";
import { processPipeline, codeGenSettings } from "./src/pipeline.js";
import { IdentifierNormalizer } from "./transforms/index.js"
import { Logger } from "./src/logger.js";
// get the arguments we need
const args = parseArgs();
// make sure we have the minimum required arguments to run
checkRequred(args);
const targets = formatArguments(args);
const identifierNormalizer = new IdentifierNormalizer()
identifierNormalizer.settings.Functions = IdentifierNormalizer.types.snake_case;
// identifierNormalizer.settings.logLevel = Logger.logLevel.WARN;
const pipeline = [identifierNormalizer];
processPipeline(targets, pipeline);



