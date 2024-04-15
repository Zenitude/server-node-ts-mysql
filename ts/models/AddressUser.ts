import { Schema, model } from 'mongoose';
import { AddressUserModel } from '../utils/types/types';

const addressUserSchema = new Schema<AddressUserModel>({
    street: { type: String, trim: true },
    zipcode: { type: String, trim: true },
    city: { type: String, trim: true }
});

export default model<AddressUserModel>('AddressUser', addressUserSchema, 'addressusers')