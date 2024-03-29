import Head from "next/head";
import { useContext, useEffect } from "react";
import ToolLayout from "../../components/ToolLayout";
import { LanguageContext } from "@/components/languages/LanguageProvider";

export default function Color() {
  const { localize } = useContext(LanguageContext);

  useEffect(() => {
    let colorInput = document.getElementById("colorInput") as any;
    let colorOutput = document.getElementById("colorOutput");

    let canvas = document.querySelector("canvas") as any;
    canvas.style.imageRendering = "optimizeQuality";

    let ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.globalCompositeOperation = "lighter";

    colorInput.value = "255, 0, 0\n0, 255, 0\n#0000FF";

    let colors = parseColor();
    refresh(colors);

    function parseColor() {
      let text = colorInput.value;
      let lines = text.split("\n");

      let colors = [];
      for (let line of lines) {
        line = line.trim();
        if (line.length === 0) continue;

        let color;
        if (line.startsWith("#")) {
          // Parse #RRGGBB format
          let r = parseInt(line.slice(1, 3), 16);
          let g = parseInt(line.slice(3, 5), 16);
          let b = parseInt(line.slice(5, 7), 16);
          color = [r, g, b];
        } else {
          // Parse r,g,b format
          color = line.split(",").map(Number);
        }

        colors.push(color);
      }

      console.log(colors);
      return colors;
    }

    function refresh(colors: any) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const N = colors.length;
      for (let i = 0; i < N; i++) {
        const color = colors[i];
        let hexColor =
          "#" +
          ((1 << 24) + (color[0] << 16) + (color[1] << 8) + color[2])
            .toString(16)
            .slice(1);
        ctx.fillStyle = hexColor;
        const radius = Math.min(canvas.width, canvas.height) / 6;
        const x = centerX + radius * Math.cos((2 * Math.PI * i) / N);
        const y = centerY + radius * Math.sin((2 * Math.PI * i) / N);
        ctx.beginPath();
        ctx.arc(x, y, radius * 1.5, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    // Add a mousemove event listener to the canvas
    canvas.addEventListener("mousemove", function (event: any) {
      // Get the mouse position relative to the canvas
      let rect = canvas.getBoundingClientRect();
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;

      // Get the color of the pixel under the mouse cursor
      let pixel = ctx.getImageData(x, y, 1, 1);
      let r = pixel.data[0];
      let g = pixel.data[1];
      let b = pixel.data[2];

      // Update the color info display
      let colorInfo = document.getElementById("colorInfo") as any;

      // Convert the color to #RRGGBB format
      let color =
        "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      colorInfo.textContent = `${color.toUpperCase()} rgb(${r}, ${g}, ${b})`;
      let colorIcon = document.getElementById("colorIcon") as any;
      colorIcon.style.backgroundColor = color;
    });

    (document.getElementById("view") as any).addEventListener(
      "click",
      function () {
        let colors = parseColor();
        refresh(colors);
      }
    );
  }, []);

  return (
    <>
      <Head>
        <title>{localize("color_mixer_page_title")}</title>
      </Head>
      <ToolLayout>
        <h3>{localize("color_mixer_step1_title")}</h3>
        <div>{localize("color_mixer_step1_description")}</div>
        <textarea
          id="colorInput"
          rows={5}
          cols={20}
          style={{ maxWidth: "80vw" }}
        ></textarea>
        <div>
          <button id="view">{localize("color_mixer_step2_view")}</button>
        </div>

        <h3>{localize("color_mixer_step2_title")}</h3>
        <canvas
          id="myCanvas"
          width="400"
          height="400"
          style={{
            width: "400px",
            height: "400px",
            cursor: "crosshair",
            background: "black",
            maxWidth: "80vw",
            maxHeight: "80vw",
          }}
        ></canvas>

        <h3>{localize("color_mixer_step3_title")}</h3>
        <div>{localize("color_mixer_step3_description")}</div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            columnGap: "10px",
            alignItems: "center",
          }}
        >
          <div>{localize("color_mixer_step3_current_color")}</div>
          <div
            id="colorIcon"
            style={{
              border: "solid 1px black",
              height: "12px",
              width: "12px",
              background: "transparent",
            }}
          ></div>
          <div id="colorInfo" style={{ fontWeight: "bold" }}></div>
        </div>
      </ToolLayout>
    </>
  );
}
