import DB from "@/database.js";
import { User } from "@/models/User.js";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

const database = await DB.getInstance();

export const login = (_req: Request, res: Response) => {
	res.render("auth");
};

export const authenticate = async (req: Request, res: Response) => {
	const { username, password } = req.body;

	const user = await database.get<User>("SELECT * FROM users WHERE username = ?", username);
	if (!user) return res.render("auth", { error: "Неверное имя пользователя или пароль" });

	bcrypt.compare(password, user.password, (err, isMatch) => {
		if (err || !isMatch) {
			return res.render("auth", { error: "Неверное имя пользователя или пароль" });
		}

		req.session.user = { username: user.username, role: user.role };
		res.redirect("/");
	});
};

export const logout = (req: Request, res: Response) => {
	req.session.destroy(() => {
		res.redirect("/");
	});
};
