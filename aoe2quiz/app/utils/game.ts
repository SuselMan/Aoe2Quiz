import { Cost } from '@/app/models/dataModel';
import { Answer, Question, QType } from '@/app/const/common';
import type { QuestionTypeVariantValue } from '@/app/config/questionTypes';
import type { RandomFn } from '@/app/utils/helpers';

export type TranslateFn = (key: string) => string;
import {
    shuffleArray,
    isCostEqual,
    getSimilarPrice,
    getRandomCivId,
    getRandomArrayValue,
    hasPoint,
    isTreeBrunchesEqual,
} from '@/app/utils/helpers';
import uuid from "react-native-uuid";
import MainData from "@/app/gameData";
import Strings from "@/app/strings";
import { BuildingsForTreeQ } from "@/app/const/popularCivs";
import { CommonTechTreeData, type TechTreeBrunch } from "@/app/const/techTree";
import { isNavalAllowedForLevel, isNavalBuilding, isNavalTech, isNavalUnit, isUniqueBuilding } from "@/app/const/naval";

/** Tech IDs that are unique (castle/imperial unique tech of some civ). Excluded from tech questions on Villager/Militia. */
let _uniqueTechIdSet: Set<string> | null = null;
function getUniqueTechIdSet(): Set<string> {
    if (_uniqueTechIdSet) return _uniqueTechIdSet;
    const set = new Set<string>();
    Object.keys(MainData.data.techtrees || {}).forEach((civId) => {
        const u = MainData.data.techtrees[civId].unique;
        if (u?.castleAgeUniqueTech != null) set.add(String(u.castleAgeUniqueTech));
        if (u?.imperialAgeUniqueTech != null) set.add(String(u.imperialAgeUniqueTech));
    });
    _uniqueTechIdSet = set;
    return set;
}
function isUniqueTech(techId: string): boolean {
    return getUniqueTechIdSet().has(techId);
}

/** Unit IDs that are unique (castle/imperial unique unit of some civ). Excluded from unit price questions on Villager/Militia. */
let _uniqueUnitIdSet: Set<string> | null = null;
function getUniqueUnitIdSet(): Set<string> {
    if (_uniqueUnitIdSet) return _uniqueUnitIdSet;
    const set = new Set<string>();
    Object.keys(MainData.data.techtrees || {}).forEach((civId) => {
        const u = MainData.data.techtrees[civId].unique;
        if (u?.castleAgeUniqueUnit != null) set.add(String(u.castleAgeUniqueUnit));
        if (u?.imperialAgeUniqueUnit != null) set.add(String(u.imperialAgeUniqueUnit));
    });
    _uniqueUnitIdSet = set;
    return set;
}
function isUniqueUnit(unitId: string): boolean {
    return getUniqueUnitIdSet().has(unitId);
}

/** Unique buildings allowed in "What price of this building?" from level 6 (knight) onwards */
const LEVELS_ALLOW_UNIQUE_BUILDINGS = new Set(['knight', 'cavalier', 'paladin', 'king']);

/** Spies/Измена — cost is per enemy villager, excluded from "What price of this tech?" */
const TECH_ID_EXCLUDED_FROM_PRICE = '408';

export const getCivInfoA = (isCorrect: boolean = false, exclude?: string, usedCivIds?: Set<string>, random?: RandomFn): Answer => {
    const civId = getRandomCivId(random);
    const civName = Strings.data[MainData.data.civ_names[civId]];
    if (civId === exclude || usedCivIds?.has(civId)) {
        return getCivInfoA(isCorrect, exclude, usedCivIds, random);
    }
    usedCivIds?.add(civId);
    return {
        id: uuid.v4(),
        text: civName,
        type: 'civInfo',
        isCorrect,
        civId,
        image: `https://aoe2techtree.net/img/Civs/${civId.toLowerCase()}.png`,
    };
}

export const getCivInfoQ = (random?: RandomFn, t?: TranslateFn): Question => {
    const r = random ?? (() => Math.random());
    const correctAnswer = getCivInfoA(true, undefined, undefined, r);
    const splitTextBySections = Strings.data[MainData.data.civ_helptexts[correctAnswer.civId || 'nothing']].split(/<b>.*<\/b>/).join('');
    const splitText = splitTextBySections
        .split('<br>')
        .map(i => i.replace(/^\s+|\s+$/g, ''))
        .filter(i => i);
    const randomInfo = splitText[Math.floor(r() * splitText.length)].trim();
    const text = t ? t('questions.civBonus_bonusToCiv') : 'Which civ has this description?';
    return {
        variant: 'civBonus_bonusToCiv',
        type: 'civInfo',
        questionKey: `civBonus_${correctAnswer.civId}_${randomInfo}`,
        text,
        subText: randomInfo,
        answers: shuffleArray((() => {
            const used = new Set<string>();
            return [
                { ...correctAnswer },
                getCivInfoA(false, correctAnswer.civId, used, r),
                getCivInfoA(false, correctAnswer.civId, used, r),
                getCivInfoA(false, correctAnswer.civId, used, r),
            ];
        })(), r),
    };
}

export const getTechInfoA = (isCorrect: boolean = false, exclude?: string, usedTechIds?: Set<string>, excludeNaval?: boolean, excludeUniqueTech?: boolean, random?: RandomFn): Answer => {
    const r = random ?? (() => Math.random());
    let techIds = Object.keys(MainData.data.data.techs);
    if (excludeNaval) techIds = techIds.filter((id) => !isNavalTech(id));
    if (excludeUniqueTech) techIds = techIds.filter((id) => !isUniqueTech(id));
    if (techIds.length === 0) techIds = Object.keys(MainData.data.data.techs);
    const techId = techIds[Math.floor(r() * techIds.length)];
    const techName = Strings.data[MainData.data.data.techs[techId].LanguageNameId];
    let techInfo;
    const techHelperArr = Strings.data[MainData.data.data.techs[techId].LanguageHelpId].split(/<b>.*<\/b>/);
    const techHelperBr = techHelperArr[techHelperArr.length - 1].split('<br>');
    techInfo = techHelperBr[techHelperBr.length - 1];
    if (techId === exclude || usedTechIds?.has(techId)) {
        return getTechInfoA(isCorrect, exclude, usedTechIds, excludeNaval, excludeUniqueTech, r);
    }
    usedTechIds?.add(techId);
    let isUniqImp = false;
    let isUniqCastle = false;
    let uniqUri;
    Object.keys(MainData.data.techtrees).forEach((civKey) => {
        if (MainData.data.techtrees[civKey].unique.imperialAgeUniqueTech.toString() === techId.toString()) {
            isUniqImp = true;
            uniqUri = 'https://aoe2techtree.net/img/Techs/unique_tech_2.png'
        }
        if (MainData.data.techtrees[civKey].unique.castleAgeUniqueTech.toString() === techId.toString()) {
            isUniqCastle = true;
            uniqUri = 'https://aoe2techtree.net/img/Techs/unique_tech_1.png'
        }
    });

    return {
        id: uuid.v4(),
        text: techName,
        type: 'techInfo',
        isCorrect,
        techInfo,
        techId,
        image: uniqUri || `https://aoe2techtree.net/img/Techs/${techId.toLowerCase()}.png`,
    }
}

export const getTechInfoQ = (excludeNaval?: boolean, excludeUniqueTech?: boolean, random?: RandomFn, t?: TranslateFn): Question => {
    const r = random ?? (() => Math.random());
    const correctAnswer = getTechInfoA(true, undefined, undefined, excludeNaval, excludeUniqueTech, r);
    const text = t ? t('questions.techDesc_descToTech') : 'Which tech has this description?';
    return {
        variant: 'techDesc_descToTech',
        type: 'techInfo',
        questionKey: `techDesc_${correctAnswer.techId}`,
        text,
        subText: correctAnswer.techInfo,
        answers: shuffleArray((() => {
            const used = new Set<string>();
            return [
                correctAnswer,
                getTechInfoA(false, correctAnswer.techId, used, excludeNaval, excludeUniqueTech, r),
                getTechInfoA(false, correctAnswer.techId, used, excludeNaval, excludeUniqueTech, r),
                getTechInfoA(false, correctAnswer.techId, used, excludeNaval, excludeUniqueTech, r),
            ];
        })(), r),
    };
}

const isCostInList = (cost: Cost, list: Cost[]): boolean =>
    list.some((c) => isCostEqual(cost, c));

const isIdNaval = (fieldName: string, id: string): boolean => {
    if (fieldName === 'units') return isNavalUnit(id);
    if (fieldName === 'buildings') return isNavalBuilding(id);
    if (fieldName === 'techs') return isNavalTech(id);
    return false;
};

export const getPriceA = (isCorrect: boolean = false, fieldName: string, exclude?: Cost, usedCosts?: Cost[], excludeNaval?: boolean, excludeUniqueTech?: boolean, allowUniqueBuildings?: boolean, random?: RandomFn): Answer => {
    const r = random ?? (() => Math.random());
    // @ts-ignore
    let unitIds: string[] = Object.keys(MainData.data.data[fieldName]);
    if (excludeNaval) unitIds = unitIds.filter((id) => !isIdNaval(fieldName, id));
    if (fieldName === 'buildings' && !allowUniqueBuildings) unitIds = unitIds.filter((id) => !isUniqueBuilding(id));
    if (fieldName === 'techs') {
        unitIds = unitIds.filter((id) => id !== TECH_ID_EXCLUDED_FROM_PRICE);
        if (excludeUniqueTech) unitIds = unitIds.filter((id) => !isUniqueTech(id));
    }
    if (fieldName === 'units' && excludeUniqueTech) unitIds = unitIds.filter((id) => !isUniqueUnit(id));
    if (unitIds.length === 0) {
        // @ts-ignore
        unitIds = Object.keys(MainData.data.data[fieldName]);
    }
    const unitId = unitIds[Math.floor(r() * unitIds.length)];
    // @ts-ignore
    const unitObj = MainData.data.data[fieldName][unitId];

    if ((unitObj.Cost.Wood || 0) + (unitObj.Cost.Stone || 0) + (unitObj.Cost.Food || 0) + (unitObj.Cost.Gold || 0) === 0) {
        return getPriceA(isCorrect, fieldName, exclude, usedCosts, excludeNaval, excludeUniqueTech, allowUniqueBuildings, r);
    }
    if (exclude && isCostEqual(unitObj.Cost, exclude)) {
        return getPriceA(isCorrect, fieldName, exclude, usedCosts, excludeNaval, excludeUniqueTech, allowUniqueBuildings, r);
    }
    if (usedCosts && isCostInList(unitObj.Cost, usedCosts)) {
        return getPriceA(isCorrect, fieldName, exclude, usedCosts, excludeNaval, excludeUniqueTech, allowUniqueBuildings, r);
    }
    usedCosts?.push(unitObj.Cost);

    return {
        id: uuid.v4(),
        type: 'unitPrice',
        cost: unitObj.Cost,
        isCorrect,
    };
}

const priceType2FieldName: Record<'unitPrice' | 'buildingPrice' | 'techPrice', string> = {
    unitPrice: 'units',
    buildingPrice: 'buildings',
    techPrice: 'techs',
}

const priceType2Name: Record<'unitPrice' | 'buildingPrice' | 'techPrice', string> = {
    unitPrice: 'unit',
    buildingPrice: 'building',
    techPrice: 'tech',
}

const getPriceQ = (type: 'unitPrice' | 'buildingPrice' | 'techPrice', excludeNaval?: boolean, excludeUniqueTech?: boolean, levelId?: string, random?: RandomFn, t?: TranslateFn): Question => {
    const r = random ?? (() => Math.random());
    const fieldName: string = priceType2FieldName[type] || '';
    const allowUniqueBuildings = levelId ? LEVELS_ALLOW_UNIQUE_BUILDINGS.has(levelId) : false;
    // @ts-ignore
    let unitIds: string[] = Object.keys(MainData.data.data[fieldName]);
    if (excludeNaval) unitIds = unitIds.filter((id) => !isIdNaval(fieldName, id));
    if (type === 'buildingPrice' && !allowUniqueBuildings) unitIds = unitIds.filter((id) => !isUniqueBuilding(id));
    if (type === 'techPrice') {
        unitIds = unitIds.filter((id) => id !== TECH_ID_EXCLUDED_FROM_PRICE);
        if (excludeUniqueTech) unitIds = unitIds.filter((id) => !isUniqueTech(id));
    }
    if (type === 'unitPrice' && excludeUniqueTech) unitIds = unitIds.filter((id) => !isUniqueUnit(id));
    if (unitIds.length === 0) {
        // @ts-ignore
        unitIds = Object.keys(MainData.data.data[fieldName]);
    }
    const unitId = unitIds[Math.floor(r() * unitIds.length)];
    // @ts-ignore
    const unitObj = MainData.data.data[fieldName][unitId];
    const unitName = Strings.data[unitObj.LanguageNameId];
    if ((unitObj.Cost.Wood || 0) + (unitObj.Cost.Stone || 0) + (unitObj.Cost.Food || 0) + (unitObj.Cost.Gold || 0) === 0) {
        return getPriceQ(type, excludeNaval, excludeUniqueTech, levelId, r, t);
    }
    let fakePrice = getSimilarPrice(unitObj.Cost, r);
    let fakeAttempts = 0;
    while (isCostEqual(fakePrice, unitObj.Cost) && fakeAttempts++ < 10) {
        fakePrice = getSimilarPrice(unitObj.Cost, r);
    }
    const imgSource = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
    let uniqUri;
    let techHelper;
    if (type === 'techPrice') {
        const techHelperArr = Strings.data[MainData.data.data.techs[unitId].LanguageHelpId].split(/<b>.*<\/b>/);
        const techHelperBr = techHelperArr[techHelperArr.length - 1].split('<br>');
        // console.log('techHelperBr', techHelperBr);
        techHelper = techHelperBr[techHelperBr.length - 1]
        let isUniqImp = false;
        let isUniqCastle = false;
        Object.keys(MainData.data.techtrees).forEach((civKey) => {
            if (MainData.data.techtrees[civKey].unique.imperialAgeUniqueTech.toString() === unitId.toString()) {
                isUniqImp = true;
                uniqUri = 'https://aoe2techtree.net/img/Techs/unique_tech_2.png'
            }
            if (MainData.data.techtrees[civKey].unique.castleAgeUniqueTech.toString() === unitId.toString()) {
                isUniqCastle = true;
                uniqUri = 'https://aoe2techtree.net/img/Techs/unique_tech_1.png'
            }
        })
    }

    const variantMap = { unitPrice: 'unitPrice_unitToPrice', buildingPrice: 'buildingPrice_buildingToPrice', techPrice: 'techPrice_techToPrice' } as const;
    const variant = variantMap[type];
    const text = t ? t(`questions.${variant}`) : `What price of this ${priceType2Name[type]}?`;
    return {
        variant,
        type: 'unitPrice',
        questionKey: `${variant}_${unitId}`,
        text,
        subText: unitName,
        additionalInfo: techHelper,
        image: uniqUri || `https://aoe2techtree.net/img/${imgSource}/${unitId.toLowerCase()}.png`,
        answers: shuffleArray((() => {
            const usedCosts: Cost[] = [unitObj.Cost, fakePrice];
            return [
                {
                    id: uuid.v4(),
                    type,
                    cost: unitObj.Cost,
                    isCorrect: true,
                },
                {
                    id: uuid.v4(),
                    type,
                    cost: fakePrice,
                    isCorrect: false,
                },
                getPriceA(false, fieldName, unitObj.Cost, usedCosts, excludeNaval, excludeUniqueTech, allowUniqueBuildings, r),
                getPriceA(false, fieldName, unitObj.Cost, usedCosts, excludeNaval, excludeUniqueTech, allowUniqueBuildings, r),
            ];
        })(), r),
    };
}

export const getCivTechQ = (excludeNaval?: boolean, random?: RandomFn, t?: TranslateFn): Question => {
    const r = random ?? (() => Math.random());
    const correctAnswer = getCivInfoA(true, undefined, undefined, r);
    const techs = ['castleAgeUniqueTech', 'imperialAgeUniqueTech'];
    const randomTech = techs[Math.floor(r() * techs.length)];
    // @ts-ignore
    const techId = MainData.data.techtrees[correctAnswer.civId || ''].unique[randomTech];
    if (excludeNaval && isNavalTech(techId?.toString() ?? '')) {
        return getCivTechQ(excludeNaval, r, t);
    }
    const techStringId = MainData.data.data.techs[techId.toString()].LanguageNameId;
    const techHelperStringId = MainData.data.data.techs[techId.toString()].LanguageHelpId;
    const techName = Strings.data[techStringId];
    const techHelperArr = Strings.data[MainData.data.data.techs[techId].LanguageHelpId].split(/<b>.*<\/b>/);
    const techHelperBr = techHelperArr[techHelperArr.length - 1].split('<br>');
    const techHelper = techHelperBr[techHelperBr.length - 1]
    const text = t ? t('questions.civUniqueTech_techToCiv') : 'Which civ has this tech?';
    return {
        variant: 'civUniqueUnit_unitToCiv',
        type: 'civInfo',
        questionKey: `civTech_${correctAnswer.civId}_${techId}`,
        text,
        subText: techName,
        additionalInfo: techHelper,
        image: randomTech === 'imperialAgeUniqueTech' ? 'https://aoe2techtree.net/img/Techs/unique_tech_2.png' : 'https://aoe2techtree.net/img/Techs/unique_tech_1.png',
        answers: shuffleArray((() => {
            const used = new Set<string>();
            return [
                { ...correctAnswer },
                getCivInfoA(false, correctAnswer.civId, used, r),
                getCivInfoA(false, correctAnswer.civId, used, r),
                getCivInfoA(false, correctAnswer.civId, used, r),
            ];
        })(), r),
    };
}

/** Get all unique unit IDs mapped to their owner civ ID */
function getUniqueUnitToCivMap(): Map<string, string> {
    const map = new Map<string, string>();
    Object.keys(MainData.data.techtrees || {}).forEach((civId) => {
        const u = MainData.data.techtrees[civId].unique;
        if (u?.castleAgeUniqueUnit != null) map.set(String(u.castleAgeUniqueUnit), civId);
        if (u?.imperialAgeUniqueUnit != null) map.set(String(u.imperialAgeUniqueUnit), civId);
    });
    return map;
}

/** Get a random unique unit as an Answer object */
export const getUniqueUnitA = (isCorrect: boolean = false, excludeUnitId?: string, usedUnitIds?: Set<string>, excludeNaval?: boolean, random?: RandomFn): Answer => {
    const r = random ?? (() => Math.random());
    const unitToCivMap = getUniqueUnitToCivMap();
    let unitIds = Array.from(unitToCivMap.keys());
    if (excludeNaval) unitIds = unitIds.filter((id) => !isNavalUnit(id));
    if (unitIds.length === 0) unitIds = Array.from(unitToCivMap.keys());
    const unitId = unitIds[Math.floor(r() * unitIds.length)];
    if (unitId === excludeUnitId || usedUnitIds?.has(unitId)) {
        return getUniqueUnitA(isCorrect, excludeUnitId, usedUnitIds, excludeNaval, r);
    }
    usedUnitIds?.add(unitId);
    const unitObj = MainData.data.data.units[unitId];
    const unitName = Strings.data[unitObj.LanguageNameId];
    return {
        id: uuid.v4(),
        text: unitName,
        type: 'civInfo',
        isCorrect,
        unitId,
        image: `https://aoe2techtree.net/img/Units/${unitId.toLowerCase()}.png`,
    };
};

/** Question: Show unique unit image + name, ask which civ owns it. 4 civ answer options. */
export const getUniqueUnitToCivQ = (excludeNaval?: boolean, random?: RandomFn, t?: TranslateFn): Question => {
    const r = random ?? (() => Math.random());
    const unitToCivMap = getUniqueUnitToCivMap();
    let unitIds = Array.from(unitToCivMap.keys());
    if (excludeNaval) unitIds = unitIds.filter((id) => !isNavalUnit(id));
    if (unitIds.length === 0) unitIds = Array.from(unitToCivMap.keys());
    const unitId = unitIds[Math.floor(r() * unitIds.length)];
    const civId = unitToCivMap.get(unitId)!;
    const unitObj = MainData.data.data.units[unitId];
    const unitName = Strings.data[unitObj.LanguageNameId];
    const civName = Strings.data[MainData.data.civ_names[civId]];
    const text = t ? t('questions.civUniqueUnit_unitToCiv') : 'Which civilization has this unique unit?';
    const correctAnswer: Answer = {
        id: uuid.v4(),
        text: civName,
        type: 'civInfo',
        isCorrect: true,
        civId,
        image: `https://aoe2techtree.net/img/Civs/${civId.toLowerCase()}.png`,
    };
    const usedCivIds = new Set<string>([civId]);
    return {
        variant: 'civUniqueUnit_unitToCiv',
        type: 'civInfo',
        questionKey: `uniqueUnitToCiv_${unitId}`,
        text,
        subText: unitName,
        image: `https://aoe2techtree.net/img/Units/${unitId.toLowerCase()}.png`,
        answers: shuffleArray([
            correctAnswer,
            getCivInfoA(false, civId, usedCivIds, r),
            getCivInfoA(false, civId, usedCivIds, r),
            getCivInfoA(false, civId, usedCivIds, r),
        ], r),
    };
};

/** Question: Show civ name, ask which unique unit it has. 4 unique unit answer options. */
export const getCivToUniqueUnitQ = (excludeNaval?: boolean, random?: RandomFn, t?: TranslateFn): Question => {
    const r = random ?? (() => Math.random());
    const civIds = Object.keys(MainData.data.techtrees || {});
    const civId = civIds[Math.floor(r() * civIds.length)];
    const unique = MainData.data.techtrees[civId].unique;
    // Pick castle or imperial unique unit randomly
    const unitTypes = ['castleAgeUniqueUnit', 'imperialAgeUniqueUnit'] as const;
    const chosenType = unitTypes[Math.floor(r() * unitTypes.length)];
    const unitId = String(unique[chosenType]);
    if (excludeNaval && isNavalUnit(unitId)) {
        return getCivToUniqueUnitQ(excludeNaval, r, t);
    }
    const unitObj = MainData.data.data.units[unitId];
    if (!unitObj) {
        return getCivToUniqueUnitQ(excludeNaval, r, t);
    }
    const unitName = Strings.data[unitObj.LanguageNameId];
    const civName = Strings.data[MainData.data.civ_names[civId]];
    const text = t ? t('questions.civUniqueUnit_civToUnit') : 'What is this civilization\'s unique unit?';
    const correctAnswer: Answer = {
        id: uuid.v4(),
        text: unitName,
        type: 'civInfo',
        isCorrect: true,
        unitId,
        image: `https://aoe2techtree.net/img/Units/${unitId.toLowerCase()}.png`,
    };
    const usedUnitIds = new Set<string>([unitId]);
    return {
        variant: 'civUniqueUnit_civToUnit',
        type: 'civInfo',
        questionKey: `civToUniqueUnit_${civId}_${unitId}`,
        text,
        subText: civName,
        image: `https://aoe2techtree.net/img/Civs/${civId.toLowerCase()}.png`,
        answers: shuffleArray([
            correctAnswer,
            getUniqueUnitA(false, unitId, usedUnitIds, excludeNaval, r),
            getUniqueUnitA(false, unitId, usedUnitIds, excludeNaval, r),
            getUniqueUnitA(false, unitId, usedUnitIds, excludeNaval, r),
        ], r),
    };
}

/** Unit stat keys for questions */
type UnitStatKey = 'HP' | 'Attack' | 'MeleeArmor' | 'PierceArmor' | 'Speed';
const UNIT_STAT_KEYS: UnitStatKey[] = ['HP', 'Attack', 'MeleeArmor', 'PierceArmor', 'Speed'];

/** Get a random unit as an Answer with optional stat info */
function getUnitAnswerWithStat(
    isCorrect: boolean,
    excludeUnitId?: string,
    usedUnitIds?: Set<string>,
    excludeNaval?: boolean,
    excludeUnique?: boolean,
    statKey?: UnitStatKey,
    random?: RandomFn
): Answer {
    const r = random ?? (() => Math.random());
    let unitIds = Object.keys(MainData.data.data.units);
    if (excludeNaval) unitIds = unitIds.filter((id) => !isNavalUnit(id));
    if (excludeUnique) unitIds = unitIds.filter((id) => !isUniqueUnit(id));
    if (unitIds.length === 0) unitIds = Object.keys(MainData.data.data.units);
    const unitId = unitIds[Math.floor(r() * unitIds.length)];
    if (unitId === excludeUnitId || usedUnitIds?.has(unitId)) {
        return getUnitAnswerWithStat(isCorrect, excludeUnitId, usedUnitIds, excludeNaval, excludeUnique, statKey, r);
    }
    usedUnitIds?.add(unitId);
    const unitObj = MainData.data.data.units[unitId];
    const unitName = Strings.data[unitObj.LanguageNameId];
    const statValue = statKey ? unitObj[statKey] : undefined;
    return {
        id: uuid.v4(),
        text: unitName,
        type: 'unitStats',
        isCorrect,
        unitId,
        statValue,
        image: `https://aoe2techtree.net/img/Units/${unitId.toLowerCase()}.png`,
    };
}

/** Map stat key to i18n key */
function getStatI18nKey(statKey: UnitStatKey): string {
    const map: Record<UnitStatKey, string> = {
        HP: 'hp',
        Attack: 'attack',
        MeleeArmor: 'meleeArmor',
        PierceArmor: 'pierceArmor',
        Speed: 'speed',
    };
    return map[statKey];
}

/** Question: Show unit stats, ask which unit has them. 4 unit answer options. */
export const getUnitStatsToUnitQ = (excludeNaval?: boolean, excludeUnique?: boolean, random?: RandomFn, t?: TranslateFn): Question => {
    const r = random ?? (() => Math.random());
    let unitIds = Object.keys(MainData.data.data.units);
    if (excludeNaval) unitIds = unitIds.filter((id) => !isNavalUnit(id));
    if (excludeUnique) unitIds = unitIds.filter((id) => !isUniqueUnit(id));
    if (unitIds.length === 0) unitIds = Object.keys(MainData.data.data.units);
    const unitId = unitIds[Math.floor(r() * unitIds.length)];
    const unitObj = MainData.data.data.units[unitId];
    const unitName = Strings.data[unitObj.LanguageNameId];

    // Pick 2-3 random stats to show
    const statCount = 2 + Math.floor(r() * 2); // 2 or 3
    const selectedStats = shuffleArray([...UNIT_STAT_KEYS], r).slice(0, statCount);
    const statsText = selectedStats.map((key) => {
        const label = t ? t(`unitStats.${getStatI18nKey(key)}`) : key;
        return `${label}: ${unitObj[key]}`;
    }).join(', ');

    const text = t ? t('questions.unitStats_statsToUnit') : 'Which unit has these stats?';
    const correctAnswer: Answer = {
        id: uuid.v4(),
        text: unitName,
        type: 'unitStats',
        isCorrect: true,
        unitId,
        image: `https://aoe2techtree.net/img/Units/${unitId.toLowerCase()}.png`,
    };
    const usedUnitIds = new Set<string>([unitId]);
    return {
        variant: 'unitStats_statsToUnit',
        type: 'unitStats',
        questionKey: `unitStatsToUnit_${unitId}`,
        text,
        subText: statsText,
        answers: shuffleArray([
            correctAnswer,
            getUnitAnswerWithStat(false, unitId, usedUnitIds, excludeNaval, excludeUnique, undefined, r),
            getUnitAnswerWithStat(false, unitId, usedUnitIds, excludeNaval, excludeUnique, undefined, r),
            getUnitAnswerWithStat(false, unitId, usedUnitIds, excludeNaval, excludeUnique, undefined, r),
        ], r),
    };
}

/** Question: Show unit, ask for specific stat value. 4 numeric answer options. */
export const getUnitToStatQ = (excludeNaval?: boolean, excludeUnique?: boolean, random?: RandomFn, t?: TranslateFn): Question => {
    const r = random ?? (() => Math.random());
    let unitIds = Object.keys(MainData.data.data.units);
    if (excludeNaval) unitIds = unitIds.filter((id) => !isNavalUnit(id));
    if (excludeUnique) unitIds = unitIds.filter((id) => !isUniqueUnit(id));
    if (unitIds.length === 0) unitIds = Object.keys(MainData.data.data.units);
    const unitId = unitIds[Math.floor(r() * unitIds.length)];
    const unitObj = MainData.data.data.units[unitId];
    const unitName = Strings.data[unitObj.LanguageNameId];

    const statKey = UNIT_STAT_KEYS[Math.floor(r() * UNIT_STAT_KEYS.length)];
    const correctValue = unitObj[statKey];
    const statLabel = t ? t(`unitStats.${getStatI18nKey(statKey)}`) : statKey;

    // Generate 3 fake values close to correct
    const usedValues = new Set<number>([correctValue]);
    const fakeValues: number[] = [];
    while (fakeValues.length < 3) {
        const offset = Math.floor(r() * 20) - 10; // -10 to +10
        const fakeValue = Math.max(1, correctValue + offset);
        if (!usedValues.has(fakeValue)) {
            usedValues.add(fakeValue);
            fakeValues.push(fakeValue);
        }
    }

    const text = t ? t('questions.unitStats_unitToStat') : `What is this unit's ${statLabel}?`;
    const answers = shuffleArray([
        {
            id: uuid.v4(),
            text: String(correctValue),
            type: 'unitStats' as const,
            isCorrect: true,
            statValue: correctValue,
            statLabel,
        },
        ...fakeValues.map((val) => ({
            id: uuid.v4(),
            text: String(val),
            type: 'unitStats' as const,
            isCorrect: false,
            statValue: val,
            statLabel,
        })),
    ], r);

    return {
        variant: 'unitStats_unitToStat',
        type: 'unitStats',
        questionKey: `unitToStat_${unitId}_${statKey}`,
        text,
        subText: `${unitName} — ${statLabel}`,
        image: `https://aoe2techtree.net/img/Units/${unitId.toLowerCase()}.png`,
        statKey,
        statValue: correctValue,
        answers,
    };
}

//export type Question = {
//     type: QType,
//     text: string,
//     subText: string | undefined,
//     additionalInfo?: string,
//     image?: string,
//     answers: Answer[],
// }

/** Pick a civ that has this building and a tech tree branch *different* from all civs in usedCivIds (and from excludeCivId). */
function getCivInfoATreeBranch(
    excludeCivId: string,
    tree: TechTreeBrunch,
    building: number,
    usedCivIds: Set<string>,
    random?: RandomFn,
): Answer {
    const r = random ?? (() => Math.random());
    const civIds = Object.keys(MainData.data.civ_names);
    const maxAttempts = civIds.length * 2;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const civId = civIds[Math.floor(r() * civIds.length)];
        if (civId === excludeCivId || usedCivIds.has(civId)) continue;
        if (!hasPoint({ building }, civId)) continue;
        let treeDifferent = true;
        for (const otherId of usedCivIds) {
            if (isTreeBrunchesEqual(otherId, civId, tree)) {
                treeDifferent = false;
                break;
            }
        }
        if (!treeDifferent) continue;
        usedCivIds.add(civId);
        const civName = Strings.data[MainData.data.civ_names[civId]];
        return {
            id: uuid.v4(),
            text: civName,
            type: 'civInfo',
            isCorrect: false,
            civId,
            image: `https://aoe2techtree.net/img/Civs/${civId.toLowerCase()}.png`,
        };
    }
    return getCivInfoA(false, excludeCivId, usedCivIds, r);
}

export const getTreeBrunchQ = (random?: RandomFn, t?: TranslateFn): Question => {
    const r = random ?? (() => Math.random());
    const answer = getCivInfoA(true, undefined, undefined, r);
    const civId = answer.civId as string;
    const building = getRandomArrayValue(BuildingsForTreeQ, r);
    const hasBuilding = hasPoint({ building }, civId);
    if (!hasBuilding) return getTreeBrunchQ(r, t);

    const tree = CommonTechTreeData[building];
    if (!tree) return getTreeBrunchQ(r, t);
    const usedCivIds = new Set<string>([civId]);
    const text = t ? t('questions.treeBranch_branchToCiv') : 'Which civ has this tech tree branch?';

    return {
        variant: 'treeBranch_branchToCiv',
        type: "treeBrunch",
        questionKey: `treeBranch_${civId}_${building}`,
        text,
        subText: '',
        tree,
        building: building,
        answers: shuffleArray([
            answer,
            getCivInfoATreeBranch(civId, tree, building, usedCivIds, r),
            getCivInfoATreeBranch(civId, tree, building, usedCivIds, r),
            getCivInfoATreeBranch(civId, tree, building, usedCivIds, r),
        ], r),
    };
}

/** Question: Show tech, ask research time in seconds. 4 time options. */
export const getTechTimeQ = (excludeNaval?: boolean, excludeUniqueTech?: boolean, random?: RandomFn, t?: TranslateFn): Question => {
    const r = random ?? (() => Math.random());
    let techIds = Object.keys(MainData.data.data.techs);
    if (excludeNaval) techIds = techIds.filter((id) => !isNavalTech(id));
    if (excludeUniqueTech) techIds = techIds.filter((id) => !isUniqueTech(id));
    techIds = techIds.filter((id) => id !== TECH_ID_EXCLUDED_FROM_PRICE);
    if (techIds.length === 0) techIds = Object.keys(MainData.data.data.techs);
    const techId = techIds[Math.floor(r() * techIds.length)];
    const techObj = MainData.data.data.techs[techId];
    const techName = Strings.data[techObj.LanguageNameId];
    const correctTime = techObj.ResearchTime;
    const usedTimes = new Set<number>([correctTime]);
    const fakeTimes: number[] = [];
    while (fakeTimes.length < 3) {
        const offset = (Math.floor(r() * 60) - 30) * 5;
        const v = Math.max(0, correctTime + offset);
        if (!usedTimes.has(v)) { usedTimes.add(v); fakeTimes.push(v); }
    }
    const text = t ? t('questions.techTime_techToTime') : 'How long does it take to research this technology?';
    const answers = shuffleArray([
        { id: uuid.v4(), text: `${correctTime} sec`, type: 'techInfo' as const, isCorrect: true, techId },
        ...fakeTimes.map((sec) => ({ id: uuid.v4(), text: `${sec} sec`, type: 'techInfo' as const, isCorrect: false })),
    ], r);
    let img = `https://aoe2techtree.net/img/Techs/${techId.toLowerCase()}.png`;
    const u = getUniqueTechIdSet();
    if (u.has(techId)) {
        Object.keys(MainData.data.techtrees || {}).forEach((civKey) => {
            const uniq = MainData.data.techtrees[civKey].unique;
            if (String(uniq.imperialAgeUniqueTech) === techId) img = 'https://aoe2techtree.net/img/Techs/unique_tech_2.png';
            if (String(uniq.castleAgeUniqueTech) === techId) img = 'https://aoe2techtree.net/img/Techs/unique_tech_1.png';
        });
    }
    return {
        variant: 'techTime_techToTime',
        type: 'techInfo',
        questionKey: `techTime_${techId}`,
        text,
        subText: techName,
        image: img,
        answers,
    };
}

/** Get unique tech name by tech id (for civ→unique tech answers). */
function getUniqueTechName(techId: number | string): string {
    const id = String(techId);
    const tech = MainData.data.data.techs[id];
    return tech ? Strings.data[tech.LanguageNameId] : '';
}

/** Get icon URL for a unique tech (castle vs imperial). */
function getUniqueTechIconUrl(techId: string): string {
    const id = String(techId);
    for (const civKey of Object.keys(MainData.data.techtrees || {})) {
        const u = MainData.data.techtrees[civKey].unique;
        if (u?.imperialAgeUniqueTech != null && String(u.imperialAgeUniqueTech) === id)
            return 'https://aoe2techtree.net/img/Techs/unique_tech_2.png';
        if (u?.castleAgeUniqueTech != null && String(u.castleAgeUniqueTech) === id)
            return 'https://aoe2techtree.net/img/Techs/unique_tech_1.png';
    }
    return `https://aoe2techtree.net/img/Techs/${id.toLowerCase()}.png`;
}

/** Question: Show civ, ask its unique tech. 4 unique tech name options. */
export const getCivToUniqueTechQ = (excludeNaval?: boolean, random?: RandomFn, t?: TranslateFn): Question => {
    const r = random ?? (() => Math.random());
    const civIds = Object.keys(MainData.data.techtrees || {});
    const civId = civIds[Math.floor(r() * civIds.length)];
    const unique = MainData.data.techtrees[civId].unique;
    const techTypes = ['castleAgeUniqueTech', 'imperialAgeUniqueTech'] as const;
    const chosen = techTypes[Math.floor(r() * techTypes.length)];
    const techId = String(unique[chosen]);
    if (excludeNaval && isNavalTech(techId)) return getCivToUniqueTechQ(excludeNaval, r, t);
    const techName = getUniqueTechName(techId);
    const civName = Strings.data[MainData.data.civ_names[civId]];
    const correctAnswer: Answer = {
        id: uuid.v4(),
        text: techName,
        type: 'civInfo',
        isCorrect: true,
        techId,
        image: chosen === 'imperialAgeUniqueTech' ? 'https://aoe2techtree.net/img/Techs/unique_tech_2.png' : 'https://aoe2techtree.net/img/Techs/unique_tech_1.png',
    };
    const usedTechIds = new Set<string>([techId]);
    const otherUniqueTechs: string[] = [];
    Object.keys(MainData.data.techtrees || {}).forEach((c) => {
        const u = MainData.data.techtrees[c].unique;
        [u.castleAgeUniqueTech, u.imperialAgeUniqueTech].forEach((tid) => {
            if (tid != null) {
                const sid = String(tid);
                if (!usedTechIds.has(sid) && (!excludeNaval || !isNavalTech(sid))) {
                    usedTechIds.add(sid);
                    otherUniqueTechs.push(sid);
                }
            }
        });
    });
    const wrongAnswers = shuffleArray(otherUniqueTechs, r).slice(0, 3).map((tid) => ({
        id: uuid.v4(),
        text: getUniqueTechName(tid),
        type: 'civInfo' as const,
        isCorrect: false,
        techId: tid,
        image: getUniqueTechIconUrl(tid),
    }));
    const text = t ? t('questions.civUniqueTech_civToTech') : 'What is this civilization\'s unique technology?';
    return {
        variant: 'civUniqueTech_civToTech',
        type: 'civInfo',
        questionKey: `civToUniqueTech_${civId}_${techId}`,
        text,
        subText: civName,
        image: `https://aoe2techtree.net/img/Civs/${civId.toLowerCase()}.png`,
        answers: shuffleArray([correctAnswer, ...wrongAnswers], r),
    };
}

/** Upgrade display name: use upgraded unit name. */
function getUpgradeDisplayName(upgradeKey: string): string {
    const up = MainData.data.data.unit_upgrades[upgradeKey];
    if (!up) return '';
    const unit = MainData.data.data.units[String(up.ID)];
    return unit ? Strings.data[unit.LanguageNameId] : up.internal_name || upgradeKey;
}

/** Icon URL for unit upgrade. aoe2techtree uses numeric unit ID for filenames (e.g. 1155.png). Prefer upgrade key when it's a unit id (works for 1155, 1792); else resolve by up.ID (result unit). */
function getUpgradeIconUrl(upgradeKey: string): string {
    const up = MainData.data.data.unit_upgrades[upgradeKey];
    if (!up) return '';
    const units = MainData.data.data.units || {};
    // When upgrade key is the result unit id (e.g. 1155 Elite Skirmisher), use it — aoe2techtree has Units/1155.png
    if (units[upgradeKey]) return `https://aoe2techtree.net/img/Units/${upgradeKey.toLowerCase()}.png`;
    const unitEntry = Object.entries(units).find(([, u]) => u.ID === up.ID);
    const unitKey = unitEntry ? unitEntry[0] : String(up.ID);
    return `https://aoe2techtree.net/img/Units/${unitKey.toLowerCase()}.png`;
}

/** Question: Show upgrade, ask cost. */
export const getUpgradePriceQ = (direction: 'upgradeToPrice' | 'priceToUpgrade', random?: RandomFn, t?: TranslateFn): Question => {
    const r = random ?? (() => Math.random());
    const upgrades = Object.keys(MainData.data.data.unit_upgrades || {});
    const withCost = upgrades.filter((k) => {
        const c = MainData.data.data.unit_upgrades[k].Cost;
        const total = (c?.Food || 0) + (c?.Wood || 0) + (c?.Gold || 0) + (c?.Stone || 0);
        return total > 0;
    });
    if (withCost.length === 0) return getTechTimeQ(false, false, r, t);
    const upgradeId = withCost[Math.floor(r() * withCost.length)];
    const upgradeObj = MainData.data.data.unit_upgrades[upgradeId];
    const cost = upgradeObj.Cost;
    const upgradeName = getUpgradeDisplayName(upgradeId);
    if (direction === 'upgradeToPrice') {
        const usedCosts: Cost[] = [cost];
        const usedUpgradeIds = new Set<string>([upgradeId]);
        const getOther = (): Answer => {
            const maxAttempts = 50;
            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                const otherId = withCost[Math.floor(r() * withCost.length)];
                const otherCost = MainData.data.data.unit_upgrades[otherId].Cost;
                if (usedUpgradeIds.has(otherId) || isCostEqual(otherCost, cost) || usedCosts.some((c) => isCostEqual(c, otherCost)))
                    continue;
                usedUpgradeIds.add(otherId);
                usedCosts.push(otherCost);
                return { id: uuid.v4(), type: 'unitPrice', cost: otherCost, isCorrect: false };
            }
            let fallbackCost = getSimilarPrice(cost, r);
            let fallbackAttempts = 0;
            while (usedCosts.some((c) => isCostEqual(c, fallbackCost)) && fallbackAttempts++ < 10)
                fallbackCost = getSimilarPrice(cost, r);
            usedCosts.push(fallbackCost);
            return { id: uuid.v4(), type: 'unitPrice', cost: fallbackCost, isCorrect: false };
        };
        const text = t ? t('questions.upgradePrice_upgradeToPrice') : 'What is the cost of this upgrade?';
        return {
            variant: 'upgradePrice_upgradeToPrice',
            type: 'unitPrice',
            questionKey: `upgradePrice_${upgradeId}`,
            text,
            subText: upgradeName,
            image: getUpgradeIconUrl(upgradeId),
            answers: shuffleArray([
                { id: uuid.v4(), type: 'unitPrice', cost, isCorrect: true },
                getOther(),
                getOther(),
                getOther(),
            ], r),
        };
    }
    const usedCosts: Cost[] = [cost];
    const usedUpgradeIds = new Set<string>([upgradeId]);
    const getOtherUpgrade = (): Answer => {
        const maxAttempts = 50;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const otherId = withCost[Math.floor(r() * withCost.length)];
            const otherCost = MainData.data.data.unit_upgrades[otherId].Cost;
            if (usedUpgradeIds.has(otherId) || isCostEqual(otherCost, cost) || usedCosts.some((c) => isCostEqual(c, otherCost)))
                continue;
            usedUpgradeIds.add(otherId);
            usedCosts.push(otherCost);
            const name = getUpgradeDisplayName(otherId);
            return { id: uuid.v4(), text: name, type: 'unitPrice', isCorrect: false, image: getUpgradeIconUrl(otherId) };
        }
        const wrongPool = withCost.filter((k) => k !== upgradeId);
        const fallbackId = wrongPool.find((k) => !usedUpgradeIds.has(k)) ?? wrongPool[0];
        if (fallbackId) {
            usedUpgradeIds.add(fallbackId);
            const name = getUpgradeDisplayName(fallbackId);
            return { id: uuid.v4(), text: name, type: 'unitPrice', isCorrect: false, image: getUpgradeIconUrl(fallbackId) };
        }
        const anyWrong = [...usedUpgradeIds].find((k) => k !== upgradeId);
        if (anyWrong)
            return { id: uuid.v4(), text: getUpgradeDisplayName(anyWrong), type: 'unitPrice', isCorrect: false, image: getUpgradeIconUrl(anyWrong) };
        return { id: uuid.v4(), text: '', type: 'unitPrice', isCorrect: false, image: '' };
    };
    const costStr = [cost.Food && `F: ${cost.Food}`, cost.Wood && `W: ${cost.Wood}`, cost.Gold && `G: ${cost.Gold}`, cost.Stone && `S: ${cost.Stone}`].filter(Boolean).join(' ');
    const text = t ? t('questions.upgradePrice_priceToUpgrade') : 'Which upgrade costs this much?';
    return {
        variant: 'upgradePrice_priceToUpgrade',
        type: 'unitPrice',
        questionKey: `upgradePriceTo_${upgradeId}`,
        text,
        subText: costStr,
        answers: shuffleArray([
            { id: uuid.v4(), text: upgradeName, type: 'unitPrice', isCorrect: true, image: getUpgradeIconUrl(upgradeId) },
            getOtherUpgrade(),
            getOtherUpgrade(),
            getOtherUpgrade(),
        ], r),
    };
}

/** Question: Show upgrade, ask research time. */
export const getUpgradeTimeQ = (direction: 'upgradeToTime' | 'timeToUpgrade', random?: RandomFn, t?: TranslateFn): Question => {
    const r = random ?? (() => Math.random());
    const upgrades = Object.keys(MainData.data.data.unit_upgrades || {});
    if (upgrades.length === 0) return getTechTimeQ(false, false, r, t);
    const upgradeId = upgrades[Math.floor(r() * upgrades.length)];
    const upgradeObj = MainData.data.data.unit_upgrades[upgradeId];
    const correctTime = upgradeObj.ResearchTime;
    const upgradeName = getUpgradeDisplayName(upgradeId);
    const usedTimes = new Set<number>([correctTime]);
    const fakeTimes: number[] = [];
    while (fakeTimes.length < 3) {
        const v = Math.max(0, correctTime + (Math.floor(r() * 40) - 20) * 5);
        if (!usedTimes.has(v)) { usedTimes.add(v); fakeTimes.push(v); }
    }
    if (direction === 'upgradeToTime') {
        const text = t ? t('questions.upgradeTime_upgradeToTime') : 'How long does this upgrade take to research?';
        const answers = shuffleArray([
            { id: uuid.v4(), text: `${correctTime} sec`, type: 'techInfo' as const, isCorrect: true },
            ...fakeTimes.map((sec) => ({ id: uuid.v4(), text: `${sec} sec`, type: 'techInfo' as const, isCorrect: false })),
        ], r);
        return {
            variant: 'upgradeTime_upgradeToTime',
            type: 'techInfo',
            questionKey: `upgradeTime_${upgradeId}`,
            text,
            subText: upgradeName,
            image: getUpgradeIconUrl(upgradeId),
            answers,
        };
    }
    const otherUpgrades = shuffleArray(upgrades.filter((k) => k !== upgradeId), r).slice(0, 3);
    const correctAnswer = { id: uuid.v4(), text: upgradeName, type: 'techInfo' as const, isCorrect: true, image: getUpgradeIconUrl(upgradeId) };
    const wrongAnswers = otherUpgrades.map((k) => ({
        id: uuid.v4(),
        text: getUpgradeDisplayName(k),
        type: 'techInfo' as const,
        isCorrect: false,
        image: getUpgradeIconUrl(k),
    }));
    const text = t ? t('questions.upgradeTime_timeToUpgrade') : 'Which upgrade takes this long to research?';
    return {
        variant: 'upgradeTime_timeToUpgrade',
        type: 'techInfo',
        questionKey: `upgradeTimeTo_${correctTime}_${upgradeId}`,
        text,
        subText: `${correctTime} sec`,
        answers: shuffleArray([correctAnswer, ...wrongAnswers], r),
    };
}

const BUILDING_STAT_KEYS = ['GarrisonCapacity', 'LineOfSight', 'Range', 'HP'] as const;
type BuildingStatKey = (typeof BUILDING_STAT_KEYS)[number];
function getBuildingStatI18nKey(key: BuildingStatKey): string {
    const map: Record<BuildingStatKey, string> = { GarrisonCapacity: 'garrisonCapacity', LineOfSight: 'lineOfSight', Range: 'range', HP: 'hp' };
    return map[key];
}

/** Question: Show building, ask stat value. */
export const getBuildingStatsBuildingToStatQ = (excludeNaval?: boolean, random?: RandomFn, t?: TranslateFn): Question => {
    const r = random ?? (() => Math.random());
    let buildingIds = Object.keys(MainData.data.data.buildings);
    if (excludeNaval) buildingIds = buildingIds.filter((id) => !isNavalBuilding(id));
    buildingIds = buildingIds.filter((id) => !isUniqueBuilding(id));
    if (buildingIds.length === 0) buildingIds = Object.keys(MainData.data.data.buildings);
    const buildingId = buildingIds[Math.floor(r() * buildingIds.length)];
    const building = MainData.data.data.buildings[buildingId];
    const statKey = BUILDING_STAT_KEYS[Math.floor(r() * BUILDING_STAT_KEYS.length)];
    const correctValue = building[statKey];
    if (correctValue == null) return getBuildingStatsBuildingToStatQ(excludeNaval, r, t);
    const buildingName = Strings.data[building.LanguageNameId];
    const statLabel = t ? t(`buildingStats.${getBuildingStatI18nKey(statKey)}`) : statKey;
    const usedValues = new Set<number>([correctValue]);
    const fakeValues: number[] = [];
    while (fakeValues.length < 3) {
        const v = Math.max(0, correctValue + (Math.floor(r() * 20) - 10));
        if (!usedValues.has(v)) { usedValues.add(v); fakeValues.push(v); }
    }
    const text = t ? t('questions.buildingStats_buildingToStat') : 'What is this building\'s value for this stat?';
    const answers = shuffleArray([
        { id: uuid.v4(), text: String(correctValue), type: 'unitStats' as const, isCorrect: true, statValue: correctValue, statLabel },
        ...fakeValues.map((val) => ({ id: uuid.v4(), text: String(val), type: 'unitStats' as const, isCorrect: false, statValue: val, statLabel })),
    ], r);
    return {
        variant: 'buildingStats_buildingToStat',
        type: 'unitStats',
        questionKey: `buildingStat_${buildingId}_${statKey}`,
        text,
        subText: `${buildingName} — ${statLabel}`,
        image: `https://aoe2techtree.net/img/Buildings/${buildingId.toLowerCase()}.png`,
        statKey,
        statValue: correctValue,
        answers,
    };
}

/** Question: Show stat value, ask which building. */
export const getBuildingStatsStatToBuildingQ = (excludeNaval?: boolean, random?: RandomFn, t?: TranslateFn): Question => {
    const r = random ?? (() => Math.random());
    let buildingIds = Object.keys(MainData.data.data.buildings);
    if (excludeNaval) buildingIds = buildingIds.filter((id) => !isNavalBuilding(id));
    buildingIds = buildingIds.filter((id) => !isUniqueBuilding(id));
    if (buildingIds.length === 0) buildingIds = Object.keys(MainData.data.data.buildings);
    const buildingId = buildingIds[Math.floor(r() * buildingIds.length)];
    const building = MainData.data.data.buildings[buildingId];
    const statKey = BUILDING_STAT_KEYS[Math.floor(r() * BUILDING_STAT_KEYS.length)];
    const correctValue = building[statKey];
    if (correctValue == null) return getBuildingStatsStatToBuildingQ(excludeNaval, r, t);
    const buildingName = Strings.data[building.LanguageNameId];
    const statLabel = t ? t(`buildingStats.${getBuildingStatI18nKey(statKey)}`) : statKey;
    const correctAnswer: Answer = {
        id: uuid.v4(),
        text: buildingName,
        type: 'civInfo',
        isCorrect: true,
        buildingId,
        image: `https://aoe2techtree.net/img/Buildings/${buildingId.toLowerCase()}.png`,
    };
    const usedIds = new Set<string>([buildingId]);
    const getOther = (): Answer => {
        const maxAttempts = 80;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const otherId = buildingIds[Math.floor(r() * buildingIds.length)];
            if (usedIds.has(otherId)) continue;
            const other = MainData.data.data.buildings[otherId];
            const val = other[statKey];
            if (val === correctValue) continue;
            usedIds.add(otherId);
            return { id: uuid.v4(), text: Strings.data[other.LanguageNameId], type: 'civInfo', isCorrect: false, buildingId: otherId, image: `https://aoe2techtree.net/img/Buildings/${otherId.toLowerCase()}.png` };
        }
        const fallbackId = buildingIds.find((id) => !usedIds.has(id) && id !== buildingId) ?? buildingIds.find((id) => id !== buildingId);
        if (fallbackId) {
            usedIds.add(fallbackId);
            const other = MainData.data.data.buildings[fallbackId];
            return { id: uuid.v4(), text: Strings.data[other.LanguageNameId], type: 'civInfo', isCorrect: false, buildingId: fallbackId, image: `https://aoe2techtree.net/img/Buildings/${fallbackId.toLowerCase()}.png` };
        }
        const anyOther = buildingIds.find((id) => id !== buildingId);
        if (anyOther) {
            const other = MainData.data.data.buildings[anyOther];
            return { id: uuid.v4(), text: Strings.data[other.LanguageNameId], type: 'civInfo', isCorrect: false, buildingId: anyOther, image: `https://aoe2techtree.net/img/Buildings/${anyOther.toLowerCase()}.png` };
        }
        return { id: uuid.v4(), text: '', type: 'civInfo', isCorrect: false, buildingId: '', image: '' };
    };
    const text = t ? t('questions.buildingStats_statToBuilding') : 'Which building has this value for this stat?';
    return {
        variant: 'buildingStats_statToBuilding',
        type: 'civInfo',
        questionKey: `buildingStatTo_${statKey}_${correctValue}_${buildingId}`,
        text,
        subText: `${statLabel}: ${correctValue}`,
        answers: shuffleArray([correctAnswer, getOther(), getOther(), getOther()], r),
    };
}

/** Strip HTML for description text. */
function stripDesc(html: string): string {
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200);
}

/** Remove everything between angle brackets (ASCII < > or Unicode ‹ › U+2039/U+203A), then collapse spaces. */
function stripAngleBrackets(s: string): string {
    return s
        .replace(/<[^>]*>/g, ' ')
        .replace(/\u2039[^\u203A]*\u203A/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/** Prepare unit description for quiz: remove "Create UnitName (cost)" prefix, strip all <...> and ‹...›, trim. */
function getUnitDescForQuestion(html: string): string {
    const firstParen = html.indexOf(')');
    const text = firstParen >= 0 ? html.slice(firstParen + 1) : html;
    return stripAngleBrackets(text);
}

/** Question: Show building description, ask which building. */
export const getBuildingDescQ = (excludeNaval?: boolean, random?: RandomFn, t?: TranslateFn): Question => {
    const r = random ?? (() => Math.random());
    let buildingIds = Object.keys(MainData.data.data.buildings);
    if (excludeNaval) buildingIds = buildingIds.filter((id) => !isNavalBuilding(id));
    buildingIds = buildingIds.filter((id) => !isUniqueBuilding(id));
    if (buildingIds.length === 0) buildingIds = Object.keys(MainData.data.data.buildings);
    const buildingId = buildingIds[Math.floor(r() * buildingIds.length)];
    const building = MainData.data.data.buildings[buildingId];
    const rawDesc = Strings.data[building.LanguageHelpId] || '';
    const desc = stripDesc(rawDesc);
    if (!desc) return getBuildingDescQ(excludeNaval, r, t);
    const buildingName = Strings.data[building.LanguageNameId];
    const correctAnswer: Answer = { id: uuid.v4(), text: buildingName, type: 'civInfo', isCorrect: true, buildingId, image: `https://aoe2techtree.net/img/Buildings/${buildingId.toLowerCase()}.png` };
    const usedIds = new Set<string>([buildingId]);
    const getOther = (): Answer => {
        const maxAttempts = 80;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const otherId = buildingIds[Math.floor(r() * buildingIds.length)];
            if (usedIds.has(otherId)) continue;
            usedIds.add(otherId);
            const other = MainData.data.data.buildings[otherId];
            return { id: uuid.v4(), text: Strings.data[other.LanguageNameId], type: 'civInfo', isCorrect: false, buildingId: otherId, image: `https://aoe2techtree.net/img/Buildings/${otherId.toLowerCase()}.png` };
        }
        const fallbackId = buildingIds.find((id) => !usedIds.has(id)) ?? buildingIds.find((id) => id !== buildingId);
        if (fallbackId) {
            usedIds.add(fallbackId);
            const other = MainData.data.data.buildings[fallbackId];
            return { id: uuid.v4(), text: Strings.data[other.LanguageNameId], type: 'civInfo', isCorrect: false, buildingId: fallbackId, image: `https://aoe2techtree.net/img/Buildings/${fallbackId.toLowerCase()}.png` };
        }
        return { id: uuid.v4(), text: '', type: 'civInfo', isCorrect: false, buildingId: '', image: '' };
    };
    const text = t ? t('questions.buildingDesc_descToBuilding') : 'Which building is described here?';
    return {
        variant: 'buildingDesc_descToBuilding',
        type: 'civInfo',
        questionKey: `buildingDesc_${buildingId}`,
        text,
        subText: desc,
        answers: shuffleArray([correctAnswer, getOther(), getOther(), getOther()], r),
    };
}

/** Question: Show unit description, ask which unit. */
export const getUnitDescQ = (excludeNaval?: boolean, excludeUnique?: boolean, random?: RandomFn, t?: TranslateFn): Question => {
    const r = random ?? (() => Math.random());
    let unitIds = Object.keys(MainData.data.data.units);
    if (excludeNaval) unitIds = unitIds.filter((id) => !isNavalUnit(id));
    if (excludeUnique) unitIds = unitIds.filter((id) => !isUniqueUnit(id));
    if (unitIds.length === 0) unitIds = Object.keys(MainData.data.data.units);
    const unitId = unitIds[Math.floor(r() * unitIds.length)];
    const unit = MainData.data.data.units[unitId];
    const rawDesc = Strings.data[unit.LanguageHelpId] || '';
    const desc = getUnitDescForQuestion(rawDesc);
    if (!desc) return getUnitDescQ(excludeNaval, excludeUnique, r, t);
    const unitName = Strings.data[unit.LanguageNameId];
    const correctAnswer: Answer = { id: uuid.v4(), text: unitName, type: 'civInfo', isCorrect: true, unitId, image: `https://aoe2techtree.net/img/Units/${unitId.toLowerCase()}.png` };
    const usedIds = new Set<string>([unitId]);
    const getOther = (): Answer => {
        const maxAttempts = 80;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const otherId = unitIds[Math.floor(r() * unitIds.length)];
            if (usedIds.has(otherId)) continue;
            usedIds.add(otherId);
            const other = MainData.data.data.units[otherId];
            return { id: uuid.v4(), text: Strings.data[other.LanguageNameId], type: 'civInfo', isCorrect: false, unitId: otherId, image: `https://aoe2techtree.net/img/Units/${otherId.toLowerCase()}.png` };
        }
        const fallbackId = unitIds.find((id) => !usedIds.has(id)) ?? unitIds.find((id) => id !== unitId);
        if (fallbackId) {
            usedIds.add(fallbackId);
            const other = MainData.data.data.units[fallbackId];
            return { id: uuid.v4(), text: Strings.data[other.LanguageNameId], type: 'civInfo', isCorrect: false, unitId: fallbackId, image: `https://aoe2techtree.net/img/Units/${fallbackId.toLowerCase()}.png` };
        }
        return { id: uuid.v4(), text: '', type: 'civInfo', isCorrect: false, unitId: '', image: '' };
    };
    const text = t ? t('questions.unitDesc_descToUnit') : 'Which unit is described here?';
    return {
        variant: 'unitDesc_descToUnit',
        type: 'civInfo',
        questionKey: `unitDesc_${unitId}`,
        text,
        subText: desc,
        answers: shuffleArray([correctAnswer, getOther(), getOther(), getOther()], r),
    };
}

type LegacyKey =
    | 'civInfo' | 'unitPrice' | 'buildingPrice' | 'techPrice' | 'civTech' | 'techInfo' | 'treeBrunch'
    | 'uniqueUnitToCiv' | 'civToUniqueUnit' | 'unitStatsToUnit' | 'unitToStat'
    | 'techTime' | 'civToUniqueTech' | 'upgradePriceToPrice' | 'upgradePriceToUpgrade' | 'upgradeTimeToTime' | 'upgradeTimeToUpgrade'
    | 'buildingStatsToStat' | 'buildingStatToBuilding' | 'unitDesc';

const VARIANT_TO_LEGACY: Partial<Record<QuestionTypeVariantValue, LegacyKey>> = {
    techPrice_techToPrice: 'techPrice',
    unitPrice_unitToPrice: 'unitPrice',
    buildingPrice_buildingToPrice: 'buildingPrice',
    civBonus_bonusToCiv: 'civInfo',
    civUniqueUnit_unitToCiv: 'uniqueUnitToCiv',
    civUniqueUnit_civToUnit: 'civToUniqueUnit',
    techDesc_descToTech: 'techInfo',
    treeBranch_branchToCiv: 'treeBrunch',
    unitStats_statsToUnit: 'unitStatsToUnit',
    unitStats_unitToStat: 'unitToStat',
    techTime_techToTime: 'techTime',
    civUniqueTech_civToTech: 'civToUniqueTech',
    upgradePrice_upgradeToPrice: 'upgradePriceToPrice',
    upgradePrice_priceToUpgrade: 'upgradePriceToUpgrade',
    upgradeTime_upgradeToTime: 'upgradeTimeToTime',
    upgradeTime_timeToUpgrade: 'upgradeTimeToUpgrade',
    buildingStats_buildingToStat: 'buildingStatsToStat',
    buildingStats_statToBuilding: 'buildingStatToBuilding',
    // buildingDesc_descToBuilding disabled (too readable), code kept for possible reuse
    unitDesc_descToUnit: 'unitDesc',
};

/** Question variants that can be used for training (single-type infinite quiz). */
export const SUPPORTED_TRAINING_VARIANTS: QuestionTypeVariantValue[] = Object.keys(VARIANT_TO_LEGACY) as QuestionTypeVariantValue[];

const MAX_QUESTION_RETRIES = 30;

export function getQuestionByVariants(
    variants: QuestionTypeVariantValue[],
    levelId?: string,
    random?: RandomFn,
    t?: TranslateFn,
    usedKeys?: Set<string>
): Question {
    const r = random ?? (() => Math.random());
    const supported = variants.filter((v) => VARIANT_TO_LEGACY[v]);
    const excludeNaval = levelId ? !isNavalAllowedForLevel(levelId) : false;
    const excludeUniqueTech = levelId === 'villager' || levelId === 'militia' || levelId === 'scout';

    const generate = (): Question => {
        const chosen = supported.length ? supported[Math.floor(r() * supported.length)] : ('civBonus_bonusToCiv' as QuestionTypeVariantValue);
        const legacy = VARIANT_TO_LEGACY[chosen];
        if (legacy === 'civInfo') return getCivInfoQ(r, t);
        if (legacy === 'techInfo') return getTechInfoQ(excludeNaval, excludeUniqueTech, r, t);
        if (legacy === 'civTech') return getCivTechQ(excludeNaval, r, t);
        if (legacy === 'treeBrunch') return getTreeBrunchQ(r, t);
        if (legacy === 'uniqueUnitToCiv') return getUniqueUnitToCivQ(excludeNaval, r, t);
        if (legacy === 'civToUniqueUnit') return getCivToUniqueUnitQ(excludeNaval, r, t);
        if (legacy === 'unitStatsToUnit') return getUnitStatsToUnitQ(excludeNaval, excludeUniqueTech, r, t);
        if (legacy === 'unitToStat') return getUnitToStatQ(excludeNaval, excludeUniqueTech, r, t);
        if (legacy === 'unitPrice' || legacy === 'buildingPrice' || legacy === 'techPrice') return getPriceQ(legacy, excludeNaval, excludeUniqueTech, levelId, r, t);
        if (legacy === 'techTime') return getTechTimeQ(excludeNaval, excludeUniqueTech, r, t);
        if (legacy === 'civToUniqueTech') return getCivToUniqueTechQ(excludeNaval, r, t);
        if (legacy === 'upgradePriceToPrice') return getUpgradePriceQ('upgradeToPrice', r, t);
        if (legacy === 'upgradePriceToUpgrade') return getUpgradePriceQ('priceToUpgrade', r, t);
        if (legacy === 'upgradeTimeToTime') return getUpgradeTimeQ('upgradeToTime', r, t);
        if (legacy === 'upgradeTimeToUpgrade') return getUpgradeTimeQ('timeToUpgrade', r, t);
        if (legacy === 'buildingStatsToStat') return getBuildingStatsBuildingToStatQ(excludeNaval, r, t);
        if (legacy === 'buildingStatToBuilding') return getBuildingStatsStatToBuildingQ(excludeNaval, r, t);
        if (legacy === 'unitDesc') return getUnitDescQ(excludeNaval, excludeUniqueTech, r, t);
        return getCivInfoQ(r, t);
    };

    if (!usedKeys?.size) return generate();
    for (let attempt = 0; attempt < MAX_QUESTION_RETRIES; attempt++) {
        const q = generate();
        if (q.questionKey && !usedKeys.has(q.questionKey)) return q;
    }
    return generate();
}

/** Format the correct answer as a display string for "Correct was: X" */
export function formatCorrectAnswer(question: Question): string {
    const correct = question.answers.find((a) => a.isCorrect);
    if (!correct) return '';
    if (correct.text) return correct.text;
    if (correct.cost) {
        const parts: string[] = [];
        if (correct.cost.Food) parts.push(`F: ${correct.cost.Food}`);
        if (correct.cost.Gold) parts.push(`G: ${correct.cost.Gold}`);
        if (correct.cost.Wood) parts.push(`W: ${correct.cost.Wood}`);
        if (correct.cost.Stone) parts.push(`S: ${correct.cost.Stone}`);
        return parts.join(' ');
    }
    if (correct.statValue !== undefined && correct.statLabel) return `${correct.statLabel}: ${correct.statValue}`;
    return String(correct.techName ?? correct.techInfo ?? '');
}
