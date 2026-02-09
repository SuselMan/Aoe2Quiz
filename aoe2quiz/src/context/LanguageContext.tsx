import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Locale } from '@/src/i18n';
import { LOCALES, t as tFn } from '@/src/i18n';
import storage from '@/src/utils/storage';
import { STORAGE_KEYS } from '@/src/config/storageKeys';

const VALID_LOCALES = new Set(LOCALES.map((l) => l.value));

function isValidLocale(s: string | null): s is Locale {
  return s != null && VALID_LOCALES.has(s as Locale);
}

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
  t: (key: string, params?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ru');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    storage.getItem(STORAGE_KEYS.language).then((saved) => {
      if (isValidLocale(saved)) setLocaleState(saved);
      setReady(true);
    });
  }, []);

  const setLocale = useCallback(async (newLocale: Locale) => {
    setLocaleState(newLocale);
    await storage.setItem(STORAGE_KEYS.language, newLocale);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => tFn(locale, key, params),
    [locale]
  );

  if (!ready) return null;

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {/* key forces full remount when locale changes so all UI texts update */}
      <React.Fragment key={locale}>{children}</React.Fragment>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
