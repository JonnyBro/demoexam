import { Request, Response } from "express";
import { Order } from "../models/Order.js";

// Тестовая база данных
export const orders = [
	new Order({
		id: 1,
		startDate: 1728557640000,
		device: "Ноутбук",
		problemType: "Не заряжается",
		description: "Заказан новый аккумулятор",
		client: "Сергеев А.В.",
		status: "Ждём запчасти",
	}),
	new Order({
		id: 2,
		startDate: 1742055818000,
		device: "ПК",
		problemType: "Не включается",
		client: "Ермолаев А.И.",
		status: "Ждём когда клиент принесёт устройство",
	}),
	new Order({
		id: 3,
		startDate: 1738859018000,
		device: "КПК",
		problemType: "Нет изо",
		description: "Заменён дисплей",
		client: "Иванов И.И.",
		status: "Выполнен",
		endDate: Date.now(),
	}),
];

export const getOrders = (_req: Request, res: Response) => {
	res.render("orders", { orders });
};

export const createOrder = (req: Request, res: Response) => {
	const { device, client, description, status, problemType } = req.body;
	const newOrder = new Order({
		id: orders.length + 1,
		startDate: Date.now(),
		device,
		problemType,
		description,
		client,
		status,
	});

	orders.push(newOrder);

	res.redirect("/orders");
};

export const updateOrder = (req: Request, res: Response) => {
	const order = orders.find(o => o.id === parseInt(req.params.id));
	if (!order) return res.status(404).send("Заказ не найден");

	const { description, status } = req.body;

	order.updateDescription(description);
	order.updateStatus(status);

	res.redirect("/orders");
};

export const deleteOrder = (req: Request, res: Response) => {
	const orderIndex = orders.findIndex(o => o.id === parseInt(req.params.id));

	if (orderIndex === -1) return res.status(404).send("Заказ не найден");
	if (req.session.user?.role !== "admin") return res.status(401).send("Нет прав");

	orders.splice(orderIndex, 1);

	res.redirect("/orders");
};

export const assingMaster = (req: Request, res: Response) => {
	const id = parseInt(req.params.id);
	const order = orders.find(order => order.id === id);
	const { master } = req.body;

	if (!order) return res.json({ success: false, message: "Заказ не найден" });

	order.master = master;

	return res.json({ success: true, message: "Мастер назначен" });
};
