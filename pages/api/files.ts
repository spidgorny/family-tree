// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { handleGet } from "../../lib/api-handler";
import dirTree from "directory-tree";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return handleGet(req, res, async () => {
    let cwd = process.cwd();
    let files = dirTree(".", { exclude: /node_modules|.git/ });
    return { cwd, files };
  });
}
