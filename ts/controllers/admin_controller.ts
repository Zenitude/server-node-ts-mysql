import { Request, Response, NextFunction } from "express";
import { sendView } from "../utils/functions/sendView";
import { CustomType } from "../utils/types/types";

export const dashboard = (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as CustomType;
    const isConnected = session.isConnected ? session.isConnected : false;
    const roleConnected = res.locals.roleUser ?? false;

    if(roleConnected !== 1) {
        sendView(res, 200, '/');
    } else {
        sendView(res, 200, "admin", { isConnected: isConnected, roleConnected: roleConnected});
    }
}
