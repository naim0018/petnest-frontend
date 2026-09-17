import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getFeedPostById, feedPosts } from "@/lib/data/petnest-data";
import { FeedPostCard } from "../_components/feed/main-content/FeedPostCard";
import CommonWrapper from "@/components/common/CommonWrapper";

interface FeedDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return feedPosts.map((post) => ({ id: post.id }));
}

export async function generateMetadata({ params }: FeedDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getFeedPostById(id);

  if (!post) {
    return { title: "Post Not Found - PetNest" };
  }

  return {
    title: `${post.authorName}'s Post | PetNest Feed`,
    description: post.content.slice(0, 155),
    alternates: {
      canonical: `https://petnest.org/feed/${post.id}`,
    },
    openGraph: {
      title: `${post.authorName}'s Post`,
      description: post.content,
      url: `https://petnest.org/feed/${post.id}`,
      siteName: "PetNest Feed",
      images: post.image ? [{ url: post.image }] : [],
      type: "article",
    },
  };
}

export default async function FeedPostDetailPage({ params }: FeedDetailPageProps) {
  const { id } = await params;
  const post = await getFeedPostById(id);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SocialMediaPosting",
    headline: post.content.slice(0, 100),
    articleBody: post.content,
    image: post.image,
    author: {
      "@type": "Person",
      name: post.authorName,
    },
  };

  return (
    <CommonWrapper className="max-w-4xl space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-coral hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Feed
        </Link>
      </nav>

      <FeedPostCard post={post} />
    </CommonWrapper>
  );
}
