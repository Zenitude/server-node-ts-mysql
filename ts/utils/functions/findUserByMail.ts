import { Request } from "express";
import User from "../../models/User";
import { cleanValue } from "./cleanValue";

export const findUserByMail = async (req: Request) => {
    return await User.findOne({ email: cleanValue(req.body.email) })
}