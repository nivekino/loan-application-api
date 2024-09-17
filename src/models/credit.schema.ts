import mongoose, { Document, Schema } from "mongoose";

export interface ICredit extends Document {
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
  documentoIdentidadPath?: string[];
}

const creditSchema = new Schema<ICredit>(
  {
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    correoElectronico: { type: String, required: true },
    numeroTelefono: { type: String, required: true },
    tipoIdentificacion: { type: String, required: true },
    numeroIdentificacion: { type: String, required: true },
    departamento: { type: String, required: true },
    municipio: { type: String, required: true },
    direccion: { type: String, required: true },
    ingresosMensuales: { type: Number, required: true },
    selfiePath: { type: String },
    documentoIdentidadPath: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export const CreditModel = mongoose.model<ICredit>("Credit", creditSchema);
