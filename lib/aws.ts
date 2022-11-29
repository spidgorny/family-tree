import {AWSUtils} from "./aws-utils";

export async function getSherpaAuthParameters() {
	const u = new AWSUtils();
	const [p1, p2] = await Promise.all([
		u.getParameter(
			"/noe/it/web/Sherpa/MasterKey/Api/ClientId",
			true),
		u.getParameter(
			"/noe/it/web/Sherpa/MasterKey/Api/Secret",
			true
		)]);
	return [p1.Value, p2.Value];
}
