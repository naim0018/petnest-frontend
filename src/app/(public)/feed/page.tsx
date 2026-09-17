import { Metadata } from "next";
import CommonWrapper from "@/components/common/CommonWrapper";
import { getFeedPosts } from "@/lib/data/petnest-data";
import { TrendingTopicsWidget } from "./_components/feed/right-content/TrendingTopicsWidget";
import { ShareLoveWidget } from "./_components/feed/left-content/ShareLoveWidget";
import { FeedNavigationCard } from "./_components/feed/left-content/FeedNavigationCard";
import { FeedMainSection } from "./_components/feed/main-content/FeedMainSection";
import { FeedFilterProvider } from "@/context/FeedFilterContext";

export const metadata: Metadata = {
    title: "PetNest Feed - Pet Stories, Updates & Photos",
    description: "Share pet stories, ask vet questions, and discover community posts from pet owners and rescues nationwide.",
    alternates: {
        canonical: "https://petnest.org/feed",
    },
    openGraph: {
        title: "PetNest Feed - Pet Community & Updates",
        description: "Share pet stories, ask vet questions, and discover community posts.",
        url: "https://petnest.org/feed",
        siteName: "PetNest",
        images: [{ url: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80" }],
        type: "website",
    },
};

export default async function FeedPage() {
    const posts = await getFeedPosts();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "PetNest Feed",
        url: "https://petnest.org/feed",
        description: "Pet Community & Updates Platform",
    };

    return (
        <CommonWrapper>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <FeedFilterProvider>
                <main className="grid grid-cols-1 lg:grid-cols-16 gap-6">
                    {/* Left Column - Navigation & Share Love Cards */}
                    <aside className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-26 space-y-6">
                            <FeedNavigationCard />
                            <ShareLoveWidget />
                        </div>
                    </aside>

                    {/* Main Feed Center Column */}
                    <FeedMainSection posts={posts} />

                    {/* Right Sidebar Column */}
                    <aside className="col-span-1 lg:col-span-3">
                        <div className="sticky top-26 space-y-6">
                            <TrendingTopicsWidget />
                        </div>
                    </aside>
                </main>
            </FeedFilterProvider>
        </CommonWrapper>
    );
}
