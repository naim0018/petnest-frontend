export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface CategoryFaqConfig {
  title: string;
  subtitle: string;
  cardImage: string;
  cardImageAlt: string;
  mascotImage?: string;
  mascotAlt?: string;
  bgGradient: string;
  bubbleColor: string;
  blendOverlayClass: string;
}

export const CATEGORY_FAQ_CONFIG: Record<string, CategoryFaqConfig> = {
  birds: {
    title: "Common Questions",
    subtitle: "Quick answers to help you right away.",
    cardImage: "/CareGuideCard/budgie-care-guide-bg.png",
    cardImageAlt: "Pet bird FAQ guide",
    mascotImage: "/CareGuideCard/budgie-faq-mascot.png",
    mascotAlt: "Cute Budgie mascot",
    bgGradient: "bg-[#eaf6ef] dark:bg-[#12241b]",
    bubbleColor: "bg-[#c6ebd7]/60 dark:bg-[#1f4230]/40",
    blendOverlayClass: "bg-linear-to-r from-[#eef9f2] via-[#eef9f2]/95 via-35% sm:via-[#eef9f2]/85 sm:via-45% md:via-[#eef9f2]/60 md:via-55% to-transparent dark:from-[#11231a] dark:via-[#11231a]/95 dark:via-35% sm:dark:via-[#11231a]/85 sm:dark:via-45% md:dark:via-[#11231a]/60 md:dark:via-55% dark:to-transparent",
  },
  dogs: {
    title: "Puppy & Dog Questions",
    subtitle: "Everyday health, feeding, and training advice.",
    cardImage: "/CareGuideCard/dog-care-guide-bg.png",
    cardImageAlt: "Dog FAQ guide",
    mascotImage: "/CareGuideCard/dog-faq-mascot.png",
    mascotAlt: "Cute puppy mascot",
    bgGradient: "bg-[#fff8ea] dark:bg-[#231a10]",
    bubbleColor: "bg-[#ffe0b2]/50 dark:bg-[#4d3b24]/40",
    blendOverlayClass: "bg-linear-to-r from-[#fff9eb] via-[#fff9eb]/95 via-35% sm:via-[#fff9eb]/85 sm:via-45% md:via-[#fff9eb]/60 md:via-55% to-transparent dark:from-[#251e13] dark:via-[#251e13]/95 dark:via-35% sm:dark:via-[#251e13]/85 sm:dark:via-45% md:dark:via-[#251e13]/60 md:dark:via-55% dark:to-transparent",
  },
  cats: {
    title: "Cat & Kitten Questions",
    subtitle: "Litter, enrichment, and feline nutritional answers.",
    cardImage: "/CareGuideCard/cat-care-guide-bg.png",
    cardImageAlt: "Cat FAQ guide",
    mascotImage: "/CareGuideCard/cat-faq-mascot.png",
    mascotAlt: "Cute cat mascot",
    bgGradient: "bg-[#fbf7f4] dark:bg-[#221c19]",
    bubbleColor: "bg-[#e8d5c4]/40 dark:bg-[#42332c]/40",
    blendOverlayClass: "bg-linear-to-r from-[#fbf8f5] via-[#fbf8f5]/95 via-35% sm:via-[#fbf8f5]/85 sm:via-45% md:via-[#fbf8f5]/60 md:via-55% to-transparent dark:from-[#221c1a] dark:via-[#221c1a]/95 dark:via-35% sm:dark:via-[#221c1a]/85 sm:dark:via-45% md:dark:via-[#221c1a]/60 md:dark:via-55% dark:to-transparent",
  },
  "small-pets": {
    title: "Small Pets Questions",
    subtitle: "Hamster, rabbit, and pocket pet care guidance.",
    cardImage: "/CareGuide/featured/smallpet-guide.jpg",
    cardImageAlt: "Small pets FAQ guide",
    mascotImage: "/CareGuideCard/hamster-faq-mascot.png",
    mascotAlt: "Cute hamster mascot",
    bgGradient: "bg-[#fff5e9] dark:bg-[#241a12]",
    bubbleColor: "bg-[#ffcc80]/40 dark:bg-[#4f3621]/40",
    blendOverlayClass: "bg-linear-to-r from-[#fff3e0] via-[#fff3e0]/95 via-35% sm:via-[#fff3e0]/85 sm:via-45% md:via-[#fff3e0]/60 md:via-55% to-transparent dark:from-[#261d14] dark:via-[#261d14]/95 dark:via-35% sm:dark:via-[#261d14]/85 sm:dark:via-45% md:dark:via-[#261d14]/60 md:dark:via-55% dark:to-transparent",
  },
  aquatic: {
    title: "Aquarium & Fish Questions",
    subtitle: "Tank cycling, water quality, and tropical fish health.",
    cardImage: "/CareGuideCard/aquatic-care-guide-bg.png",
    cardImageAlt: "Aquatic FAQ guide",
    mascotImage: "/CareGuideCard/aquatic-faq-mascot.png",
    mascotAlt: "Betta fish mascot",
    bgGradient: "bg-[#eaf5fc] dark:bg-[#112330]",
    bubbleColor: "bg-[#81d4fa]/35 dark:bg-[#1a4057]/40",
    blendOverlayClass: "bg-linear-to-r from-[#e1f5fe] via-[#e1f5fe]/95 via-35% sm:via-[#e1f5fe]/85 sm:via-45% md:via-[#e1f5fe]/60 md:via-55% to-transparent dark:from-[#112431] dark:via-[#112431]/95 dark:via-35% sm:dark:via-[#112431]/85 sm:dark:via-45% md:dark:via-[#112431]/60 md:dark:via-55% dark:to-transparent",
  },
  reptiles: {
    title: "Reptile & Terrarium Questions",
    subtitle: "Heat gradients, UVB lighting, and feeding tips.",
    cardImage: "/CareGuide/featured/reptile-guide.jpg",
    cardImageAlt: "Reptile FAQ guide",
    mascotImage: "/CareGuideCard/reptile-faq-mascot.png",
    mascotAlt: "Cute chameleon mascot",
    bgGradient: "bg-[#f2f8ee] dark:bg-[#162512]",
    bubbleColor: "bg-[#c5e1a5]/40 dark:bg-[#284221]/40",
    blendOverlayClass: "bg-linear-to-r from-[#f1f8e9] via-[#f1f8e9]/95 via-35% sm:via-[#f1f8e9]/85 sm:via-45% md:via-[#f1f8e9]/60 md:via-55% to-transparent dark:from-[#172613] dark:via-[#172613]/95 dark:via-35% sm:dark:via-[#172613]/85 sm:dark:via-45% md:dark:via-[#172613]/60 md:dark:via-55% dark:to-transparent",
  },
};

export const CATEGORY_FAQS_MAP: Record<string, FAQItem[]> = {
  birds: [
    {
      id: "b-1",
      question: "Can budgies eat bananas?",
      answer:
        "Yes! Bananas are safe and healthy for budgies in moderation. They provide potassium and vitamins, but offer small slices as a treat due to natural sugars.",
    },
    {
      id: "b-2",
      question: "How often should I clean the cage?",
      answer:
        "Spot clean droppings and replace cage liner paper daily. Deep clean perches, food dishes, and the whole cage once a week with bird-safe disinfectant.",
    },
    {
      id: "b-3",
      question: "Why is my budgie puffing up?",
      answer:
        "Budgies puff feathers to stay warm, relax, or sleep. However, if puffing is accompanied by lethargy, sitting at the bottom of the cage, or tail bobbing, contact an avian vet promptly.",
    },
    {
      id: "b-4",
      question: "How much should a budgie eat daily?",
      answer:
        "A budgie typically eats about 1.5 to 2 teaspoons of high-quality fortified seeds or pellets daily, alongside daily fresh dark leafy greens and clean water.",
    },
  ],
  dogs: [
    {
      id: "d-1",
      question: "How often should I walk my adult dog?",
      answer:
        "Most adult dogs need 30 to 60 minutes of daily exercise split into 2 walks, depending on breed energy levels, weather, and overall mobility.",
    },
    {
      id: "d-2",
      question: "When should puppies get their core vaccines?",
      answer:
        "Puppies typically start core shots (DHPP/DA2PP) at 6–8 weeks old, receiving booster shots every 3–4 weeks until roughly 16 weeks of age.",
    },
    {
      id: "d-3",
      question: "What foods are dangerous or toxic for dogs?",
      answer:
        "Chocolate, grapes, raisins, onions, garlic, macadamia nuts, xylitol (artificial sweetener), and cooked bones are strictly hazardous to dogs.",
    },
    {
      id: "d-4",
      question: "How can I prevent separation anxiety in puppies?",
      answer:
        "Practice short, positive departures early on, provide high-value chew toys or lick mats, avoid dramatic goodbyes, and maintain a predictable daily routine.",
    },
  ],
  cats: [
    {
      id: "c-1",
      question: "Why does my cat drink water only from running taps?",
      answer:
        "Cats possess an instinctual preference for fresh running water over still bowls, which they associate with stagnant water. A pet water fountain solves this.",
    },
    {
      id: "c-2",
      question: "How many litter boxes do I need?",
      answer:
        "The golden veterinary rule is 'n + 1': one litter box per cat in the household plus one extra, distributed across different floors or quiet areas.",
    },
    {
      id: "c-3",
      question: "Can cats eat wet and dry food together?",
      answer:
        "Yes! A mix of high-protein wet food helps kidney hydration while dental dry kibble offers caloric density and crunch.",
    },
    {
      id: "c-4",
      question: "How do I stop my kitten from scratching the furniture?",
      answer:
        "Place sturdy sisal scratch posts right next to targeted sofa corners, praise them for using the post, and use pet-safe deterring double-sided tape.",
    },
  ],
  "small-pets": [
    {
      id: "s-1",
      question: "Can rabbits live solely on commercial pellets?",
      answer:
        "No. 80-85% of a rabbit's daily diet must be unlimited clean Timothy hay to maintain crucial gastrointestinal motility and prevent dental spurs.",
    },
    {
      id: "s-2",
      question: "Is cedar or pine wood bedding safe for hamsters?",
      answer:
        "No. Cedar and softwood shavings emit aromatic hydrocarbons (phenols) that irritate small pets' delicate respiratory tracts. Use aspen or unscented paper bedding.",
    },
    {
      id: "s-3",
      question: "Do guinea pigs need supplemental Vitamin C?",
      answer:
        "Yes! Like humans, guinea pigs cannot synthesize their own Vitamin C. Provide fresh bell peppers and vet-approved stabilized Vitamin C tablets daily.",
    },
    {
      id: "s-4",
      question: "How much space does a Syrian hamster need?",
      answer:
        "Veterinarians recommend a minimum unbroken floor space of 775 sq inches (5000 sq cm) with at least 8-10 inches of bedding for natural burrowing.",
    },
  ],
  aquatic: [
    {
      id: "a-1",
      question: "What is the nitrogen cycle in a fish tank?",
      answer:
        "It is the beneficial bacterial process that converts toxic fish ammonia into nitrite, and then into less harmful nitrate before you add fish.",
    },
    {
      id: "a-2",
      question: "How often should I change aquarium water?",
      answer:
        "Perform a 20% to 25% water change weekly or bi-weekly using a gravel siphon and water conditioner to maintain pristine chemical stability.",
    },
    {
      id: "a-3",
      question: "Can a betta fish comfortably live in a tiny bowl?",
      answer:
        "No. Betta fish require at least 5 gallons with a low-flow filter, an adjustable heater (78-80°F), and live or silk hiding plants.",
    },
    {
      id: "a-4",
      question: "How often and how much should I feed my tropical fish?",
      answer:
        "Feed once or twice daily only as much food as all fish can completely consume within 2 minutes to prevent ammonia spikes from uneaten food.",
    },
  ],
  reptiles: [
    {
      id: "r-1",
      question: "Why do reptiles need both heat and UVB lighting?",
      answer:
        "Reptiles are ectothermic and rely on external heat for digestion, while UVB wavelengths allow their bodies to synthesize Vitamin D3 for calcium absorption.",
    },
    {
      id: "r-2",
      question: "How often do juvenile bearded dragons need calcium dust?",
      answer:
        "Juveniles should have feeder insects dusted with pure calcium 4-5 times a week, and calcium with D3/multivitamins 1-2 times weekly.",
    },
    {
      id: "r-3",
      question: "What should I do if my snake refuses to eat?",
      answer:
        "Verify enclosure temperature gradient and humidity levels first. Ensure prey is warm enough, feed at dusk, and avoid handling 24 hours prior to feeding.",
    },
    {
      id: "r-4",
      question: "What humidity is ideal for a crested gecko?",
      answer:
        "Keep ambient humidity around 60–80% with daily misting cycles that allow the enclosure to dry out slightly during the day to prevent mold.",
    },
  ],
};
