/**
 * All question type variants. Configurable per difficulty level.
 * Naming: subject + direction (e.g. techPrice_techToPrice = show tech, choose price).
 */
export const QuestionTypeVariant = {
  // 1) Tech prices
  techPrice_techToPrice: 'techPrice_techToPrice',
  techPrice_priceToTech: 'techPrice_priceToTech',
  uniqueTechPrice_techToPrice: 'uniqueTechPrice_techToPrice',
  // 2) Building/unit prices
  unitPrice_unitToPrice: 'unitPrice_unitToPrice',
  unitPrice_priceToUnit: 'unitPrice_priceToUnit',
  uniqueUnitPrice_unitToPrice: 'uniqueUnitPrice_unitToPrice',
  buildingPrice_buildingToPrice: 'buildingPrice_buildingToPrice',
  buildingPrice_priceToBuilding: 'buildingPrice_priceToBuilding',
  // 3) Civ specifics (unique bonus, unique unit, team bonus) + reverse
  civBonus_bonusToCiv: 'civBonus_bonusToCiv',
  civBonus_civToBonus: 'civBonus_civToBonus',
  civUniqueUnit_unitToCiv: 'civUniqueUnit_unitToCiv',
  civUniqueUnit_civToUnit: 'civUniqueUnit_civToUnit',
  civTeamBonus_bonusToCiv: 'civTeamBonus_bonusToCiv',
  civTeamBonus_civToBonus: 'civTeamBonus_civToBonus',
  // 4) Tech description
  techDesc_descToTech: 'techDesc_descToTech',
  techDesc_techToDesc: 'techDesc_techToDesc',
  // 5) Unit stats
  unitStats_statsToUnit: 'unitStats_statsToUnit',
  unitStats_unitToStat: 'unitStats_unitToStat',
  // 6) Tech tree branch (keep existing)
  treeBranch_branchToCiv: 'treeBranch_branchToCiv',
  // 7) Tech research time
  techTime_techToTime: 'techTime_techToTime',
  // 8) Civ unique tech (reverse)
  civUniqueTech_civToTech: 'civUniqueTech_civToTech',
  // 9) Unit upgrade cost & time
  upgradePrice_upgradeToPrice: 'upgradePrice_upgradeToPrice',
  upgradePrice_priceToUpgrade: 'upgradePrice_priceToUpgrade',
  upgradeTime_upgradeToTime: 'upgradeTime_upgradeToTime',
  upgradeTime_timeToUpgrade: 'upgradeTime_timeToUpgrade',
  // 10) Building stats
  buildingStats_buildingToStat: 'buildingStats_buildingToStat',
  buildingStats_statToBuilding: 'buildingStats_statToBuilding',
  // 11) Building/unit description
  buildingDesc_descToBuilding: 'buildingDesc_descToBuilding',
  unitDesc_descToUnit: 'unitDesc_descToUnit',
} as const;

export type QuestionTypeVariantKey = keyof typeof QuestionTypeVariant;
export type QuestionTypeVariantValue = (typeof QuestionTypeVariant)[QuestionTypeVariantKey];
