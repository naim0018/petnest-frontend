export interface StorySlide {
  id: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  duration?: number; // seconds
}

export interface StoryComment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timeAgo: string;
  likes: number;
}

export interface DetailedStoryUser {
  id: string;
  name: string;
  petIcon: string;
  avatar: string;
  timeAgo: string;
  storiesCount: number;
  slides: StorySlide[];
  caption: string;
  tags: string[];
  likesCount: number;
  isLiked?: boolean;
  commentsCount: number;
  comments: StoryComment[];
  hasUnseenStory?: boolean;
  isFollowing?: boolean;
}

export const DETAILED_STORIES_DATA: DetailedStoryUser[] = [
  {
    id: "story-1",
    name: "Bella",
    petIcon: "🐱",
    avatar: "/CareGuide/bella-avatar.jpg",
    timeAgo: "2 hours ago",
    storiesCount: 5,
    slides: [
      {
        id: "slide-1",
        mediaUrl: "/CareGuide/bella-corgi.jpg",
        mediaType: "image",
        duration: 5,
      },
      {
        id: "slide-2",
        mediaUrl: "/CareGuide/bella-sunset.jpg",
        mediaType: "image",
        duration: 5,
      },
      {
        id: "slide-2",
        mediaUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80",
        mediaType: "image",
        duration: 5,
      },
      {
        id: "slide-3",
        mediaUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80",
        mediaType: "image",
        duration: 5,
      },
      {
        id: "slide-4",
        mediaUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=80",
        mediaType: "image",
        duration: 5,
      },
      {
        id: "slide-5",
        mediaUrl: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=1200&q=80",
        mediaType: "image",
        duration: 5,
      },
    ],
    caption:
      "Evening walk with my best friend 🥰 Nothing beats this golden hour and happy paws! 🌅🐾",
    tags: ["#GoldenRetriever", "#DogLife", "#EveningWalk"],
    likesCount: 245,
    isLiked: false,
    commentsCount: 32,
    comments: [
      {
        id: "c-1",
        author: "Rahim Uddin",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        text: "Such a happy face! 😍",
        timeAgo: "2h ago",
        likes: 5,
      },
      {
        id: "c-2",
        author: "Samiha",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
        text: "Look at that smile! So cute 🥰",
        timeAgo: "3h ago",
        likes: 3,
      },
      {
        id: "c-3",
        author: "Tanvir Ahmed",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
        text: "Where is this? Looks beautiful!",
        timeAgo: "3h ago",
        likes: 2,
      },
      {
        id: "c-4",
        author: "Nabila",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
        text: "Golden retrievers are the best! ❤️",
        timeAgo: "4h ago",
        likes: 4,
      },
    ],
    hasUnseenStory: true,
    isFollowing: false,
  },
  {
    id: "story-2",
    name: "Luna",
    petIcon: "🐶",
    avatar: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=150&q=80",
    timeAgo: "4h ago",
    storiesCount: 3,
    slides: [
      {
        id: "luna-1",
        mediaUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80",
        mediaType: "image",
        duration: 5,
      },
      {
        id: "luna-2",
        mediaUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80",
        mediaType: "image",
        duration: 5,
      },
      {
        id: "luna-3",
        mediaUrl: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80",
        mediaType: "image",
        duration: 5,
      },
    ],
    caption: "Morning park zoomies! Someone didn't want to come back home today 🎾🐾",
    tags: ["#PuppyZoomies", "#DogPark", "#MorningRoutine"],
    likesCount: 184,
    commentsCount: 19,
    comments: [
      {
        id: "lc-1",
        author: "Elena Rostova",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
        text: "Full speed ahead! 🚀",
        timeAgo: "3h ago",
        likes: 7,
      },
      {
        id: "lc-2",
        author: "Marcus Vance",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80",
        text: "The happiest dog in the world!",
        timeAgo: "1h ago",
        likes: 2,
      },
    ],
    hasUnseenStory: true,
  },
  {
    id: "story-3",
    name: "Charlie",
    petIcon: "🐱",
    avatar: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=150&q=80",
    timeAgo: "6h ago",
    storiesCount: 4,
    slides: [
      {
        id: "charlie-1",
        mediaUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80",
        mediaType: "image",
        duration: 5,
      },
      {
        id: "charlie-2",
        mediaUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=1200&q=80",
        mediaType: "image",
        duration: 5,
      },
    ],
    caption: "Finding the only patch of sunlight on the floor and claiming it all afternoon ☀️💤",
    tags: ["#CatNap", "#SunbeamCat", "#LazyAfternoon"],
    likesCount: 312,
    commentsCount: 27,
    comments: [
      {
        id: "cc-1",
        author: "Sophie Clark",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
        text: "Sunbeam recharge in progress! 🔋",
        timeAgo: "5h ago",
        likes: 9,
      },
    ],
    hasUnseenStory: true,
  },
  {
    id: "story-4",
    name: "Max",
    petIcon: "🐱",
    avatar: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=150&q=80",
    timeAgo: "8h ago",
    storiesCount: 2,
    slides: [
      {
        id: "max-1",
        mediaUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=1200&q=80",
        mediaType: "image",
        duration: 5,
      },
    ],
    caption: "Discovered the top of the bookshelf. I rule this household now! 👑😼",
    tags: ["#CatTree", "#HighPerch", "#CatWisdom"],
    likesCount: 98,
    commentsCount: 11,
    comments: [
      {
        id: "mc-1",
        author: "Devon Reed",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80",
        text: "The look of pure sovereignty!",
        timeAgo: "6h ago",
        likes: 3,
      },
    ],
    hasUnseenStory: true,
  },
  {
    id: "story-5",
    name: "Moco",
    petIcon: "🐹",
    avatar: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=150&q=80",
    timeAgo: "12h ago",
    storiesCount: 6,
    slides: [
      {
        id: "moco-1",
        mediaUrl: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=1200&q=80",
        mediaType: "image",
        duration: 5,
      },
    ],
    caption: "Pouch stuffing championship winner! Two sunflower seeds and a pea flake 🐹🌾",
    tags: ["#HamsterLife", "#CheekPouches", "#PocketPet"],
    likesCount: 154,
    commentsCount: 16,
    comments: [
      {
        id: "mcc-1",
        author: "Zara Khan",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
        text: "Those cheeks! Imploding from cuteness 💖",
        timeAgo: "10h ago",
        likes: 8,
      },
    ],
    hasUnseenStory: true,
  },
  {
    id: "story-6",
    name: "Coco",
    petIcon: "🐶",
    avatar: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=150&q=80",
    timeAgo: "1d ago",
    storiesCount: 3,
    slides: [
      {
        id: "coco-1",
        mediaUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=80",
        mediaType: "image",
        duration: 5,
      },
    ],
    caption: "New sweater day! Ready for the autumn breeze 🍂🧣🐶",
    tags: ["#PetFashion", "#DogSweater", "#AutumnVibes"],
    likesCount: 220,
    commentsCount: 24,
    comments: [],
    hasUnseenStory: true,
  },
  {
    id: "story-7",
    name: "Rocky",
    petIcon: "🦝",
    avatar: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=150&q=80",
    timeAgo: "1d ago",
    storiesCount: 4,
    slides: [
      {
        id: "rocky-1",
        mediaUrl: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=1200&q=80",
        mediaType: "image",
        duration: 5,
      },
    ],
    caption: "Ready for another backyard patrol. Nothing passes without my approval! 🦝🕵️",
    tags: ["#BackyardWatch", "#LittleExplorer", "#PetDaily"],
    likesCount: 167,
    commentsCount: 14,
    comments: [],
    hasUnseenStory: true,
  },
];
