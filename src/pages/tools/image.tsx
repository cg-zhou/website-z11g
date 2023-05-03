import Head from "next/head";
import { useEffect } from "react";

export default function Image() {
  useEffect(() => {
    let img: any = null;

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
        let ratio = parseFloat(this.getAttribute("data-ratio"));
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

  return (
    <div style={{ background: "white" }}>
      <Head>
        <title>图像工具</title>
      </Head>
      <div
        className="flex-auto flex-col"
        //   style="display: flex; flex-direction: column; margin-left: 2vw;"
      >
        <h3>1. 选择图像文件</h3>
        <input type="file" id="image-input" accept="image/*" />
        <h3>2. 设置参数</h3>
        <div>
          <div>
            <span>灰阶：</span>
            <input type="checkbox" id="grayscaleCheckbox" />
          </div>
          <div>
            <span>反色：</span>
            <input type="checkbox" id="invertCheckbox" />
          </div>
          <div>
            <span>保持比例：</span>
            <input type="checkbox" id="keepRatioCheckbox" />
          </div>
          <label>宽度: </label>
          <input type="number" id="width-input" />
          <br />
          <label>高度: </label>
          <input type="number" id="height-input" />
          <br />
          <div
          //   style="margin-top: 10px;"
          >
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
        </div>
        <h3>3. 预览图像</h3>
        <div
        // style="max-width:80vw;max-height:50vh;overflow: auto;"
        >
          <img id="preview"></img>
        </div>
        <h3>4. 下载图像</h3>
        <a id="download-link" href="#">
          <button>下载</button>
        </a>
      </div>
    </div>
  );
}
