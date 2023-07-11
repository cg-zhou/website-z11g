import React, { useState, createContext, ReactNode } from "react";
import languages from "./languages.json";
import dynamic from "next/dynamic";

interface LanguageContextProps {
  language: string;
  toggleLanguage: () => void;
  localize: (text: string) => string;
}

export const LanguageContext = createContext<LanguageContextProps>({
  language: "en",
  toggleLanguage: () => {},
  localize: (text: string) => text,
});

interface LanguageProviderProps {
  children: ReactNode;
}

function NoSSRLanguageProvider({ children }: LanguageProviderProps) {
  const languageKey = "language";
  const defaultLanguageValue =
    typeof window !== "undefined"
      ? localStorage.getItem(languageKey) || "en"
      : "en";

  const [language, setLanguage] = useState(defaultLanguageValue);

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "cn" : "en";
    setLanguage(newLanguage);

    if (typeof window !== "undefined") {
      localStorage.setItem(languageKey, newLanguage);
    }
  };

  const localize = (text: string) => {
    let result = (languages as any)[language][text];
    return result ? result : text;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, localize }}>
      {children}
    </LanguageContext.Provider>
  );
}

const LanguageProvider = dynamic(() => Promise.resolve(NoSSRLanguageProvider), {
  ssr: false,
});

export default LanguageProvider;
