import { Request, Response, NextFunction } from "express";
import { sendView } from "../utils/functions/sendView";
import { CustomType } from "../utils/types/types";

export const home = (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as CustomType;
    session.maVariable = "";
    const isConnected = session.isConnected ? session.isConnected : false;
    const roleConnected = res.locals.roleUser ?? false;
    //res.status(200).render(join(__dirname, "../views/index.ejs"), { isConnected: isConnected, roleConnected: roleConnected })
    sendView(res, 200, "index", { isConnected: isConnected, roleConnected: roleConnected });
}
