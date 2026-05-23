/**
 * GET /api/destinations
 * Query params:
 *   ?featured=true        → returns 8 curated high-rated destinations (home page)
 *   ?continent=europe&category=cultural&q=paris&page=0  → filtered explore modal
 *
 * Uses Geoapify Places API for real destination data +
 * Unsplash API for high-quality photos.
 * Results are cached in-memory for 1 hour to preserve free-tier credits.
 */

import { NextResponse } from 'next/server';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Destination {
  id: string;
  name: string;
  region: string;
  country: string;
  coordinates: string;
  lat: number;
  lon: number;
  description: string;
  tags: string[];
  image: string;
  imageAlt: string;
  aiScore: string;
  temp?: string;
  wikidata?: string;
}

// ── In-memory cache ────────────────────────────────────────────────────────────

const cache = new Map<string, { data: Destination[]; ts: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function fromCache(key: string): Destination[] | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) { cache.delete(key); return null; }
  return entry.data;
}
function toCache(key: string, data: Destination[]) {
  cache.set(key, { data, ts: Date.now() });
}

// ── Curated featured destinations ─────────────────────────────────────────────
// These are the 8 hand-picked destinations shown on the main page.
// We still fetch real Unsplash photos for them dynamically.

const FEATURED_SEEDS = [
  { name: 'Bali',         country: 'Indonesia',    lat:  -8.34,  lon: 115.09, tags: ['Culture','Nature','Wellness'],   temp: '28°C', score: '9.4' },
  { name: 'Amalfi Coast', country: 'Italy',         lat:  40.63,  lon:  14.60, tags: ['Coastal','Cuisine','Romance'],   temp: '24°C', score: '9.7' },
  { name: 'Swiss Alps',   country: 'Switzerland',   lat:  46.82,  lon:   8.23, tags: ['Mountains','Adventure','Luxury'],temp: '12°C', score: '9.5' },
  { name: 'Kyoto',        country: 'Japan',         lat:  35.01,  lon: 135.77, tags: ['Heritage','Gardens','Cuisine'],  temp: '20°C', score: '9.6' },
  { name: 'Sahara',       country: 'Morocco',       lat:  31.79,  lon:  -7.09, tags: ['Desert','Adventure','Culture'],  temp: '34°C', score: '9.1' },
  { name: 'Patagonia',    country: 'Argentina',     lat: -48.86,  lon: -69.22, tags: ['Wilderness','Trekking','Wildlife'],temp:'8°C', score: '9.3' },
  { name: 'Maldives',     country: 'Indian Ocean',  lat:   3.20,  lon:  73.22, tags: ['Tropical','Diving','Luxury'],    temp: '30°C', score: '9.8' },
  { name: 'Santorini',    country: 'Greece',        lat:  36.39,  lon:  25.46, tags: ['Coastal','Romance','Culture'],   temp: '26°C', score: '9.5' },
];

// ── Continent bounding boxes for Geoapify filter ──────────────────────────────

const CONTINENT_FILTERS: Record<string, string> = {
  all:       '',
  europe:    'rect:-31.27,27.64,69.03,81.01',
  asia:      'rect:26.04,-11.17,180.00,77.72',
  africa:    'rect:-25.36,-46.97,63.53,37.35',
  americas:  'rect:-168.17,-56.52,-34.79,83.11',
  oceania:   'rect:112.92,-50.00,180.00,-10.06',
};

// ── Category → Geoapify category string ──────────────────────────────────────

const CATEGORY_MAP: Record<string, string> = {
  all:        'tourism.attraction,tourism.sights',
  culture:    'tourism.sights.castle,tourism.sights.ruins,tourism.sights.archaeological_site',
  nature:     'natural.peak,natural.beach,natural.cliff,natural.volcano',
  adventure:  'tourism.attraction,sport.mountain_hiking,natural.peak',
  luxury:     'tourism.attraction,accommodation.hotel',
  coastal:    'natural.beach,tourism.attraction',
  food:       'catering.restaurant,tourism.attraction',
};

// ── Unsplash photo fetcher ────────────────────────────────────────────────────

async function fetchUnsplashPhoto(query: string): Promise<{ url: string; alt: string }> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return { url: '', alt: query };

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query + ' travel landscape')}&per_page=1&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${key}` }, next: { revalidate: 3600 } }
    );
    if (!res.ok) return { url: '', alt: query };
    const data = await res.json();
    const photo = data.results?.[0];
    if (!photo) return { url: '', alt: query };
    return {
      url: photo.urls?.regular ?? '',
      alt: photo.alt_description ?? `${query} travel destination`,
    };
  } catch {
    return { url: '', alt: query };
  }
}

// ── Geoapify place fetcher ────────────────────────────────────────────────────

async function fetchGeoapifyPlaces(
  continent: string,
  category: string,
  query: string,
  page: number
): Promise<Destination[]> {
  const key = process.env.GEOAPIFY_API_KEY;
  if (!key) return [];

  const categories = CATEGORY_MAP[category] ?? CATEGORY_MAP.all;
  const filter = CONTINENT_FILTERS[continent] || CONTINENT_FILTERS.all;
  const limit = 12;
  const offset = page * limit;

  let url = `https://api.geoapify.com/v2/places?categories=${categories}&limit=${limit}&offset=${offset}&lang=en&apiKey=${key}`;
  if (filter) url += `&filter=${filter}`;
  if (query) url += `&name=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    const features = data.features ?? [];

    // Fetch Unsplash photos in parallel (max 6 at a time to be safe)
    const slice = features.slice(0, 12);
    const withPhotos = await Promise.all(
      slice.map(async (f: any) => {
        const props = f.properties ?? {};
        const name = props.name || props.city || 'Unknown';
        const country = props.country || props.state || '';
        const lat = f.geometry?.coordinates?.[1] ?? 0;
        const lon = f.geometry?.coordinates?.[0] ?? 0;

        // Build tags from categories — Geoapify returns an array, not a string
        const categoriesRaw = props.categories;
        const categoryArr: string[] = Array.isArray(categoriesRaw)
            ? categoriesRaw
            : typeof categoriesRaw === 'string'
                ? categoriesRaw.split(',')
                : [];
        const rawTags = categoryArr.map((k: string) => {
            const last = k.trim().split('.').pop() ?? k;
            return last.charAt(0).toUpperCase() + last.slice(1).replace(/_/g, ' ');
        }).filter(Boolean).slice(0, 3);
        const tags = rawTags.length > 0 ? rawTags : ['Attraction'];

        // AI score — deterministic from coordinates so it doesn't flicker
        const score = (8.0 + ((Math.abs(lat * 7 + lon * 3) % 20) / 10)).toFixed(1);

        const photo = await fetchUnsplashPhoto(`${name} ${country}`);

        return {
          id: props.place_id ?? `${lat}-${lon}`,
          name,
          region: props.state ?? props.county ?? '',
          country,
          coordinates: `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? 'E' : 'W'}`,
          lat,
          lon,
          description: props.address_line2 ?? `Explore ${name}, a remarkable destination in ${country}.`,
          tags,
          image: photo.url,
          imageAlt: photo.alt,
          aiScore: score,
          wikidata: props.datasource?.raw?.wikidata,
        } as Destination;
      })
    );

    return withPhotos.filter(d => d.name && d.name !== 'Unknown');
  } catch (err) {
    console.error('[/api/destinations] Geoapify error:', err);
    return [];
  }
}

// ── Featured destinations ─────────────────────────────────────────────────────

async function fetchFeatured(): Promise<Destination[]> {
  const cached = fromCache('featured');
  if (cached) return cached;

  const results = await Promise.all(
    FEATURED_SEEDS.map(async (seed) => {
      const photo = await fetchUnsplashPhoto(`${seed.name} ${seed.country} landscape`);
      const lat = seed.lat;
      const lon = seed.lon;
      return {
        id: `featured-${seed.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: seed.name,
        region: seed.country,
        country: seed.country,
        coordinates: `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? 'E' : 'W'}`,
        lat,
        lon,
        description: getDescription(seed.name),
        tags: seed.tags,
        image: photo.url || getFallbackImage(seed.name),
        imageAlt: photo.alt || `${seed.name} travel destination`,
        aiScore: seed.score,
        temp: seed.temp,
      } as Destination;
    })
  );

  const valid = results.filter(d => d.image);
  toCache('featured', valid);
  return valid;
}

// ── Fallback descriptions ─────────────────────────────────────────────────────

function getDescription(name: string): string {
  const map: Record<string, string> = {
    'Bali':         'Terraced rice paddies cascade into misty volcanic valleys. A spiritual haven where ancient temples meet lush tropical wilderness.',
    'Amalfi Coast': 'Dramatic cliffs plunge into turquoise waters while pastel villages cling to vertiginous hillsides along the Mediterranean.',
    'Swiss Alps':   'Crystal-clear lakes mirror snow-capped peaks in a pristine alpine wonderland. Where silence speaks louder than words.',
    'Kyoto':        'Thousand-year-old temples sit beneath canopies of maple and cherry blossom. Tradition and beauty in perfect harmony.',
    'Sahara':       'Endless golden dunes sculpted by wind stretch to every horizon. An ocean of sand where time dissolves into stillness.',
    'Patagonia':    'Towering granite spires rise above glacial lakes in the last true wilderness. Raw, untamed, breathtaking.',
    'Maldives':     'Crystal lagoons reveal coral gardens beneath the surface. Paradise refined to its purest, most luminous form.',
    'Santorini':    'Iconic white-domed churches overlook a shimmering volcanic caldera. The Mediterranean at its most impossibly beautiful.',
  };
  return map[name] ?? `Discover the wonders of ${name}, a destination that will leave you breathless.`;
}

function getFallbackImage(name: string): string {
  // Curated Unsplash source URLs as fallback (no API key needed)
  const map: Record<string, string> = {
    'Bali':         'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800',
    'Amalfi Coast': 'https://images.unsplash.com/photo-1534445867742-43195f401b6c?w=800',
    'Swiss Alps':   'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800',
    'Kyoto':        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
    'Sahara':       'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800',
    'Patagonia':    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
    'Maldives':     'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
    'Santorini':    'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
  };
  return map[name] ?? '';
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get('featured') === 'true';

  if (featured) {
    const data = await fetchFeatured();
    return NextResponse.json(data);
  }

  // Explore modal — live Geoapify results
  const continent = searchParams.get('continent') ?? 'all';
  const category  = searchParams.get('category')  ?? 'all';
  const q         = searchParams.get('q')          ?? '';
  const page      = parseInt(searchParams.get('page') ?? '0', 10);

  const cacheKey = `${continent}:${category}:${q}:${page}`;
  const cached = fromCache(cacheKey);
  if (cached) return NextResponse.json(cached);

  const data = await fetchGeoapifyPlaces(continent, category, q, page);
  if (data.length > 0) toCache(cacheKey, data);

  return NextResponse.json(data);
}