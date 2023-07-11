import Head from "next/head";
import { useContext, useEffect } from "react";
import ToolLayout from "../../components/ToolLayout";
import { LanguageContext } from "@/components/languages/LanguageProvider";

export default function Image() {
  const { localize, language } = useContext(LanguageContext);

  let img: any = null;

  useEffect(() => {
    let fileNameWithoutExtension = "image";
    let fileNameExtension = ".jpg";

    const widthInput = document.getElementById("width-input") as any;
    const heightInput = document.getElementById("height-input") as any;

    let keepRatioCheckbox = document.getElementById("keepRatioCheckbox") as any;
    keepRatioCheckbox.checked = true;

    let grayscaleCheckbox = document.getElementById("grayscaleCheckbox") as any;
    grayscaleCheckbox.checked = false;

    let invertCheckbox = document.getElementById("invertCheckbox") as any;
    invertCheckbox.checked = false;

    widthInput.addEventListener("input", (event: any) => {
      if (keepRatioCheckbox.checked) {
        heightInput.value = Math.floor(
          (event.target.value / img.naturalWidth) * img.naturalHeight
        );
      }
      refresh(event.target.value, heightInput.value);
    });

    heightInput.addEventListener("input", (event: any) => {
      if (keepRatioCheckbox.checked) {
        widthInput.value = Math.floor(
          (event.target.value / img.naturalHeight) * img.naturalWidth
        );
      }
      refresh(widthInput.value, event.target.value);
    });

    grayscaleCheckbox.addEventListener("input", () => {
      refresh(widthInput.value, heightInput.value);
    });

    invertCheckbox.addEventListener("input", () => {
      refresh(widthInput.value, heightInput.value);
    });

    let ratioButtons = document.querySelectorAll(".ratio-button");
    for (let button of ratioButtons as any) {
      button.addEventListener("click", function () {
        let ratio = parseFloat(button.getAttribute("data-ratio"));
        widthInput.value = Math.floor(ratio * img.naturalWidth);
        heightInput.value = Math.floor(ratio * img.naturalHeight);

        refresh(widthInput.value, heightInput.value);
      });
    }

    function invert(ctx: any, canvas: any) {
      var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      var data = imageData.data;

      // invert colors
      for (var i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
        data[i + 3] = 255;
      }

      ctx.putImageData(imageData, 0, 0);
    }

    function grayscale(ctx: any, canvas: any) {
      // get the image data from the canvas
      var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      var data = imageData.data;

      // iterate over all pixels and convert to grayscale
      for (var i = 0; i < data.length; i += 4) {
        var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg; // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
      }

      // update the canvas with the new image data
      ctx.putImageData(imageData, 0, 0);
    }

    function refresh(width: any, height: any) {
      if (width < 1 || width > 100000 || height < 1 || height > 100000) {
        console.warn("invalid width / height value.");
      }

      // dynamically create a canvas element
      var canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      var ctx = canvas.getContext("2d") as any;
      ctx.drawImage(img, 0, 0, width, height);

      if (grayscaleCheckbox.checked) {
        grayscale(ctx, canvas);
      }

      if (invertCheckbox.checked) {
        invert(ctx, canvas);
      }

      // show resized image in preview element
      let dataUrl = canvas.toDataURL(`image/${fileNameExtension.substring(1)}`);
      (document.getElementById("preview") as any).src = dataUrl;

      // update download link
      let x_img = document.getElementById("preview") as any;
      let link = document.getElementById("download-link") as any;
      link.href = x_img.src;
      link.setAttribute(
        "download",
        `new-${fileNameWithoutExtension}_${width}x${height}${fileNameExtension}`
      );
    }

    let imgInput = document.getElementById("image-input") as any;
    imgInput.addEventListener("change", function (e: any) {
      if (e.target.files) {
        let imageFile = e.target.files[0];
        if (!imageFile) {
          return;
        }

        var index = imageFile.name.lastIndexOf(".");
        if (index > 0) {
          fileNameWithoutExtension = imageFile.name.slice(0, index);
          fileNameExtension = imageFile.name.slice(index);
        } else {
          fileNameWithoutExtension = "image";
          fileNameExtension = ".jpg";
        }

        var reader = new FileReader();
        reader.onload = function (e) {
          img = document.createElement("img");
          img.onload = function (event: any) {
            console.log(
              `Image size: ${img.naturalWidth} x ${img.naturalHeight}`
            );

            widthInput.value = img.naturalWidth;
            heightInput.value = img.naturalHeight;

            refresh(img.naturalWidth, img.naturalHeight);
          };
          img.src = (e.target as any).result;
        };
        reader.readAsDataURL(imageFile);
      }
    });
  }, []);

  const labelStyle = { minWidth: language === "cn" ? 80 : 140 };
  return (
    <ToolLayout>
      <Head>
        <title>{localize("image_processor_page_title")}</title>
      </Head>
      <h3>{localize("image_processor_step1_title")}</h3>
      <input type="file" id="image-input" accept="image/*" />
      <h3>{localize("image_processor_step2_title")}</h3>
      <div className="row">
        <label style={labelStyle}>
          {localize("image_processor_step2_grayscale")}
        </label>
        <input type="checkbox" id="grayscaleCheckbox" />
      </div>
      <div className="row">
        <label style={labelStyle}>
          {localize("image_processor_step2_reverse_color")}
        </label>
        <input type="checkbox" id="invertCheckbox" />
      </div>
      <div className="row">
        <label style={labelStyle}>
          {localize("image_processor_step2_keep_ratio")}
        </label>
        <input type="checkbox" id="keepRatioCheckbox" />
      </div>
      <div className="row">
        <label style={labelStyle}>
          {localize("image_processor_step2_width")}
        </label>
        <input type="number" id="width-input" />
      </div>
      <div className="row">
        <label style={labelStyle}>
          {localize("image_processor_step2_height")}
        </label>
        <input type="number" id="height-input" />
      </div>
      <div className="row" style={{ columnGap: 5 }}>
        <label style={labelStyle}>
          {localize("image_processor_step2_one_key_setup")}
        </label>
        <button className="ratio-button" data-ratio="1">
          100%
        </button>
        <button className="ratio-button" data-ratio="0.8">
          80%
        </button>
        <button className="ratio-button" data-ratio="0.5">
          50%
        </button>
        <button className="ratio-button" data-ratio="0.25">
          25%
        </button>
        <button className="ratio-button" data-ratio="0.1">
          10%
        </button>
      </div>
      <h3>{localize("image_processor_step3_title")}</h3>
      <div style={{ maxWidth: "80vw", maxHeight: "50vh", overflow: "auto" }}>
        <img id="preview"></img>
      </div>
      <h3>{localize("image_processor_step4_title")}</h3>
      <div>
        <a id="download-link" href="#">
          <button>{localize("image_processor_step4_download")}</button>
        </a>
      </div>
    </ToolLayout>
  );
}
