import {
  FolderTree,
  UtensilsCrossed,
  Sparkles,
  Heart,
  Stethoscope,
  ShieldAlert,
  BookOpen,
  Activity,
  Layers,
  Award,
  Clock,
  Smile,
  PawPrint,
  Scissors,
  Syringe,
  Pill,
  Bug,
  Brain,
  Home,
  Plane,
  Thermometer,
  Sun,
  HeartHandshake,
  Droplets,
  AlertTriangle,
  Scale,
  Fish,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

export interface CategoryIconPreset {
  name: string;
  label: string;
  slug: string;
  description: string;
  icon: LucideIcon;
}

export const CATEGORY_ICON_PRESETS: CategoryIconPreset[] = [
  {
    name: "FolderTree",
    label: "General Topic",
    slug: "general-topic",
    description:
      "Essential everyday pet care foundations, practical checklists, and general ownership guides.",
    icon: FolderTree,
  },
  {
    name: "UtensilsCrossed",
    label: "Nutrition & Diet",
    slug: "nutrition-diet",
    description:
      "Balanced meal plans, dietary requirements, feeding schedules, and veterinary nutrition advice.",
    icon: UtensilsCrossed,
  },
  {
    name: "Sparkles",
    label: "Training & Skills",
    slug: "training-skills",
    description:
      "Positive reinforcement training, obedience cues, housebreaking, and skill-building guides.",
    icon: Sparkles,
  },
  {
    name: "Heart",
    label: "Health & Wellness",
    slug: "health-wellness",
    description:
      "Preventive health routines, wellness checkups, vitality signs, and holistic pet care.",
    icon: Heart,
  },
  {
    name: "Stethoscope",
    label: "Clinical & Vet",
    slug: "clinical-vet",
    description:
      "Veterinary diagnostics, medical procedures, chronic condition care, and clinic visit prep.",
    icon: Stethoscope,
  },
  {
    name: "ShieldAlert",
    label: "Emergency & First Aid",
    slug: "emergency-first-aid",
    description:
      "Urgent response steps, triage guidelines, CPR basics, and pet first-aid kit essentials.",
    icon: ShieldAlert,
  },
  {
    name: "BookOpen",
    label: "Guides & Essentials",
    slug: "guides-essentials",
    description:
      "Comprehensive starter handbooks, care pillars, and foundational pet reference manuals.",
    icon: BookOpen,
  },
  {
    name: "Activity",
    label: "Mobility & Exercise",
    slug: "mobility-exercise",
    description:
      "Daily exercise routines, joint health support, physical therapy, and active play plans.",
    icon: Activity,
  },
  {
    name: "Layers",
    label: "Species & Habitat",
    slug: "species-habitat",
    description:
      "Species-specific enclosures, terrariums, bedding, climate control, and habitat enrichment.",
    icon: Layers,
  },
  {
    name: "Award",
    label: "Behavior & Shows",
    slug: "behavior-shows",
    description:
      "Understanding body language, solving behavioral challenges, and show preparation.",
    icon: Award,
  },
  {
    name: "Clock",
    label: "Life Stages & Routine",
    slug: "life-stages-routine",
    description:
      "Daily care schedules, developmental milestones, and age-tailored transitions.",
    icon: Clock,
  },
  {
    name: "Smile",
    label: "Socialization & Mood",
    slug: "socialization-mood",
    description:
      "Confidence building, anxiety relief, multi-pet introductions, and emotional wellbeing.",
    icon: Smile,
  },
  {
    name: "PawPrint",
    label: "Puppy & Kitten Onboarding",
    slug: "puppy-kitten-onboarding",
    description:
      "First-year essentials for welcoming new puppies and kittens home safely and smoothly.",
    icon: PawPrint,
  },
  {
    name: "Scissors",
    label: "Grooming & Hygiene",
    slug: "grooming-hygiene",
    description:
      "Bathing, coat brushing, nail trimming, ear cleaning, and skin hygiene best practices.",
    icon: Scissors,
  },
  {
    name: "Syringe",
    label: "Vaccinations & Preventive",
    slug: "vaccinations-preventive",
    description:
      "Core and lifestyle vaccine schedules, titer testing, and seasonal disease prevention.",
    icon: Syringe,
  },
  {
    name: "Pill",
    label: "Medications & Supplements",
    slug: "medications-supplements",
    description:
      "Safe medication administration, dosage guidance, and evidence-backed pet supplements.",
    icon: Pill,
  },
  {
    name: "Bug",
    label: "Parasite & Flea Control",
    slug: "parasite-flea-control",
    description:
      "Year-round prevention and treatment for fleas, ticks, heartworms, and intestinal parasites.",
    icon: Bug,
  },
  {
    name: "Brain",
    label: "Mental Enrichment",
    slug: "mental-enrichment",
    description:
      "Puzzle feeders, scent work, interactive toys, and cognitive games to prevent boredom.",
    icon: Brain,
  },
  {
    name: "Home",
    label: "Home Proofing & Setup",
    slug: "home-proofing-setup",
    description:
      "Pet-safe home layouts, crate training setups, hazard removal, and cozy resting zones.",
    icon: Home,
  },
  {
    name: "Plane",
    label: "Travel & Boarding",
    slug: "travel-boarding",
    description:
      "Stress-free car rides, airline carrier rules, travel checklists, and boarding preparation.",
    icon: Plane,
  },
  {
    name: "Thermometer",
    label: "Seasonal & Weather Care",
    slug: "seasonal-weather-care",
    description:
      "Summer heatstroke prevention, winter paw protection, and severe weather safety strategies.",
    icon: Thermometer,
  },
  {
    name: "Sun",
    label: "Senior Pet Care",
    slug: "senior-pet-care",
    description:
      "Comfort-focused care, cognitive support, and gentle routines for aging companions.",
    icon: Sun,
  },
  {
    name: "HeartHandshake",
    label: "Adoption & Rescue",
    slug: "adoption-rescue",
    description:
      "Preparing for shelter adoption, decompression periods, and bonding with rescue pets.",
    icon: HeartHandshake,
  },
  {
    name: "Droplets",
    label: "Dental & Coat Care",
    slug: "dental-coat-care",
    description:
      "Toothbrushing techniques, oral hygiene, shedding management, and healthy skin care.",
    icon: Droplets,
  },
  {
    name: "AlertTriangle",
    label: "Toxic Foods & Hazards",
    slug: "toxic-foods-hazards",
    description:
      "Household poisons, toxic plants, unsafe human foods, and accidental ingestion guidance.",
    icon: AlertTriangle,
  },
  {
    name: "Scale",
    label: "Weight & Fitness",
    slug: "weight-fitness",
    description:
      "Body condition scoring, healthy weight management plans, and portion control tips.",
    icon: Scale,
  },
  {
    name: "Fish",
    label: "Aquatics & Exotic Care",
    slug: "aquatics-exotic-care",
    description:
      "Water chemistry, UVB lighting, humidity, and specialized care for birds, reptiles, and fish.",
    icon: Fish,
  },
  {
    name: "ShoppingBag",
    label: "Gear & Supplies",
    slug: "gear-supplies",
    description:
      "Choosing safe harnesses, carriers, bowls, litter boxes, and durable everyday pet gear.",
    icon: ShoppingBag,
  },
];

export const getCategoryIcon = (iconName?: string | null): LucideIcon => {
  if (!iconName) return FolderTree;
  const match = CATEGORY_ICON_PRESETS.find(
    (p) => p.name.toLowerCase() === iconName.toLowerCase()
  );
  return match ? match.icon : FolderTree;
};
