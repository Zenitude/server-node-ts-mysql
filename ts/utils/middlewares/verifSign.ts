import { Request, Response, NextFunction } from "express";
import { sendView } from "../functions/sendView";
import { CustomType } from "../types/types";

export const verifSign = (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as CustomType;
    const isConnected: boolean = session.isConnected ? session.isConnected : false;
    if(isConnected === true) { 
        sendView(res, 200, '/');
    } else {
        next();
    }
}