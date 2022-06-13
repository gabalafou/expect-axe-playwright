"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveLocator = void 0;
function isLocator(value) {
    return value.constructor.name === 'Locator';
}
function resolveLocator(handle) {
    return isLocator(handle) ? handle : handle.locator('body');
}
exports.resolveLocator = resolveLocator;
