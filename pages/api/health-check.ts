// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { handleGet } from "../../lib/api-handler";
import { getDb } from "../../lib/mysql/db-config";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return handleGet(req, res, async () => {
    const db = await getDb();
    const [people] = await db.query("select count(*) from people");
    return { people };
  });
}
