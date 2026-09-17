export interface FeedPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  petBadge: string;
  timeAgo: string;
  location: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
  category?: "community" | "updates" | "guides" | "adoption" | "marketplace";
  petType?: "dogs" | "cats" | "birds" | "small-pets" | "aquatic" | "reptiles" | string;
  petBreed?: string;
}

export interface Club {
  id: string;
  name: string;
  members: number;
  category: string;
  image: string;
  description: string;
}

export interface Guide {
  id: string;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  author: string;
  image: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  featured?: boolean;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  inStock: boolean;
}

export interface AdoptablePet {
  id: string;
  slug: string;
  name: string;
  species: "Dog" | "Cat";
  breed: string;
  age: string;
  gender: "Male" | "Female";
  location: string;
  image: string;
  description: string;
  traits: string[];
  shelterName: string;
}

export interface Shelter {
  id: string;
  name: string;
  location: string;
  image: string;
  rescuedCount: number;
  availableCount: number;
  phone: string;
  email: string;
  verified: boolean;
}

export const feedPosts: FeedPost[] = [
  // 1. Community Posts
  {
    id: "post-1",
    authorName: "Sarah Jenkins",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    petBadge: "Golden Retriever Mom",
    timeAgo: "25 mins ago",
    location: "Austin, TX",
    content: "Milo had his first beach day today! He was a bit scared of the waves at first, but now we can't get him out of the water! 🌊🐾 Any tips for washing out sand from double coats?",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
    likes: 142,
    comments: 28,
    shares: 9,
    tags: ["GoldenRetriever", "BeachDay", "DogCare"],
    category: "community",
    petType: "dogs",
    petBreed: "golden-retriever",
  },
  {
    id: "post-c2",
    authorName: "Marcus Vance",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    petBadge: "Avian Enthusiast",
    timeAgo: "45 mins ago",
    location: "San Diego, CA",
    content: "Rio the Sun Conure mastered his first target training session today! 🦜✨ Flighted recall indoors has been such an incredible bonding experience. What foraging toys do your parrots love most?",
    image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80",
    likes: 218,
    comments: 34,
    shares: 14,
    tags: ["ParrotLife", "SunConure", "AvianCare", "BirdTraining"],
    category: "community",
    petType: "birds",
    petBreed: "conure",
  },
  {
    id: "post-c3",
    authorName: "Jessica Wong",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    petBadge: "Community Organizer",
    timeAgo: "1 hour ago",
    location: "Central Park, NY",
    content: "Who is joining our Saturday Morning Pet Parents Meetup? We are gathering near the Great Lawn at 10 AM! Homemade organic peanut butter treats for every good boy and girl. 🐕☕",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
    likes: 312,
    comments: 57,
    shares: 23,
    tags: ["NYCPets", "DogMeetup", "PetCommunity"],
    category: "community",
    petType: "dogs",
    petBreed: "all",
  },
  {
    id: "post-b1",
    authorName: "Aaliyah Brooks",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    petBadge: "Cockatiel Mom",
    timeAgo: "1 hour ago",
    location: "Miami, FL",
    content: "Sunny the Cockatiel learned to whistle the Addams Family theme song! 🎵 Watching his little crest pop up when he reaches the chorus is the cutest thing ever.",
    image: "https://images.unsplash.com/photo-1522858547137-f1dcec554f55?auto=format&fit=crop&w=800&q=80",
    likes: 342,
    comments: 48,
    shares: 22,
    tags: ["Cockatiel", "BirdSongs", "AvianLife"],
    category: "community",
    petType: "birds",
    petBreed: "cockatiel",
  },
  {
    id: "post-b2",
    authorName: "Liam O'Connor",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    petBadge: "Budgie Keeper",
    timeAgo: "2 hours ago",
    location: "Seattle, WA",
    content: "Meet Pippin & Kiwi, my two Budgerigars (Budgies)! They spent 20 minutes playing in a shallow plate of wet romaine lettuce this morning. 🥬🦜 Budgie bath time is unbeatable!",
    image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80",
    likes: 284,
    comments: 31,
    shares: 17,
    tags: ["Budgies", "Parakeet", "FeatheredFriends"],
    category: "community",
    petType: "birds",
    petBreed: "budgie",
  },
  {
    id: "post-b3",
    authorName: "Carlos Mendez",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    petBadge: "Macaw Sanctuary",
    timeAgo: "3 hours ago",
    location: "Orlando, FL",
    content: "Blue & Gold Macaw 'Koa' spreading his wings during free-flight training in the outdoor aviary! Wingspan of over 3.5 feet of pure majestic beauty. 💙💛",
    image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80",
    likes: 512,
    comments: 69,
    shares: 45,
    tags: ["Macaw", "ExoticBirds", "FreeFlight"],
    category: "community",
    petType: "birds",
    petBreed: "macaw",
  },

  // 2. Pet Updates
  {
    id: "post-u1",
    authorName: "Emily Vance",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    petBadge: "Cat Parent",
    timeAgo: "1 hour ago",
    location: "Portland, OR",
    content: "Luna found the warmest patch of afternoon sun on the living room rug. Moments like this melt all the weekday stress away. Share your pet's favorite sleeping pose! 🐱💤",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
    likes: 384,
    comments: 42,
    shares: 21,
    tags: ["CatNap", "SunbeamLover", "PetMoments"],
    category: "updates",
    petType: "cats",
    petBreed: "british-shorthair",
  },
  {
    id: "post-u2",
    authorName: "Chloe Miller",
    authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    petBadge: "Bunny Whisperer",
    timeAgo: "3 hours ago",
    location: "Denver, CO",
    content: "Barnaby the Holland Lop doing full binkies across the hardwood floor! Fresh orchard hay and apple orchard chew sticks are definitely his favorite treats. 🐰🌾",
    image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80",
    likes: 245,
    comments: 31,
    shares: 18,
    tags: ["HollandLop", "BunnyBinkies", "RabbitCare"],
    category: "updates",
    petType: "small-pets",
    petBreed: "holland-lop",
  },
  {
    id: "post-u3",
    authorName: "Tyler Adams",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    petBadge: "Proud Dog Dad",
    timeAgo: "4 hours ago",
    location: "Seattle, WA",
    content: "Oliver officially graduated from Puppy Kindergarten with top marks in 'Leave It' and 'Stay'! Look at his little graduation collar. Time flies so fast! 🎓🐶",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
    likes: 462,
    comments: 63,
    shares: 29,
    tags: ["CorgiLife", "PuppyGraduation", "ProudParent"],
    category: "updates",
    petType: "dogs",
    petBreed: "corgi",
  },

  // 3. Recommended Guides
  {
    id: "post-3",
    authorName: "Elena Rostova",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    petBadge: "Certified Vet Tech",
    timeAgo: "5 hours ago",
    location: "Chicago, IL",
    content: "💡 Vet Tip Tuesday: Dental health is vital for senior pets. Over 80% of dogs and cats over age 3 show signs of active periodontal disease. Remember to brush daily or use vet-approved enzymatic chews!",
    image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80",
    likes: 412,
    comments: 67,
    shares: 88,
    tags: ["VetTips", "DogHealth", "PetWellness", "VetAdvice"],
    category: "guides",
  },
  {
    id: "post-g2",
    authorName: "Dr. Emily Watson",
    authorAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80",
    petBadge: "DVM, Lead Vet",
    timeAgo: "6 hours ago",
    location: "Boston, MA",
    content: "📘 Essential Guide: Puppy Vaccination Schedules simplified. Core vaccines like DHPP and Rabies require precise intervals to build active maternal antibody independence. Don't skip boosters!",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
    likes: 520,
    comments: 83,
    shares: 114,
    tags: ["PuppyCare", "VaccinationGuide", "VetApproved"],
    category: "guides",
  },
  {
    id: "post-g3",
    authorName: "Dr. Nathan Cole",
    authorAvatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=150&q=80",
    petBadge: "Avian & Exotic Vet",
    timeAgo: "8 hours ago",
    location: "San Francisco, CA",
    content: "⚠️ Bird Safety Alert: Non-stick cookware emitting PTFE/Teflon fumes is fatal to birds within minutes. Ensure your kitchen is Teflon-free and keep air purifiers running in avian living spaces.",
    image: "https://images.unsplash.com/photo-1522858547137-f1dcec554f55?auto=format&fit=crop&w=800&q=80",
    likes: 388,
    comments: 49,
    shares: 95,
    tags: ["BirdCare", "PetSafety", "AvianHealth"],
    category: "guides",
  },

  // 4. Adoption Updates
  {
    id: "post-2",
    authorName: "David Chen",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    petBadge: "Cat Rescue Volunteer",
    timeAgo: "2 hours ago",
    location: "Seattle, WA",
    content: "Adoptable Alert! 🐱 Meet Whiskers, a 6-month-old British Shorthair mix who loves sunbeams and lap cuddles. Fully vaccinated, microchipped, and ready for his forever human!",
    image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80",
    likes: 289,
    comments: 54,
    shares: 41,
    tags: ["AdoptionAlert", "RescueCat", "SeattlePets", "AdoptDontShop"],
    category: "adoption",
  },
  {
    id: "post-a2",
    authorName: "Austin Animal Center",
    authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    petBadge: "Shelter Partner",
    timeAgo: "3 hours ago",
    location: "Austin, TX",
    content: "SUCCESS STORY: Barnaby has been officially adopted! From an abandoned rescue pup to having his own backyard and twin toddlers to protect. Thank you PetNest community for sharing his profile! 🏡❤️",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
    likes: 673,
    comments: 92,
    shares: 76,
    tags: ["GotchaDay", "AdoptionSuccess", "RescueStory"],
    category: "adoption",
  },
  {
    id: "post-a3",
    authorName: "North Texas Pet Rescue",
    authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
    petBadge: "Rescue Coordinator",
    timeAgo: "5 hours ago",
    location: "Dallas, TX",
    content: "URGENT FOSTER NEEDED: Sweet senior hound Buster (age 8) needs a quiet couch for 4 weeks while his medical treatments finish. All vet expenses and food covered by our rescue!",
    image: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=800&q=80",
    likes: 419,
    comments: 58,
    shares: 83,
    tags: ["FosterNeeded", "SeniorPetLove", "RescueNetwork"],
    category: "adoption",
  },

  // 5. Marketplace Updates
  {
    id: "post-m1",
    authorName: "PetNest Marketplace",
    authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    petBadge: "Official Store",
    timeAgo: "2 hours ago",
    location: "Nationwide Shipping",
    content: "🌟 Featured Product: The Orthopedic Memory Foam Pet Bed with waterproof inner lining. Tested and approved by senior dogs with joint stiffness. 20% off for PetNest community members today!",
    image: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=800&q=80",
    likes: 184,
    comments: 29,
    shares: 15,
    tags: ["PetGear", "OrthopedicBed", "MarketplaceDeal"],
    category: "marketplace",
  },
  {
    id: "post-m2",
    authorName: "Samira Patel",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    petBadge: "Verified Buyer",
    timeAgo: "4 hours ago",
    location: "San Jose, CA",
    content: "RESTOCK ALERT! The Interactive Feather Teaser Wand & organic catnip refill set is finally back in stock in the marketplace! My two cats go absolutely wild for this wand. 10/10 recommend. 🪶🐈",
    image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80",
    likes: 226,
    comments: 38,
    shares: 12,
    tags: ["CatToys", "ProductReview", "HappyCats"],
    category: "marketplace",
  },
  {
    id: "post-m3",
    authorName: "PetNest Deals",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    petBadge: "Community Deals",
    timeAgo: "6 hours ago",
    location: "Online",
    content: "🥩 Weekend Special: Buy 2 get 1 free on all freeze-dried raw single-ingredient toppers (Beef Liver, Salmon, Chicken Heart). Perfect for picky eaters and training rewards!",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80",
    likes: 298,
    comments: 44,
    shares: 31,
    tags: ["PetNutrition", "FreezeDriedRaw", "MarketplaceSpecial"],
    category: "marketplace",
  },
];

export const guidesData: Guide[] = [
  {
    id: "g1",
    slug: "puppy-vaccination-schedule-guide",
    title: "Complete Puppy Vaccination Schedule: What Every First-Time Owner Must Know",
    category: "Health & Care",
    readTime: "6 min read",
    author: "Dr. Emily Watson, DVM",
    publishedAt: "2026-09-01",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
    excerpt: "Understand core vs non-core vaccines, recommended timelines for rabies & DHPP, and how to keep your pup safe before full immunity.",
    content: `Vaccinating your puppy is one of the most critical steps in ensuring long-term health and immunity against life-threatening canine viruses. Core vaccines include Canine Parvovirus, Distemper, Adenovirus-2 (Hepatitis), and Rabies.

### Recommended Timeline:
- **6 to 8 Weeks**: First DHPP shot (Distemper, Hepatitis, Parainfluenza, Parvovirus).
- **10 to 12 Weeks**: Second DHPP booster + Leptospirosis/Lyme if recommended by your vet.
- **14 to 16 Weeks**: Final DHPP booster + Rabies vaccine.

### Pre-Vaccination Precautions
Until your puppy has received all three rounds of core vaccines, avoid public dog parks, communal pet stores, and un-vaccinated dogs to prevent exposure to parvovirus.`,
    featured: true,
  },
  {
    id: "g2",
    slug: "teach-new-kitten-simple-cues",
    title: "10 Simple Cues to Teach Your New Kitten in 7 Days",
    category: "Training",
    readTime: "4 min read",
    author: "Marcus Vance",
    publishedAt: "2026-09-05",
    image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=500&q=80",
    excerpt: "Positive reinforcement techniques for clicker training, litter box routine, and target training with young cats.",
    content: `Kittens are naturally curious and highly receptive to reward-based clicker training. Teaching basic recall and target cues builds mental stimulation and strengthens your bond.`,
  },
  {
    id: "g3",
    slug: "raw-vs-grain-inclusive-dog-diets",
    title: "Raw vs Grain-Inclusive Diets: What Veterinary Nutritionists Advise",
    category: "Nutrition",
    readTime: "8 min read",
    author: "Dr. Sarah Lin, PhD",
    publishedAt: "2026-09-08",
    image: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=500&q=80",
    excerpt: "An evidence-based breakdown of macronutrients, FDA dietary guidelines, and choosing kibble vs fresh food for your dog.",
    content: `Navigating canine nutrition requires balancing protein, essential fatty acids, vitamins, and digestible carbohydrates according to AAFCO standards.`,
  },
  {
    id: "g4",
    slug: "summer-heatstroke-prevention-flat-faced-dogs",
    title: "Summer Heatstroke Prevention in Flat-Faced Breeds (Pugs & Bulldogs)",
    category: "Safety & Emergency",
    readTime: "5 min read",
    author: "Dr. Emily Watson, DVM",
    publishedAt: "2026-09-10",
    image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=500&q=80",
    excerpt: "Recognize early panting signs, cooling pad techniques, and emergency steps during hot summer months.",
    content: `Brachycephalic breeds have shortened airways that make regulating body temperature challenging in hot weather. Always provide shade, hydration, and avoid midday exercise.`,
  },
];

export const adoptablePetsData: AdoptablePet[] = [
  {
    id: "pet-1",
    slug: "barnaby-golden-retriever-mix",
    name: "Barnaby",
    species: "Dog",
    breed: "Golden Retriever Mix",
    age: "1.5 Years",
    gender: "Male",
    location: "Austin Rescue Center, TX",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
    description: "Barnaby is a joyful, energetic Golden Retriever mix who loves playing fetch, swimming in lakes, and snuggling on the couch.",
    traits: ["Good with Kids", "Vaccinated", "Neutered"],
    shelterName: "Austin Pet Rescue",
  },
  {
    id: "pet-2",
    slug: "cleo-siamese-mix-cat",
    name: "Cleo",
    species: "Cat",
    breed: "Siamese Mix",
    age: "8 Months",
    gender: "Female",
    location: "Seattle Animal Shelter, WA",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80",
    description: "Cleo is a gentle, affectionate Siamese mix kitten who loves sunbeams, feather wands, and purring on your lap.",
    traits: ["Indoor Only", "Microchipped", "Playful"],
    shelterName: "Seattle Humane",
  },
  {
    id: "pet-3",
    slug: "teddy-corgi-beagle-mix",
    name: "Teddy",
    species: "Dog",
    breed: "Corgi & Beagle Mix",
    age: "2 Years",
    gender: "Male",
    location: "Dallas Paws, TX",
    image: "https://images.unsplash.com/photo-1617895153857-82fe79adfcd4?auto=format&fit=crop&w=600&q=80",
    description: "Teddy is an adorable, low-rider Corgi Beagle mix with a big heart and gentle manners.",
    traits: ["House Trained", "Leash Trained", "Friendly"],
    shelterName: "North Texas Rescue",
  },
  {
    id: "pet-4",
    slug: "luna-calico-shorthair-cat",
    name: "Luna",
    species: "Cat",
    breed: "Calico Short-hair",
    age: "1 Year",
    gender: "Female",
    location: "Austin Rescue Center, TX",
    image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80",
    description: "Luna is a calm, friendly Calico cat looking for a quiet home with lots of love and sunny window sills.",
    traits: ["Lap Cat", "Gentle", "Spayed"],
    shelterName: "Austin Pet Rescue",
  },
];

export const marketplaceProductsData: Product[] = [
  {
    id: "prod-1",
    title: "Premium Grain-Free Salmon & Sweet Potato Kibble (15 lbs)",
    category: "Food & Treats",
    price: 49.99,
    originalPrice: 59.99,
    rating: 4.9,
    reviews: 320,
    image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=500&q=80",
    badge: "Best Seller",
    inStock: true,
  },
  {
    id: "prod-2",
    title: "Orthopedic Memory Foam Pet Bed with Washable Cover (Large)",
    category: "Beds & Furniture",
    price: 79.50,
    rating: 4.8,
    reviews: 185,
    image: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=500&q=80",
    badge: "Top Rated",
    inStock: true,
  },
  {
    id: "prod-3",
    title: "Interactive Feather Teaser Wand & Wand Refills Set",
    category: "Toys & Scratchers",
    price: 14.99,
    originalPrice: 19.99,
    rating: 4.7,
    reviews: 94,
    image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=500&q=80",
    inStock: true,
  },
  {
    id: "prod-4",
    title: "Stainless Steel Automatic Pet Water Fountain (2.5L)",
    category: "Accessories",
    price: 34.99,
    rating: 4.9,
    reviews: 410,
    image: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?auto=format&fit=crop&w=500&q=80",
    badge: "Hot Item",
    inStock: true,
  },
];

export const sheltersData: Shelter[] = [
  {
    id: "shelter-1",
    name: "Austin Humane Society & Rescue Center",
    location: "Austin, TX",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80",
    rescuedCount: 3420,
    availableCount: 48,
    phone: "(512) 555-0192",
    email: "adopt@austinhumane.org",
    verified: true,
  },
  {
    id: "shelter-2",
    name: "Seattle Animal Shelter Alliance",
    location: "Seattle, WA",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80",
    rescuedCount: 2180,
    availableCount: 32,
    phone: "(206) 555-0144",
    email: "info@seattlerescue.org",
    verified: true,
  },
  {
    id: "shelter-3",
    name: "North Texas Pet Rescue Foundation",
    location: "Dallas, TX",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80",
    rescuedCount: 4900,
    availableCount: 64,
    phone: "(214) 555-0188",
    email: "contact@northtexasrescue.org",
    verified: true,
  },
];

// Helper Fetch Functions for Server Components
export async function getFeedPosts(): Promise<FeedPost[]> {
  return feedPosts;
}

export async function getFeedPostById(id: string): Promise<FeedPost | undefined> {
  return feedPosts.find((p) => p.id === id);
}

export async function getGuides(): Promise<Guide[]> {
  return guidesData;
}

export async function getGuideBySlug(slug: string): Promise<Guide | undefined> {
  return guidesData.find((g) => g.slug === slug);
}

export async function getAdoptablePets(): Promise<AdoptablePet[]> {
  return adoptablePetsData;
}

export async function getAdoptablePetBySlug(slug: string): Promise<AdoptablePet | undefined> {
  return adoptablePetsData.find((p) => p.slug === slug);
}

export async function getMarketplaceProducts(): Promise<Product[]> {
  return marketplaceProductsData;
}

export async function getShelters(): Promise<Shelter[]> {
  return sheltersData;
}
