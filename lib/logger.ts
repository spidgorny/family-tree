import { DateTime } from "luxon";
import chalk from "chalk";
import bytes from "bytes";

export class Logger {
	firstLog = Date.now();
	lastLog = Date.now();

	constructor(protected currentMethod: string) {}

	log(...args: any[]) {
		console.log(
			this.diffColor(),
			chalk.blue(`[${this.currentMethod ?? ""}]`),
			...args,
		);
	}

	info(...args: any[]) {
		console.info(
			this.diffColor(),
			chalk.blue(`[${this.currentMethod ?? ""}]`),
			...args.map((x) => chalk.cyan(x)),
		);
	}

	warn(...args: any[]) {
		console.warn(
			this.diffColor(),
			chalk.blue(`[${this.currentMethod ?? ""}]`),
			...args.map((x) => chalk.yellow(x)),
		);
	}

	error(...args: any[]) {
		console.error(
			this.diffColor(),
			chalk.blue(`[${this.currentMethod ?? ""}]`),
			...args.map((x) => chalk.red(x)),
		);
	}

	table(...args: any[]) {
		console.table(args[0], args[1]);
	}

	progress(fraction: number, ...args: any[]) {
		let barChartLength = 20;
		fraction = Math.min(fraction, 1);
		console.log(
			this.diffColor(),
			chalk.blue(`[${this.currentMethod}]`),
			`[${"*".repeat(fraction * barChartLength).padEnd(barChartLength, " ")}]`,
			chalk.yellow((fraction * 100).toFixed(2) + "%"),
			...args,
		);
	}

	cost(cost: number) {
		console.log("$$", cost);
	}

	get duration() {
		return DateTime.now().diff(DateTime.fromMillis(this.firstLog));
	}

	get uptime() {
		return this.duration.toFormat("hh:mm:ss");
	}

	get diff() {
		let diff = Date.now() - this.lastLog;
		this.lastLog = Date.now();
		return diff / 1000;
	}

	diffColor() {
		return (
			chalk.cyan(`${this.uptime}`) + chalk.green(` +${this.diff.toFixed(3)}\t`)
		);
	}

	itemsPerSecond(loaded: number, startTime: number) {
		const endTime = Date.now();
		const duration = (endTime - startTime) / 1000;
		const itemsPerSecond = loaded / duration;
		return `${itemsPerSecond} items/sec`;
	}

	bytesPerSecond(loaded: number, startTime: number) {
		const endTime = Date.now();
		const duration = (endTime - startTime) / 1000;
		const itemsPerSecond = loaded / duration;
		return `${bytes(itemsPerSecond)}/sec`;
	}
}
