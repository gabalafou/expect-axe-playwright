"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBeAccessible = void 0;
const test_1 = __importDefault(require("@playwright/test"));
const merge_deep_1 = __importDefault(require("merge-deep"));
const axe_reporter_html_1 = __importDefault(require("axe-reporter-html"));
const attachments_1 = require("../../utils/attachments");
const axe_1 = require("../../utils/axe");
const matcher_1 = require("../../utils/matcher");
const poll_1 = require("../../utils/poll");
const summarize = (violations) => violations
    .map((violation) => `${violation.id}(${violation.nodes.length})`)
    .join(', ');
async function toBeAccessible(handle, { timeout, ...options } = {}) {
    try {
        const locator = (0, matcher_1.resolveLocator)(handle);
        await (0, axe_1.injectAxe)(locator);
        const info = test_1.default.info();
        const opts = (0, merge_deep_1.default)(info.project.use.axeOptions, options);
        const { ok, results } = await (0, poll_1.poll)(locator, timeout, async () => {
            const results = await (0, axe_1.runAxe)(locator, opts);
            return {
                ok: !results.violations.length,
                results,
            };
        });
        // Attach additional files to the HTML report for CI and for visibility into
        // any issues:
        // - HTML report
        // - JSON used to generate the HTML report
        // - Accessibility Tree of the page
        // Attach HTML report
        const html = await (0, axe_reporter_html_1.default)(results);
        const filename = opts.filename || 'axe-report.html';
        await (0, attachments_1.attach)(info, filename, html);
        // Attach JSON used to generate the HTML report
        const json = JSON.stringify(results, null, 2);
        const jsonFilename = 'axe-report.json';
        await (0, attachments_1.attach)(info, jsonFilename, json);
        // Attach accessibility tree
        const page = locator.page();
        const accessibilityTree = await page.accessibility.snapshot();
        const accessibilityTreeJson = JSON.stringify(accessibilityTree, null, 2);
        const treeFilename = 'accessibility-tree.json';
        await (0, attachments_1.attach)(info, treeFilename, accessibilityTreeJson);
        return {
            pass: ok,
            message: () => {
                return (this.utils.matcherHint('toBeAccessible', undefined, undefined, this) +
                    '\n\n' +
                    'Expected: No violations\n' +
                    `Received: ${results.violations.length} violations\n\n` +
                    `Violations: ${summarize(results.violations)}`);
            },
        };
    }
    catch (err) {
        return {
            pass: false,
            message: () => err.message,
        };
    }
}
exports.toBeAccessible = toBeAccessible;
