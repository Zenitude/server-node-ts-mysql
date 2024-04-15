"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    from: { type: String, required: true, trim: true },
    fullname: { type: String, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    sended: { type: Date, default: Date.now() }
});
exports.default = (0, mongoose_1.model)('Message', messageSchema, 'messages');
