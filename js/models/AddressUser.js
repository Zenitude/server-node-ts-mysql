"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const addressUserSchema = new mongoose_1.Schema({
    street: { type: String, trim: true },
    zipcode: { type: String, trim: true },
    city: { type: String, trim: true }
});
exports.default = (0, mongoose_1.model)('AddressUser', addressUserSchema, 'addressusers');
