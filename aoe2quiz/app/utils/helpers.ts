import {Cost} from "@/app/models/dataModel";
import {Age, Buildings, Tech, TechTreeBrunch, TechTreePoint, Unit} from "@/app/const/techTree";
import MainData from '@/app/gameData';
import Strings from "@/app/strings";

export type RandomFn = () => number;

const defaultRandom: RandomFn = () => Math.random();

export const shuffleArray = <T,>(array: T[], random: RandomFn = defaultRandom): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export const getRandomArrayValue = <T,>(data: T[], random: RandomFn = defaultRandom): T => {
    return data[Math.floor(random() * data.length)];
};

export const getRandomArrayIndex = (length: number, random: RandomFn = defaultRandom): number => {
    return Math.floor(random() * length);
};

// TODO: bad name, rename;
export const hasPoint = (data: TechTreePoint, civId: string) => {
    if(data.building) {
        return  !!MainData.data.techtrees[civId]?.buildings.find(i => i.id === data.building);
    }
    if(data.unit) {
        return  !!MainData.data.techtrees[civId]?.units.find(i => i.id === data.unit);
    }
    if(data.tech) {
        return  !!MainData.data.techtrees[civId]?.techs.find(i => i.id === data.tech);
    }

    return false;
}

export const isCostEqual = (cost1: Cost, cost2: Cost): boolean => {
    return cost1.Wood === cost2.Wood && cost1.Stone === cost2.Stone && cost1.Gold === cost2.Gold && cost1.Food === cost2.Food;
}

export const isTreeBrunchesEqual = (civId1: string, civId2: string, tree: TechTreeBrunch) => {
    let isEqual = true;

    const compareCivs = (point: TechTreePoint) => {
        const hasPointC1 = hasPoint(point, civId1);
        const hasPointC2 = hasPoint(point, civId2);
        const isSame = (hasPointC1 && hasPointC2) || (!hasPointC1 && !hasPointC2);
        if(!isSame) {
            isEqual = false;
        }
    }

    traverseTechTreeBrunch(tree, compareCivs);
    return isEqual;
}

const traverseTechTreeBrunch = (brunch: TechTreeBrunch, callback: (point: TechTreePoint) => void) => {
    for (const treeAgeData of brunch) {
        for (const techTreeLine of treeAgeData.items) {
            for (const techTreePoint of techTreeLine) {
                callback(techTreePoint); // Выполняем действие на каждом элементе
            }
        }
    }
};

export const getSimilarPrice = (price: Cost, random: RandomFn = defaultRandom): Cost => {
    const variants = [5, 10, 20, 15, -5, -10, -15, -20];

    const fakePrice: Cost = { ...price };

    if (fakePrice.Wood != null) {
        fakePrice.Wood = Math.max(0, (fakePrice.Wood || 0) + variants[Math.floor(random() * variants.length)]);
    }
    if (fakePrice.Stone != null) {
        fakePrice.Stone = Math.max(0, (fakePrice.Stone || 0) + variants[Math.floor(random() * variants.length)]);
    }
    if (fakePrice.Gold != null) {
        fakePrice.Gold = Math.max(0, (fakePrice.Gold || 0) + variants[Math.floor(random() * variants.length)]);
    }
    if (fakePrice.Food != null) {
        fakePrice.Food = Math.max(0, (fakePrice.Food || 0) + variants[Math.floor(random() * variants.length)]);
    }

    const total = (fakePrice.Wood || 0) + (fakePrice.Stone || 0) + (fakePrice.Gold || 0) + (fakePrice.Food || 0);
    if (total === 0) return getSimilarPrice(price, random);
    return fakePrice;
};

export const getTechImageById = (techId: Tech) => {
    let uniqUri;
    Object.keys(MainData.data.techtrees).forEach((civKey) => {
        if (MainData.data.techtrees[civKey].unique.imperialAgeUniqueTech.toString() === techId.toString()) {
            uniqUri = 'https://aoe2techtree.net/img/Techs/unique_tech_2.png'
        }
        if (MainData.data.techtrees[civKey].unique.castleAgeUniqueTech.toString() === techId.toString()) {
            uniqUri = 'https://aoe2techtree.net/img/Techs/unique_tech_1.png'
        }
    });

    return uniqUri || `https://aoe2techtree.net/img/Techs/${techId.toString().toLowerCase()}.png`;
}

export const getUnitImageById = (unitId: Unit): string => {
    return `https://aoe2techtree.net/img/Units/${unitId.toString().toLowerCase()}.png`
}

export const getBuildingImageById = (id: Buildings): string => {
    return `https://aoe2techtree.net/img/Buildings/${id.toString().toLowerCase()}.png`
}

export const getUnitNameById = (unitId: Unit): string => {
    const stringId = MainData.data.data.units[unitId].LanguageNameId;
    return Strings.data[stringId] || 'no data';
}

export const getTechNameById = (unitId: Tech): string => {
    const stringId = MainData.data.data.techs[unitId].LanguageNameId;
    return Strings.data[stringId] || 'no data';
}

export const getBuildingNameById = (unitId: Buildings): string => {
    const stringId = MainData.data.data.buildings[unitId].LanguageNameId;
    return Strings.data[stringId] || 'no data';
}

export const getImageByAgeId = (age: Age) => {
    switch (age) {
        case Age.DarkAge:
            return 'https://aoe2techtree.net/img/Ages/feudal_age_de.png';
        case Age.FeudalAge:
            return 'https://aoe2techtree.net/img/Ages/feudal_age_de.png';
        case Age.CastleAge:
            return 'https://aoe2techtree.net/img/Ages/castle_age_de.png';
        case Age.ImperialAge:
            return 'https://aoe2techtree.net/img/Ages/imperial_age_de.png';
        default:
            return '';
    }
}

export const getImageUrl = (data: TechTreePoint): string => {
    if(data.tech) {
        return getTechImageById(data.tech);
    }
    if(data.unit) {
        return getUnitImageById(data.unit)
    }
    if(data.building) {
        return getBuildingImageById(data.building)
    }
    return "";
};

export const getTitle = (data: TechTreePoint): string => {
    if(data.tech) {
        return getTechNameById(data.tech);
    }
    if(data.unit) {
        return getUnitNameById(data.unit)
    }
    if(data.building) {
        return getBuildingNameById(data.building)
    }
    return 'unknown'
};

export const getRandomCivId = (random: RandomFn = defaultRandom): string => {
    const civIds = Object.keys(MainData.data.civ_names);
    return civIds[Math.floor(random() * civIds.length)];
};

/** Localized civilization name by game civ id (e.g. "Britons"). */
export const getCivNameById = (civId: string): string => {
    const stringId = MainData.data.civ_names?.[civId];
    if (!stringId) return civId;
    return Strings.data[stringId] || civId;
};

/** URL of civilization icon (aoe2techtree). */
export const getCivIconUri = (civId: string): string =>
    `https://aoe2techtree.net/img/Civs/${civId.toLowerCase()}.png`;

/** All civilization ids for selection, sorted by localized name. */
export const getCivIdsSortedByName = (): string[] => {
    const civIds = Object.keys(MainData.data.civ_names || {});
    return [...civIds].sort((a, b) => getCivNameById(a).localeCompare(getCivNameById(b)));
};

