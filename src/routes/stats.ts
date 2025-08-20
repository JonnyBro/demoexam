import express, { Request, Response } from "express";
import { orders } from "../controllers/orders.js";
import { countCompleted, getAverageTimeToComplete, getProblemTypeStat } from "../utils/helpers.js";

const router = express.Router();

router.get("/", (_req: Request, res: Response) => {
	res.json({
		completeCount: countCompleted(orders),
		problemTypeStat: getProblemTypeStat(orders),
		averageTimeToComplete: getAverageTimeToComplete(orders),
	});
});

export default router;
