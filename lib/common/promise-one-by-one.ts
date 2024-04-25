export async function PromiseOneByOne(promiseList = []) {
	let results = [];
	for (let promise of promiseList) {
		results.push(await promise);
	}
	return results;
}
