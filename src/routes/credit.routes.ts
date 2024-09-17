import { Router } from "express";
import {
  createCredit,
  getCredits,
  getCreditById,
  updateCredit,
  deleteCredit,
} from "../controllers/credit.controller";
import { loginUsers, createUser } from "../controllers/user.controller";
import tokenAutentication from "../middlewares/tokenAutentication";

const router = Router();

// Routes for credits
router.post("/credits", createCredit);
router.get("/credits/", tokenAutentication.protectWithJwt, getCredits);
router.get("/credits/:id", tokenAutentication.protectWithJwt, getCreditById);
router.put("/credits/:id", tokenAutentication.protectWithJwt, updateCredit);
router.delete("/credits/:id", tokenAutentication.protectWithJwt, deleteCredit);

// Routes for users
router.post("/login", loginUsers);
router.post("/register", createUser);

export default router;
