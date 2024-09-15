"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditModel = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
const creditSchema = new mongoose_1.Schema({
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
    documentoIdentidadPath: { type: String },
}, {
    timestamps: true, // Automatically creates `createdAt` and `updatedAt` fields.
});
exports.CreditModel = mongoose_1.default.model('Credit', creditSchema);
//# sourceMappingURL=credit.schema.js.map