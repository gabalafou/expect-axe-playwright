"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const file_1 = require("../utils/file");
function listener(req, res) {
    const file = req.url.replace('/', '');
    (0, file_1.readFile)(file).then((html) => {
        res.writeHead(200);
        res.end(html);
    });
}
async function globalSetup() {
    const server = http_1.default.createServer(listener);
    await new Promise((done) => server.listen(done));
    // Expose port to the tests
    const address = server.address();
    process.env.SERVER_PORT = String(address.port);
    return async () => {
        await new Promise((done) => server.close(done));
    };
}
exports.default = globalSetup;
