import { Request, Response } from "express";
import { Order } from "../models/Order.js";
import DB from "@/database.js";

const database = await DB.getInstance();

export const getOrders = async (_req: Request, res: Response) => {
	const orders = (await database.all("SELECT * FROM orders")) as Order[];

	res.render("orders", { orders });
};

export const createOrder = async (req: Request, res: Response) => {
	const { device, client, description, status, problemType } = req.body;
	if (!device || !client || !description || !status || !problemType) {
		return res.status(404).send("Не хватает данных");
	}

	const response = await database.run(
		// eslint-disable-next-line max-len
		"INSERT INTO orders (device, client, description, status, problemType) VALUES (?, ?, ?, ?, ?)",
		[device, client, description, status, problemType],
	);

	if (!response.changes) return res.status(404).send("Ничего не изменено");

	res.redirect("/orders");
};

export const updateOrder = async (req: Request, res: Response) => {
	try {
		const id = req.body.id as number;
		if (!id) return res.status(400).send("ID заказа не указан");

		const order = await database.get<Order>("SELECT * FROM orders WHERE id = ?", id);
		if (!order) return res.status(404).send("Заказ не найден");

		const updates: Partial<Order> = {};
		const params: any[] = [];

		if (req.body.description) {
			updates.description = req.body.description;
			params.push(req.body.description);
		}

		if (req.body.endDate) {
			updates.endDate = req.body.endDate;
			params.push(req.body.endDate);
		}

		if (req.body.master) {
			updates.master = req.body.master;
			params.push(req.body.master);
		}

		if (req.body.status) {
			updates.status = req.body.status;
			params.push(req.body.status);
		}

		if (Object.keys(updates).length === 0) {
			return res.status(400).send("Нет данных для обновления");
		}

		const setClause = Object.keys(updates)
			.map(key => `${key} = ?`)
			.join(", ");

		const query = `UPDATE orders SET ${setClause} WHERE id = ?`;
		params.push(id);

		const result = await database.run(query, params);

		if (result.changes === 0) {
			return res.status(404).send("Заказ не найден или данные не изменились");
		}

		res.json({ success: true, message: "Заказ успешно обновлен" });
	} catch (e) {
		console.error("Ошибка при обновлении заказа", e);
		res.status(500).send("Внутренняя ошибка сервера");
	}
};

export const deleteOrder = async (req: Request, res: Response) => {
	if (req.session.user?.role !== "admin") return res.status(401).send("Нет прав");

	const id = req.body.id;
	const order = (await database.get(
		"SELECT * FROM orders WHERE id = ?",
		id,
	)) as Order;
	if (!order) return res.status(404).send("Пользователь не найден");

	const response = await database.run("DELETE FROM users WHERE id = ?", id);

	if (!response.changes) return res.status(404).send("Ничего не изменено");

	res.redirect("/users");
};
