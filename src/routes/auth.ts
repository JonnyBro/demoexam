import express from "express";
import { authenticate, login, logout } from "../controllers/auth.js";

const router = express.Router();

router.get("/", login);
router.post("/", authenticate);
router.get("/logout", logout);

export default router;
