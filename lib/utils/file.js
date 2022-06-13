"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFile = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
async function readFile(filename) {
    const filePath = path_1.default.join(__dirname, '../config/templates', filename);
    return fs_1.default.promises.readFile(filePath, { encoding: 'utf-8' });
}
exports.readFile = readFile;
