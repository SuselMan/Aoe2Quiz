const STRINGS_BASE_URL = 'https://aoe2techtree.net/data/locales';

/** Map app locale to aoe2techtree locale code when different */
const LOCALE_TO_AOE2: Record<string, string> = {
    br: 'pt',
    mx: 'es',
    tw: 'zh',
};

/** Local fallback strings (bundled); used when no network */
const FALLBACK_STRINGS: Record<string, Record<string, string>> = {
    en: require('./strings_en.json'),
    zh: require('./strings_zh.json'),
    tw: require('./strings_tw.json'),
    fr: require('./strings_fr.json'),
    de: require('./strings_de.json'),
    hi: require('./strings_hi.json'),
    it: require('./strings_it.json'),
    jp: require('./strings_jp.json'),
    ko: require('./strings_ko.json'),
    ms: require('./strings_ms.json'),
    pl: require('./strings_pl.json'),
    ru: require('./strings_ru.json'),
    es: require('./strings_es.json'),
    mx: require('./strings_mx.json'),
    tr: require('./strings_tr.json'),
    vi: require('./strings_vi.json'),
    br: require('./strings_br.json'),
};

class StringsClass {
    private _data: Record<string, string> = {};

    set data(a: Record<string, string>) {
        this._data = a;
    }

    get data(): Record<string, string> {
        return this._data;
    }

    /** Fetch strings for locale from aoe2techtree; on failure use local fallback */
    async loadForLocale(locale: string): Promise<void> {
        const aoe2Locale = LOCALE_TO_AOE2[locale] ?? locale;
        const url = `${STRINGS_BASE_URL}/${aoe2Locale}/strings.json`;
        try {
            const res = await fetch(url);
            if (res.ok) {
                const json = (await res.json()) as Record<string, string>;
                this._data = typeof json === 'object' && json !== null ? json : {};
                return;
            }
        } catch {
            /* ignore */
        }
        const fallback = FALLBACK_STRINGS[locale] ?? FALLBACK_STRINGS[LOCALE_TO_AOE2[locale]] ?? FALLBACK_STRINGS.en ?? {};
        this._data = fallback;
    }
}

const Strings = new StringsClass();

export default Strings;
