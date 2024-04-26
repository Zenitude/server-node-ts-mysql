"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contact = void 0;
const sendView_1 = require("../utils/functions/sendView");
const contact = async (req, res, next) => {
    const session = req.session;
    const isConnected = session.isConnected ?? false;
    const roleConnected = res.locals.roleUser ?? false;
    try {
        (0, sendView_1.sendView)(res, 200, 'contact', { isConnected: isConnected, roleConnected: roleConnected, successSend: "" });
    }
    catch (error) {
        console.log(`${error}`);
        (0, sendView_1.sendView)(res, 401, 'contact', { isConnected: isConnected, roleConnected: roleConnected, successSend: "", error: "Erreur lors de l'envoie du message" });
    }
};
exports.contact = contact;
