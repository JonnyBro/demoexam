export interface OrderDetails {
	id: number;
	startDate: number;
	device: string;
	problemType: string;
	description?: string;
	client: string;
	status: string;
	endDate?: number;
	master?: string;
	comments?: string[];
}

export class Order {
	id: number;
	startDate: number;
	device: string;
	problemType: string;
	description?: string;
	client: string;
	status: string;
	endDate?: number;
	master?: string;
	comments: string[];

	constructor(options: OrderDetails) {
		this.id = options.id;
		this.startDate = options.startDate;
		this.device = options.device;
		this.problemType = options.problemType;
		this.description = options.description;
		this.client = options.client;
		this.status = options.status;
		this.endDate = options.endDate;
		this.master = options.master;
		this.comments = options.comments || [];
	}

	updateStatus(newStatus: string) {
		if (newStatus && newStatus !== this.status) {
			this.status = newStatus;

			return `Статус заявки №${this.id} изменен.\n${
				newStatus.toLowerCase() === "завершён" ? "Заявка завершена\n" : ""
			}`;
		} else return null;
	}

	addComment(comment: string): string | null | undefined {
		if (comment) {
			this.comments.push(comment);

			return this.comments.at(-1);
		} else return null;
	}

	updateDescription(description: string) {
		if (description) {
			this.description = description;
			return this.description;
		}
	}

	updateMaster(master: string) {
		if (master) {
			this.master = master;
			return this.master;
		}
	}

	updateEndDate(date: number) {
		if (date) {
			this.endDate = date;
			return this.endDate;
		}
	}
}
