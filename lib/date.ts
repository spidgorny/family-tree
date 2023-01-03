function isValidDate(dateObject) {
	return new Date(dateObject).toString() !== "Invalid Date";
}
