"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contact = void 0;
const path_1 = require("path");
const contact = async (req, res, next) => {
    const session = req.session;
    const isConnected = session.isConnected ?? false;
    const roleConnected = res.locals.roleUser ?? false;
    try {
        res.status(200).render((0, path_1.join)(__dirname, "../views/contact.ejs"), { isConnected: isConnected, roleConnected: roleConnected });
    }
    catch (error) {
        console.log(`${error}`);
        res.status(500).render((0, path_1.join)(__dirname, "../views/errors/error-500.ejs"), { isConnected: isConnected, roleConnected: roleConnected, message: { type: 'error', text: 'Contact' } });
    }
};
exports.contact = contact;
