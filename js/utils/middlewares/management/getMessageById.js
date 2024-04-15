"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessageById = void 0;
const Message_1 = __importDefault(require("../../../models/Message"));
const cleanValue_1 = require("../../functions/cleanValue");
const getMessageById = async (req, res, next) => {
    try {
        const message = await Message_1.default.findOne({ _id: (0, cleanValue_1.cleanValue)(req.params.id) });
        console.log("message1 : ", message);
        if (message) {
            res.locals.detailsMessage = message;
            next();
        }
        else {
            throw new Error(`Error GetMessageById message not found`);
        }
    }
    catch (error) {
        throw new Error(`Error GetMessageById : ${error}`);
    }
};
exports.getMessageById = getMessageById;
