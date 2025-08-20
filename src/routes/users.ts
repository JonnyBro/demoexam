import { Application, Router } from "express";
import { createUser, deleteUser, updateUser } from "../controllers/users.js";

const router = Router();

router.use((req, res, next) => {
	if (!req.session.user) return res.redirect("/auth");
	if (req.session.user?.role !== "admin") return;

	next();
});

router.post("/", createUser);
router.put("/:id", updateUser as Application);
router.delete("/:id", deleteUser as Application);

export default router;
