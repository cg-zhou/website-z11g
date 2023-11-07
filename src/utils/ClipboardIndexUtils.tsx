import fs from 'fs';

type FileItem = {
    name: string;
    path: string;
    size: number;
    mimetype: string;
    uploadDate: Date;
    lastModifiedDate: Date;
}

type ClipboardIndexItem = {
    code: string;
    files: FileItem[];
}

type ClipboardIndex = ClipboardIndexItem[];

export class ClipboardIndexUtils {
    static generateCode(): string {
        return Math.floor(Math.random() * 999999).toString(10).padStart(6, '0').toUpperCase();
    }

    static load(): ClipboardIndex {
        const jsonPath = './app_data/clipboard/index.json';

        let json = '[]';
        if (fs.existsSync(jsonPath)) {
            json = fs.readFileSync(jsonPath, 'utf8');
        }

        const data = JSON.parse(json);
        return data as ClipboardIndex;
    }

    static save(clipboardIndex: ClipboardIndex) {
        const storageFolder = `./app_data/clipboard/`;
        if (!fs.existsSync(storageFolder)) {
            fs.mkdirSync(storageFolder, { recursive: true });
        }

        const storageFile = `${storageFolder}/index.json`;
        const json = JSON.stringify(clipboardIndex, null, 2);

        fs.writeFileSync(storageFile, json);
    }

    static appendFileIndex(
        code: string,
        file: FileItem) {
        let clipboardIndex = ClipboardIndexUtils.load();
        clipboardIndex.push({
            code,
            files: [file]
        });
        ClipboardIndexUtils.save(clipboardIndex);
    }
}