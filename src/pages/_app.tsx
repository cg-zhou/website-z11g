import "@/styles/globals.css";
import type { AppProps } from "next/app";

import Head from "next/head";

import LanguageProvider from "@/components/languages/LanguageProvider";

import React from "react";
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";

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
      <LanguageProvider>
        <NavigationBar />

        <Component {...pageProps} />

        <Footer />
      </LanguageProvider>
    </>
  );
}
