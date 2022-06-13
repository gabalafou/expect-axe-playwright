"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.poll = void 0;
const test_1 = __importDefault(require("@playwright/test"));
function getTimeout(timeout) {
    var _a, _b, _c;
    return (_c = timeout !== null && timeout !== void 0 ? timeout : (_b = (_a = test_1.default.info()) === null || _a === void 0 ? void 0 : _a.project.expect) === null || _b === void 0 ? void 0 : _b.timeout) !== null && _c !== void 0 ? _c : 5000;
}
async function poll(locator, timeout, predicate) {
    let result = null;
    let expired = false;
    const timer = setTimeout(() => {
        expired = true;
    }, getTimeout(timeout));
    try {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            if (expired)
                return result;
            result = await predicate();
            if (expired || result.ok)
                return result;
            // TODO: Figure out a non-flaky way to use RAF.
            // await locator.evaluate(() => new Promise(requestAnimationFrame))
            await locator.evaluate(() => new Promise((resolve) => setTimeout(resolve, 250)));
        }
    }
    catch (e) {
        // Nothing to do here.
    }
    finally {
        clearTimeout(timer);
    }
    return result;
}
exports.poll = poll;
