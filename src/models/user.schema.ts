import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
    nombres: string;
    apellidos: string;
    correoElectronico: string;
    password: string;
}

const userSchema = new Schema<IUser>(
    {
        nombres: { type: String, required: true },
        apellidos: { type: String, required: true },
        correoElectronico: { type: String, required: true },
        password: { type: String, required: true },
    },
    {
        timestamps: true, // Automatically creates `createdAt` and `updatedAt` fields.
    },
);

export const UserModel = mongoose.model<IUser>('User', userSchema);
