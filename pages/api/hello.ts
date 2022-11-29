// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { handleGet } from "../../lib/api-handler";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  return handleGet(req, res, () => {
    return { name: "John Doe" };
  });
}
