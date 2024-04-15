import { Schema, model } from "mongoose";
import { UserModel } from "../utils/types/types";
import AddressUser from "./AddressUser";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new Schema<UserModel>({
    lastname: { type: String, trim: true },
    firstname: { type: String, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
    address: { type: Schema.Types.ObjectId, ref: AddressUser },
    role: { type: Number, default: 0}
});

userSchema.plugin(uniqueValidator);

export default model<UserModel>('User', userSchema, 'users');