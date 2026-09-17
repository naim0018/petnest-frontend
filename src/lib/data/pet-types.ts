export interface PetSubtypeData {
  id: string;
  label: string;
}

export interface PetTypeCategoryData {
  id: string;
  label: string;
  iconName: "PawPrint" | "Dog" | "Cat" | "Bird" | "Rabbit" | "Fish" | "Turtle";
  subtypes: PetSubtypeData[];
}

export const PET_TYPES_DATA: PetTypeCategoryData[] = [
  {
    id: "all",
    label: "All Pets",
    iconName: "PawPrint",
    subtypes: [],
  },
  {
    id: "birds",
    label: "Birds",
    iconName: "Bird",
    subtypes: [
      { id: "all", label: "All Birds" },
      { id: "budgie", label: "Budgerigar (Budgie)" },
      { id: "cockatiel", label: "Cockatiel" },
      { id: "macaw", label: "Macaw" },
      { id: "parrot", label: "Parrot" },
      { id: "canary", label: "Canary" },
      { id: "lovebird", label: "Lovebird" },
      { id: "finch", label: "Finch" },
      { id: "cockatoo", label: "Cockatoo" },
      { id: "conure", label: "Conure" },
      { id: "african-grey", label: "African Grey" },
      { id: "dove", label: "Pigeon & Dove" },
    ],
  },
  {
    id: "dogs",
    label: "Dogs",
    iconName: "Dog",
    subtypes: [
      { id: "all", label: "All Dogs" },
      { id: "golden-retriever", label: "Golden Retriever" },
      { id: "french-bulldog", label: "French Bulldog" },
      { id: "german-shepherd", label: "German Shepherd" },
      { id: "labrador", label: "Labrador Retriever" },
      { id: "poodle", label: "Poodle" },
      { id: "husky", label: "Siberian Husky" },
      { id: "beagle", label: "Beagle" },
      { id: "corgi", label: "Corgi" },
      { id: "pomeranian", label: "Pomeranian" },
      { id: "dachshund", label: "Dachshund" },
      { id: "rottweiler", label: "Rottweiler" },
      { id: "shih-tzu", label: "Shih Tzu" },
    ],
  },
  {
    id: "cats",
    label: "Cats",
    iconName: "Cat",
    subtypes: [
      { id: "all", label: "All Cats" },
      { id: "persian", label: "Persian" },
      { id: "maine-coon", label: "Maine Coon" },
      { id: "siamese", label: "Siamese" },
      { id: "british-shorthair", label: "British Shorthair" },
      { id: "bengal", label: "Bengal" },
      { id: "ragdoll", label: "Ragdoll" },
      { id: "scottish-fold", label: "Scottish Fold" },
      { id: "sphynx", label: "Sphynx" },
      { id: "calico", label: "Calico" },
      { id: "russian-blue", label: "Russian Blue" },
    ],
  },
  {
    id: "small-pets",
    label: "Small Pets",
    iconName: "Rabbit",
    subtypes: [
      { id: "all", label: "All Small Pets" },
      { id: "holland-lop", label: "Holland Lop Bunny" },
      { id: "netherland-dwarf", label: "Netherland Dwarf" },
      { id: "syrian-hamster", label: "Syrian Hamster" },
      { id: "dwarf-hamster", label: "Dwarf Hamster" },
      { id: "guinea-pig", label: "Guinea Pig" },
      { id: "chinchilla", label: "Chinchilla" },
      { id: "ferret", label: "Ferret" },
      { id: "hedgehog", label: "Hedgehog" },
    ],
  },
  {
    id: "aquatic",
    label: "Aquatic",
    iconName: "Fish",
    subtypes: [
      { id: "all", label: "All Aquatic" },
      { id: "betta", label: "Betta Fish" },
      { id: "goldfish", label: "Fancy Goldfish" },
      { id: "guppies", label: "Guppies" },
      { id: "angelfish", label: "Angelfish" },
      { id: "tetras", label: "Neon Tetras" },
      { id: "cichlids", label: "Cichlids" },
      { id: "discus", label: "Discus" },
      { id: "clownfish", label: "Clownfish" },
      { id: "axolotl", label: "Axolotl" },
    ],
  },
  {
    id: "reptiles",
    label: "Reptiles",
    iconName: "Turtle",
    subtypes: [
      { id: "all", label: "All Reptiles" },
      { id: "bearded-dragon", label: "Bearded Dragon" },
      { id: "leopard-gecko", label: "Leopard Gecko" },
      { id: "crested-gecko", label: "Crested Gecko" },
      { id: "ball-python", label: "Ball Python" },
      { id: "chameleon", label: "Chameleon" },
      { id: "turtle", label: "Red-Eared Slider Turtle" },
      { id: "tortoise", label: "Russian Tortoise" },
    ],
  },
];
