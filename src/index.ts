import express, { urlencoded, json } from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./routes/auth.js";
import ordersRouter from "./routes/orders.js";
import statsRouter from "./routes/stats.js";
import cors from "cors";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const port = 3000;

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());

app.use(
	session({
		secret: "very-secret-key",
		resave: false,
		saveUninitialized: true,
	}),
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use("/auth", authRouter);
app.use("/orders", ordersRouter);
app.use("/stats", statsRouter);

app.get("/", (req, res) => {
	if (!req.session.user) return res.redirect("/auth");

	res.redirect("/orders");
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
