export interface BreedItem {
  id: string;
  label: string;
  image: string;
}

export interface PetCategoryItem {
  id: string;
  label: string;
  image: string;
  breeds: BreedItem[];
}

export const ALL_PETS_CATEGORY: PetCategoryItem = {
  id: "all",
  label: "All Pets",
  image: "/CareGuide/categories/dog.png",
  breeds: [],
};

export const PET_CATEGORIES_WITH_BREEDS: PetCategoryItem[] = [
  {
    id: "dogs",
    label: "Dogs",
    image: "/CareGuide/categories/dog.png",
    breeds: [
      { id: "all", label: "All Dogs", image: "/CareGuide/categories/dog.png" },
      { id: "golden-retriever", label: "Golden Retriever", image: "/CareGuide/breeds/dogs/golden-retriever.jpg" },
      { id: "french-bulldog", label: "French Bulldog", image: "/CareGuide/breeds/dogs/french-bulldog.jpg" },
      { id: "german-shepherd", label: "German Shepherd", image: "/CareGuide/breeds/dogs/german-shepherd.jpg" },
      { id: "labrador", label: "Labrador", image: "/CareGuide/breeds/dogs/labrador.jpg" },
      { id: "poodle", label: "Poodle", image: "/CareGuide/breeds/dogs/poodle.jpg" },
      { id: "husky", label: "Siberian Husky", image: "/CareGuide/breeds/dogs/husky.jpg" },
      { id: "beagle", label: "Beagle", image: "/CareGuide/breeds/dogs/beagle.jpg" },
      { id: "corgi", label: "Corgi", image: "/CareGuide/breeds/dogs/corgi.jpg" },
      { id: "pomeranian", label: "Pomeranian", image: "/CareGuide/breeds/dogs/pomeranian.jpg" },
      { id: "dachshund", label: "Dachshund", image: "/CareGuide/breeds/dogs/dachshund.jpg" },
      { id: "rottweiler", label: "Rottweiler", image: "/CareGuide/breeds/dogs/rottweiler.jpg" },
      { id: "shih-tzu", label: "Shih Tzu", image: "/CareGuide/breeds/dogs/shih-tzu.jpg" },
    ],
  },
  {
    id: "cats",
    label: "Cats",
    image: "/CareGuide/categories/cat.png",
    breeds: [
      { id: "all", label: "All Cats", image: "/CareGuide/categories/cat.png" },
      { id: "persian", label: "Persian", image: "/CareGuide/breeds/cats/persian.jpg" },
      { id: "maine-coon", label: "Maine Coon", image: "/CareGuide/breeds/cats/maine-coon.jpg" },
      { id: "siamese", label: "Siamese", image: "/CareGuide/breeds/cats/siamese.jpg" },
      { id: "british-shorthair", label: "British Shorthair", image: "/CareGuide/breeds/cats/british-shorthair.jpg" },
      { id: "bengal", label: "Bengal", image: "/CareGuide/breeds/cats/bengal.jpg" },
      { id: "ragdoll", label: "Ragdoll", image: "/CareGuide/breeds/cats/ragdoll.jpg" },
      { id: "scottish-fold", label: "Scottish Fold", image: "/CareGuide/breeds/cats/scottish-fold.jpg" },
      { id: "sphynx", label: "Sphynx", image: "/CareGuide/breeds/cats/sphynx.jpg" },
      { id: "calico", label: "Calico", image: "/CareGuide/breeds/cats/calico.jpg" },
      { id: "russian-blue", label: "Russian Blue", image: "/CareGuide/breeds/cats/russian-blue.jpg" },
    ],
  },
  {
    id: "birds",
    label: "Birds",
    image: "/CareGuide/categories/bird.png",
    breeds: [
      { id: "all", label: "All Birds", image: "/CareGuide/categories/bird.png" },
      { id: "budgie", label: "Budgerigar (Budgie)", image: "/CareGuide/breeds/birds/budgie.jpg" },
      { id: "cockatiel", label: "Cockatiel", image: "/CareGuide/breeds/birds/cockatiel.jpg" },
      { id: "macaw", label: "Scarlet Macaw", image: "/CareGuide/breeds/birds/macaw.jpg" },
      { id: "parrot", label: "Ringneck Parrot", image: "/CareGuide/breeds/birds/parrot.jpg" },
      { id: "conure", label: "Sun Conure", image: "/CareGuide/breeds/birds/conure.jpg" },
      { id: "green-cheeked-conure", label: "Green Cheek Conure", image: "/CareGuide/breeds/birds/green-cheeked-conure.jpg" },
      { id: "african-grey", label: "African Grey", image: "/CareGuide/breeds/birds/african-grey.jpg" },
      { id: "cockatoo", label: "Cockatoo", image: "/CareGuide/breeds/birds/cockatoo.jpg" },
      { id: "lovebird", label: "Lovebird", image: "/CareGuide/breeds/birds/lovebird.jpg" },
      { id: "canary", label: "Canary", image: "/CareGuide/breeds/birds/canary.jpg" },
      { id: "finch", label: "Gouldian Finch", image: "/CareGuide/breeds/birds/finch.jpg" },
      { id: "dove", label: "Diamond Dove", image: "/CareGuide/breeds/birds/dove.jpg" },
    ],
  },
  {
    id: "small-pets",
    label: "Small Pets",
    image: "/CareGuide/categories/rabbit.png",
    breeds: [
      { id: "all", label: "All Small Pets", image: "/CareGuide/categories/rabbit.png" },
      { id: "holland-lop", label: "Holland Lop Bunny", image: "/CareGuide/breeds/small-pets/holland-lop.jpg" },
      { id: "netherland-dwarf", label: "Netherland Dwarf", image: "/CareGuide/breeds/small-pets/netherland-dwarf.jpg" },
      { id: "syrian-hamster", label: "Syrian Hamster", image: "/CareGuide/breeds/small-pets/syrian-hamster.jpg" },
      { id: "guinea-pig", label: "Guinea Pig", image: "/CareGuide/breeds/small-pets/guinea-pig.jpg" },
      { id: "chinchilla", label: "Chinchilla", image: "/CareGuide/breeds/small-pets/chinchilla.jpg" },
      { id: "ferret", label: "Ferret", image: "/CareGuide/breeds/small-pets/ferret.jpg" },
      { id: "hedgehog", label: "Hedgehog", image: "/CareGuide/breeds/small-pets/hedgehog.jpg" },
    ],
  },
  {
    id: "aquatic",
    label: "Fish & Aquatic",
    image: "/CareGuide/categories/fish.png",
    breeds: [
      { id: "all", label: "All Aquatic", image: "/CareGuide/categories/fish.png" },
      { id: "betta", label: "Betta Fish", image: "/CareGuide/breeds/aquatic/betta.jpg" },
      { id: "goldfish", label: "Fancy Goldfish", image: "/CareGuide/breeds/aquatic/goldfish.jpg" },
      { id: "guppies", label: "Guppies", image: "/CareGuide/breeds/aquatic/guppies.jpg" },
      { id: "angelfish", label: "Angelfish", image: "/CareGuide/breeds/aquatic/angelfish.jpg" },
      { id: "clownfish", label: "Clownfish", image: "/CareGuide/breeds/aquatic/clownfish.jpg" },
    ],
  },
  {
    id: "reptiles",
    label: "Reptiles",
    image: "/CareGuide/categories/reptile.png",
    breeds: [
      { id: "all", label: "All Reptiles", image: "/CareGuide/categories/reptile.png" },
      { id: "bearded-dragon", label: "Bearded Dragon", image: "/CareGuide/breeds/reptiles/bearded-dragon.jpg" },
      { id: "leopard-gecko", label: "Leopard Gecko", image: "/CareGuide/breeds/reptiles/leopard-gecko.jpg" },
      { id: "chameleon", label: "Chameleon", image: "/CareGuide/breeds/reptiles/chameleon.jpg" },
      { id: "turtle", label: "Pet Turtle", image: "/CareGuide/breeds/reptiles/turtle.jpg" },
    ],
  },
];
