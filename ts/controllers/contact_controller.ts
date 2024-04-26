import { Request, Response, NextFunction } from 'express';
import { sendView } from "../utils/functions/sendView";
import { CustomType } from '../utils/types/types';



export const contact = async (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as CustomType;
    const isConnected = session.isConnected ?? false ;
    const roleConnected = res.locals.roleUser ?? false;

    try {
        sendView(res, 200, 'contact', { isConnected: isConnected, roleConnected : roleConnected, successSend: ""});
    } catch(error) {
        console.log(`${error}`);
        sendView(res, 401, 'contact', {isConnected: isConnected, roleConnected : roleConnected, successSend: "", error: "Erreur lors de l'envoie du message" })
    }
}