import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export const locales = ['en', 'am', 'om', 'ti', 'so'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const languageNames: Record<Locale, { name: string; nativeName: string; flag: string }> = {
  en: { name: 'English', nativeName: 'English', flag: '🇬🇧' },
  am: { name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹' },
  om: { name: 'Oromo', nativeName: 'Afaan Oromoo', flag: '🇪🇹' },
  ti: { name: 'Tigrinya', nativeName: 'ትግርኛ', flag: '🇪🇹' },
  so: { name: 'Somali', nativeName: 'Soomaali', flag: '🇸🇴' },
};

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get('NEXT_LOCALE')?.value;

  let locale: Locale = defaultLocale;
  if (rawLocale && locales.includes(rawLocale as Locale)) {
    locale = rawLocale as Locale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
