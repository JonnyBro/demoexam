import bcrypt from "bcryptjs";

export interface UserDetails {
	id?: number;
	username: string;
	password: string;
	role: Roles;
}

export enum Roles {
	Admin = "admin",
	User = "user",
}

export class User {
	id?: number;
	username: string;
	password: string;
	role: Roles;

	constructor(options: UserDetails) {
		this.username = options.username;
		this.password = options.password;
		this.role = options.role;
	}

	async changePassword(pass: string) {
		if (pass) {
			this.password = await bcrypt.hash(pass, 10);
			return true;
		}

		return false;
	}

	changeRole(role: Roles) {
		if (role) {
			this.role = role;
			return this.role;
		}
	}
}
