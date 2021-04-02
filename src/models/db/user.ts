import mongoose, { Document, Schema } from 'mongoose';

export interface IUserSchema extends Document {
    email: string;
    password: string;
    encryptedPassword: string;
    role: 'admin' | 'member';
}

const userSchema: Schema = new Schema({
    email: { type: String, required: true },
    encryptedPassword: { type: String, required: true },
    role: { type: String, enum: ['admin', 'member'], required: true },
});

const User = mongoose.model<IUserSchema>('User', userSchema);
export default User;