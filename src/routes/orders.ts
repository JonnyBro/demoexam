import { Application, Router } from "express";
import {
	createOrder,
	deleteOrder,
	getOrders,
	updateOrder,
} from "../controllers/orders.js";

const router = Router();

router.use((req, res, next) => {
	if (!req.session.user) return res.redirect("/auth");

	next();
});

router.get("/", getOrders);
router.post("/", createOrder as Application);
router.put("/:id", updateOrder as Application);
router.delete("/:id", deleteOrder as Application);

export default router;
