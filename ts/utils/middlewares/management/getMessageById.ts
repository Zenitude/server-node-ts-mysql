import { Request, Response, NextFunction } from "express";
import Message from "../../../models/Message";
import { cleanValue } from "../../functions/cleanValue";

export const getMessageById = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const message = await Message.findOne({_id: cleanValue(req.params.id) });
        console.log("message1 : ", message)
        if(message) {
            res.locals.detailsMessage = message;
            next();
        } else {
            throw new Error(`Error GetMessageById message not found`)
        }
    } catch(error) {
        throw new Error(`Error GetMessageById : ${error}`);
    }
}