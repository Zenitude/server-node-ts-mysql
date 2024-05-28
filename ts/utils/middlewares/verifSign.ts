import { Request, Response, NextFunction } from "express";
import { join } from "path";
import { CustomType } from "../types/types";

export const verifSign = (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as CustomType;
    const isConnected: boolean = session.isConnected ? session.isConnected : false;
    if(isConnected === true) { 
        res.status(401).redirect('/');
    } else {
        next();
    }
}