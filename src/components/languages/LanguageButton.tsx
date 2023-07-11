import React, { useContext } from "react";
import { LanguageContext } from "./LanguageProvider";

function LanguageButton() {
  const { toggleLanguage, language } = useContext(LanguageContext);

  return (
    <button onClick={toggleLanguage}>
      {language == "en" ? "中文" : "English"}
    </button>
  );
}

export default LanguageButton;
