// example code to normalize the naming conventions of identifiers

// loop over all declarations and check to see what they are and reidentify them
import * as t from "@babel/types";
import {locToString} from "./../utils.js"

export const CASE_TYPE = Object.freeze({
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

export function getSettings() {
    return {
        LengthCuttoff: 4,
        Variables: CASE_TYPE.camelCase,
        Functions: CASE_TYPE.camelCase,
        Classes: CASE_TYPE.PascalCase,
    }
}
const typeMap = {
    VariableDeclarator: "Variables",
    FunctionDeclaration: "Functions",
    ClassDeclaration: "Classes",
}
export function getTransform(settings = getSettings()) {
    return {
        name: "Identifier Normalizer",
        transform: {
            "VariableDeclarator|FunctionDeclaration|ClassDeclaration"(path) {
                const type = settings[typeMap[path.node.type]];
                if (!t.isIdentifier(path.node.id))
                    return;
                const identifier = path.node.id;
                if (identifier.name.length <= settings.LengthCuttoff)
                    return;
                if (checkCase(identifier.name, type))
                    return;
                const oldName = identifier.name;
                const newName = rebuildCase(oldName, type)
                console.log(`[Identifier Normalizer] Replacing (${oldName}) with (${newName})`);
                path.scope.rename(oldName, newName);
            }
        }
    }
}