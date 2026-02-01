import { en } from './locales/en';
import { ru } from './locales/ru';
import { zh } from './locales/zh';
import { tw } from './locales/tw';
import { fr } from './locales/fr';
import { de } from './locales/de';
import { hi } from './locales/hi';
import { it } from './locales/it';
import { jp } from './locales/jp';
import { ko } from './locales/ko';
import { ms } from './locales/ms';
import { pl } from './locales/pl';
import { es } from './locales/es';
import { mx } from './locales/mx';
import { tr } from './locales/tr';
import { vi } from './locales/vi';
import { br } from './locales/br';

export type Locale =
  | 'en'
  | 'zh'
  | 'tw'
  | 'fr'
  | 'de'
  | 'hi'
  | 'it'
  | 'jp'
  | 'ko'
  | 'ms'
  | 'pl'
  | 'ru'
  | 'es'
  | 'mx'
  | 'tr'
  | 'vi'
  | 'br';

export const LOCALES: { value: Locale; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: '简体中文' },
  { value: 'tw', label: '繁體中文' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'hi', label: 'हिंदी' },
  { value: 'it', label: 'Italiano' },
  { value: 'jp', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'ms', label: 'Bahasa Melayu' },
  { value: 'pl', label: 'Polski' },
  { value: 'ru', label: 'Русский' },
  { value: 'es', label: 'Español' },
  { value: 'mx', label: 'Español (México)' },
  { value: 'tr', label: 'Türkçe' },
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'br', label: 'Português (Brasil)' },
];

const translationsWithFallback = {
  en,
  ru,
  zh,
  tw,
  fr,
  de,
  hi,
  it,
  jp,
  ko,
  ms,
  pl,
  es,
  mx,
  tr,
  vi,
  br,
} as const;
type SupportedLocale = keyof typeof translationsWithFallback;

export const translations = translationsWithFallback;

export type TranslationKeys = keyof typeof en;

/** Resolve locale to a supported translation; unknown fallback to en */
function resolveLocale(locale: Locale): SupportedLocale {
  if (locale in translationsWithFallback) return locale as SupportedLocale;
  return 'en';
}

/** Get nested value by path like "menu.singlePlayer". Unknown locales fallback to en. */
export function t(
  locale: Locale,
  key: string,
  params?: Record<string, string | number>
): string {
  const resolved = resolveLocale(locale);
  const keys = key.split('.');
  let value: unknown = translations[resolved];
  for (const k of keys) {
    value = (value as Record<string, unknown>)?.[k];
  }
  let str = typeof value === 'string' ? value : key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    });
  }
  return str;
}
