/**
 * IDs of naval units, buildings, and techs.
 * Used to exclude naval content on difficulty levels before Archer.
 */
const navalUnitIds = new Set<string>([
  '13',  // FishingShip
  '17',  // TradeCog
  '21',  // WarGalley
  '250', // Longboat
  '420', // CannonGalleon
  '442', // Galleon
  '527', // DemolitionShip
  '528', // HeavyDemolitionShip
  '529', // FireShip
  '532', // FastFireShip
  '533', // EliteLongboat
  '539', // Galley
  '545', // TransportShip
  '691', // EliteCannonGalleon
  '831', // TurtleShip
  '832', // EliteTurtleShip
  '1004', // Caravel
  '1006', // EliteCaravel
  '1103', // FireGalley
  '1104', // DemolitionRaft
]);

const navalBuildingIds = new Set<string>([
  '45',   // Dock
  '1189', // Harbor
]);

const navalTechIds = new Set<string>([
  '373', // Shipwright
  '374', // Careening
  '375', // DryDock
  '489', // Ironclad
  '572', // Carrack
  '624', // Thalassocracy
]);

export function isNavalUnit(id: string): boolean {
  return navalUnitIds.has(id);
}

export function isNavalBuilding(id: string): boolean {
  return navalBuildingIds.has(id);
}

export function isNavalTech(id: string): boolean {
  return navalTechIds.has(id);
}

/** Naval content (units, buildings, techs) allowed only from Archer level onwards */
const LEVELS_ALLOW_NAVAL = new Set(['archer', 'knight', 'cavalier', 'paladin', 'king']);

export function isNavalAllowedForLevel(levelId: string): boolean {
  return LEVELS_ALLOW_NAVAL.has(levelId);
}

/** Civ-unique buildings (only one civ can build). Excluded from "What price of this building?" */
const UNIQUE_BUILDING_IDS = new Set<string>([
  '1021', // Feitoria (Portuguese)
  '1251', // Krepost (Bulgarians)
  '1665', // Donjon (Sicilians)
  '1734', // Folwark (Poles)
  '1754', // Caravanserai (Saracens / trade)
  '1806', // Fortified Church (Romanians)
  '1808', // Mule Cart (Burgundians)
]);

export function isUniqueBuilding(id: string): boolean {
  return UNIQUE_BUILDING_IDS.has(id);
}
