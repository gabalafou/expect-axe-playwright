"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachmentExists = exports.attach = void 0;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const test_1 = require("@playwright/test");
async function attach(info, name, data) {
    const outPath = path_1.default.join(info.outputPath(), name);
    await promises_1.default.writeFile(outPath, data, 'utf8');
    // So..., Playwright says not to do this, but `TestInfo.attach` hashes the
    // filename making the user experience pretty terrible.
    info.attachments.push({
        name,
        path: outPath,
        contentType: `application/${path_1.default.extname(name)}`,
    });
}
exports.attach = attach;
function attachmentExists(name) {
    return test_1.test.info().attachments.some((attachment) => attachment.name === name);
}
exports.attachmentExists = attachmentExists;
