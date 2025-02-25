import Head from "next/head";
import { useContext, useEffect, useState, useRef } from "react";
import ToolLayout from "../../components/ToolLayout";
import { LanguageContext } from "@/components/languages/LanguageProvider";
import { useClipboard } from 'use-clipboard-copy';
import axios, { AxiosRequestConfig } from "axios";
import { CodeInput } from '@/components/inputs/CodeInput';
import { MessageDialog } from '@/components/common/MessageDialog';

type ExtractResult = {
  isSuccess: boolean;
  fileInfo: PreviewFile
  errorMessage?: string;
}

type PreviewFile = {
  name: string;
  path: string;
  size: number;
  mimetype: string;
  uploadDate: Date;
  expiryDate: Date;
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
  const [expiryTime, setExpiryTime] = useState<'2hours' | '1day' | '1week'>('2hours');
  const [remainingTime, setRemainingTime] = useState<string>('');
  const [showError, setShowError] = useState(false);
  const [showMessage, setShowMessage] = useState<{show: boolean, message: string, type: 'error' | 'success'}>({
    show: false,
    message: '',
    type: 'error'
  });

  const { localize } = useContext(LanguageContext);
  const clipboard = useClipboard();

  const handleCopy = (text: string) => {
    clipboard.copy(text);
    const displayText = text.length > 30 ? text.substring(0, 30) + '...' : text;
    setShowMessage({
      show: true,
      message: localize("clipboard_step2_copied") + ': ' + displayText,
      type: 'success'
    });
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
    formData.append("expiryTime", expiryTime);
  };

  const buildFilesForm = async (formData: FormData) => {
    formData.append("uploadType", "text");
    formData.append("expiryTime", expiryTime);
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
    try {
      const response = await axios.get(url);
      console.log(response.data);
      setExtractResult(response.data);
      setShowError(response.data.isSuccess === false);

      if (response.data.isSuccess && 
          response.data.fileInfo.mimetype.toLowerCase().startsWith('text/')) {
        const textUrl = `/api/clipboard?code=${inputCode}`;
        const textResponse = await axios.get(textUrl);
        setPreviewText(`${textResponse.data}`);
      }
    } catch (error) {
      console.error(error);
      setExtractResult({
        isSuccess: false,
        errorMessage: 'clipboard_step1_extract_failed',
        fileInfo: {
          name: '',
          path: '',
          size: 0,
          mimetype: '',
          uploadDate: new Date(),
          expiryDate: new Date()
        }
      });
      setShowError(true);
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

  const getExpiryDate = () => {
    const now = new Date();
    switch (expiryTime) {
      case '2hours':
        return new Date(now.getTime() + 2 * 60 * 60 * 1000);
      case '1day':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case '1week':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() + 2 * 60 * 60 * 1000);
    }
  };

  const getRemainingTime = (expiryDate: Date) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return "0:00:00";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (extractResult?.isSuccess) {
      // 立即更新一次
      setRemainingTime(getRemainingTime(extractResult.fileInfo.expiryDate));

      // 计算到下一秒的延迟
      const now = new Date();
      const delay = 1000 - now.getMilliseconds();

      // 首次延迟到下一秒的整数时间点
      const initialTimeout = setTimeout(() => {
        setRemainingTime(getRemainingTime(extractResult.fileInfo.expiryDate));
        
        // 然后每秒更新一次
        const timer = setInterval(() => {
          setRemainingTime(getRemainingTime(extractResult.fileInfo.expiryDate));
        }, 1000);

        return () => clearInterval(timer);
      }, delay);

      return () => clearTimeout(initialTimeout);
    }
  }, [extractResult]);

  // 修改格式化错误信息的函数
  const formatErrorMessage = (errorMessage: string, fileInfo?: any) => {
    if (errorMessage === 'clipboard_step1_expired' && fileInfo?.expiryDate) {
      return localize(errorMessage).replace(
        '{time}',
        new Date(fileInfo.expiryDate).toLocaleString()
      );
    }
    // 如果是提取失败，直接返回本地化的消息，不需要替换参数
    if (errorMessage === 'clipboard_step1_extract_failed') {
      return localize(errorMessage).replace('{reason}', '');
    }
    return localize(errorMessage);
  };

  return (
    <ToolLayout>
      <Head>
        <title>{localize("clipboard_page_title")}</title>
      </Head>
      <h3>{localize("clipboard_step1_title")}</h3>
      <input ref={selectFileInputRef} onChange={onSelectedFilesChange} type="file" />
      <div className="font-bold">{localize("clipboard_step1_or")}</div>
      <textarea rows={3} cols={20} value={inputText} onChange={inputTextChange} style={{ maxWidth: "50vw" }} />
      <div className="flex flex-row mt-2">
        <div style={{ minWidth: "7rem" }}>{localize("clipboard_step1_expiry")}</div>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="2hours"
              checked={expiryTime === '2hours'}
              onChange={(e) => setExpiryTime(e.target.value as any)}
              className="mr-2"
            />
            {localize("clipboard_step1_expiry_2hours")}
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="1day"
              checked={expiryTime === '1day'}
              onChange={(e) => setExpiryTime(e.target.value as any)}
              className="mr-2"
            />
            {localize("clipboard_step1_expiry_1day")}
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="1week"
              checked={expiryTime === '1week'}
              onChange={(e) => setExpiryTime(e.target.value as any)}
              className="mr-2"
            />
            {localize("clipboard_step1_expiry_1week")}
          </label>
        </div>
      </div>
      <div className="mt-2">
        <button onClick={onUploadClicked}>{localize("clipboard_step1_upload")}</button>
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
      {showMessage.show && (
        <MessageDialog
          message={showMessage.message}
          type={showMessage.type}
          onClose={() => setShowMessage({...showMessage, show: false})}
        />
      )}

      {hasError && showError && (
        <MessageDialog
          message={formatErrorMessage(
            extractResult.errorMessage || 'clipboard_step1_extract_failed',
            extractResult.fileInfo
          )}
          type="error"
          onClose={() => setShowError(false)}
        />
      )}

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
              <div>{localize("clipboard_step3_upload_time")}</div>
              <div>
                {`${new Date(extractResult.fileInfo.uploadDate).toLocaleString()}`}
              </div>
            </div>
            <div className="flex flex-row">
              <div>{localize("clipboard_step3_expiry_duration")}</div>
              <div>
                {remainingTime}
              </div>
            </div>
            <div className="flex flex-row">
              <div>{localize("clipboard_step3_expiry_time")}</div>
              <div>
                {`${new Date(extractResult.fileInfo.expiryDate).toLocaleString()}`}
              </div>
            </div>
          </div>

          {
            // preview image
            isImage
            && <div style={{ maxWidth: "20rem", maxHeight: "20rem", overflow: "auto" }} className="mb-4">
              <img alt={extractResult.fileInfo.name} src={extractResult.fileInfo.path} />
            </div>
          }

          {
            // preview text
            isText
            && <textarea style={{ maxWidth: "50vw", overflow: "auto" }} className="mb-4" readOnly={true} value={previewText} rows={6} />
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
      }
    </ToolLayout>
  );
}
