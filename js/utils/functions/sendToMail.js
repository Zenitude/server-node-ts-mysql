"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendToMail = async (from, user, subject, message) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: `${process.env.EMAIL_USER}`,
                pass: `${process.env.EMAIL_PSWD}`
            }
        });
        const options = {
            from: `${user} <${from}>`,
            to: process.env.EMAIL_USER,
            subject: subject,
            html: `<p>${message}</p><br /><p>------<p><br /><p>${user}</p>`
        };
        const info = await transporter.sendMail(options);
        console.log(`Email envoyé : ${info.messageId}`);
    }
    catch (error) {
        console.log(`Erreur envoi du mail : ${error}`);
    }
};
exports.sendToMail = sendToMail;
