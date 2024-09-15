"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    correoElectronico: { type: String, required: true },
    password: { type: String, required: true },
}, {
    timestamps: true, // Automatically creates `createdAt` and `updatedAt` fields.
});
exports.UserModel = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=user.schema.js.map