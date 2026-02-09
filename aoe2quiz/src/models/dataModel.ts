type AgeNames = { [key: string]: string };

type CivHelpTexts = { [key: string]: string };

type CivNames = { [key: string]: string };

type Armour = {
    Amount: number;
    Class: number;
};

type Attack = {
    Amount: number;
    Class: number;
};

export type Resource = 'Food' | 'Wood' | 'Gold' | 'Stone';

export type Cost = {
    Food?: number;
    Wood?: number;
    Gold?: number;
    Stone?: number;
};

type Building = {
    AccuracyPercent: number;
    Armours: Armour[];
    Attack: number;
    Attacks: Attack[];
    Cost: Cost;
    GarrisonCapacity: number;
    HP: number;
    ID: number;
    LanguageHelpId: number;
    LanguageNameId: number;
    LineOfSight: number;
    MeleeArmor: number;
    MinRange: number;
    PierceArmor: number;
    Range: number;
    ReloadTime: number;
    TrainTime: number;
    internal_name: string;
};

type Tech = {
    Cost: Cost;
    ID: number;
    LanguageHelpId: number;
    LanguageNameId: number;
    Repeatable: boolean;
    ResearchTime: number;
    internal_name: string;
};

type Unit = {
    ID: number;
    LanguageHelpId: number;
    LanguageNameId: number;
    Cost: Cost;
    HP: number;
    Attack: number;
    MeleeArmor: number;
    PierceArmor: number;
    Speed: number;
    internal_name: string;
};

type Data = {
    buildings: { [id: string]: Building };
    techs: { [id: string]: Tech };
    units: { [id: string]: Unit };
    unit_upgrades: { [id: string]: UnitUpgrade };
};

type TechTreeStrings = { [key: string]: string }; // Example: { "some_key": "some_value" }

type TechTree = {
    buildings: { age: number; id: number }[];
    monkPrefix: string;
    techs: { age: number; id: number }[];
    unique: {
        castleAgeUniqueTech: number;
        castleAgeUniqueUnit: number;
        imperialAgeUniqueTech: number;
        imperialAgeUniqueUnit: number;
    };
    units: { age: number; id: number }[];
};


type UnitUpgrade = {
    Cost: Cost;
    ID: number; // This represents the ID of the upgraded unit
    ResearchTime: number;
    internal_name: string; // Name of the upgrade
};


export type GameData = {
    age_names: { [key: string]: string };
    civ_helptexts: { [key: string]: string };
    civ_names: { [key: string]: string };
    data: {
        buildings: { [id: string]: Building };
        techs: { [id: string]: Tech };
        unit_upgrades: { [id: string]: UnitUpgrade };
        units: { [id: string]: Unit };
    };
    tech_tree_strings: { [key: string]: string };
    techtrees: { [civName: string]: TechTree }; // Updated to match JSON
};
