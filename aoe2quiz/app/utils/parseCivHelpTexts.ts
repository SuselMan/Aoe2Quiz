import MainData from '@/app/gameData';
import Strings from '@/app/strings';

export type CivParsedInfo = {
  civId: string;
  /** Civ bonuses (bullet points before unique unit section) */
  bonuses: string[];
  /** Unique unit name(s) - one string, may contain "unit1, unit2" */
  uniqueUnit: string;
  /** Unique tech names - one string per tech or combined */
  uniqueTechs: string[];
  /** Team bonus text */
  teamBonus: string;
};

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<b>(.*?)<\/b>/gi, '$1')
    .replace(/<i>(.*?)<\/i>/gi, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function extractSection(html: string, startTag: string): string | null {
  const re = new RegExp(`<b>${startTag}</b>\\s*<br>\\s*(.*?)(?=<br>\\s*<b>|$)`, 'is');
  const m = html.match(re);
  return m ? stripHtml(m[1]).trim() : null;
}

/** Extract bullet points before the first <b> section (civ bonuses) */
function extractBonuses(html: string): string[] {
  const beforeFirstB = html.split(/<b>/i)[0];
  const lines = beforeFirstB.split(/<br\s*\/?>/gi).map((s) => stripHtml(s).trim()).filter(Boolean);
  return lines.filter((s) => s.startsWith('•') || s.startsWith('—') || s.startsWith('-'));
}

export function parseCivHelpText(civId: string): CivParsedInfo | null {
  const helpId = MainData.data.civ_helptexts?.[civId];
  if (!helpId) return null;
  const raw = Strings.data[helpId];
  if (!raw) return null;

  const bonuses = extractBonuses(raw);
  const uniqueUnitRaw = extractSection(raw, 'Уникальный юнит:') ?? extractSection(raw, 'Уникальные юниты:');
  const uniqueTechRaw = extractSection(raw, 'Уникальные технологии:');
  const teamBonusRaw = extractSection(raw, 'Командный бонус:');

  const uniqueUnit = uniqueUnitRaw ?? '';
  const uniqueTechs = uniqueTechRaw ? uniqueTechRaw.split(/[•\n]/).map((s) => s.trim()).filter(Boolean) : [];
  const teamBonus = teamBonusRaw ?? '';

  return {
    civId,
    bonuses,
    uniqueUnit,
    uniqueTechs,
    teamBonus,
  };
}

let cached: Record<string, CivParsedInfo> | null = null;

export function getAllCivParsedInfo(): Record<string, CivParsedInfo> {
  if (cached) return cached;
  const civIds = Object.keys(MainData.data.civ_names);
  const result: Record<string, CivParsedInfo> = {};
  civIds.forEach((civId) => {
    const info = parseCivHelpText(civId);
    if (info) result[civId] = info;
  });
  cached = result;
  return result;
}

export function clearCivParsedCache() {
  cached = null;
}
