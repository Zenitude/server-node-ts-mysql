"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateMiddleware = void 0;
const dateMiddleware = (req, res, next) => {
    console.log(new Date().toLocaleString());
    next();
};
exports.dateMiddleware = dateMiddleware;
