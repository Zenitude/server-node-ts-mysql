import { Request, Response, NextFunction } from 'express';
import { join } from 'path';
import { CustomType } from '../utils/types/types';



export const contact = async (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as CustomType;
    const isConnected = session.isConnected ?? false ;
    const roleConnected = res.locals.roleUser ?? false;

    try {
        res.status(200).render(join(__dirname, "../views/contact.ejs"), { isConnected: isConnected, roleConnected: roleConnected})
    } catch(error) {
        console.log(`${error}`);
        res.status(500).render(join(__dirname, "../views/errors/error-500.ejs"), { isConnected: isConnected, roleConnected: roleConnected, message: {type: 'error', text: 'Contact'}})
    }
}