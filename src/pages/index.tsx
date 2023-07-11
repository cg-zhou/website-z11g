import Image from "next/image";
import Link from "next/link";

import duckJpg from "../public/images/duck.jpg";

import Head from "next/head";

import React, { useContext } from "react";
import { LanguageContext } from "@/components/languages/LanguageProvider";

export default function Home() {
  const { language, localize } = useContext(LanguageContext);
  const bannerStyle = {
    maxWidth:
      language === "cn"
        ? "calc(var(--logo-diameter) * 1.7)"
        : "calc(var(--logo-diameter) * 2.67)",
  };
  return (
    <div>
      <Head>
        <title>{localize("homepage_title")}</title>
      </Head>
      <div className="logo-for-wechat">
        <Image src={duckJpg} alt="duck"></Image>
      </div>

      <header className="header">
        <div className="logo">
          <div className="logo-img">
            <Link href="/">
              <div className="logo-info">
                <h3>Definition is procedure</h3>
                <p>by cg-zhou</p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <div className="banner">
        <div className="banner-text" style={bannerStyle}>
          {localize("homepage_banner")}
        </div>
      </div>
    </div>
  );
}
