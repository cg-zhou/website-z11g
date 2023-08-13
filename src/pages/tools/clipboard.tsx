import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import ToolLayout from "../../components/ToolLayout";
import { LanguageContext } from "@/components/languages/LanguageProvider";
import { useClipboard } from 'use-clipboard-copy';

export default function File() {
  const [code, setCode] = useState('');

  const { localize } = useContext(LanguageContext);
  const clipboard = useClipboard();

  const handleCopy = () => {
    clipboard.copy(code);
  };

  useEffect(() => {
    let files: any = null;

    async function uploadFiles() {

      const formData = new FormData();
      formData.append("code", "empty");
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        formData.append(`file_${i}`, file);
      }

      try {
        const response = await fetch("/api/clipboard", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();

        setCode(result.code as string);

        console.log("Success:", result);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    let uploadButton = document.getElementById("upload") as HTMLButtonElement;
    uploadButton.addEventListener(
      "click",
      function () {
        console.log('clicked');
        uploadFiles();
      }
    );

    let fileInput = document.getElementById("file-input") as any;
    fileInput.addEventListener("change", function (e: any) {
      if (e.target.files) {
        files = e.target.files;
      }
    });

    let downloadButton = document.getElementById("download") as HTMLButtonElement;
    downloadButton.addEventListener(
      "click",
      function () {
        let fileInput = document.getElementById("download-file-code") as HTMLInputElement;
        const url = `/api/clipboard?code=${fileInput.value}`;
        window.open(url, '_blank');
      }
    );
  }, []);

  const codeRowStyle = {
    display: 'flex',
    columnGap: '5px',
    alignItems: 'center'
  };

  return (
    <ToolLayout>
      <Head>
        <title>{localize("clipboard_page_title")}</title>
      </Head>
      <h3>{localize("clipboard_step1_title")}</h3>
      <input type="file" id="file-input" />
      <div>
        <button id="upload">{localize("clipboard_step1_upload")}</button>
      </div>
      {code &&
        <div style={codeRowStyle}>
          <span>{localize("clipboard_step1_upload_success")}</span>
          <span>{code}</span>
          <button onClick={handleCopy} id="copy">{localize("clipboard_step1_copy")}</button>
        </div>}
      <h3>{localize("clipboard_step2_title")}</h3>
      <input type='text' id="download-file-code" placeholder={localize("clipboard_step2_code_placeholder")} />
      <div>
        <button id="download">{localize("clipboard_step2_download")}</button>
      </div>
    </ToolLayout>
  );
}
