export interface MarketplacePetType {
  id: string;
  name: string;
  image: string;
}

export interface MarketplaceBreed {
  id: string;
  name: string;
  image: string;
  petTypeId: string;
}

export interface MarketplaceListing {
  id: string;
  title: string;
  petType: string;
  breed?: string;
  category: string;
  price: number; // 0 if free / rehoming
  originalPrice?: number;
  isFree?: boolean;
  currencySymbol?: string;
  badge?: "For Sale" | "Rehoming" | "Like New" | "Free" | "Best Seller" | "20% OFF";
  badgeVariant?: "coral" | "green" | "yellow" | "sky";
  condition: "New" | "Like New" | "Good" | "Used";
  listingType: "for-sale" | "free" | "swap";
  image: string;
  location: string;
  timeAgo: string;
  isLivePet?: boolean; // Live animal sale or adoption vs supplies
  isCommunityListing?: boolean;
  store?: {
    id: string;
    name: string;
    isVerified?: boolean;
    slug?: string;
  };
  seller: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    isStore?: boolean;
  };
}

export type MarketplaceProduct = MarketplaceListing;

export const MARKETPLACE_PET_TYPES: MarketplacePetType[] = [
  { id: "all", name: "All Pets", image: "/CareGuide/categories/dog.png" },
  { id: "dogs", name: "Dogs", image: "/CareGuide/categories/dog.png" },
  { id: "cats", name: "Cats", image: "/CareGuide/categories/cat.png" },
  { id: "birds", name: "Birds", image: "/CareGuide/categories/bird.png" },
  { id: "rabbits", name: "Rabbits", image: "/CareGuide/categories/rabbit.png" },
  { id: "fish", name: "Fish", image: "/CareGuide/categories/fish.png" },
  { id: "reptiles", name: "Reptiles", image: "/CareGuide/categories/reptile.png" },
  { id: "small-pets", name: "Small Pets", image: "/CareGuide/categories/small-pets.png" },
];

export const MARKETPLACE_BREEDS_MAP: Record<string, MarketplaceBreed[]> = {
  birds: [
    { id: "all", name: "All Birds", image: "/CareGuide/categories/bird.png", petTypeId: "birds" },
    { id: "budgie", name: "Budgie", image: "/CareGuide/breeds/birds/budgie.jpg", petTypeId: "birds" },
    { id: "cockatiel", name: "Cockatiel", image: "/CareGuide/breeds/birds/cockatiel.jpg", petTypeId: "birds" },
    { id: "lovebird", name: "Lovebird", image: "/CareGuide/breeds/birds/lovebird.jpg", petTypeId: "birds" },
    { id: "finch", name: "Finch", image: "/CareGuide/breeds/birds/finch.jpg", petTypeId: "birds" },
    { id: "canary", name: "Canary", image: "/CareGuide/breeds/birds/canary.jpg", petTypeId: "birds" },
    { id: "parrot", name: "Parrot", image: "/CareGuide/breeds/birds/parrot.jpg", petTypeId: "birds" },
    { id: "african-grey", name: "African Grey", image: "/CareGuide/breeds/birds/african-grey.jpg", petTypeId: "birds" },
    { id: "macaw", name: "Macaw", image: "/CareGuide/breeds/birds/macaw.jpg", petTypeId: "birds" },
    { id: "cockatoo", name: "Cockatoo", image: "/CareGuide/breeds/birds/cockatoo.jpg", petTypeId: "birds" },
    { id: "conure", name: "Conure", image: "/CareGuide/breeds/birds/conure.jpg", petTypeId: "birds" },
  ],
  dogs: [
    { id: "all", name: "All Dogs", image: "/CareGuide/categories/dog.png", petTypeId: "dogs" },
    { id: "golden-retriever", name: "Golden Retriever", image: "/CareGuide/breeds/dogs/golden-retriever.jpg", petTypeId: "dogs" },
    { id: "french-bulldog", name: "French Bulldog", image: "/CareGuide/breeds/dogs/french-bulldog.jpg", petTypeId: "dogs" },
    { id: "german-shepherd", name: "German Shepherd", image: "/CareGuide/breeds/dogs/german-shepherd.jpg", petTypeId: "dogs" },
    { id: "labrador", name: "Labrador", image: "/CareGuide/breeds/dogs/labrador.jpg", petTypeId: "dogs" },
    { id: "poodle", name: "Poodle", image: "/CareGuide/breeds/dogs/poodle.jpg", petTypeId: "dogs" },
    { id: "husky", name: "Husky", image: "/CareGuide/breeds/dogs/husky.jpg", petTypeId: "dogs" },
    { id: "corgi", name: "Corgi", image: "/CareGuide/breeds/dogs/corgi.jpg", petTypeId: "dogs" },
  ],
  cats: [
    { id: "all", name: "All Cats", image: "/CareGuide/categories/cat.png", petTypeId: "cats" },
    { id: "persian", name: "Persian", image: "/CareGuide/breeds/cats/persian.jpg", petTypeId: "cats" },
    { id: "maine-coon", name: "Maine Coon", image: "/CareGuide/breeds/cats/maine-coon.jpg", petTypeId: "cats" },
    { id: "siamese", name: "Siamese", image: "/CareGuide/breeds/cats/siamese.jpg", petTypeId: "cats" },
    { id: "british-shorthair", name: "British Shorthair", image: "/CareGuide/breeds/cats/british-shorthair.jpg", petTypeId: "cats" },
  ],
  rabbits: [
    { id: "all", name: "All Rabbits", image: "/CareGuide/categories/rabbit.png", petTypeId: "rabbits" },
    { id: "holland-lop", name: "Holland Lop", image: "/CareGuide/breeds/small-pets/holland-lop.jpg", petTypeId: "rabbits" },
    { id: "netherland-dwarf", name: "Netherland Dwarf", image: "/CareGuide/breeds/small-pets/netherland-dwarf.jpg", petTypeId: "rabbits" },
  ],
  fish: [
    { id: "all", name: "All Fish", image: "/CareGuide/categories/fish.png", petTypeId: "fish" },
    { id: "betta", name: "Betta", image: "/CareGuide/breeds/aquatic/betta.jpg", petTypeId: "fish" },
    { id: "goldfish", name: "Goldfish", image: "/CareGuide/breeds/aquatic/goldfish.jpg", petTypeId: "fish" },
  ],
  reptiles: [
    { id: "all", name: "All Reptiles", image: "/CareGuide/categories/reptile.png", petTypeId: "reptiles" },
    { id: "bearded-dragon", name: "Bearded Dragon", image: "/CareGuide/breeds/reptiles/bearded-dragon.jpg", petTypeId: "reptiles" },
  ],
  "small-pets": [
    { id: "all", name: "All Small Pets", image: "/CareGuide/categories/small-pets.png", petTypeId: "small-pets" },
    { id: "hamster", name: "Hamster", image: "/CareGuide/breeds/small-pets/syrian-hamster.jpg", petTypeId: "small-pets" },
  ],
};

export interface SidebarCategoryItem {
  id: string;
  label: string;
  count: number;
}

export const SIDEBAR_CATEGORIES: SidebarCategoryItem[] = [
  { id: "all", label: "All Categories", count: 243 },
  { id: "cages", label: "Cages & Accessories", count: 82 },
  { id: "food", label: "Food & Treats", count: 45 },
  { id: "toys", label: "Toys & Enrichment", count: 38 },
  { id: "perches", label: "Perches & Stands", count: 21 },
  { id: "health", label: "Health & Care", count: 18 },
  { id: "grooming", label: "Grooming", count: 12 },
  { id: "travel", label: "Travel & Carriers", count: 14 },
  { id: "nesting", label: "Nesting & Breeding", count: 9 },
  { id: "cleaning", label: "Cleaning & Hygiene", count: 11 },
  { id: "books", label: "Books & Learning", count: 7 },
];

export interface SidebarConditionItem {
  id: string;
  label: string;
  count?: number;
}

export const SIDEBAR_CONDITIONS: SidebarConditionItem[] = [
  { id: "all", label: "All" },
  { id: "new", label: "New", count: 96 },
  { id: "like-new", label: "Like New", count: 64 },
  { id: "good", label: "Good", count: 62 },
  { id: "used", label: "Used", count: 21 },
];

export interface SidebarListingTypeItem {
  id: string;
  label: string;
  count: number;
}

export const SIDEBAR_LISTING_TYPES: SidebarListingTypeItem[] = [
  { id: "for-sale", label: "For Sale", count: 198 },
  { id: "free", label: "Free (Giveaway)", count: 28 },
  { id: "swap", label: "Swap / Trade", count: 10 },
];

export const SIDEBAR_LOCATIONS = [
  "Dhaka, Bangladesh",
  "Mirpur, Dhaka",
  "Uttara, Dhaka",
  "Dhanmondi, Dhaka",
  "Gulshan, Dhaka",
  "Banani, Dhaka",
  "Bashundhara, Dhaka",
  "Mohammadpur, Dhaka",
  "Wari, Dhaka",
  "Chittagong, Bangladesh",
  "Sylhet, Bangladesh",
];

export const SIDEBAR_RADIUS_OPTIONS = [
  "Within 10 km",
  "Within 25 km",
  "Within 50 km",
  "Within 100 km",
  "Entire City / All Distance",
];

// Top filter bar constants
export const TOP_CATEGORIES = [
  "All Categories",
  "Cages & Accessories",
  "Food & Treats",
  "Toys & Enrichment",
  "Perches & Stands",
  "Health & Care",
  "Travel & Carriers",
];

export const TOP_LOCATIONS = [
  "All Locations",
  "Dhaka, Bangladesh",
  "Uttara, Dhaka",
  "Mirpur, Dhaka",
  "Dhanmondi, Dhaka",
  "Gulshan, Dhaka",
  "Bashundhara, Dhaka",
  "Mohammadpur, Dhaka",
  "Banani, Dhaka",
];

export const TOP_CONDITIONS = ["All", "New", "Like New", "Good", "Used"];

export const TOP_PRICE_RANGES = [
  { label: "Any", min: 0, max: Infinity },
  { label: "Under ৳500", min: 0, max: 500 },
  { label: "৳500 - ৳1,500", min: 500, max: 1500 },
  { label: "৳1,500 - ৳5,000", min: 1500, max: 5000 },
  { label: "Above ৳5,000", min: 5000, max: Infinity },
];

// 12 Products exactly as shown in screenshot with store names & verified shop flags
export const MARKETPLACE_ITEMS: MarketplaceListing[] = [
  // ROW 1
  {
    id: "item-1",
    title: "Budgie Cage with Accessories",
    petType: "birds",
    breed: "budgie",
    category: "cages",
    price: 4500,
    originalPrice: 5000,
    currencySymbol: "৳",
    badge: "For Sale",
    badgeVariant: "yellow",
    condition: "Good",
    listingType: "for-sale",
    isLivePet: false,
    image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80",
    location: "Mirpur, Dhaka",
    timeAgo: "2 hours ago",
    store: {
      id: "avian-nest-shop",
      name: "Avian Nest BD",
      isVerified: true,
      slug: "avian-nest-bd",
    },
    seller: {
      id: "u-1",
      name: "Sadia R.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      rating: 4.8,
      reviewCount: 12,
      isStore: true,
    },
  },
  {
    id: "item-2",
    title: "Two Friendly Budgies (Pair)",
    petType: "birds",
    breed: "budgie",
    category: "cages",
    price: 0,
    isFree: true,
    currencySymbol: "৳",
    badge: "Rehoming",
    badgeVariant: "coral",
    condition: "Good",
    listingType: "free",
    isLivePet: true,
    image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80",
    location: "Uttara, Dhaka",
    timeAgo: "5 hours ago",
    seller: {
      id: "u-2",
      name: "Tanvir H.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      rating: 5.0,
      reviewCount: 8,
      isStore: false,
    },
  },
  {
    id: "item-3",
    title: "Budgie Food Mix (1kg)",
    petType: "birds",
    breed: "budgie",
    category: "food",
    price: 350,
    originalPrice: 420,
    currencySymbol: "৳",
    badge: "For Sale",
    badgeVariant: "coral",
    condition: "New",
    listingType: "for-sale",
    isLivePet: false,
    image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80",
    location: "Dhanmondi, Dhaka",
    timeAgo: "1 day ago",
    store: {
      id: "grain-treats-mart",
      name: "Happy Wings Mart",
      isVerified: true,
      slug: "happy-wings-mart",
    },
    seller: {
      id: "u-3",
      name: "Nusrat K.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      rating: 4.9,
      reviewCount: 15,
      isStore: true,
    },
  },
  {
    id: "item-4",
    title: "Wooden Play Stand with Toys",
    petType: "birds",
    breed: "budgie",
    category: "perches",
    price: 1200,
    currencySymbol: "৳",
    badge: "Like New",
    badgeVariant: "green",
    condition: "Like New",
    listingType: "for-sale",
    isLivePet: false,
    image: "https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?auto=format&fit=crop&w=600&q=80",
    location: "Bashundhara, Dhaka",
    timeAgo: "1 day ago",
    store: {
      id: "crafty-perch-co",
      name: "Timber Pets Studio",
      isVerified: false,
      slug: "timber-pets-studio",
    },
    seller: {
      id: "u-4",
      name: "Aminul I.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      rating: 4.7,
      reviewCount: 6,
      isStore: true,
    },
  },

  // ROW 2
  {
    id: "item-5",
    title: "Travel Carrier (Small)",
    petType: "birds",
    breed: "budgie",
    category: "travel",
    price: 800,
    originalPrice: 950,
    currencySymbol: "৳",
    badge: "For Sale",
    badgeVariant: "coral",
    condition: "Good",
    listingType: "for-sale",
    isLivePet: false,
    image: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?auto=format&fit=crop&w=600&q=80",
    location: "Mohammadpur, Dhaka",
    timeAgo: "2 days ago",
    seller: {
      id: "u-5",
      name: "Rafid S.",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
      rating: 4.6,
      reviewCount: 10,
      isStore: false,
    },
  },
  {
    id: "item-6",
    title: "Budgie Vitamins & Supplements",
    petType: "birds",
    breed: "budgie",
    category: "health",
    price: 600,
    currencySymbol: "৳",
    badge: "For Sale",
    badgeVariant: "coral",
    condition: "New",
    listingType: "for-sale",
    isLivePet: false,
    image: "https://images.unsplash.com/photo-1522858547137-f1dcec554f55?auto=format&fit=crop&w=600&q=80",
    location: "Gulshan, Dhaka",
    timeAgo: "2 days ago",
    store: {
      id: "vet-care-direct",
      name: "Avian Healthcare BD",
      isVerified: true,
      slug: "avian-healthcare-bd",
    },
    seller: {
      id: "u-6",
      name: "Ishita A.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      rating: 4.9,
      reviewCount: 20,
      isStore: true,
    },
  },
  {
    id: "item-7",
    title: "Assorted Toys Bundle",
    petType: "birds",
    breed: "budgie",
    category: "toys",
    price: 900,
    currencySymbol: "৳",
    badge: "Like New",
    badgeVariant: "green",
    condition: "Like New",
    listingType: "for-sale",
    isLivePet: false,
    image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=600&q=80",
    location: "Banani, Dhaka",
    timeAgo: "3 days ago",
    store: {
      id: "parrot-playhouse",
      name: "Parrot Playhouse BD",
      isVerified: true,
      slug: "parrot-playhouse-bd",
    },
    seller: {
      id: "u-7",
      name: "Mehvish C.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      rating: 4.8,
      reviewCount: 9,
      isStore: true,
    },
  },
  {
    id: "item-8",
    title: "Budgie Nest Box",
    petType: "birds",
    breed: "budgie",
    category: "nesting",
    price: 450,
    currencySymbol: "৳",
    badge: "For Sale",
    badgeVariant: "coral",
    condition: "New",
    listingType: "for-sale",
    isLivePet: false,
    image: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=600&q=80",
    location: "Mirpur, Dhaka",
    timeAgo: "3 days ago",
    seller: {
      id: "u-8",
      name: "Kazi N.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      rating: 4.7,
      reviewCount: 11,
      isStore: false,
    },
  },

  // ROW 3
  {
    id: "item-9",
    title: "Perch Set (Natural Wood)",
    petType: "birds",
    breed: "budgie",
    category: "perches",
    price: 350,
    currencySymbol: "৳",
    badge: "For Sale",
    badgeVariant: "coral",
    condition: "Good",
    listingType: "for-sale",
    isLivePet: false,
    image: "https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?auto=format&fit=crop&w=600&q=80",
    location: "Uttara, Dhaka",
    timeAgo: "4 days ago",
    seller: {
      id: "u-9",
      name: "Samiha T.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      rating: 4.9,
      reviewCount: 7,
      isStore: false,
    },
  },
  {
    id: "item-10",
    title: "Cage Cover (Medium)",
    petType: "birds",
    breed: "budgie",
    category: "cages",
    price: 500,
    currencySymbol: "৳",
    badge: "Like New",
    badgeVariant: "yellow",
    condition: "Like New",
    listingType: "for-sale",
    isLivePet: false,
    image: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?auto=format&fit=crop&w=600&q=80",
    location: "Dhanmondi, Dhaka",
    timeAgo: "4 days ago",
    seller: {
      id: "u-10",
      name: "Arman K.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      rating: 4.6,
      reviewCount: 6,
      isStore: false,
    },
  },
  {
    id: "item-11",
    title: "Budgie Treat Sticks (Sealed)",
    petType: "birds",
    breed: "budgie",
    category: "food",
    price: 300,
    currencySymbol: "৳",
    badge: "For Sale",
    badgeVariant: "coral",
    condition: "New",
    listingType: "for-sale",
    isLivePet: false,
    image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80",
    location: "Wari, Dhaka",
    timeAgo: "5 days ago",
    store: {
      id: "avian-nest-shop",
      name: "Avian Nest BD",
      isVerified: true,
      slug: "avian-nest-bd",
    },
    seller: {
      id: "u-11",
      name: "Jannat F.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      rating: 4.8,
      reviewCount: 14,
      isStore: true,
    },
  },
  {
    id: "item-12",
    title: "Cleaning Kit for Cage",
    petType: "birds",
    breed: "budgie",
    category: "cleaning",
    price: 0,
    isFree: true,
    currencySymbol: "৳",
    badge: "Free",
    badgeVariant: "green",
    condition: "Good",
    listingType: "free",
    isLivePet: false,
    image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=600&q=80",
    location: "Mohammadpur, Dhaka",
    timeAgo: "6 days ago",
    seller: {
      id: "u-12",
      name: "Fatema L.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      rating: 4.9,
      reviewCount: 18,
      isStore: false,
    },
  },
];
