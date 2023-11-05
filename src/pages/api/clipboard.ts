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

async function upload(
  req: NextApiRequest,
  res: NextApiResponse) {
  try {
    const data: FormidableData = await new Promise((resolve, reject) => {
      const form = new IncomingForm({
        maxFileSize: 10 * 1024 * 1024 * 1024,
        maxFieldsSize: 100 * 1024 * 1024
      });

      form.parse(req, (err: any, fields: any, files: any) => {
        if (err) {
          reject({ err })
        };

        resolve({ fields, files });
      });
    });

    console.log(data);

    const code = ClipboardIndexUtils.generateCode();
    const storageFolder = `./app_data/clipboard/${code}`;
    if (!fs.existsSync(storageFolder)) {
      fs.mkdirSync(storageFolder, { recursive: true });
    }

    var files = Object.values(data.files);
    if (files.length > 0) {
      for (const fileArray of files) {
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
    } else {
      const userInputText = data.fields.userInputText[0];
      const fileName = 'text.txt';
      const storagePath = `${storageFolder}/${fileName}`;
      const writeStream = fs.createWriteStream(storagePath);
      writeStream.write(userInputText);
      writeStream.close();
      ClipboardIndexUtils.appendFileIndex(
        code,
        {
          name: fileName,
          size: userInputText.length,
          path: storagePath,
          mimetype: 'text/plain',
          lastModifiedDate: new Date(),
          uploadDate: new Date()
        });
    }

    res.status(200).send({ code });
  } catch (error) {
    console.log('Upload failed:');
    console.log(error);
    res.status(500).send('Upload failed:');
  }
}

async function get(req: NextApiRequest,
  res: NextApiResponse) {

  const code = req.query.code as string;
  const onlyGetFileInfo = req.query.onlyGetFileInfo == 'true';

  console.log('onlyGetFileInfo = ' + (onlyGetFileInfo == true));
  console.log('The file code is:' + code);

  if (!code) {
    throw new Error("the code can't be empty");
  }

  let hasFindFile: Boolean = false;
  try {
    const clipboardIndex = ClipboardIndexUtils.load();
    for (let i = 0; i < clipboardIndex.length; i++) {
      const fileIndexItem = clipboardIndex[i];
      if (fileIndexItem.code == code) {

        hasFindFile = true;
        let file = fileIndexItem.files[0];

        if (onlyGetFileInfo == true) {
          file.path = `/api/clipboard?code=${code}`;
          res.status(200).json({
            isSuccess: true,
            fileInfo: file
          });
          return;
        } else {
          const fileStream = fs.createReadStream(file.path);
          res.setHeader('Content-Type', file.mimetype);
          res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`);
          fileStream.pipe(res);
          return;
        }
      }
    }
  } catch (e) {
    console.error(e);
    res.status(404);
    return;
  }

  res.status(200).json({
    isSuccess: false
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse) {

  if (req.method == 'POST') {
    await upload(req, res);
  } else if (req.method == 'GET') {
    await get(req, res);
  } else {
    res.status(500).json('Unsupported method');
  }
};