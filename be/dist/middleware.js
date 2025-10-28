"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = auth;
exports.adminAuth = adminAuth;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
async function auth(req, res, next) {
    const token = req.headers["token"];
    if (!token) {
        res.json({
            msg: "token not found"
        });
    }
    const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    if (!decode) {
        res.json({
            msg: "you are not authorised"
        });
    }
    else {
        req.userId = decode.id;
        next();
    }
}
function adminAuth(req, res, next) {
    const token = req.headers["token"];
    if (!token) {
        res.json({
            msg: "token not found"
        });
    }
    const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_ADMIN_SECRET);
    if (!decode) {
        res.json({
            msg: "you are not authorised"
        });
    }
    else {
        next();
    }
}
//# sourceMappingURL=middleware.js.map