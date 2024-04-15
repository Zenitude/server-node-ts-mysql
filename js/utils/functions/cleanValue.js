"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanValue = void 0;
const validator_1 = require("validator");
const cleanValue = (value) => {
    if (!value)
        return "";
    const str = value.trim();
    const escValue = (0, validator_1.escape)(str);
    const finalValue = escValue.replace(/<[^>]*>/g, '')
        .replace(/&lt;/g, '') // remplace <
        .replace(/&gt;/g, '') // remplace >
        .replace(/&amp;/g, '') // remplace &
        .replace(/&quot;/g, '') // remplace "
        .replace(/&#039;/g, '') // remplace '
        .replace(/&#x2F;/g, ''); // remplace /
    return finalValue;
};
exports.cleanValue = cleanValue;
