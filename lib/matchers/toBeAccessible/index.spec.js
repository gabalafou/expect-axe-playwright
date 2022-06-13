"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const attachments_1 = require("../../utils/attachments");
const file_1 = require("../../utils/file");
const promises_1 = __importDefault(require("fs/promises"));
test_1.test.describe.parallel('toBeAccessible', () => {
    test_1.test.describe('page', () => {
        (0, test_1.test)('positive', async ({ page }) => {
            const content = await (0, file_1.readFile)('accessible.html');
            await page.setContent(content);
            await (0, test_1.expect)(page).toBeAccessible();
        });
        (0, test_1.test)('negative', async ({ page }) => {
            test_1.test.fail();
            const content = await (0, file_1.readFile)('inaccessible.html');
            await page.setContent(content);
            await (0, test_1.expect)(page).toBeAccessible({ timeout: 2000 });
        });
    });
    test_1.test.describe('frame locators', () => {
        (0, test_1.test)('positive', async ({ page }) => {
            const content = `<iframe src="http://localhost:${process.env.SERVER_PORT}/accessible.html">`;
            await page.setContent(content);
            await (0, test_1.expect)(page.frameLocator('iframe')).toBeAccessible();
        });
        (0, test_1.test)('negative', async ({ page }) => {
            test_1.test.fail();
            const content = `<iframe src="http://localhost:${process.env.SERVER_PORT}/inaccessible.html">`;
            await page.setContent(content);
            await (0, test_1.expect)(page.frameLocator('iframe')).toBeAccessible({
                timeout: 2000,
            });
        });
    });
    test_1.test.describe('frame', () => {
        (0, test_1.test)('positive', async ({ page }) => {
            const content = `<iframe src="http://localhost:${process.env.SERVER_PORT}/accessible.html">`;
            await page.setContent(content);
            const iframe = await page.$('iframe');
            const frame = await iframe.contentFrame();
            await (0, test_1.expect)(frame).toBeAccessible();
        });
        (0, test_1.test)('negative', async ({ page }) => {
            test_1.test.fail();
            const content = `<iframe src="http://localhost:${process.env.SERVER_PORT}/inaccessible.html">`;
            await page.setContent(content);
            const iframe = await page.$('iframe');
            const frame = await iframe.contentFrame();
            await (0, test_1.expect)(frame).toBeAccessible({ timeout: 2000 });
        });
    });
    test_1.test.describe('locator', () => {
        (0, test_1.test)('positive', async ({ page }) => {
            await page.setContent('<button id="foo">Hello</button>');
            await (0, test_1.expect)(page.locator('#foo')).toBeAccessible();
        });
        (0, test_1.test)('negative', async ({ page }) => {
            test_1.test.fail();
            await page.setContent('<button id="foo"></button>');
            await (0, test_1.expect)(page.locator('#foo')).toBeAccessible({ timeout: 2000 });
        });
    });
    (0, test_1.test)('should auto-retry assertions', async ({ page }) => {
        await page.setContent('<button id="foo"></button>');
        await Promise.all([
            (0, test_1.expect)(page.locator('#foo')).toBeAccessible(),
            page
                .waitForTimeout(1000)
                .then(() => page.setContent('<button id="foo">Hello</button>')),
        ]);
    });
    (0, test_1.test)('should allow providing custom run options', async ({ page }) => {
        await page.setContent('<button id="foo"></button>');
        await (0, test_1.expect)(page.locator('#foo')).toBeAccessible({
            rules: {
                'button-name': { enabled: false },
            },
        });
    });
    (0, test_1.test)('should respect project level options', async ({ page }) => {
        await page.setContent('<body><h1></h1></body>');
        await (0, test_1.expect)(page).toBeAccessible();
        await page.setContent('<body><h1></h1></body>');
        await (0, test_1.expect)(page).not.toBeAccessible({
            rules: { 'empty-heading': { enabled: true } },
            timeout: 2000,
        });
    });
    (0, test_1.test)('should throw an error after the timeout exceeds', async ({ page }) => {
        await page.setContent('<body><button></button></body>');
        const start = Date.now();
        const fn = () => (0, test_1.expect)(page).toBeAccessible({ timeout: 1000 });
        await (0, test_1.expect)(fn).rejects.toThrowError();
        const duration = Date.now() - start;
        (0, test_1.expect)(duration).toBeGreaterThan(1000);
        (0, test_1.expect)(duration).toBeLessThan(1500);
    });
    (0, test_1.test)('default report filename', async ({ page }) => {
        const content = await (0, file_1.readFile)('inaccessible.html');
        await page.setContent(content);
        await (0, test_1.expect)(page)
            .toBeAccessible({ timeout: 2000 })
            .catch(() => Promise.resolve());
        (0, test_1.expect)((0, attachments_1.attachmentExists)('axe-report.html')).toBe(true);
    });
    (0, test_1.test)('should allow providing custom report filename', async ({ page }) => {
        const filename = 'custom-report.html';
        const content = await (0, file_1.readFile)('inaccessible.html');
        await page.setContent(content);
        await (0, test_1.expect)(page)
            .toBeAccessible({ timeout: 2000, filename })
            .catch(() => Promise.resolve());
        (0, test_1.expect)((0, attachments_1.attachmentExists)(filename)).toBe(true);
    });
    (0, test_1.test)('should attach accessibility tree', async ({ page }) => {
        const filename = 'accessibility-tree.json';
        const content = await (0, file_1.readFile)('accessible.html');
        await page.setContent(content);
        await (0, test_1.expect)(page).toBeAccessible({ timeout: 2000 });
        const testInfo = test_1.test.info();
        const attachment = testInfo.attachments.find((attachment) => attachment.name === filename);
        const json = await promises_1.default.readFile(attachment.path, { encoding: 'utf-8' });
        const tree = JSON.parse(json);
        (0, test_1.expect)(tree).toBeTruthy();
    });
});
