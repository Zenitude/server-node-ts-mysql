import { Schema, model, Document } from 'mongoose';
import { MessageModel } from '../utils/types/types';

const messageSchema = new Schema<MessageModel>({
    from: { type: String, required: true, trim: true },
    fullname: { type: String, trim: true},
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    sended: { type: Date, default: Date.now()}
});

export default model<MessageModel>('Message', messageSchema, 'messages');