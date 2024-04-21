function isValidDate(dateObject) {
	return new Date(dateObject).toString() !== "Invalid Date";
}

export function utcDate(now: Date | "") {
	if (!(now instanceof Date)) {
		return now;
	}
	return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
		.toISOString()
		.substring(0, 10);
}
