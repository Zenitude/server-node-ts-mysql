"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errors = void 0;
const sendView_1 = require("../utils/functions/sendView");
const errors = (req, res, next) => {
    const session = req.session;
    const isConnected = session.isConnected ?? false;
    const roleConnected = res.locals.roleUser ?? false;
    (0, sendView_1.sendView)(res, 400, "error", { isConnected: isConnected, roleConnected: roleConnected });
};
exports.errors = errors;
