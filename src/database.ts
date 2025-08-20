import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

export type AppDatabase = Database<sqlite3.Database, sqlite3.Statement>;

class DB {
	private static instance: Database<sqlite3.Database, sqlite3.Statement>;

	static async getInstance() {
		if (!DB.instance) {
			DB.instance = await open({
				filename: "./database.db",
				driver: sqlite3.Database,
			});
		}

		return DB.instance;
	}
}

export const initDatabase = async (database: AppDatabase): Promise<boolean> => {
	const queryUsers = `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL
    );`;

	const queryOrders = `CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        startDate INTEGER NOT NULL,
        endDate INTEGER,
        device TEXT NOT NULL,
        problemType TEXT NOT NULL,
        description TEXT,
        client TEXT NOT NULL,
        status TEXT NOT NULL
    );`;

	try {
		await database.exec(queryUsers);
		await database.exec(queryOrders);
		return true;
	} catch (error) {
		console.error("Database initialization failed:", error);
		return false;
	}
};

export const initTestDatabase = async (database: AppDatabase): Promise<boolean> => {
	const usersData = [
		{
			username: "admin",
			password: "$2b$12$StSzqVqzY5ZS7eOn.3X1ZuBauhVtO/b2bN1ZmpxailHsr0SUnXICe", // qwerty1234
			role: "admin",
		},
		{
			username: "user",
			password: "$2b$12$QbMhuePfQ6lRH.43KbbAmedokC8gEXfvbCtNnsWIvt0nzmEyGFkLK", // qwerty
			role: "user",
		},
	];

	const ordersData = [
		{
			startDate: 1728557640000,
			device: "Ноутбук",
			problemType: "Не заряжается",
			description: "Заказан новый аккумулятор",
			client: "Сергеев А.В.",
			status: "Ждём запчасти",
		},
		{
			startDate: 1742055818000,
			device: "ПК",
			problemType: "Не включается",
			client: "Ермолаев А.И.",
			status: "Ждём когда клиент принесёт устройство",
		},
		{
			startDate: 1738859018000,
			device: "КПК",
			problemType: "Нет изо",
			description: "Заменён дисплей",
			client: "Иванов И.И.",
			status: "Выполнен",
			endDate: Date.now(),
		},
	];

	try {
		await database.exec("DELETE FROM users");
		await database.exec("DELETE FROM orders");

		await database.exec("DELETE FROM sqlite_sequence WHERE name='users'");
		await database.exec("DELETE FROM sqlite_sequence WHERE name='orders'");

		for (const user of usersData) {
			await database.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", [
				user.username,
				user.password,
				user.role,
			]);
		}

		for (const order of ordersData) {
			await database.run(
				// eslint-disable-next-line max-len
				"INSERT INTO orders (startDate, endDate, device, problemType, description, client, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
				[
					order.startDate,
					order.endDate || null,
					order.device,
					order.problemType,
					order.description || null,
					order.client,
					order.status,
				],
			);
		}

		console.log("Test database initialized with sample data");
		return true;
	} catch (error) {
		console.error("Failed to initialize test database:", error);
		return false;
	}
};

export default DB;
