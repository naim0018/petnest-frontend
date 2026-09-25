import { Suspense } from "react";
import { Metadata } from "next";
import CommonWrapper from "@/components/common/CommonWrapper";
import { getFeedPosts } from "@/lib/data/petnest-data";
import { FeedFilterProvider } from "@/context/FeedFilterContext";
import { FeedContentSwitcher } from "./_components/feed/FeedContentSwitcher";

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

            <Suspense fallback={<div className="min-h-screen animate-pulse" />}>
                <FeedFilterProvider>
                    <FeedContentSwitcher posts={posts} />
                </FeedFilterProvider>
            </Suspense>
        </CommonWrapper>
    );
}
