"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByMail = void 0;
const User_1 = __importDefault(require("../../models/User"));
const cleanValue_1 = require("./cleanValue");
const findUserByMail = async (req) => {
    return await User_1.default.findOne({ email: (0, cleanValue_1.cleanValue)(req.body.email) });
};
exports.findUserByMail = findUserByMail;
