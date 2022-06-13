"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAxe = exports.injectAxe = void 0;
const fs_1 = __importDefault(require("fs"));
/**
 * Injects the axe-core script into the page if it hasn't already been injected.
 */
async function injectAxe(locator) {
    // Exit early if Axe has already been injected.
    if (await locator.evaluate(() => !!window.axe)) {
        return;
    }
    // Read the source code from the axe-core library
    const filePath = require.resolve('axe-core/axe.min.js');
    const axe = await fs_1.default.promises.readFile(filePath, 'utf-8');
    // Inject the script into the page
    await locator.evaluate((_, axe) => window.eval(axe), axe);
}
exports.injectAxe = injectAxe;
/**
 * Runs axe on an element handle. The script must already be injected
 * using `injectAxe`.
 */
function runAxe(locator, options = {}) {
    return locator.evaluate((el, options) => window.axe.run(el, options), options);
}
exports.runAxe = runAxe;
