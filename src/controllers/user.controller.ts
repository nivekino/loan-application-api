import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/user.schema";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: "Failed to authenticate token" });
    }

    if (typeof decoded !== "string" && (decoded as CustomJwtPayload).userId) {
      req.userId = (decoded as CustomJwtPayload).userId;
    } else {
      return res.status(500).json({ message: "Invalid token payload" });
    }

    next();
  });
};

export const loginUsers = async (req: Request, res: Response) => {
  try {
    const { correoElectronico, password } = req.body;

    const user = await UserModel.findOne({ correoElectronico });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, correoElectronico: user.correoElectronico },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error during login", error });
  }
};

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
      .json({ message: "User created successfully", data: newUser });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Email already exists" });
    } else {
      res.status(500).json({ message: "Error creating user", error });
    }
  }
};
