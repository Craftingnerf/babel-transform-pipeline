import { file } from "@babel/types";
import fs from "fs";
import path from "path";

// just for easier readability;
function doesExist(filePath) {
    return fs.existsSync(filePath);
}
function createDir(filePath) {
    if (!doesExist(getPathToFile(filePath)))
        createDir(getPathToFile(filePath));
    return fs.mkdirSync(filePath);
}
function isFile(filePath) {
    if (!fs.existsSync(filePath))
        return false;
    return fs.lstatSync(filePath).isFile();
}
function isDir(filePath) {
    if (!fs.existsSync(filePath))
        return false;
    return fs.lstatSync(filePath).isDirectory();
}
function getPathToFile(filePath) {
    // console.log(path.dirname(filePath));
    // console.log(path.basename(filePath));
    // console.log(path.extname(filePath));
    
    return path.dirname(filePath);
}

// I know the arguments variable is frowned upon
// but too bad
function joinPaths() {
    return path.join(...arguments);
}


// return an array of filepaths 
// OR undefined if it doesnt exist or isnt a directory
function getDirFiles(filePath) {
    if (!isDir(filePath))
        return undefined;
    return fs.readdirSync(filePath)
        .map(filename => { return joinPaths(filePath, filename); })
}

// recursive function to find all the child files
function getAllChildFiles(filePath) {
    if (!isDir(filePath))
        return;
    return fs.readdirSync(filePath)
        .map(filename => { return joinPaths(filePath, filename); })
        .flatMap(filename => { 
            if (isDir(filename))
                return getAllChildFiles(filename);
            return filename
        });
}

// read/write file helpers
function readFile(filePath, encoding = "utf-8") {
    if (!isFile(filePath))
        return undefined;
    return fs.readFileSync(filePath, encoding);
}
function writeFile(filePath, data, encoding = "utf-8") {
    if (!doesExist(getPathToFile(filePath)))
        createDir(getPathToFile(filePath));
    if (doesExist(filePath) && !isFile(filePath))
        return undefined;
    return fs.writeFileSync(filePath, data, encoding);
}

export {
    readFile, 
    writeFile,
    getDirFiles,
    getPathToFile,
    joinPaths,
    isFile,
    isDir,
    getAllChildFiles,
}