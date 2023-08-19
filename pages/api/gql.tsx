// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  response: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method == "POST") {
    let body = JSON.parse(req.body);

    let sid = body.sid || "";
    let data = await fetch("https://replit.com/graphql", {
      method: "POST",
      headers: {
        cookie: "connect.sid=" + sid,
        "User-Agent": "Mozilla/5.0",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        Referrer: "https://replit.com/",
      },
      body: JSON.stringify({
        query: body.query,
        variables: body.variables,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        return data;
      });

    res.status(200).json({ response: { success: true, data: data.data } });
  } else {
    res.status(405).json({ response: { success: false } });
  }
}
