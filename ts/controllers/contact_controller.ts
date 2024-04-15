import { Request, Response, NextFunction } from 'express';
import { sendView } from "../utils/functions/sendView";
import Message from "../models/Message";
import { cleanValue } from '../utils/functions/cleanValue';
import { verifInputs } from '../utils/functions/verifInput';
import { CustomType } from '../utils/types/types';
import { join } from "path";

const findMessages = async () => {
    return await Message.find();
}

export const contact = async (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as CustomType;
    const isConnected = session.isConnected ?? false ;
    const roleConnected = res.locals.roleUser ?? false;

    try {
        if(req.body.email) {
            const inputs = [
                {type: 'string', name: 'lastname', message: ''},
                {type: 'string', name: 'firstname', message: ''},
                {type: 'email', name: 'email', message: ''},
                {type: 'string', name: 'subject', message: ''},
                {type: 'string', name: 'message', message: ''}
            ]

            verifInputs(req, res, inputs);

            const { firstname, lastname, email, subject, message } = req.body;
            const fullname = `${firstname} ${lastname}`;

            const newMessage = new Message({
                from: cleanValue(email),
                fullname: cleanValue(fullname),
                subject: cleanValue(subject),
                message: cleanValue(message),
            })
            
            newMessage.save()
            .then((result: any) => {
                console.log(`Message sauvegardé : ${result}`);
                sendView(res, 200, 'contact', {isConnected: isConnected, roleConnected : roleConnected, successSend: "Message envoyé avec succès"})
            })
            .catch((error: any) => { throw new Error(`Error Save Message : ${error}`)}); 
        } else {
            sendView(res, 200, 'contact', { isConnected: isConnected, roleConnected : roleConnected, successSend: ""});
        }
    } catch(error) {
        console.log(`${error}`);
        sendView(res, 401, 'contact', {isConnected: isConnected, roleConnected : roleConnected, successSend: "", error: "Erreur lors de l'envoie du message" })
    }
}

export const list = async (req: Request, res: Response) => {
    const session = req.session as CustomType;
    const isConnected = session.isConnected ?? false;
    const roleConnected = res.locals.roleUser ?? false;

    try {
        if(roleConnected !== 1) {
            sendView(res, 401, "error", {isConnected: isConnected, roleConnected: roleConnected});
        } else {
            await findMessages()
            .then(messages => {
                sendView(res, 200, 'list-message', {isConnected: isConnected, roleConnected: roleConnected, messages: messages});
            })
            .catch(error => { throw new Error(`Error findUsers List Users : ${error}`)});
        }
    } catch(error) {
        console.log(`Erreur List Messages : ${error}`);
        sendView(res, 401, 'error', {isConnected: isConnected, roleConnected: roleConnected, error: 'List Messages'});
    }
}

export const details = (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as CustomType;
    const isConnected = session.isConnected ?? false;
    const roleConnected = res.locals.roleUser ?? false;
    const detailsMessage = res.locals.detailsMessage ?? false;

    try {
        if(!isConnected || roleConnected !== 1 || !detailsMessage) {
            sendView(res, 401, "error", {isConnected: isConnected, roleConnected: roleConnected});
        } else {
            sendView(res, 200, 'details-message', {message: detailsMessage, isConnected: isConnected, roleConnected: roleConnected});
        }
    } catch(error) {
        console.log(`Erreur details Message : ${error}`);
        sendView(res, 500, 'error', 'Details Message');
    }
}

export const remove = (req: Request, res: Response) => {
    const session = req.session as CustomType;
    const isConnected = session.isConnected ?? false;
    const roleConnected = res.locals.roleUser ?? 0;
    const detailsMessage = res.locals.detailsMessage ?? false;
    
    try {
        if(req.method === 'DELETE') {
            Message.deleteOne({_id: cleanValue(req.params.id) })
            .then(() => {
                res.status(200).json({url: '/messages', message: {type: 'success', text:`Message supprimé avec succès.`}});
            })
            .catch(error => {throw new Error(`Error deleteOne Delete Message : ${error}`)});
        } else {
            if(!isConnected || roleConnected !== 1 || !detailsMessage) {
                res.status(302).redirect("/");
            } else {
                res.status(200).render(join(__dirname, "../views/management/messages/delete-message.ejs"), { isConnected: isConnected, roleConnected: roleConnected, message: detailsMessage})
            }
        }
    } catch(error) {
        console.log(`${error}`);
        res.status(500).render(join(__dirname, "../views/management/messages/delete-message.ejs"), { isConnected: isConnected, roleConnected: roleConnected, message: detailsMessage})
    }
}