import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { InputType, CustomType } from '../types/types';
import { join } from 'path';

// verifInputs va verifier la conformité des données et les sécuriser 
export const verifInputs = (req: Request, res: Response, inputs: InputType[]) => {
    const session = req.session as CustomType;
    const isConnected = session.isConnected ?? false;
    const roleConnected = res.locals.roleUser ?? 0;

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
        res.status(421).render(join(__dirname, ""), { isConnected: isConnected, roleConnected: roleConnected, message:{type:'error', text:'Validation Formulaire'}})
    }
}