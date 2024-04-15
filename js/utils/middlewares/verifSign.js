"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifSign = void 0;
const sendView_1 = require("../functions/sendView");
const verifSign = (req, res, next) => {
    const session = req.session;
    const isConnected = session.isConnected ? session.isConnected : false;
    if (isConnected === true) {
        (0, sendView_1.sendView)(res, 200, '/');
    }
    else {
        next();
    }
};
exports.verifSign = verifSign;
