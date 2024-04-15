"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifInputs = void 0;
const express_validator_1 = require("express-validator");
const sendView_1 = require("../functions/sendView");
// verifInputs va verifier la conformité des données et les sécuriser 
const verifInputs = (req, res, inputs) => {
    inputs.forEach(input => {
        switch (input.type) {
            case 'string':
                (0, express_validator_1.body)(input.name, input.message).isString().notEmpty();
                break;
            case 'email':
                (0, express_validator_1.body)(input.name, input.message).isEmail().notEmpty();
                break;
            case 'zipcode':
                (0, express_validator_1.body)(input.name, input.message).isPostalCode("FR").notEmpty();
                break;
        }
    });
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        (0, sendView_1.sendView)(res, 421, 'error', 'Validation Formulaire');
    }
};
exports.verifInputs = verifInputs;
