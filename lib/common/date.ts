function isValidDate(dateObject) {
	return new Date(dateObject).toString() !== "Invalid Date";
}

export function utcDate(now: Date | "" | undefined | null) {
	if (!(now instanceof Date)) {
		return now;
	}
	return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
		.toISOString()
		.substring(0, 10);
}

let lastTime = Date.now();
export async function onlyOncePerSecond(
	someCode: (() => Promise<void>) | (() => void),
) {
	let sinceLastTime = Date.now() - lastTime;
	if (sinceLastTime < 1000) {
		return;
	}
	await someCode();
	lastTime = Date.now();
}
