import React, { useContext } from "react";
import { LanguageContext } from "@/components/languages/LanguageProvider";
import LanguageButton from "@/components/languages/LanguageButton";
import Link from "next/link";

function NavigationBar() {
  const { localize } = useContext(LanguageContext);
  return (
    <div className="navigation-bar">
      <Link href="/">{localize("menu_homepage")}</Link>
      <span>|</span>
      <Link href="/tools/image">{localize("menu_image")}</Link>
      <span>|</span>
      <Link href="/tools/color">{localize("menu_color")}</Link>
      <span>|</span>
      <Link href="/tools/clipboard">{localize("menu_clipboard")}</Link>
      <span style={{ marginLeft: 20 }}>
        <LanguageButton />
      </span>
    </div>
  );
}

export default NavigationBar;
