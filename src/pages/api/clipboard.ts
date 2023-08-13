import { ClipboardIndexUtils } from '@/utils/ClipboardIndexUtils';
import { IncomingForm, Fields, Files } from 'formidable';
import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface FormidableData {
  fields: Fields;
  files: Files;
}

async function upload(req: NextApiRequest,
  res: NextApiResponse) {
  try {
    const data: FormidableData = await new Promise((resolve, reject) => {
      const form = new IncomingForm();
      form.parse(req, (err: any, fields: any, files: any) => {
        if (err) {
          reject({ err })
        };

        resolve({ fields, files });
      });
    });

    console.log(data.files);

    const code = ClipboardIndexUtils.generateCode();
    const storageFolder = `./app_data/clipboard/${code}`;
    if (!fs.existsSync(storageFolder)) {
      fs.mkdirSync(storageFolder, { recursive: true });
    }

    for (const fileArray of Object.values(data.files)) {
      const file = (fileArray as any)[0];
      const readStream = fs.createReadStream(file.filepath);

      const storagePath = `${storageFolder}/${file.originalFilename}`;
      const writeStream = fs.createWriteStream(storagePath);
      readStream.pipe(writeStream);

      ClipboardIndexUtils.appendFileIndex(
        code,
        {
          name: file.originalFilename,
          size: file.size,
          path: storagePath,
          mimetype: file.mimetype,
          lastModifiedDate: file.lastModifiedDate,
          uploadDate: new Date()
        });
    }

    res.status(200).json({ code });
  } catch (error) {
    console.log(error);
    res.status(500).json('An error occurred while uploading the file');
  }
}

async function download(req: NextApiRequest,
  res: NextApiResponse) {
  const code = req.query.code as string;
  console.log('The file code is:' + code);
  if (!code) {
    throw new Error("the code can't be empty");
  }

  try {
    const clipboardIndex = ClipboardIndexUtils.load();
    for (let i = 0; i < clipboardIndex.length; i++) {
      const fileIndexItem = clipboardIndex[i];
      if (fileIndexItem.code == code) {
        let file = fileIndexItem.files[0];
        const fileStream = fs.createReadStream(file.path);
        res.setHeader('Content-Type', file.mimetype);
        res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`);
        fileStream.pipe(res);
      }
    }
  } catch (e) {
    console.error(e);
    res.status(404);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse) {

  if (req.method == 'POST') {
    await upload(req, res);
  } else if (req.method == 'GET') {
    await download(req, res);
  } else {
    res.status(500).json('Unsupported method');
  }
};