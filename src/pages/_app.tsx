import "@/styles/globals.css";
import type { AppProps } from "next/app";

import Link from "next/link";
import Image from "next/image";

import icuRedSvg from "../public/images/link-996.icu-red.svg";
import anti996BlueSvg from "../public/images/license-Anti-996-blue.svg";

import homeSvg from "../public/images/home.svg";
import emailSvg from "../public/images/email.svg";
import stackoverflowSvg from "../public/images/stackoverflow.svg";
import githubSvg from "../public/images/github.svg";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,user-scalable=0"
        />
        <link rel="icon" href="/images/favicon.ico" type="image/x-icon" />
      </Head>

      <div className="navigation-bar">
        <Link href="/">主页</Link>
        <span>|</span>
        <Link href="/tools/image">图像处理</Link>
        <span>|</span>
        <Link href="/tools/color">颜色叠加</Link>
      </div>

      <Component {...pageProps} />
      <footer className="footer">
        <div className="footer-icons-row">
          <Image
            className="circle-img"
            title="Homepage"
            src={homeSvg}
            onClick={() => (window.location.href = "/")}
            alt="Home"
          ></Image>
          <Image
            className="circle-img"
            title="Email"
            src={emailSvg}
            onClick={() => (window.location.href = "mailto:z_cg@foxmail.com")}
            alt="email"
          ></Image>
          <Image
            className="circle-img"
            title="Stack Overflow"
            src={stackoverflowSvg}
            onClick={() =>
              window.open("https://stackoverflow.com/users/5844918/cg-zhou")
            }
            alt="stackoverflow"
          ></Image>{" "}
          <Image
            className="circle-img"
            title="GitHub"
            src={githubSvg}
            onClick={() => window.open("https://github.com/cg-zhou")}
            alt="github"
          ></Image>{" "}
        </div>

        <div className="footer-996-row">
          <Link
            href="https://github.com/996icu/996.ICU/blob/master/LICENSE"
            target="view_window"
            className="no-underline"
          >
            <Image src={anti996BlueSvg} alt="Anti 996"></Image>
          </Link>

          <Link
            href="https://996.icu"
            target="view_window"
            className="no-underline ml-1"
          >
            <Image src={icuRedSvg} alt="996.icu"></Image>
          </Link>
        </div>

        <div className="footer-row">
          Written by
          <Link className="footer-link ml-1.5" href="mailto:z_cg@foxmail.com">
            Chunguang Zhou
          </Link>
        </div>
        <div className="footer-row">
          <Link
            href="https://beian.miit.gov.cn/"
            target="_blank"
            className="footer-link"
          >
            辽ICP备2023002125号
          </Link>
        </div>
      </footer>
    </>
  );
}
