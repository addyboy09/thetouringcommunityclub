export type RecommendedSite = {
  slug: string;
  name: string;
  location: string;
  rating: number;
  tag: string;
  desc: string;
  amenities: string[];
  photos: string[];
  review: { author: string; text: string };
};

export type ApprovedSite = {
  slug: string;
  name: string;
  location: string;
  year: number;
  notes: string;
  amenities: string[];
  photos: string[];
  review: { author: string; text: string };
};

const photo = (q: string, seed: number) =>
  `https://images.unsplash.com/photo-${q}?w=1200&q=80&auto=format&fit=crop&sig=${seed}`;

// Curated Unsplash IDs (caravan / camping / countryside)
const POOL = [
  "1504280390367-361c6d9f38f4",
  "1517824806704-9040b037703b",
  "1500530855697-b586d89ba3ee",
  "1464822759023-fed622ff2c3b",
  "1496080174650-637e3f22fa03",
  "1455763916899-e8b50eca9967",
  "1444090542259-0af8fa96557e",
  "1502635385003-ee1e6a1a742d",
  "1487730116645-74489c95b41b",
  "1533873984035-25970ab07461",
  "1508873535684-277a3cbcc4e8",
  "1476041800959-2f6bb412c8ce",
];

const pics = (offset: number, count = 3) =>
  Array.from({ length: count }, (_, i) => photo(POOL[(offset + i) % POOL.length], offset + i));

export const recommendedSites: RecommendedSite[] = [
  {
    slug: "Wagtail Country Park",
    name: "Wagtail Country Park",
    location: "Mansfield, England",
    rating: 4.9,
    tag: "Views",
    desc: "Spacious touring pitches, fishing lakes, wildlife-rich surroundings and dog friendly.",
    amenities: ["Fishing Lake", "Hot showers", "Electric hook-ups", "Dog friendly", "Forest walks", ""],
    photos: picshttps://wagtailcountrypark.co.uk/wp-content/uploads/2018/10/Wagtail-busy-1-1030x687.jpg(0),
    review: { author: "Mark & Julie, Yorkshire", text: "Woke to mist on the loch and ospreys overhead. Pitches are flat, staff couldn't be friendlier. We'll be back every summer." },
  },
  {
    slug: "BLANK",
    name: "BLANK",
    location: "Bude, Cornwall",
    rating: 4.8,
    tag: "Family",
    desc: "Family-run park minutes from Bude's beaches. Excellent facilities and friendly farm animals.",
    amenities: ["Heated pool", "Farm shop", "Kids' play area", "Hardstanding pitches", "Laundry", "On-site bar"],
    photos: pics(2),
    review: { author: "The Patel family", text: "Our kids didn't want to leave — feeding the lambs each morning was the highlight. Spotless facilities and a short drive to Crooklets beach." },
  },
  {
    slug: "castlerigg-hall",
    name: "Castlerigg Hall",
    location: "Keswick, Lake District",
    rating: 4.9,
    tag: "Views",
    desc: "Panoramic views over Derwentwater. A favourite Lake District base for our members.",
    amenities: ["Panoramic views", "Restaurant on site", "Serviced pitches", "Drying room", "Walking trails"],
    photos: pics(4),
    review: { author: "Dave, motorhome solo tour", text: "The view from pitch 27 over Derwentwater is hard to beat. Showers piping hot, owners genuinely lovely." },
  },
  {
    slug: "beadnell-bay",
    name: "Beadnell Bay C&MC Site",
    location: "Northumberland Coast",
    rating: 4.7,
    tag: "Coastal",
    desc: "Sand-dune pitches steps from a Blue Flag beach on the stunning Northumberland coast.",
    amenities: ["Beach access", "Hardstanding & grass", "Modern washblock", "Dog walk", "Wi-Fi"],
    photos: pics(6),
    review: { author: "Sue & Ian", text: "Step out the awning and you're on the dunes. Watched seals on the bay each evening — pure bliss." },
  },
  {
    slug: "tan-y-bryn-farm",
    name: "Tan-y-Bryn Farm",
    location: "Snowdonia, Wales",
    rating: 4.6,
    tag: "Quiet CL",
    desc: "Tranquil 5-pitch CL with mountain views — a true off-grid escape.",
    amenities: ["5 pitches only", "Fresh water", "Chemical disposal", "Mountain views", "Dark skies"],
    photos: pics(8),
    review: { author: "Paul, weekend tourer", text: "Exactly what a CL should be — quiet, friendly farmer, sheep for neighbours and the Milky Way overhead." },
  },
  {
    slug: "toms-field",
    name: "Tom's Field",
    location: "Swanage, Dorset",
    rating: 4.7,
    tag: "Jurassic Coast",
    desc: "Walk to Dancing Ledge from this much-loved Purbeck campsite.",
    amenities: ["Coast path access", "Small shop", "Family washblock", "Tent & tourer pitches", "No-frills charm"],
    photos: pics(10),
    review: { author: "Helen, regular since '08", text: "A proper old-school campsite. Walk to the cliffs in 20 minutes and pub in the village. Never changes — that's the appeal." },
  },
];

export const approvedSites: ApprovedSite[] = [
  {
    slug: "riverside-touring-park",
    name: "Riverside Touring Park",
    location: "Wye Valley, Herefordshire",
    year: 2024,
    notes: "Spotless facilities, hardstanding pitches, dog friendly.",
    amenities: ["Riverside pitches", "Hardstanding", "Dog friendly", "Family washblock", "Fishing on site"],
    photos: pics(1),
    review: { author: "TCC Inspector — Sarah", text: "A genuinely welcoming park with care taken in every detail. Pitches are level, drainage excellent and the river walk is a treat." },
  },
  {
    slug: "highland-meadows",
    name: "Highland Meadows",
    location: "Inverness-shire, Scotland",
    year: 2025,
    notes: "Adult-only, full service pitches and stunning glen views.",
    amenities: ["Adult only", "Full service pitches", "Wi-Fi", "Glen views", "Cycle storage"],
    photos: pics(3),
    review: { author: "TCC Inspector — Graham", text: "Calm, immaculate and beautifully laid out. The full-service pitches are pricey but worth every penny for the setting." },
  },
  {
    slug: "coastal-view-caravan-park",
    name: "Coastal View Caravan Park",
    location: "Pembrokeshire, Wales",
    year: 2024,
    notes: "Family park with direct beach access and heated facilities.",
    amenities: ["Direct beach access", "Heated washblock", "Family pitches", "Play area", "Surf school nearby"],
    photos: pics(5),
    review: { author: "TCC Inspector — Bethan", text: "A well-run family site with a proper sense of community. Beach path is a five-minute stroll and the welcome was first class." },
  },
  {
    slug: "pine-lakes-retreat",
    name: "Pine Lakes Retreat",
    location: "New Forest, Hampshire",
    year: 2025,
    notes: "Wooded pitches, quiet location, on-site farm shop.",
    amenities: ["Wooded pitches", "Farm shop", "Cycle hire", "Dog walk", "Fire pits allowed"],
    photos: pics(7),
    review: { author: "TCC Inspector — Mike", text: "Properly peaceful — ponies wandered past our awning at dusk. Owners clearly love what they do." },
  },
  {
    slug: "moorland-edge-campsite",
    name: "Moorland Edge Campsite",
    location: "Yorkshire Dales",
    year: 2023,
    notes: "Walker-friendly with excellent drying room and pub next door.",
    amenities: ["Drying room", "Boot wash", "Pub adjacent", "Hardstanding & grass", "Map library"],
    photos: pics(9),
    review: { author: "TCC Inspector — Jean", text: "After a wet day on the fells, the drying room was a godsend. The Black Bull next door does a fine pie too." },
  },
  {
    slug: "harbour-lights-touring",
    name: "Harbour Lights Touring",
    location: "Devon, South Coast",
    year: 2025,
    notes: "Walk into a working harbour town. Great fish & chips!",
    amenities: ["Walk to harbour", "Sea views", "Hardstanding pitches", "Late arrivals area", "EV charging"],
    photos: pics(11),
    review: { author: "TCC Inspector — Rob", text: "Five minutes downhill and you're watching the boats unload. Pitches are tight but well-thought-out and the showers are superb." },
  },
];
