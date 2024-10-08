import { Request, Response } from "express";
import { UserModel } from "../models/user.schema";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";

const jwtSing = "xGH07sUaXD1";

// Controller for user login (generates a JWT token)
export const loginUsers = async (req: Request, res: Response) => {
  try {
    const { correoElectronico, password } = req.body;

    const user = await UserModel.findOne({ correoElectronico });
    if (!user) {
      return res.status(401).json({ message: "Correo electrónico no válido" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña no válida" });
    }

    let token = jwt.sign(
      { userId: user._id, correoElectronico: user.correoElectronico },
      jwtSing,
      { expiresIn: "1h" }
    );

    logger.info("Generated JWT Token", token);
    res.status(200).json({ message: "Inicio de sesión exitoso", token: token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error durante el inicio de sesión", error });
  }
};

// Controller for user registration
export const createUser = async (req: Request, res: Response) => {
  try {
    const { nombres, apellidos, correoElectronico, password } = req.body;

    const newUser = new UserModel({
      nombres,
      apellidos,
      correoElectronico,
      password,
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "Usuario creado exitosamente", data: newUser });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "El correo electrónico ya existe" });
    } else {
      res.status(500).json({ message: "Error al crear el usuario", error });
    }
  }
};
