import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

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
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

export const UserModel = mongoose.model<IUser>("User", userSchema);
