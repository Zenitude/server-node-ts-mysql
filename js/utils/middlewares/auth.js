"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../../models/User"));
const sendView_1 = require("../functions/sendView");
const auth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            throw new Error('Token');
        }
        if (!process.env.SECRET_KEY_TOKEN) {
            (0, sendView_1.sendView)(res, 500, "error", "Key");
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY_TOKEN);
        if (!decodedToken.userId) {
            throw new Error('Identifiant');
        }
        const user = User_1.default.findById(decodedToken.userId);
        if (!user) {
            throw new Error('Token invalide');
        }
        req.session.decodedToken = decodedToken;
        next();
    }
    catch (error) {
        (0, sendView_1.sendView)(res, 401, 'error', `${error}`);
    }
};
exports.auth = auth;
