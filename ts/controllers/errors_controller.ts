import { Request, Response, NextFunction } from "express";
import { sendView } from "../utils/functions/sendView";
import { CustomType } from "../utils/types/types";

export const errors = (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as CustomType;
    const isConnected = session.isConnected ?? false ;
    const roleConnected = res.locals.roleUser ?? false;

    sendView(res, 400, "error", { isConnected: isConnected, roleConnected : roleConnected});
}