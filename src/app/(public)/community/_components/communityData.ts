export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  badge: "Question" | "Discussion" | "Stories" | "Recommendations";
  timeAgo: string;
  location: string;
  title: string;
  petEmoji?: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  image?: string;
  imageCount?: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface PetTopicItem {
  id: string;
  name: string;
  icon: string;
  bgColor: string;
}

export interface CommunityStat {
  label: string;
  value: string;
  isOnline?: boolean;
}

export interface TrendingTopicItem {
  tag: string;
  count: string;
}

export interface FeaturedMemberItem {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isFollowing?: boolean;
}

export const COMMUNITY_STATS: CommunityStat[] = [
  { label: "Members", value: "12.5K" },
  { label: "Posts", value: "1.2K" },
  { label: "Online", value: "24", isOnline: true },
];

export const PET_TOPICS: PetTopicItem[] = [
  { id: "dogs", name: "Dogs", icon: "🐶", bgColor: "bg-amber-100 dark:bg-amber-950/40 text-amber-600" },
  { id: "cats", name: "Cats", icon: "🐱", bgColor: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600" },
  { id: "birds", name: "Birds", icon: "🦜", bgColor: "bg-cyan-100 dark:bg-cyan-950/40 text-cyan-600" },
  { id: "fish", name: "Fish", icon: "🐠", bgColor: "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600" },
  { id: "small-pets", name: "Small Pets", icon: "🐹", bgColor: "bg-orange-100 dark:bg-orange-950/40 text-orange-600" },
  { id: "reptiles", name: "Reptiles", icon: "🦎", bgColor: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600" },
  { id: "health-vet", name: "Health & Vet", icon: "🩺", bgColor: "bg-blue-100 dark:bg-blue-950/40 text-blue-600" },
  { id: "food-nutrition", name: "Food & Nutrition", icon: "🍲", bgColor: "bg-amber-100 dark:bg-amber-950/40 text-amber-600" },
  { id: "training", name: "Training", icon: "🎾", bgColor: "bg-teal-100 dark:bg-teal-950/40 text-teal-600" },
  { id: "grooming", name: "Grooming", icon: "✂️", bgColor: "bg-pink-100 dark:bg-pink-950/40 text-pink-600" },
  { id: "behavior", name: "Behavior", icon: "🐾", bgColor: "bg-sky-100 dark:bg-sky-950/40 text-sky-600" },
  { id: "adoption", name: "Adoption", icon: "❤️", bgColor: "bg-rose-100 dark:bg-rose-950/40 text-rose-600" },
  { id: "general", name: "General", icon: "✨", bgColor: "bg-amber-100 dark:bg-amber-950/40 text-amber-600" },
];

export const COMMUNITY_TRENDING_TOPICS: TrendingTopicItem[] = [
  { tag: "#PetCareTips", count: "12.5K posts" },
  { tag: "#AdoptionStories", count: "8.2K posts" },
  { tag: "#PuppyLove", count: "6.1K posts" },
  { tag: "#CatLife", count: "5.3K posts" },
  { tag: "#BirdCare", count: "4.8K posts" },
];

export const FEATURED_MEMBERS: FeaturedMemberItem[] = [
  {
    id: "m1",
    name: "Dr. Samira Patel",
    role: "Verified Vet",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80",
    isFollowing: false,
  },
  {
    id: "m2",
    name: "Ahmed Raza",
    role: "Pet Trainer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    isFollowing: false,
  },
  {
    id: "m3",
    name: "Nusrat Jahan",
    role: "Community Guide",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    isFollowing: false,
  },
  {
    id: "m4",
    name: "Farhana Islam",
    role: "Bird Expert",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
    isFollowing: false,
  },
];

export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: "cp-1",
    authorName: "Sadia Rahman",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    badge: "Question",
    timeAgo: "2 hours ago",
    location: "Dhaka, Bangladesh",
    title: "What's the best food for a picky cat?",
    petEmoji: "🐱",
    content: "My 1 year old cat is very picky with food. She only eats dry food sometimes and refuses wet food. Any recommendations for healthy and tasty options?",
    tags: ["Cats", "Food & Nutrition", "Feeding Tips"],
    likes: 24,
    comments: 18,
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
    isLiked: false,
    isSaved: false,
  },
  {
    id: "cp-2",
    authorName: "Tanvir Ahmed",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    badge: "Discussion",
    timeAgo: "5 hours ago",
    location: "Chattogram, Bangladesh",
    title: "Morning walk routine with my Golden Retriever",
    petEmoji: "🐕",
    content: "Been taking him for morning walks for 3 months now. It's amazing how much his energy and behavior have improved. Here are some photos from today's walk!",
    tags: ["Dogs", "Exercise", "Daily Care", "Golden Retriever"],
    likes: 56,
    comments: 12,
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
    imageCount: 3,
    isLiked: false,
    isSaved: false,
  },
  {
    id: "cp-3",
    authorName: "Mim Akter",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    badge: "Recommendations",
    timeAgo: "8 hours ago",
    location: "Sylhet, Bangladesh",
    title: "Best bird toys for Budgies?",
    petEmoji: "🦜",
    content: "Looking for some good toy recommendations for my budgies. They get bored easily. What are your birds' favorite toys?",
    tags: ["Birds", "Toys", "Budgies", "Enrichment"],
    likes: 32,
    comments: 20,
    image: "https://images.unsplash.com/photo-1544943910-4c1dc44a055c?auto=format&fit=crop&w=800&q=80",
    isLiked: false,
    isSaved: false,
  },
  {
    id: "cp-4",
    authorName: "Nusrat Jahan",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    badge: "Stories",
    timeAgo: "1 day ago",
    location: "Rajshahi, Bangladesh",
    title: "How I adopted my rescue cat ❤️",
    content: "Found him shivering in the rain 6 months ago. Now he's the king of the house and brings so much joy into our daily lives!",
    tags: ["Rescue", "Adoption", "CatLove"],
    likes: 89,
    comments: 27,
    image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80",
    isLiked: true,
    isSaved: false,
  },
];
