"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboard = void 0;
const sendView_1 = require("../utils/functions/sendView");
const dashboard = (req, res, next) => {
    const session = req.session;
    const isConnected = session.isConnected ? session.isConnected : false;
    const roleConnected = res.locals.roleUser ?? false;
    if (roleConnected !== 1) {
        (0, sendView_1.sendView)(res, 200, '/');
    }
    else {
        (0, sendView_1.sendView)(res, 200, "admin", { isConnected: isConnected, roleConnected: roleConnected });
    }
};
exports.dashboard = dashboard;
