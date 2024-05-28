import { NextApiRequest, NextApiResponse } from "next";
import formidable, { File as FormidableFile, Fields, Files } from "formidable";
import { IncomingMessage } from "http"; // Necessary for form.parse()
import cors from "cors";
export const config = {
  api: {
    bodyParser: false
  }
};

const corsMiddleware = cors({
  methods: ["POST", "DELETE"]
}); 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) 
{
  
  const { method } = req;
  console.log(req.body)
  console.log("Method",method);
  // await runMiddleware(req, res,corsMiddleware);
  switch (method) {
    case "POST": {
      const { fields, files } = await parseForm(req);

      if (!fields.orgId || !fields.uploaderId || !files.file) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      let orgId = fields.orgId as unknown as string;
      const uploaderId = fields.uploaderId as unknown as string;
      const file = files.file as unknown as FormidableFile;
      console.log(orgId, uploaderId, file);
      try {
        return res
          .status(201)
          .json({ message: "Document uploaded successfully" });
      } catch (error) {
        return res.status(500).json(error);
      }
    }

    case "DELETE": {
      const readable = req.read();
      const buffer = Buffer.from(readable);
      const body = JSON.parse(buffer.toString());
      const { orgId, docId } = body;
      console.log(orgId, docId);
      try {
        return res.status(200).json({ message: "Document successfully" });
      } catch (error) {
        console.log(error);
        return res.status(500).json(error);
      }
    }

    default:
      res.setHeader("Allow", ["POST", "DELETE"]);
      res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}

const parseForm = (
  req: NextApiRequest
): Promise<{ fields: Fields; files: Files }> => {
  const form = formidable({ multiples: true });
  return new Promise((resolve, reject) => {
    form.parse(req as IncomingMessage, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
};
