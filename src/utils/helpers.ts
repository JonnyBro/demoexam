import { Order } from "@/models/Order.js";

export function countCompleted(repo: Order[]) {
	return repo.filter(o => o.status.toLowerCase() === "завершён").length;
}

export function getProblemTypeStat(repo: Order[]) {
	const dict: Record<string, any> = {};

	for (const o of repo) {
		dict[o.problemType] = (dict[o.problemType] || 0) + 1;
	}

	return dict;
}

export function getAverageTimeToComplete(repo: Order[]) {
	const times = repo
		.filter(o => o.status.toLowerCase() === "завершён" && o.endDate)
		.map(o => {
			const endDate = o.endDate!;
			const startDate = o.startDate;

			return (endDate - startDate) / (1000 * 60 * 60 * 24);
		});

	return times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
}
