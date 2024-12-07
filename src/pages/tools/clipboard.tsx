import Head from "next/head";
import { useContext, useEffect, useState, useRef } from "react";
import ToolLayout from "../../components/ToolLayout";
import { LanguageContext } from "@/components/languages/LanguageProvider";
import { useClipboard } from 'use-clipboard-copy';
import axios, { AxiosRequestConfig } from "axios";
import { CodeInput } from '@/components/inputs/CodeInput';

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

export default function Clipboard(props: any) {
  const selectFileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadingInfo, setUploadingInfo] = useState('');
  const [inputText, setInputText] = useState('');
  const [fileCode, setFileCode] = useState('');
  const [fileCodeInputKey, setFileCodeInputKey] = useState('');
  const [extractResult, setExtractResult] = useState<ExtractResult | null>(null);
  const [previewText, setPreviewText] = useState('');

  const { localize } = useContext(LanguageContext);
  const clipboard = useClipboard();

  const handleCopy = (text: string) => {
    clipboard.copy(text);
    const displayText = text.length > 10 ? text.substring(0, 10) : text;
    alert(localize("clipboard_step2_copied") + ': ' + displayText);
  };

  const refreshFileCodeInput = (fileCode: string) => {
    setFileCode(fileCode);
    setFileCodeInputKey(Math.random().toString());
    refreshPreview(fileCode);
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

    setFileCode("");
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
      const uploadedCode = response.data.code as string;

      setUploadingInfo("");
      console.log("Success:", response);

      if (selectFileInputRef.current) {
        selectFileInputRef.current.value = '';
      }
      setInputText('');

      refreshFileCodeInput(uploadedCode);
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
    const url = `/api/clipboard?code=${fileCode}`;
    window.open(url, '_blank');
  }

  const inputTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  const onFileCodeChanged = async (text: string) => {
    console.log(text);

    const inputCode = text.trim().toUpperCase();
    setFileCode(inputCode);

    refreshPreview(inputCode);
  };

  const refreshPreview = (code: string) => {
    if (code.length == 6) {
      extract(code);
    } else {
      setExtractResult(null);
    }
  }

  const getDisplaySize = (size: number) => {
    if (size < 1024) {
      return size + ' B';
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(1) + ' KB';
    } else if (size < 1024 * 1024 * 1024) {
      return (size / 1024 / 1024).toFixed(1) + ' MB';
    }
    return (size / 1024 / 1024 / 1024).toFixed(1) + ' GB';
  }

  const isImage = extractResult?.isSuccess
    && extractResult.fileInfo.mimetype.toLowerCase().startsWith('image/');
  const isText = extractResult?.isSuccess
    && extractResult.fileInfo.mimetype.toLowerCase().startsWith('text/');
  const hasError = extractResult && !extractResult.isSuccess;
  const isSuccess = extractResult && extractResult.isSuccess;

  return (
    <ToolLayout>
      <Head>
        <title>{localize("clipboard_page_title")}</title>
      </Head>
      <h3>{localize("clipboard_step1_title")}</h3>
      <input ref={selectFileInputRef} onChange={onSelectedFilesChange} type="file" />
      <div className="font-bold">{localize("clipboard_step1_or")}</div>
      <textarea rows={3} cols={20} value={inputText} onChange={inputTextChange} style={{ maxWidth: "80vw" }} />
      <div className="mt-2">
        <button onClick={onUploadClicked} >{localize("clipboard_step1_upload")}</button>
      </div>
      {
        uploadingInfo.length > 0 &&
        <div>{`${uploadingInfo}`}</div>
      }

      <h3>{localize("clipboard_step2_title")}</h3>
      <CodeInput value={fileCode} onChange={onFileCodeChanged} fields={6} />

      {/* copy extraction code */}
      {
        fileCode &&
        <div className="flex gap-4 mt-2">
          <button onClick={() => handleCopy(fileCode)}>{localize("clipboard_step1_copy")}</button>
          <button onClick={() => refreshFileCodeInput('')}>{localize("clipboard_step1_clear")}</button>
        </div>
      }
      {
        hasError && <div>{`Failed to extract ${fileCode}`}</div>
      }

      {
        isSuccess &&
        <div>
          <h3>{localize("clipboard_step3_title")}</h3>

          <div className="clipboard-preview-file-info my-2">
            {/* upload info */}
            <div>
              <div>{localize("clipboard_step3_name")}</div>
              <div>
                {`${extractResult.fileInfo.name}`}
              </div>
            </div>
            <div>
              <div>{localize("clipboard_step3_size")}</div>
              <div>
                {`${getDisplaySize(extractResult.fileInfo.size)}`}
              </div>
            </div>
            <div className="flex flex-row">
              <div style={{ minWidth: "8rem" }}>{localize("clipboard_step3_upload_time")}</div>
              <div>
                {`${new Date(extractResult.fileInfo.uploadDate).toLocaleString()}`}
              </div>
            </div>

            {
              // preview image
              isImage
              && <div style={{ maxWidth: "80vw", maxHeight: "50vh", overflow: "auto" }}>
                <img alt={extractResult.fileInfo.name} src={extractResult.fileInfo.path} />
              </div>
            }

            {
              // preview text
              isText
              && <textarea style={{ maxWidth: "80vw", overflow: "auto" }} readOnly={true} value={previewText} rows={6} />
            }

            {
              // copy or download
              <div className="flex flex-row gap-3 items-center">
                <button onClick={download}>{localize("clipboard_step2_download")}</button>
                {
                  isText
                  && <button onClick={() => handleCopy(previewText)}>{localize("clipboard_step3_copy_text")}</button>
                }
              </div>
            }
          </div>
        </div>
      }
    </ToolLayout>
  );
}
