import { Request, Response, NextFunction } from "express";

export const dateMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log(new Date().toLocaleString());
    next();
}