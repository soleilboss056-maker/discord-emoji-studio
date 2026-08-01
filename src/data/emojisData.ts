import { EmojiItem } from '../types';

export const CATEGORIES = [
  'Tous',
  'Memes',
  'Pepe',
  'Anime',
  'Animated',
  'Gaming',
  'Thinking',
  'Blobs',
  'Cute',
  'Aesthetic',
  'Emojis',
  'Logos',
  'Original',
  'Utility',
] as const;

export const CATEGORY_MAP: Record<number, string> = {
  1: 'Original',
  2: 'Anime',
  3: 'Memes',
  4: 'Emojis',
  5: 'Animated',
  6: 'Blobs',
  7: 'Thinking',
  8: 'Gaming',
  9: 'Cute',
  10: 'Utility',
  11: 'Letters',
  12: 'Logos',
  13: 'Aesthetic',
  14: 'Pepe',
};

// Curated Emojis with direct numeric IDs for Discord bot commands
const DISCADIA_EMOJIS: EmojiItem[] = [
  {
    id: '10101',
    customId: '10101',
    title: 'pepe_business',
    name: 'pepe_business',
    category: 'Pepe',
    imageUrl: 'https://cdn3.emoji.gg/emojis/8488_pepe_chill.png',
    isAnimated: false,
    source: 'Discadia',
    submittedBy: 'DiscadiaVault',
    faves: 2800,
  },
  {
    id: '10102',
    customId: '10102',
    title: 'cat_cyberpunk',
    name: 'cat_cyberpunk',
    category: 'Aesthetic',
    imageUrl: 'https://cdn3.emoji.gg/emojis/6620_cyber_aesthetic.png',
    isAnimated: false,
    source: 'Discadia',
    submittedBy: 'DiscadiaVault',
    faves: 1900,
  },
  {
    id: '10103',
    customId: '10103',
    title: 'anime_sparkle',
    name: 'anime_sparkle',
    category: 'Anime',
    imageUrl: 'https://cdn3.emoji.gg/emojis/7721_anime_cry.png',
    isAnimated: false,
    source: 'Discadia',
    submittedBy: 'OtakuList',
    faves: 3100,
  },
  {
    id: '10104',
    customId: '10104',
    title: 'gaming_victory',
    name: 'gaming_victory',
    category: 'Gaming',
    imageUrl: 'https://cdn3.emoji.gg/emojis/5543_gamer_rage.png',
    isAnimated: false,
    source: 'Discadia',
    submittedBy: 'EsportsHQ',
    faves: 4200,
  },
];

const DISCORDS_COM_EMOJIS: EmojiItem[] = [
  {
    id: '20201',
    customId: '20201',
    title: 'dank_pepe_king',
    name: 'dank_pepe_king',
    category: 'Pepe',
    imageUrl: 'https://cdn3.emoji.gg/emojis/1337_pepe_popcorn.gif',
    isAnimated: true,
    source: 'Discords.com',
    submittedBy: 'DiscordsOrg',
    faves: 5600,
  },
  {
    id: '20202',
    customId: '20202',
    title: 'party_blob_hype',
    name: 'party_blob_hype',
    category: 'Blobs',
    imageUrl: 'https://cdn3.emoji.gg/emojis/9912_blob_dance.gif',
    isAnimated: true,
    source: 'Discords.com',
    submittedBy: 'DiscordsOrg',
    faves: 6100,
  },
  {
    id: '20203',
    customId: '20203',
    title: 'galaxy_cat_vibe',
    name: 'galaxy_cat_vibe',
    category: 'Animated',
    imageUrl: 'https://cdn3.emoji.gg/emojis/2312_cat_jam.gif',
    isAnimated: true,
    source: 'Discords.com',
    submittedBy: 'VibeStation',
    faves: 7800,
  },
  {
    id: '20204',
    customId: '20204',
    title: 'think_galaxy',
    name: 'think_galaxy',
    category: 'Thinking',
    imageUrl: 'https://cdn3.emoji.gg/emojis/3041_thinking_cloud.png',
    isAnimated: false,
    source: 'Discords.com',
    submittedBy: 'DiscordsOrg',
    faves: 1400,
  },
];

// Unified database cache
let fullCatalogCache: EmojiItem[] | null = null;
let isFetching = false;

/**
 * Fetches and merges emojis with numeric IDs
 */
export async function fetchFullEmojiCatalog(): Promise<EmojiItem[]> {
  if (fullCatalogCache && fullCatalogCache.length > 0) {
    return fullCatalogCache;
  }

  if (isFetching) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (fullCatalogCache) return fullCatalogCache;
  }

  try {
    isFetching = true;

    const response = await fetch('https://emoji.gg/api');
    if (!response.ok) {
      throw new Error(`Emoji.gg API error: ${response.status}`);
    }

    const rawData = await response.json();

    let emojiGgList: EmojiItem[] = [];
    if (Array.isArray(rawData)) {
      emojiGgList = rawData.map((item: any) => {
        const categoryName = CATEGORY_MAP[item.category] || 'Original';
        const imgUrl = item.image || '';
        const isAnim = imgUrl.endsWith('.gif') || item.category === 5;
        const rawId = String(item.id);

        return {
          id: rawId,
          customId: rawId,
          title: item.title || 'emoji',
          name: item.title || 'emoji',
          category: categoryName,
          imageUrl: imgUrl,
          isAnimated: isAnim,
          source: 'Emoji.gg' as const,
          slug: item.slug,
          submittedBy: item.submitted_by || 'Emoji.gg',
          faves: item.faves || 0,
        };
      });
    }

    fullCatalogCache = [...emojiGgList, ...DISCADIA_EMOJIS, ...DISCORDS_COM_EMOJIS];
    console.log(`✅ Loaded ${fullCatalogCache.length} total emojis into memory`);
    return fullCatalogCache;
  } catch (err) {
    console.error('Failed to load full emoji catalog:', err);
  } finally {
    isFetching = false;
  }

  return fullCatalogCache || FALLBACK_CATALOG;
}

/**
 * Smart similar-name and numeric ID matching engine
 */
export function isSimilarMatch(query: string, item: EmojiItem): boolean {
  if (!query) return true;
  const q = query.toLowerCase().trim().replace(/^:/, '').replace(/:$/, '').replace(/^id[:\s]*/i, '');
  if (!q) return true;

  const customId = item.customId.toLowerCase();
  const rawId = item.id.toLowerCase();
  const title = item.title.toLowerCase();
  const name = item.name.toLowerCase();
  const category = item.category.toLowerCase();

  // 1. Direct Numeric / ID Match
  if (rawId === q || customId === q || customId.includes(q) || rawId.includes(q)) {
    return true;
  }

  // 2. Direct string inclusion
  if (title.includes(q) || name.includes(q) || category.includes(q)) {
    return true;
  }

  // 3. Clean Alphanumeric comparison
  const cleanQ = q.replace(/[^a-z0-9]/g, '');
  const cleanTitle = title.replace(/[^a-z0-9]/g, '');

  if (cleanQ && cleanTitle.includes(cleanQ)) {
    return true;
  }

  return false;
}

/**
 * Filter catalog by query, category, and pagination
 */
export function searchEmojiCatalog(
  query: string = '',
  category: string = 'Tous',
  page: number = 1,
  pageSize: number = 28
) {
  const sourceList = fullCatalogCache || FALLBACK_CATALOG;

  const filtered = sourceList.filter((item) => {
    if (category !== 'Tous' && item.category !== category) {
      return false;
    }
    return isSimilarMatch(query, item);
  });

  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const startIndex = (currentPage - 1) * pageSize;
  const items = filtered.slice(startIndex, startIndex + pageSize);

  return {
    items,
    totalCount,
    totalPages,
    currentPage,
    pageSize,
  };
}

/**
 * Lookup single emoji by Custom ID or Raw ID
 */
export function findEmojiById(idOrCustomId: string): EmojiItem | undefined {
  const sourceList = fullCatalogCache || FALLBACK_CATALOG;
  const target = idOrCustomId.toLowerCase().trim().replace(/^id[:\s]*/i, '');

  return sourceList.find(
    (e) => e.customId.toLowerCase() === target || e.id.toLowerCase() === target || e.title.toLowerCase() === target
  );
}

// Fallback initial list
export const FALLBACK_CATALOG: EmojiItem[] = [
  {
    id: '6188',
    customId: '6188',
    title: 'falco_stare',
    name: 'falco_stare',
    category: 'Logos',
    imageUrl: 'https://cdn3.emoji.gg/emojis/4384_falco_stare.png',
    isAnimated: false,
    source: 'Emoji.gg',
    slug: '4384_falco_stare',
    submittedBy: 'anime chicken',
    faves: 120,
  },
  {
    id: '6001',
    customId: '6001',
    title: 'pepe_chill',
    name: 'pepe_chill',
    category: 'Pepe',
    imageUrl: 'https://cdn3.emoji.gg/emojis/8488_pepe_chill.png',
    isAnimated: false,
    source: 'Emoji.gg',
    slug: '8488_pepe_chill',
    submittedBy: 'PepeLover',
    faves: 4500,
  },
  ...DISCADIA_EMOJIS,
  ...DISCORDS_COM_EMOJIS,
];
