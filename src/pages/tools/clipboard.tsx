import Head from "next/head";
import { useContext, useEffect, useState, useRef } from "react";
import ToolLayout from "../../components/ToolLayout";
import { LanguageContext } from "@/components/languages/LanguageProvider";
import { useClipboard } from 'use-clipboard-copy';
import axios, { AxiosRequestConfig } from "axios";
import InputBoxes from "@/components/InputBoxes";

type ExtractResult = {
  isSuccess: boolean;
  fileInfo: PreviewFile
}

type PreviewFile = {
  name: string;
  path: string;
  size: number;
  mimetype: string;
  uploadDate: Date;
}

export default function File() {
  const selectFileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [code, setCode] = useState('');
  const [uploadingInfo, setUploadingInfo] = useState('');
  const [inputText, setInputText] = useState('');
  const [inputFileCode, setInputFileCode] = useState('');
  const [extractResult, setExtractResult] = useState<ExtractResult | null>(null);
  const [previewText, setPreviewText] = useState('');

  const { localize } = useContext(LanguageContext);
  const clipboard = useClipboard();

  const handleCopy = () => {
    clipboard.copy(code);
  };

  const handleCopyPreviewText = () => {
    clipboard.copy(previewText);
  };

  const onUploadClicked = async () => {

    let formData = new FormData();
    if (selectedFiles.length > 0) {
      await buildFilesForm(formData);
    }
    else if (inputText.length > 0) {
      await buildTextForm(formData);
    }
    else {
      alert(localize("clipboard_step1_select_file_or_input"));
      return;
    }

    setCode("");
    setUploadingInfo("");

    try {
      const config: AxiosRequestConfig = {
        onUploadProgress: progressEvent => {
          const uploading = localize("clipboard_step1_uploading");
          const progress = `${(progressEvent.loaded / 1024 / 1024).toFixed(1)} / ${(progressEvent.total as number / 1024 / 1024).toFixed(1)} MB`;
          setUploadingInfo(`${uploading} ${progress}`);
        }
      }

      const response = await axios.post("/api/clipboard", formData, config);
      setCode(response.data.code as string);
      setUploadingInfo("");
      console.log("Success:", response);

      if (selectFileInputRef.current) {
        selectFileInputRef.current.value = '';
      }
      setInputText('');

    } catch (error) {
      console.error("Error:", error);
    }
  };

  const buildTextForm = async (formData: FormData) => {
    formData.append("uploadType", "file");
    formData.append("userInputText", inputText);
  };

  const buildFilesForm = async (formData: FormData) => {
    formData.append("uploadType", "text");
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      formData.append(`file_${i}`, file);
    }
  };

  const onSelectedFilesChange = (e: any) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
    }
  }

  const extract = async (inputCode: string) => {
    const url = `/api/clipboard?code=${inputCode}&onlyGetFileInfo=true`;
    const response = await axios.get(url);
    console.log(response.data);
    setExtractResult(response.data);

    var extractResult = response.data as ExtractResult;
    if (extractResult.isSuccess) {
      if (extractResult.fileInfo.mimetype.toLowerCase().startsWith('text/')) {
        const url = `/api/clipboard?code=${inputCode}`;
        const response = await axios.get(url);
        setPreviewText(`${response.data}`);
      }
    }
  }

  const download = () => {
    const url = `/api/clipboard?code=${inputFileCode}`;
    window.open(url, '_blank');
  }

  const inputTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  const onInputFileCodeChanged = async (text: string) => {
    console.log(text);

    const inputCode = text.trim().toUpperCase();
    await setInputFileCode(inputCode);
    if (inputCode.length == 6) {
      extract(inputCode);
    } else {
      setExtractResult(null);
    }
  };

  const isImage = extractResult?.isSuccess
    && extractResult.fileInfo.mimetype.toLowerCase().startsWith('image/');
  const isText = extractResult?.isSuccess
    && extractResult.fileInfo.mimetype.toLowerCase().startsWith('text/');
  const hasError = extractResult && !extractResult.isSuccess;
  return (
    <ToolLayout>
      <Head>
        <title>{localize("clipboard_page_title")}</title>
      </Head>
      <h3>{localize("clipboard_step1_title")}</h3>
      <input ref={selectFileInputRef} onChange={onSelectedFilesChange} type="file" />
      <div className="font-bold">{localize("clipboard_step1_or")}</div>
      <textarea rows={3} cols={20} value={inputText} onChange={inputTextChange} style={{ maxWidth: "80vw" }} />
      <div>
        <button onClick={onUploadClicked} >{localize("clipboard_step1_upload")}</button>
      </div>
      {
        uploadingInfo.length > 0 &&
        <div>{`${uploadingInfo}`}</div>
      }
      {
        code &&
        <div>
          <div>{localize("clipboard_step1_upload_success")}</div>
          <div className="flex flex-row gap-3 items-center">
            <div className="font-bold my-2 text-2xl">{code}</div>
            <button onClick={handleCopy}>{localize("clipboard_step1_copy")}</button>
          </div>
        </div>
      }
      <h3>{localize("clipboard_step2_title")}</h3>
      <InputBoxes text='' onInputChange={onInputFileCodeChanged} />
      {/* <input type='text' onChange={onInputFileCodeChanged} placeholder={localize("clipboard_step2_code_placeholder")} /> */}
      {
        isImage
        && <div style={{ maxWidth: "80vw", maxHeight: "50vh", overflow: "auto" }}>
          <img alt={extractResult.fileInfo.name} src={extractResult.fileInfo.path}></img>
        </div>
      }
      {
        isText
        && <textarea style={{ maxWidth: "80vw", maxHeight: "50vh", overflow: "auto" }} readOnly={true} value={previewText} />
      }
      {
        hasError
        && <div>{`Failed to extract ${inputFileCode}`}</div>
      }
      <div className="flex flex-row gap-3 items-center">
        {
          isText
          && <button onClick={handleCopyPreviewText}>{localize("clipboard_step1_copy")}</button>
        }
        <button onClick={download}>{localize("clipboard_step2_download")}</button>
      </div>
    </ToolLayout>
  );
}
