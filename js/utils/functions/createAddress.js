"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAddress = void 0;
const cleanValue_1 = require("./cleanValue");
const AddressUser_1 = __importDefault(require("../../models/AddressUser"));
const createAddress = async (req) => {
    const { street, zipcode, city } = req.body;
    const newAddress = new AddressUser_1.default({
        street: (0, cleanValue_1.cleanValue)(street),
        zipcode: parseInt((0, cleanValue_1.cleanValue)(zipcode)),
        city: (0, cleanValue_1.cleanValue)(city)
    });
    return await newAddress.save();
};
exports.createAddress = createAddress;
