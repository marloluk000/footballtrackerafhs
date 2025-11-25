import { Player } from './types';
import { normalizePlayerName } from './jerseyNumbers';

const nonSophomoreRequiredItems = [
  'Jersey - Red',
  'Jersey - Black',
  'Jersey - White',
  'Pants - Red',
  'Pants - Black',
  'Pants - White',
  'Helmet',
  'Guardian',
  'Shoulder',
  'Girdle',
  'Knee',
  'Practice Pants',
  'Belt',
  'Win in the Dark (Book)',
];

const sophomoreRequiredItems = [
  'Jersey - Sophomore Red',
  'Jersey - White',
  'Pants - Red',
  'Helmet',
  'Guardian',
  'Shoulder',
  'Girdle',
  'Knee',
  'Practice Pants',
  'Belt',
  'Win in the Dark (Book)',
];

type JerseyOnlyOverride = {
  normalizedName: string;
  numbers: Set<number>;
  items: string[];
};

const jerseyOnlyOverrides: JerseyOnlyOverride[] = [
  {
    normalizedName: normalizePlayerName('Dalin Afu'),
    numbers: new Set([61]),
    items: ['Jersey - Red', 'Jersey - Black', 'Jersey - White'],
  },
];

type DuplicateEntryOverride = {
  normalizedName: string;
  numbers: Set<number> | null;
};

const duplicateEntryOverrides: DuplicateEntryOverride[] = [
  {
    normalizedName: normalizePlayerName('Dalin Afu'),
    numbers: new Set([0, 61]),
  },
];

const findJerseyOnlyOverride = (player: Player) => {
  const normalizedName = normalizePlayerName(player.name);
  const number = player.number ?? -1;
  return jerseyOnlyOverrides.find(
    override =>
      override.normalizedName === normalizedName && override.numbers.has(number)
  );
};

export const isJerseyOnlyPlayer = (player: Player): boolean => {
  return Boolean(findJerseyOnlyOverride(player));
};

export const getRequiredItemsForPlayer = (player: Player): string[] => {
  const override = findJerseyOnlyOverride(player);
  if (override) {
    return override.items;
  }

  const isSophomore = player.grade?.toLowerCase().includes('so');
  return isSophomore ? sophomoreRequiredItems : nonSophomoreRequiredItems;
};

export const getNonSophomoreRequiredItems = () => nonSophomoreRequiredItems;
export const getSophomoreRequiredItems = () => sophomoreRequiredItems;

export const shouldKeepPlayerEntriesSeparate = (player: Player): boolean => {
  const normalizedName = normalizePlayerName(player.name);
  const number = player.number ?? -1;
  return duplicateEntryOverrides.some(override => {
    if (override.normalizedName !== normalizedName) {
      return false;
    }
    if (!override.numbers || override.numbers.size === 0) {
      return true;
    }
    return override.numbers.has(number);
  });
};

