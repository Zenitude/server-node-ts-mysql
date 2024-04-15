import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { InputType } from '../types/types';
import { sendView } from './sendView';

// verifInputs va verifier la conformité des données et les sécuriser 
export const verifInputs = (req: Request, res: Response, inputs: InputType[]) => {
    inputs.forEach(input => {

        switch(input.type) {

            case 'string' : 
                body(input.name, input.message).isString().notEmpty();
                break;

            case 'email' : 
                body(input.name, input.message).isEmail().notEmpty();
                break;

            case 'zipcode' : 
                body(input.name, input.message).isPostalCode("FR").notEmpty();                
                break;
        }
    })

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        console.log(errors.array());
        sendView(res, 421, 'error', 'Validation Formulaire');
    }
}