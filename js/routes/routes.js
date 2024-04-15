"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const home_1 = __importDefault(require("./home"));
const contact_1 = __importDefault(require("./contact"));
const sign_1 = __importDefault(require("./sign"));
const admin_1 = __importDefault(require("./admin"));
const users_1 = __importDefault(require("./users"));
const errors_1 = __importDefault(require("./errors"));
exports.routes = [home_1.default, contact_1.default, sign_1.default, admin_1.default, users_1.default, errors_1.default];
