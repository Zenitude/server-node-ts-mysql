"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAddress = void 0;
const AddressUser_1 = __importDefault(require("../../models/AddressUser"));
const cleanValue_1 = require("./cleanValue");
const findAddress = async (req) => {
    const { street, zipcode, city } = req.body;
    return await AddressUser_1.default.findOne({
        street: (0, cleanValue_1.cleanValue)(street),
        zipcode: (0, cleanValue_1.cleanValue)(zipcode),
        city: (0, cleanValue_1.cleanValue)(city)
    });
};
exports.findAddress = findAddress;
