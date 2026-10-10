// example code to normalize the naming conventions of identifiers

// loop over all declarations and check to see what they are and reidentify them
import * as t from "@babel/types";
import {TransformObject} from "./transformClasses.js";
import { Logger } from "../src/logger.js";

const CASE_TYPE = Object.freeze({
    camelCase: 0,
    PascalCase: 1,
    snake_case: 2,
    SCREAM_SNAKE_CASE: 3,
});

function isCamelCase(str) {
    return (/^[a-z0-9]+([A-Z][a-z0-9]+)*?$/).test(str);
}

function isPascalCase(str) {
    return (/^([A-Z][a-z0-9]+)+?$/).test(str);
}

function isSnakeCase(str) {
    return (/^[a-z]+(_[a-z0-9]+)+?$/).test(str);
}

function isScreamSnakeCase(str) {
    return (/^[A-Z]+(_[A-Z0-9]+)+?$/).test(str);
}

function checkCase(str, caseType) {
    switch (caseType) {
        case CASE_TYPE.camelCase:
            return isCamelCase(str);
        case CASE_TYPE.PascalCase:
            return isPascalCase(str);
        case CASE_TYPE.snake_case:
            return isSnakeCase(str);
        case CASE_TYPE.SCREAM_SNAKE_CASE:
            return isScreamSnakeCase(str);
    }
}

function parseWords(str) {
    const words = []
    const matches = str.matchAll(/(([A-Z]?[a-z0-9]+)|[A-Z0-9]+)/g);
    for (const match of matches)
        words.push(match[0]);
    return words;
}

function capitalCase(str)  {
    return str.slice(0,1).toUpperCase()+str.slice(1).toLowerCase();
}

function rebuildCase(str, caseType) {
    const words = parseWords(str);
    switch (caseType) {
        case CASE_TYPE.camelCase:
            return words[0].toLowerCase()+words.slice(1).map(val => capitalCase(val)).join("");
        case CASE_TYPE.PascalCase:
            return words.map(val => capitalCase(val)).join("");
        case CASE_TYPE.snake_case:
            return words.map(val => val.toLowerCase()).join("_");
        case CASE_TYPE.SCREAM_SNAKE_CASE:
            return words.map(val => val.toUpperCase()).join("_");
    }
}

const typeMap = {
    VariableDeclarator: "Variables",
    FunctionDeclaration: "Functions",
    ClassDeclaration: "Classes",
}
class IdentifierNormalizer extends TransformObject {
    static types = CASE_TYPE;
    constructor() {
        super();
        this.name = "Identifier Normalizer";
        this.settings = {
            IndentLevel: 2,
            LogLevel: Logger.logLevel.DEBUG,
            LengthCutoff: 4,
            Variables: CASE_TYPE.camelCase,
            Functions: CASE_TYPE.camelCase,
            Classes: CASE_TYPE.PascalCase,
        }
        this.log = new Logger("Identifier Normalizer", this.settings.LogLevel, false);
    }
    getTransform() {
        this.log.level = this.settings.LogLevel;
        const self = this;
        return {
            "VariableDeclarator|FunctionDeclaration|ClassDeclaration"(path) {
                // maps the type of identifier we want to check against
                const type = self.settings[typeMap[path.node.type]];
                if (!t.isIdentifier(path.node.id)) {
                    self.log.verbose("Couldnt find identifier", self.settings.IndentLevel);
                    return;
                }
                const identifier = path.node.id;
                if (identifier.name.length <= self.settings.LengthCutoff) {
                    self.log.verbose("Identifier name is below cut-off range", self.settings.IndentLevel);
                    return;
                }
                if (checkCase(identifier.name, type)) {
                    self.log.verbose("Identifier is already following conventions", self.settings.IndentLevel);
                    return;
                }
                const oldName = identifier.name;
                const newName = rebuildCase(oldName, type);
                const bindings = path.scope.getBinding(newName);
                if (bindings != undefined){
                    self.log.warn(`Cant replace (${oldName}), (${newName}) is already in use!`, self.settings.IndentLevel);
                    return;
                }
                self.log.debug(`Replacing (${oldName}) with (${newName})`, self.settings.IndentLevel);
                path.scope.rename(oldName, newName);
            }
        }
    }
}
export {IdentifierNormalizer};