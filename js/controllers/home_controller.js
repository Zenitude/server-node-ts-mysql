"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.home = void 0;
const sendView_1 = require("../utils/functions/sendView");
const home = (req, res, next) => {
    const session = req.session;
    session.maVariable = "";
    const isConnected = session.isConnected ? session.isConnected : false;
    const roleConnected = res.locals.roleUser ?? false;
    //res.status(200).render(join(__dirname, "../views/index.ejs"), { isConnected: isConnected, roleConnected: roleConnected })
    (0, sendView_1.sendView)(res, 200, "index", { isConnected: isConnected, roleConnected: roleConnected });
};
exports.home = home;
