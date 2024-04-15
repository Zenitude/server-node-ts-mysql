"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAddress = void 0;
const AddressUser_1 = __importDefault(require("../../../models/AddressUser"));
const createAddress = async (req) => {
    const newAddress = new AddressUser_1.default({
        street: req.body.street,
        zipcode: req.body.zipcode,
        city: req.body.city
    });
    return await newAddress.save();
};
exports.createAddress = createAddress;
