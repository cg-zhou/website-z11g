import React, { useContext } from "react";
import { LanguageContext } from "@/components/languages/LanguageProvider";

import Link from "next/link";
import Image from "next/image";

import icuRedSvg from "../public/images/link-996.icu-red.svg";
import anti996BlueSvg from "../public/images/license-Anti-996-blue.svg";

import homeSvg from "../public/images/home.svg";
import emailSvg from "../public/images/email.svg";
import stackoverflowSvg from "../public/images/stackoverflow.svg";
import githubSvg from "../public/images/github.svg";

import beianPng from "../public/images/beian.png";

function Footer() {
  const { localize } = useContext(LanguageContext);
  return (
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
        <span>
          {localize("footer_written_by")}
          <Link className="footer-link ml-1.5" href="mailto:z_cg@foxmail.com">
            {localize("footer_cgzhou")}
          </Link>
        </span>
      </div>

      <div className="footer-row">
        <Link
          href="https://beian.mps.gov.cn/#/query/webSearch?code=21029602000754"
          target="_blank"
          className="footer-link">
          <div className="flex flex-row items-center gap-2">
            <div>
              <Image src={beianPng} alt="beian" width={16} height={16} />
            </div>
            辽公网安备21029602000754
          </div>
        </Link>
        <Link
          href="https://beian.miit.gov.cn/"
          target="_blank"
          className="footer-link">
          辽ICP备2023002125号
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
