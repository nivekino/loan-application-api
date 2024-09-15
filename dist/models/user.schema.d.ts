import mongoose, { Document } from 'mongoose';
interface IUser extends Document {
    nombres: string;
    apellidos: string;
    correoElectronico: string;
    password: string;
}
export declare const UserModel: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser> & IUser & Required<{
    _id: unknown;
}>, any>;
export {};
