// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import * as fs from "fs/promises";
import { parseStringPromise } from "xml2js";
import { serverPath } from "../../lib/next-js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("cwd", process.cwd());
  let xml = await fs.readFile(serverPath("public/export.xml"), "utf8");
  let tree = await parseStringPromise(xml, {
    trim: true,
    explicitArray: false,
    mergeAttrs: true,
  });
  // console.log(tree);
  res.status(200).json(tree);
}
