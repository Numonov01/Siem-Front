// contexts/TranslationContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translateText } from '../../service/translation';

type Language = 'en' | 'uz' | 'ru';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (text: string) => string;
  loading: boolean;
}

const TranslationContext = createContext<TranslationContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (text) => text,
  loading: false,
});

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>('en');
  const [cache, setCache] = useState<Record<string, Record<Language, string>>>(
    {}
  );
  const [loading, setLoading] = useState(false);

  // Pre-load common translations
  useEffect(() => {
    const loadCommonTranslations = async () => {
      setLoading(true);
      const commonPhrases = [
        'Profile',
        'Settings',
        'Help Center',
        'Logout',
        'Signing you out',
        'Search',
        'Expand Sidebar',
        'Collapse Sidebar',
        'Apps',
        'Messages',
      ];

      for (const phrase of commonPhrases) {
        await t(phrase);
      }
      setLoading(false);
    };

    loadCommonTranslations();
  }, [language]);

  const t = async (text: string): Promise<string> => {
    if (!text.trim()) return text;

    // Check cache first
    if (cache[text]?.[language]) {
      return cache[text][language];
    }

    // If not in cache, translate
    const translatedText = await translateText(text, language);

    // Update cache
    setCache((prev) => ({
      ...prev,
      [text]: {
        ...prev[text],
        [language]: translatedText,
      },
    }));

    return translatedText;
  };

  // Synchronous version that uses cached translations
  const tSync = (text: string): string => {
    return cache[text]?.[language] || text;
  };

  return (
    <TranslationContext.Provider
      value={{
        language,
        setLanguage,
        t: tSync,
        loading,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);
