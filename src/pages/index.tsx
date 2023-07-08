import Image from "next/image";
import Link from "next/link";

import duckJpg from "../public/images/duck.jpg";

import Head from "next/head";

import * as React from 'react';

export default function Home() {
  return (
    <div>
      <Head>
        <title>周春光的个人主页</title>
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
        <div className="banner-text">
          Hello, I am Chunguang Zhou, full stack developer from LiaoNing, China.
        </div>
      </div>
    </div>
  );
}
