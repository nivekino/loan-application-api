import mongoose, { Document } from 'mongoose';
interface ICredit extends Document {
    nombres: string;
    apellidos: string;
    correoElectronico: string;
    numeroTelefono: string;
    tipoIdentificacion: string;
    numeroIdentificacion: string;
    departamento: string;
    municipio: string;
    direccion: string;
    ingresosMensuales: number;
    selfiePath?: string;
    documentoIdentidadPath?: string;
}
export declare const CreditModel: mongoose.Model<ICredit, {}, {}, {}, mongoose.Document<unknown, {}, ICredit> & ICredit & Required<{
    _id: unknown;
}>, any>;
export {};
