import { Router } from "express";
import {
  createCredit,
  getCredits,
  getCreditById,
  updateCredit,
  deleteCredit,
} from "../controllers/credit.controller";
import { loginUsers, createUser } from "../controllers/user.controller";
const router = Router();

// router for credits
router.post("/credits", createCredit);
router.get("/credits/", getCredits);
router.get("/credits/:id", getCreditById);
router.put("/credits/:id", updateCredit);
router.delete("/credits/:id", deleteCredit);

// router for users
router.post("/login", loginUsers);
router.post("/register", createUser);

export default router;
