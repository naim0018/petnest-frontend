export interface Breed {
  id: string;
  name: string;
  image: string;
  origin?: string;
  size?: "Toy" | "Small" | "Medium" | "Large" | "Giant";
  temperament?: string;
  careLevel?: "Low" | "Moderate" | "High";
}

export interface PetType {
  id: string;
  name: string;
  scientificGroup: string;
  description: string;
  image: string;
  categoryIcon: string;
  breeds: Breed[];
}

export const initialPetCatalogData: PetType[] = [
  {
    id: "dogs",
    name: "Dogs (Canine)",
    scientificGroup: "Canis lupus familiaris",
    description: "Loyal companions known for high intelligence, protective instincts, and playful devotion.",
    image: "/CareGuideCard/dog-faq-mascot.png",
    categoryIcon: "/CareGuide/categories/dog.png",
    breeds: [
      { id: "dog-1", name: "Golden Retriever", image: "/CareGuide/breeds/dogs/golden-retriever.jpg", origin: "Scotland, UK", size: "Large", temperament: "Friendly, Intelligent, Devoted", careLevel: "Moderate" },
      { id: "dog-2", name: "French Bulldog", image: "/CareGuide/breeds/dogs/french-bulldog.jpg", origin: "France / England", size: "Small", temperament: "Playful, Adaptable, Alert", careLevel: "Moderate" },
      { id: "dog-3", name: "German Shepherd", image: "/CareGuide/breeds/dogs/german-shepherd.jpg", origin: "Germany", size: "Large", temperament: "Confident, Courageous, Smart", careLevel: "High" },
      { id: "dog-4", name: "Siberian Husky", image: "/CareGuide/breeds/dogs/husky.jpg", origin: "Siberia, Russia", size: "Large", temperament: "Energetic, Outgoing, Gentle", careLevel: "High" },
      { id: "dog-5", name: "Welsh Corgi", image: "/CareGuide/breeds/dogs/corgi.jpg", origin: "Wales, UK", size: "Small", temperament: "Affectionate, Alert, Smart", careLevel: "Moderate" },
      { id: "dog-6", name: "Beagle", image: "/CareGuide/breeds/dogs/beagle.jpg", origin: "United Kingdom", size: "Small", temperament: "Curious, Merry, Friendly", careLevel: "Moderate" },
      { id: "dog-7", name: "Pomeranian", image: "/CareGuide/breeds/dogs/pomeranian.jpg", origin: "Germany / Poland", size: "Toy", temperament: "Lively, Bold, Inquisitive", careLevel: "Moderate" },
      { id: "dog-8", name: "Labrador Retriever", image: "/CareGuide/breeds/dogs/labrador.jpg", origin: "Canada", size: "Large", temperament: "Active, Friendly, Gentle", careLevel: "Moderate" },
      { id: "dog-9", name: "Poodle", image: "/CareGuide/breeds/dogs/poodle.jpg", origin: "Germany / France", size: "Medium", temperament: "Intelligent, Active, Alert", careLevel: "Moderate" },
      { id: "dog-10", name: "Rottweiler", image: "/CareGuide/breeds/dogs/rottweiler.jpg", origin: "Germany", size: "Large", temperament: "Loyal, Loving, Confident", careLevel: "Moderate" },
    ],
  },
  {
    id: "cats",
    name: "Cats (Feline)",
    scientificGroup: "Felis catus",
    description: "Independent, graceful companions with curious personalities and gentle purring affection.",
    image: "/CareGuideCard/cat-faq-mascot.png",
    categoryIcon: "/CareGuide/categories/cat.png",
    breeds: [
      { id: "cat-1", name: "Maine Coon", image: "/CareGuide/breeds/cats/maine-coon.jpg", origin: "United States (Maine)", size: "Large", temperament: "Gentle giant, playful, sociable", careLevel: "High" },
      { id: "cat-2", name: "British Shorthair", image: "/CareGuide/breeds/cats/british-shorthair.jpg", origin: "United Kingdom", size: "Medium", temperament: "Calm, easygoing, quiet", careLevel: "Low" },
      { id: "cat-3", name: "Persian", image: "/CareGuide/breeds/cats/persian.jpg", origin: "Iran (Persia)", size: "Medium", temperament: "Quiet, sweet, dociled", careLevel: "High" },
      { id: "cat-4", name: "Bengal", image: "/CareGuide/breeds/cats/bengal.jpg", origin: "United States", size: "Medium", temperament: "Active, energetic, curious", careLevel: "High" },
      { id: "cat-5", name: "Ragdoll", image: "/CareGuide/breeds/cats/ragdoll.jpg", origin: "United States", size: "Large", temperament: "Placid, affectionate, gentle", careLevel: "Moderate" },
      { id: "cat-6", name: "Scottish Fold", image: "/CareGuide/breeds/cats/scottish-fold.jpg", origin: "Scotland", size: "Medium", temperament: "Sweet, calm, attached", careLevel: "Low" },
      { id: "cat-7", name: "Siamese", image: "/CareGuide/breeds/cats/siamese.jpg", origin: "Thailand", size: "Medium", temperament: "Vocal, affectionate, playful", careLevel: "Moderate" },
      { id: "cat-8", name: "Russian Blue", image: "/CareGuide/breeds/cats/russian-blue.jpg", origin: "Russia", size: "Medium", temperament: "Gentle, quiet, intelligent", careLevel: "Low" },
    ],
  },
  {
    id: "birds",
    name: "Birds (Avian)",
    scientificGroup: "Aves domesticus",
    description: "Vibrant, vocal avian friends with intelligent problem-solving capabilities and social flair.",
    image: "/CareGuideCard/budgie-faq-mascot.png",
    categoryIcon: "/CareGuide/categories/bird.png",
    breeds: [
      { id: "bird-1", name: "Cockatiel", image: "/CareGuide/breeds/birds/cockatiel.jpg", origin: "Australia", size: "Small", temperament: "Vocal, affectionate, curious", careLevel: "Moderate" },
      { id: "bird-2", name: "Budgerigar (Parakeet)", image: "/CareGuide/breeds/birds/budgie.jpg", origin: "Australia", size: "Small", temperament: "Social, cheerful, chatty", careLevel: "Low" },
      { id: "bird-3", name: "African Grey Parrot", image: "/CareGuide/breeds/birds/african-grey.jpg", origin: "Central Africa", size: "Medium", temperament: "Extremely intelligent, vocal", careLevel: "High" },
      { id: "bird-4", name: "Lovebird", image: "/CareGuide/breeds/birds/lovebird.jpg", origin: "Africa", size: "Small", temperament: "Loyal, spirited, playful", careLevel: "Moderate" },
      { id: "bird-5", name: "Canary", image: "/CareGuide/breeds/birds/canary.jpg", origin: "Canary Islands", size: "Small", temperament: "Independent, melodious", careLevel: "Low" },
      { id: "bird-6", name: "Cockatoo", image: "/CareGuide/breeds/birds/cockatoo.jpg", origin: "Australia / Indonesia", size: "Medium", temperament: "Affectionate, loud, intelligent", careLevel: "High" },
    ],
  },
  {
    id: "aquatic",
    name: "Fish & Aquatic",
    scientificGroup: "Actinopterygii",
    description: "Tranquil underwater species that bring serene, colorful biodiversity to aquatic aquariums.",
    image: "/CareGuideCard/aquatic-faq-mascot.png",
    categoryIcon: "/CareGuide/categories/fish.png",
    breeds: [
      { id: "fish-1", name: "Freshwater Angelfish", image: "/CareGuide/breeds/aquatic/angelfish.jpg", origin: "Amazon Basin", size: "Small", temperament: "Peaceful, elegant", careLevel: "Moderate" },
      { id: "fish-2", name: "Siamese Fighting Fish (Betta)", image: "/CareGuide/breeds/aquatic/betta.jpg", origin: "Southeast Asia", size: "Toy", temperament: "Territorial, colorful", careLevel: "Low" },
      { id: "fish-3", name: "Fancy Goldfish", image: "/CareGuide/breeds/aquatic/goldfish.jpg", origin: "East Asia", size: "Small", temperament: "Hardy, calm, active", careLevel: "Low" },
      { id: "fish-4", name: "Fancy Guppies", image: "/CareGuide/breeds/aquatic/guppies.jpg", origin: "South America", size: "Toy", temperament: "Peaceful, active schooling", careLevel: "Low" },
      { id: "fish-5", name: "Clownfish", image: "/CareGuide/breeds/aquatic/clownfish.jpg", origin: "Indo-Pacific", size: "Small", temperament: "Active, symbiotic reef dweller", careLevel: "Moderate" },
    ],
  },
  {
    id: "small-pets",
    name: "Small Pets & Rodents",
    scientificGroup: "Rodentia & Lagomorpha",
    description: "Cute, compact furry companions perfect for family households and cozy habitats.",
    image: "/CareGuideCard/hamster-faq-mascot.png",
    categoryIcon: "/CareGuide/categories/small-pets.png",
    breeds: [
      { id: "sp-1", name: "Holland Lop Rabbit", image: "/CareGuide/breeds/small-pets/holland-lop.jpg", origin: "Netherlands", size: "Small", temperament: "Gentle, friendly, sweet", careLevel: "Moderate" },
      { id: "sp-2", name: "Syrian Hamster", image: "/CareGuide/breeds/small-pets/syrian-hamster.jpg", origin: "Syria", size: "Toy", temperament: "Solitary, nocturnal, clean", careLevel: "Low" },
      { id: "sp-3", name: "Guinea Pig", image: "/CareGuide/breeds/small-pets/guinea-pig.jpg", origin: "Andes, South America", size: "Small", temperament: "Vocal, sociable, gentle", careLevel: "Moderate" },
      { id: "sp-4", name: "Chinchilla", image: "/CareGuide/breeds/small-pets/chinchilla.jpg", origin: "Andes Mountains", size: "Small", temperament: "Energetic, soft, agile", careLevel: "High" },
      { id: "sp-5", name: "Ferret", image: "/CareGuide/breeds/small-pets/ferret.jpg", origin: "Europe", size: "Small", temperament: "Playful, inquisitive, mischievous", careLevel: "High" },
    ],
  },
  {
    id: "reptiles",
    name: "Reptiles & Amphibians",
    scientificGroup: "Reptilia",
    description: "Fascinating cold-blooded creatures featuring unique evolutionary adaptations and calm temperaments.",
    image: "/CareGuideCard/reptile-faq-mascot.png",
    categoryIcon: "/CareGuide/categories/reptile.png",
    breeds: [
      { id: "rep-1", name: "Central Bearded Dragon", image: "/CareGuide/breeds/reptiles/bearded-dragon.jpg", origin: "Australia", size: "Medium", temperament: "Docile, curious, friendly", careLevel: "Moderate" },
      { id: "rep-2", name: "Leopard Gecko", image: "/CareGuide/breeds/reptiles/leopard-gecko.jpg", origin: "Middle East", size: "Small", temperament: "Gentle, nocturnal, easygoing", careLevel: "Low" },
      { id: "rep-3", name: "Veiled Chameleon", image: "/CareGuide/breeds/reptiles/chameleon.jpg", origin: "Yemen / Saudi Arabia", size: "Small", temperament: "Quiet, solitary, observant", careLevel: "High" },
      { id: "rep-4", name: "Box Turtle", image: "/CareGuide/breeds/reptiles/turtle.jpg", origin: "North America", size: "Small", temperament: "Calm, long-lived, gentle", careLevel: "Moderate" },
    ],
  },
];
