import { Document, Types } from "mongoose";
import { Session, SessionData } from "express-session"
import { JwtPayload } from "jsonwebtoken";

type OptionCookie = {
    httpOnly: boolean, 
    secure: boolean, 
    maxAge: number
}

type InputType = {
    name: string;
    message: string;
    type: string;
}

interface MessageModel extends Document {
    from: string;
    fullname: string;
    subject: string;
    message: string;
    sended: Date;
}

interface AddressUserModel extends Document {
    street: string;
    zipcode: string;
    city: string;
}

interface UserModel extends Document {
    id_user: number;
    lastname: string;
    firstname: string;
    email: string;
    password : string;
    address: Types.ObjectId;
    role: number;
}

interface CustomData extends Partial<SessionData> {
    maVariable: string;
    isConnected: boolean;
    userId: string | Types.ObjectId;
    decodedToken?: JwtPayload;
}

interface CustomSession extends Session {
    maVariable: string;
    isConnected: boolean;
    userId: string | Types.ObjectId;
    decodedToken: JwtPayload;
}

type CustomType = CustomSession & CustomData;
