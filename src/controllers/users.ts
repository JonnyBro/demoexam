import { Request, Response } from "express";
import DB from "@/database.js";
import { User } from "@/models/User.js";
import bcrypt from "bcryptjs";

const database = await DB.getInstance();

export const createUser = async (req: Request, res: Response) => {
	const { username, password, role } = req.body;
	if (!username || !password || !role) return res.status(404).send("Не хватает данных");

	const response = await database.run(
		"INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
		[username, password, role],
	);

	if (!response.changes) return res.status(404).send("Ничего не изменено");

	res.redirect("/users");
};

export const updateUser = async (req: Request, res: Response) => {
	try {
		const id = req.body.id as number;
		if (!id) return res.status(400).send("ID пользователя не указан");

		const user = await database.get<User>("SELECT * FROM users WHERE id = ?", id);
		if (!user) return res.status(404).send("Пользователь не найден");

		const updates: Partial<User> = {};
		const params: any[] = [];

		if (req.body.password) {
			updates.password = await bcrypt.hash(req.body.password, 10);
			params.push(updates.password);
		}

		if (req.body.role) {
			updates.role = req.body.role;
			params.push(updates.role);
		}

		if (Object.keys(updates).length === 0) {
			return res.status(400).send("Нет данных для обновления");
		}

		const setClause = Object.keys(updates)
			.map(key => `${key} = ?`)
			.join(", ");

		const query = `UPDATE users SET ${setClause} WHERE id = ?`;
		params.push(id);

		const result = await database.run(query, params);

		if (result.changes === 0) {
			return res.status(404).send("Пользователь не найден или данные не изменились");
		}

		res.json({
			success: true,
			message: "Пользователь успешно обновлен",
			updatedFields: Object.keys(updates),
		});
	} catch (e) {
		console.error("Ошибка при обновлении пользователя:", e);
		res.status(500).send("Внутренняя ошибка сервера");
	}
};

export const deleteUser = async (req: Request, res: Response) => {
	if (req.session.user?.role !== "admin") return res.status(401).send("Нет прав");

	const id = req.body.id;
	const user = (await database.get(
		"SELECT * FROM users WHERE id = ?",
		id,
	)) as User;
	if (!user) return res.status(404).send("Пользователь не найден");

	const response = await database.run("DELETE FROM users WHERE id = ?", id);

	if (!response.changes) return res.status(404).send("Ничего не изменено");

	res.redirect("/users");
};
