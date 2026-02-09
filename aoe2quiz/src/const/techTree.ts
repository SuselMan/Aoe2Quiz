export enum Buildings {
    Barracks = 12,
    Dock = 45,
    SiegeWorkshop = 49,
    Farm = 50,
    Mill = 68,
    House = 70,
    TownCenter = 621,
    PalisadeWall = 72,
    WatchTower = 79,
    Castle = 82,
    Market = 84,
    ArcheryRange = 87,
    Stable = 101,
    Blacksmith = 103,
    Monastery = 104,
    StoneWall = 117,
    FortifiedWall = 155,
    FishTrap = 199,
    University = 209,
    GuardTower = 234,
    Keep = 235,
    BombardTower = 236,
    Wonder = 276,
    Gate = 487,
    LumberCamp = 562,
    MiningCamp = 584,
    Outpost = 598,
    PalisadeGate = 792,
    Feitoria = 1021,
    Harbor = 1189,
    Krepost = 1251,
    Donjon = 1665,
    Folwark = 1734,
    Caravanserai = 1754,
    FortifiedChurch = 1806,
    MuleCart = 1808
}

export enum Unit {
    Archer = 4,
    HandCannoneer = 5,
    EliteSkirmisher = 6,
    Skirmisher = 7,
    Longbowman = 8,
    Mangudai = 11,
    FishingShip = 13,
    TradeCog = 17,
    WarGalley = 21,
    Crossbowman = 24,
    TeutonicKnight = 25,
    BombardCannon = 36,
    Knight = 38,
    CavalryArcher = 39,
    Cataphract = 40,
    Huskarl = 41,
    Trebuchet = 331,
    Janissary = 46,
    ChuKoNu = 73,
    Militia = 74,
    ManAtArms = 75,
    LongSwordsman = 77,
    Villager = 83,
    Spearman = 93,
    Monk = 125,
    TradeCart = 128,
    Slinger = 185,
    ImperialCamelRider = 207,
    WoadRaider = 232,
    WarElephant = 239,
    Longboat = 250,
    Scorpion = 279,
    Mangonel = 280,
    ThrowingAxeman = 281,
    Mameluke = 282,
    Cavalier = 283,
    Samurai = 291,
    CamelRider = 329,
    HeavyCamelRider = 330,
    Pikeman = 358,
    Halberdier = 359,
    CannonGalleon = 420,
    CappedRam = 422,
    Petard = 440,
    Hussar = 441,
    Galleon = 442,
    ScoutCavalry = 448,
    TwoHandedSwordsman = 473,
    HeavyCavalryArcher = 474,
    Arbalester = 492,
    DemolitionShip = 527,
    HeavyDemolitionShip = 528,
    FireShip = 529,
    EliteLongbowman = 530,
    EliteThrowingAxeman = 531,
    FastFireShip = 532,
    EliteLongboat = 533,
    EliteWoadRaider = 534,
    Galley = 539,
    HeavyScorpion = 542,
    TransportShip = 545,
    LightCavalry = 546,
    SiegeRam = 548,
    Onager = 550,
    EliteCataphract = 553,
    EliteTeutonicKnight = 554,
    EliteHuskarl = 555,
    EliteMameluke = 556,
    EliteJanissary = 557,
    EliteWarElephant = 558,
    EliteChuKoNu = 559,
    EliteSamurai = 560,
    EliteMangudai = 561,
    Champion = 567,
    Paladin = 569,
    SiegeOnager = 588,
    EliteCannonGalleon = 691,
    Berserk = 692,
    EliteBerserk = 694,
    JaguarWarrior = 725,
    EliteJaguarWarrior = 726,
    EagleScout = 751,
    EliteEagleWarrior = 752,
    EagleWarrior = 753,
    Tarkan = 755,
    EliteTarkan = 757,
    PlumedArcher = 763,
    ElitePlumedArcher = 765,
    Conquistador = 771,
    EliteConquistador = 773,
    Missionary = 775,
    WarWagon = 827,
    EliteWarWagon = 829,
    TurtleShip = 831,
    EliteTurtleShip = 832,
    GenoeseCrossbowman = 866,
    EliteGenoeseCrossbowman = 868,
    MagyarHuszar = 869,
    EliteMagyarHuszar = 871,
    ElephantArcher = 873,
    EliteElephantArcher = 875,
    Boyar = 876,
    EliteBoyar = 878,
    Kamayuk = 879,
    EliteKamayuk = 881,
    Condottiero = 882,
    OrganGun = 1001,
    EliteOrganGun = 1003,
    Caravel = 1004,
    EliteCaravel = 1006,
    CamelArcher = 1007,
    EliteCamelArcher = 1009,
    Genitour = 1010,
    EliteGenitour = 1012,
    Gbeto = 1013,
    EliteGbeto = 1015,
    ShotelWarrior = 1016,
    EliteShotelWarrior = 1018,
    FireGalley = 1103,
    DemolitionRaft = 1104,
    SiegeTower = 1105,
    BallistaElephant = 1120,
    EliteBallistaElephant = 1122,
    KarambitWarrior = 1123,
    EliteKarambitWarrior = 1125,
    Arambai = 1126,
    EliteArambai = 1128,
    RattanArcher = 1129,
    EliteRattanArcher = 1131,
    BattleElephant = 1132,
    EliteBattleElephant = 1134,
    ImperialSkirmisher = 1155,
    Konnik = 1254,
    EliteKonnik = 1255,
    Keshik = 1228,
    EliteKeshik = 1230,
    Kipchak = 1231,
    EliteKipchak = 1233,
    Leitis = 1234,
    EliteLeitis = 1236,
    KonnikDismounted = 1252,
    EliteKonnikDismounted = 1253,
    BatteringRam = 1258,
    FlamingCamel = 1263,
    SteppeLancer = 1370,
    EliteSteppeLancer = 1372,
    XolotlWarrior = 1570,
    Coustillier = 1655,
    EliteCoustillier = 1657,
    Serjeant = 1660,
    EliteSerjeant = 1661,
    FlemishMilitia = 1699,
    Obuch = 1701,
    EliteObuch = 1703,
    HussiteWagon = 1704,
    EliteHussiteWagon = 1706,
    WingedHussar = 1707,
    Houfnice = 1709,
    UrumiSwordsman = 1735,
    EliteUrumiSwordsman = 1737,
    RathaMelee = 1738,
    EliteRathaMelee = 1740,
    ChakramThrower = 1741,
    EliteChakramThrower = 1743,
    ArmoredElephant = 1744,
    SiegeElephant = 1746,
    Ghulam = 1747,
    EliteGhulam = 1749,
    Thirisadai = 1750,
    ShrivamshaRider = 1751,
    EliteShrivamshaRider = 1753,
    CamelScout = 1755,
    Ratha = 1759,
    EliteRatha = 1761,
    Centurion = 1790,
    EliteCenturion = 1792,
    Legionary = 1793,
    Dromon = 1795,
    CompositeBowman = 1800,
    EliteCompositeBowman = 1802,
    Monaspa = 1803,
    EliteMonaspa = 1805,
    WarriorPriest = 1811,
    Savar = 1813
}

export enum Tech {
    Yeomen = 3,
    ElDorado = 4,
    FurorCeltica = 5,
    Drill = 6,
    Citadels = 7,
    TownWatch = 8,
    Artillery = 10,
    Crenellations = 11,
    CropRotation = 12,
    HeavyPlow = 13,
    HorseCollar = 14,
    Guilds = 15,
    Anarchy = 16,
    Banking = 17,
    Cartography = 19,
    Atheism = 21,
    Loom = 22,
    Coinage = 23,
    GarlandWars = 24,
    Bimaristan = 28,
    Husbandry = 39,
    Faith = 45,
    Devotion = 46,
    Chemistry = 47,
    Caravan = 48,
    Bogsveigar = 49,
    Masonry = 50,
    Architecture = 51,
    Rocketry = 52,
    TreadmillCrane = 54,
    GoldMining = 55,
    Kataparuto = 59,
    Logistica = 61,
    Keep = 63,
    BombardTower = 64,
    Gillnets = 65,
    Forging = 67,
    IronCasting = 68,
    ScaleMailArmor = 74,
    BlastFurnace = 75,
    ChainMailArmor = 76,
    PlateMailArmor = 77,
    PlateBardingArmor = 80,
    ScaleBardingArmor = 81,
    ChainBardingArmor = 82,
    BeardedAxe = 83,
    Tracking = 90,
    Ballistics = 93,
    FeudalAge = 101,
    CastleAge = 102,
    ImperialAge = 103,
    GuardTower = 140,
    GoldShaftMining = 182,
    FortifiedWall = 194,
    Fletching = 199,
    BodkinArrow = 200,
    Bracer = 201,
    DoubleBitAxe = 202,
    BowSaw = 203,
    PaddedArcherArmor = 211,
    LeatherArcherArmor = 212,
    Wheelbarrow = 213,
    Squires = 215,
    RingArcherArmor = 219,
    TwoManSaw = 221,
    BlockPrinting = 230,
    Sanctity = 231,
    Illumination = 233,
    HandCart = 249,
    Fervor = 252,
    StoneMining = 278,
    StoneShaftMining = 279,
    TownPatrol = 280,
    Conscription = 315,
    Redemption = 316,
    Atonement = 319,
    Sappers = 321,
    MurderHoles = 322,
    Shipwright = 373,
    Careening = 374,
    DryDock = 375,
    SiegeEngineers = 377,
    Hoardings = 379,
    HeatedShot = 380,
    SpiesTreason = 408,
    Bloodlines = 435,
    ParthianTactics = 436,
    ThumbRing = 437,
    Theocracy = 438,
    Heresy = 439,
    Supremacy = 440,
    HerbalMedicine = 441,
    Shinkichon = 445,
    Counterweights = 454,
    Detinets = 455,
    Perfusion = 457,
    Atlatl = 460,
    Warwolf = 461,
    GreatWall = 462,
    Chieftains = 463,
    GreekFire = 464,
    Stronghold = 482,
    Marauders = 483,
    Yasama = 484,
    HulcheJavelineers = 485,
    Eupseong = 486,
    Nomads = 487,
    Kamandaran = 488,
    Ironclad = 489,
    Sipahi = 491,
    Inquisition = 492,
    Chivalry = 493,
    Pavise = 494,
    SilkRoad = 499,
    GrandTrunkRoad = 506,
    Shatagni = 507,
    Druzhina = 513,
    CorvinianArmy = 514,
    RecurveBow = 515,
    AndeanSling = 516,
    FabricShields = 517,
    Carrack = 572,
    Arquebus = 573,
    RoyalHeirs = 574,
    TorsionEngines = 575,
    Tigui = 576,
    Farimba = 577,
    Kasbah = 578,
    MaghrebiCamels = 579,
    Arson = 602,
    Arrowslits = 608,
    TuskSwords = 622,
    DoubleCrossbow = 623,
    Thalassocracy = 624,
    ForcedLevy = 625,
    Howdah = 626,
    ManipurCavalry = 627,
    Chatras = 628,
    PaperMoney = 629,
    Stirrups = 685,
    Bagains = 686,
    SilkArmor = 687,
    TimuridSiegecraft = 688,
    SteppeHusbandry = 689,
    CumanMercenaries = 690,
    HillForts = 691,
    TowerShields = 692,
    Supplies = 716,
    BurgundianVineyards = 754,
    FlemishRevolution = 755,
    FirstCrusade = 756,
    Hauberk = 757,
    SzlachtaPrivileges = 782,
    LechiticLegacy = 783,
    WagenburgTactics = 784,
    HussiteReforms = 785,
    MedicalCorps = 831,
    WootzSteel = 832,
    Paiks = 833,
    Mahayana = 834,
    Kshatriyas = 835,
    FrontierGuards = 836,
    Gambesons = 875,
    Ballistas = 883,
    Comitatenses = 884,
    Fereters = 921,
    CilicianFleet = 922,
    SvanTowers = 923,
    AznauriCavalry = 924
}


export enum Age {
    DarkAge = 1,
    FeudalAge = 2,
    CastleAge = 3,
    ImperialAge = 4
}

export type TechTreePoint = {
    unit?: Unit,
    tech?: Tech,
    building?: Buildings,
    isUniq?: boolean,
}


export type TechTreeData = Partial<Record<Buildings, TechTreeBrunch>>;
export type TechTreeBrunch = TreeAgeData[];
export type TechTreeLine = TechTreePoint[]
export type TreeAgeData = {
    age: Age,
    items: Array<TechTreeLine>,
}

const monasteryAndChurch: TechTreeBrunch = [
    {
        age: Age.CastleAge,
        items: [
            [
                {
                    unit: Unit.Monk,
                }
            ],
            [
                {
                    unit: Unit.Missionary,
                    isUniq: true,
                }
            ],
            [
                {
                    tech: Tech.Devotion,
                }
            ],
            [
                {
                    tech: Tech.Redemption,
                }
            ],
            [
                {
                    tech: Tech.Atonement,
                }
            ],
            [
                {
                    tech: Tech.HerbalMedicine,
                }
            ],
            [
                {
                    tech: Tech.Heresy,
                }
            ],
            [
                {
                    tech: Tech.Sanctity,
                }
            ],
            [
                {
                    tech: Tech.Fervor,
                }
            ],
            [
                {
                    unit: Unit.WarriorPriest,
                    isUniq: true,
                }
            ],
        ],
    },
    {
        age: Age.ImperialAge,
        items: [
            [
                {
                    tech: Tech.Illumination
                },
            ],
            [
                {
                    tech: Tech.BlockPrinting
                },
            ],
            [
                {
                    tech: Tech.Faith
                },
            ],
            [
                {
                    tech: Tech.Theocracy
                },
            ],
        ]
    }
]
const millAndFolwark: TechTreeBrunch = [
    {
        age: Age.DarkAge,
        items: [
            [
                {
                    building: Buildings.Farm,
                },
            ]
        ]
    },
    {
        age: Age.FeudalAge,
        items: [
            [
                {
                    tech: Tech.HorseCollar,
                },
            ],
        ]
    },
    {
        age: Age.CastleAge,
        items: [
            [
                {
                    tech: Tech.HeavyPlow,
                },
            ],
        ]
    },
    {
        age: Age.ImperialAge,
        items: [
            [
                {
                    tech: Tech.CropRotation,
                },
            ],
        ]
    }
]

export const CommonTechTreeData: TechTreeData = {
    [Buildings.Barracks]: [
        {
            age: Age.DarkAge,
            items: [
                [
                    {
                        unit: Unit.Militia,
                    }
                ],
            ]
        },
        {
            age: Age.FeudalAge,
            items: [
                [
                    {
                        unit: Unit.ManAtArms,
                    },
                ],
                [
                    {
                        tech: Tech.Supplies,
                    },
                ],
                [
                    {
                        unit: Unit.Spearman,
                    },
                ],
                [
                    {
                        unit: Unit.EagleScout,
                    },
                ]
            ]
        },
        {
            age: Age.CastleAge,
            items: [
                [
                    {
                        unit: Unit.LongSwordsman,
                    },
                ],
                [
                    {
                        tech: Tech.Gambesons,
                    },
                ],
                [
                    {
                        unit: Unit.Pikeman,
                    },
                ],
                [
                    {
                        unit: Unit.EagleWarrior,
                    },
                ],
                [
                    {
                        tech: Tech.Squires,
                    },
                ],
                [
                    {
                        tech: Tech.Arson,
                    },
                ],
            ]
        },
        {
            age: Age.ImperialAge,
            items: [
                [
                    {
                        unit: Unit.TwoHandedSwordsman,
                    },
                    {
                        unit: Unit.Champion,
                    },
                ],
                [
                    {
                        unit: Unit.Legionary,
                        isUniq: true,
                    },
                ],
                [
                    {
                        unit: Unit.Halberdier,
                    },
                ],
                [
                    {
                        unit: Unit.EliteEagleWarrior,
                    },
                ],
                [
                    {
                        unit: Unit.Condottiero,
                        isUniq: true,
                    },
                ],
                [
                    {
                        unit: Unit.FlemishMilitia,
                        isUniq: true,
                    },
                ],
            ]
        }
    ],
    [Buildings.ArcheryRange]: [
        {
            age: Age.FeudalAge,
            items: [
                [
                    {
                        unit: Unit.Archer,
                    }
                ],
                [
                    {
                        unit: Unit.Skirmisher,
                    }
                ]
            ]
        },
        {
            age: Age.CastleAge,
            items: [
                [
                    {
                        unit: Unit.Crossbowman,
                    }
                ],
                [
                    {
                        unit: Unit.EliteSkirmisher,
                    }
                ],
                [
                    {
                        unit: Unit.Slinger,
                        isUniq: true,
                    }
                ],
                [
                    {
                        unit: Unit.CavalryArcher,
                    }
                ],
                [
                    {
                        unit: Unit.ElephantArcher,
                    }
                ],
                [
                    {
                        unit: Unit.Genitour,
                    }
                ],
                [
                    {
                        tech: Tech.ThumbRing,
                    }
                ],
            ]
        },
        {
            age: Age.ImperialAge,
            items: [
                [
                    {
                        unit: Unit.Arbalester
                    }
                ],
                [
                    {
                        unit: Unit.ImperialSkirmisher,
                        isUniq: true,
                    }
                ],
                [
                    {
                        unit: Unit.HandCannoneer,
                    }
                ],
                [
                    {
                        unit: Unit.HeavyCavalryArcher,
                    }
                ],
                [
                    {
                        unit: Unit.EliteElephantArcher,
                    }
                ],
                [
                    {
                        unit: Unit.EliteGenitour,
                        isUniq: true,
                    }
                ],
                [
                    {
                        tech: Tech.ParthianTactics,
                    }
                ]
            ]
        }
    ],
    [Buildings.Stable]: [
        {
            age: Age.FeudalAge,
            items: [
                [
                    {
                        unit: Unit.ScoutCavalry,
                    }
                ],
                [
                    {
                        tech: Tech.Bloodlines,
                    }
                ],
                [
                    {}
                ],
                [
                    {}
                ],
                [
                    {
                        unit: Unit.CamelScout,
                        isUniq: true,
                    }
                ],
            ]
        },
        {
            age: Age.CastleAge,
            items: [
                [
                    {
                        unit: Unit.LightCavalry,
                    }
                ],
                [
                    {
                        unit: Unit.ShrivamshaRider,
                        isUniq: true,
                    }
                ],
                [
                    {
                        unit: Unit.Knight,
                    }
                ],
                [
                    {
                        unit: Unit.SteppeLancer,
                    }
                ],
                [
                    {
                        unit: Unit.CamelRider,
                    }
                ],
                [
                    {
                        unit: Unit.BattleElephant,
                    }
                ],
                [
                    {
                        unit: Unit.XolotlWarrior,
                        isUniq: true,
                    }
                ],
                [
                    {
                        tech: Tech.Husbandry,
                    }
                ],
            ]
        },
        {
            age: Age.ImperialAge,
            items: [
                [
                    {
                        unit: Unit.Hussar,
                    },
                    {
                        unit: Unit.WingedHussar,
                        isUniq: true,
                    },
                ],
                [
                    {
                        unit: Unit.EliteShrivamshaRider,
                        isUniq: true,
                    },
                ],
                [
                    {
                        unit: Unit.Cavalier,
                    },
                    {
                        unit: Unit.Paladin,
                    },
                ],
                [
                    {
                        unit: Unit.EliteSteppeLancer,
                    },
                    {
                        unit: Unit.Savar,
                        isUniq: true,
                    },
                ],
                [
                    {
                        unit: Unit.HeavyCamelRider,
                        isUniq: true,
                    },
                    {
                        unit: Unit.ImperialCamelRider,
                        isUniq: true,
                    },
                ],
                [
                    {
                        unit: Unit.EliteBattleElephant,
                    },
                ]
            ]
        }
    ],
    [Buildings.SiegeWorkshop]: [
        {
            age: Age.CastleAge,
            items: [
                [
                    {
                        unit: Unit.BatteringRam,
                    }
                ],
                [
                    {
                        unit: Unit.ArmoredElephant,
                    }
                ],
                [
                    {
                        unit: Unit.Mangonel,
                    }
                ],
                [
                    {
                        unit: Unit.Scorpion,
                    }
                ],
                [
                    {
                        unit: Unit.SiegeTower,
                    }
                ]
            ]
        },
        {
            age: Age.ImperialAge,
            items: [
                [
                    {
                        unit: Unit.CappedRam,
                    },
                    {
                        unit: Unit.SiegeRam,
                    }
                ],
                [
                    {
                        unit: Unit.SiegeElephant,
                    },
                    {
                        unit: Unit.FlamingCamel,
                        isUniq: true,
                    },
                ],
                [
                    {
                        unit: Unit.Onager,
                    },
                    {
                        unit: Unit.SiegeOnager,
                    }
                ],
                [
                    {
                        unit: Unit.HeavyScorpion,
                    }
                ],
                [
                    {
                        unit: Unit.BombardCannon,
                    },
                    {
                        unit: Unit.Houfnice,
                        isUniq: true,
                    }
                ]
            ]
        },
    ],
    [Buildings.Blacksmith]: [
        {
            age: Age.FeudalAge,
            items: [
                [
                    {
                        tech: Tech.PaddedArcherArmor
                    }
                ],
                [
                    {
                        tech: Tech.Fletching
                    }
                ],
                [
                    {
                        tech: Tech.Forging
                    }
                ],
                [
                    {
                        tech: Tech.ScaleBardingArmor
                    }
                ],
                [
                    {
                        tech: Tech.ScaleMailArmor
                    }
                ]
            ]
        },
        {
            age: Age.CastleAge,
            items: [
                [
                    {
                        tech: Tech.LeatherArcherArmor,
                    }
                ],
                [
                    {
                        tech: Tech.BodkinArrow,
                    }
                ],
                [
                    {
                        tech: Tech.IronCasting,
                    }
                ],
                [
                    {
                        tech: Tech.ChainBardingArmor,
                    }
                ],
                [
                    {
                        tech: Tech.ChainMailArmor,
                    }
                ],
            ]
        },
        {
            age: Age.ImperialAge,
            items: [
                [
                    {
                        tech: Tech.RingArcherArmor
                    }
                ],
                [
                    {
                        tech: Tech.Bracer
                    }
                ],
                [
                    {
                        tech: Tech.BlastFurnace
                    }
                ],
                [
                    {
                        tech: Tech.PlateBardingArmor
                    }
                ],
                [
                    {
                        tech: Tech.PlateMailArmor
                    }
                ]
            ]
        },
    ],
    [Buildings.University]: [
        {
            age: Age.CastleAge,
            items: [
                [
                    {
                        tech: Tech.Masonry
                    },
                ],
                [
                    {
                        tech: Tech.FortifiedWall
                    },
                ],
                [
                    {
                        tech: Tech.Ballistics
                    },
                ],
                [
                    {
                        tech: Tech.GuardTower
                    },
                ],
                [
                    {
                        tech: Tech.HeatedShot
                    },
                ],
                [
                    {
                        tech: Tech.MurderHoles
                    },
                ],
                [
                    {
                        tech: Tech.TreadmillCrane
                    },
                ],
            ]
        },
        {
            age: Age.ImperialAge,
            items: [
                [
                    {
                        tech: Tech.Architecture,
                    },
                ],
                [
                    {
                        tech: Tech.Chemistry,
                    },
                    {
                        tech: Tech.BombardTower,
                    },
                ],
                [
                    {
                        tech: Tech.SiegeEngineers,
                    },
                ],
                [
                    {
                        tech: Tech.Keep,
                    },
                ],
                [
                    {
                        tech: Tech.Arrowslits,
                    },
                ],
            ]
        },
    ],
    [Buildings.Monastery]: monasteryAndChurch,
    [Buildings.FortifiedChurch]: monasteryAndChurch,
    [Buildings.TownCenter]: [
        {
            age: Age.FeudalAge,
            items: [
                [
                    {
                        unit: Unit.Villager,
                    }
                ],
                [
                    {
                        tech: Tech.FeudalAge,
                    }
                ],
                [
                    {
                        tech: Tech.Loom,
                    }
                ]
            ]
        },
        {
            age: Age.FeudalAge,
            items: [
                [
                    {
                        tech: Tech.TownWatch,
                    }
                ],
                [
                    {
                        tech: Tech.CastleAge,
                    }
                ],
                [
                    {
                        tech: Tech.Wheelbarrow,
                    }
                ]
            ]
        },
        {
            age: Age.CastleAge,
            items: [
                [
                    {
                        tech: Tech.TownPatrol
                    },
                ],
                [
                    {
                        tech: Tech.ImperialAge
                    },
                ],
                [
                    {
                        tech: Tech.HandCart
                    },
                ],
                [
                    {
                        building: Buildings.TownCenter
                    },
                ],
            ]
        }
    ],
    [Buildings.MiningCamp]: [
        {
            age: Age.FeudalAge,
            items: [
                [
                    {
                        tech: Tech.GoldMining
                    }
                ],
                [
                    {
                        tech: Tech.StoneMining
                    }
                ],
            ]
        },
        {
            age: Age.CastleAge,
            items: [
                [
                    {
                        tech: Tech.GoldShaftMining
                    }
                ],
                [
                    {
                        tech: Tech.StoneShaftMining
                    }
                ],
            ]
        }
    ],
    [Buildings.LumberCamp]: [
        {
            age: Age.FeudalAge,
            items: [
                [
                    {
                        tech: Tech.DoubleBitAxe
                    },
                ],
            ]
        },
        {
            age: Age.CastleAge,
            items: [
                [
                    {
                        tech: Tech.BowSaw
                    },
                ],
            ]
        },
        {
            age: Age.ImperialAge,
            items: [
                [
                    {
                        tech: Tech.TwoManSaw
                    },
                ],
            ]
        }
    ],
    [Buildings.MuleCart]: [
        {
            age: Age.FeudalAge,
            items: [
                [
                    {
                        tech: Tech.GoldMining
                    }
                ],
                [
                    {
                        tech: Tech.StoneMining
                    }
                ],
                [
                    {
                        tech: Tech.DoubleBitAxe
                    },
                ],
            ]
        },
        {
            age: Age.CastleAge,
            items: [
                [
                    {
                        tech: Tech.GoldShaftMining
                    }
                ],
                [
                    {
                        tech: Tech.StoneShaftMining
                    }
                ],
                [
                    {
                        tech: Tech.BowSaw
                    },
                ],
            ]
        },
        {
            age: Age.ImperialAge,
            items: [
                [
                    {},
                ],
                [
                    {},
                ],
                [
                    {
                        tech: Tech.TwoManSaw
                    },
                ],
            ]
        }
    ],
    [Buildings.Mill]: millAndFolwark,
    [Buildings.Folwark]: millAndFolwark,
    [Buildings.Market]: [
        {
            age: Age.FeudalAge,
            items: [
                [
                    {
                        unit: Unit.TradeCart
                    }
                ]
            ]
        },
        {
            age: Age.CastleAge,
            items: [
                [
                    {
                        tech: Tech.Coinage,
                    }
                ],
                [
                    {
                        tech: Tech.Caravan,
                    }
                ]
            ]
        },
        {
            age: Age.ImperialAge,
            items: [
                [
                    {
                        tech: Tech.Banking,
                    }
                ],
                [
                    {
                        tech: Tech.Guilds,
                    }
                ]
            ]
        }
    ],
    [Buildings.Dock]: [
        {
            age: Age.DarkAge,
            items: [
                [
                    {
                        unit: Unit.FishingShip,
                    },
                ],
                [
                    {
                        unit: Unit.TransportShip,
                    },
                ],
            ]
        },
        {
            age: Age.FeudalAge,
            items: [
                [
                    {
                        unit: Unit.FireGalley,
                    },
                ],
                [
                    {
                        unit: Unit.TradeCog,
                    },
                ],
                [
                    {
                        unit: Unit.DemolitionRaft,
                    },
                ],
                [
                    {
                        unit: Unit.Galley,
                    },
                ],
                [ {}, ],
                [ {}, ],
                [ {}, ],
                [ {}, ],
                [ {}, ],
                [ {}, ],
                [ {}, ],
                [
                    {
                        building: Buildings.FishTrap,
                    },
                ],
            ]
        },
        {
            age: Age.CastleAge,
            items: [
                [
                    {
                        unit: Unit.FishingShip,
                    },
                ],
                [
                    {
                        tech: Tech.Gillnets,
                    },
                ],
                [
                    {
                        unit: Unit.DemolitionShip,
                    },
                ],
                [
                    {
                        unit: Unit.WarGalley,
                    },
                ],
                [
                    {},
                ],
                [
                    {
                        unit: Unit.TurtleShip,
                        isUniq: true,
                    },
                ],
                [
                    {
                        unit: Unit.Longboat,
                        isUniq: true,
                    },
                ],
                [
                    {
                        unit: Unit.Caravel,
                        isUniq: true,
                    },
                ],
                [
                    {},
                ],
                [
                    {
                        tech: Tech.Careening,
                    },
                ],
                [
                    {
                    },
                ],
                [
                    {
                        building: Buildings.Harbor,
                    },
                ],
            ]
        },
        {
            age: Age.ImperialAge,
            items: [
                [
                    {
                        unit: Unit.FastFireShip,
                    },
                ],
                [
                    {
                        unit: Unit.CannonGalleon,
                    },
                    {
                        unit: Unit.EliteCannonGalleon,
                    },
                ],
                [
                    {
                        unit: Unit.HeavyDemolitionShip,
                    },
                ],
                [
                    {
                        unit: Unit.Galleon,
                    },
                ],
                [
                    {
                        unit: Unit.Dromon,
                    },
                ],
                [
                    {
                        unit: Unit.EliteTurtleShip,
                        isUniq: true,
                    },
                ],
                [
                    {
                        unit: Unit.EliteLongboat,
                        isUniq: true,
                    },
                ],
                [
                    {
                        unit: Unit.EliteCaravel,
                        isUniq: true,
                    },
                ],
                [
                    {
                        unit: Unit.Thirisadai,
                        isUniq: true,
                    },
                ],
                [
                    {
                        tech: Tech.DryDock
                    },
                ],
                [
                    {
                        tech: Tech.Shipwright
                    },
                ],
            ],
        },
    ]
}

