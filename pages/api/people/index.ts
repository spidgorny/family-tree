import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "../../../lib/mysql/db-config";
import { handleGet } from "../../../lib/api-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return handleGet(req, res, async () => {
    const db = await getDb();
    const people = await db.people.select({});
    return { people };
  });
}
