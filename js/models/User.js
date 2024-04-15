"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AddressUser_1 = __importDefault(require("./AddressUser"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const userSchema = new mongoose_1.Schema({
    lastname: { type: String, trim: true },
    firstname: { type: String, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
    address: { type: mongoose_1.Schema.Types.ObjectId, ref: AddressUser_1.default },
    role: { type: Number, default: 0 }
});
userSchema.plugin(mongoose_unique_validator_1.default);
exports.default = (0, mongoose_1.model)('User', userSchema, 'users');
