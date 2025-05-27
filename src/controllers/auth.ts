import bcrypt from "bcryptjs";
import { Request, Response } from "express";

// Тестовая база данных
const users = [
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

export const login = (_req: Request, res: Response) => {
	res.render("auth");
};

export const authenticate = (req: Request, res: Response) => {
	const { username, password } = req.body;

	const user = users.find(u => u.username === username);
	if (!user) return res.render("auth", { error: "Неверное имя пользователя или пароль" });

	bcrypt.compare(password, user.password, (err, isMatch) => {
		if (err || !isMatch) {
			return res.render("auth", { error: "Неверное имя пользователя или пароль" });
		}

		req.session.user = { username: user.username, role: user.role };
		res.redirect("/orders");
	});
};

export const logout = (req: Request, res: Response) => {
	req.session.destroy(() => {
		res.redirect("/auth");
	});
};
