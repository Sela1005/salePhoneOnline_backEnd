import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
    phone?: number;
    address?: string;
    avatar?: string;
    city?: string;
    role?: string;
}

const userSchema: Schema = new Schema(
    {
        name: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        isAdmin: { type: Boolean, default: false, required: true },
        phone: { type: Number },
        address: { type: String },
        avatar: { type: String },
        city: { type: String },
        role: { type: String },
    },
    {
        timestamps: true
    }
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
