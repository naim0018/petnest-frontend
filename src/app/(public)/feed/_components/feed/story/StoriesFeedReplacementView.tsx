"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  Plus,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Smile,
  Send,
  Volume2,
  VolumeX,
  Play,
  Pause,
  History,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useFeedFilter } from "@/context/FeedFilterContext";
import {
  DETAILED_STORIES_DATA,
  DetailedStoryUser,
  StoryComment,
} from "./storyViewerData";

interface StoriesFeedReplacementViewProps {
  initialStoryId?: string | null;
  onClose?: () => void;
}

export default function StoriesFeedReplacementView({
  initialStoryId,
  onClose,
}: StoriesFeedReplacementViewProps) {
  const { setActiveStoryId } = useFeedFilter();

  // Find initial story or default to first
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(() => {
    if (!initialStoryId) return 0;
    const foundIndex = DETAILED_STORIES_DATA.findIndex(
      (s) => s.id === initialStoryId
    );
    return foundIndex >= 0 ? foundIndex : 0;
  });

  const [activeTab, setActiveTab] = useState<"all" | "following" | "popular">(
    "all"
  );
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isWritingComment, setIsWritingComment] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);

  // Current story
  const currentStory: DetailedStoryUser =
    DETAILED_STORIES_DATA[selectedStoryIndex] || DETAILED_STORIES_DATA[0];
  const slides = currentStory.slides;
  const currentSlide = slides[activeSlideIndex] || slides[0];

  // Likes & comments local state
  const [likesCount, setLikesCount] = useState(currentStory.likesCount);
  const [isLiked, setIsLiked] = useState(currentStory.isLiked || false);
  const [isFollowing, setIsFollowing] = useState(currentStory.isFollowing || false);
  const [comments, setComments] = useState<StoryComment[]>(currentStory.comments);
  const [newCommentText, setNewCommentText] = useState("");
  const commentInputRef = useRef<HTMLInputElement>(null);

  // Sync state when story switches
  useEffect(() => {
    setActiveSlideIndex(0);
    setSlideProgress(0);
    setLikesCount(currentStory.likesCount);
    setIsLiked(currentStory.isLiked || false);
    setIsFollowing(currentStory.isFollowing || false);
    setComments(currentStory.comments);
    setNewCommentText("");
    setIsWritingComment(false);
  }, [currentStory]);

  // Story automatic slide timer (5 seconds per slide) - paused if manually paused OR user is writing comment
  const shouldPauseTimer = isPaused || isWritingComment || newCommentText.trim().length > 0;

  useEffect(() => {
    if (shouldPauseTimer) return;

    const intervalTime = 50; // 50ms update
    const totalTimeMs = 5000;
    const step = (intervalTime / totalTimeMs) * 100;

    const timer = setInterval(() => {
      setSlideProgress((prev) => {
        if (prev >= 100) {
          // Advance to next slide or next user
          if (activeSlideIndex < slides.length - 1) {
            setActiveSlideIndex((idx) => idx + 1);
            return 0;
          } else {
            // Next user story
            if (selectedStoryIndex < DETAILED_STORIES_DATA.length - 1) {
              const nextIndex = selectedStoryIndex + 1;
              setSelectedStoryIndex(nextIndex);
              setActiveStoryId(DETAILED_STORIES_DATA[nextIndex].id);
              return 0;
            } else {
              // Reached end of all stories, stop or loop
              return 100;
            }
          }
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [shouldPauseTimer, activeSlideIndex, slides.length, selectedStoryIndex]);

  const handlePrevSlide = () => {
    if (activeSlideIndex > 0) {
      setActiveSlideIndex((idx) => idx - 1);
      setSlideProgress(0);
    } else if (selectedStoryIndex > 0) {
      const prevIndex = selectedStoryIndex - 1;
      setSelectedStoryIndex(prevIndex);
      setActiveStoryId(DETAILED_STORIES_DATA[prevIndex].id);
      setActiveSlideIndex(0);
      setSlideProgress(0);
    }
  };

  const handleNextSlide = () => {
    if (activeSlideIndex < slides.length - 1) {
      setActiveSlideIndex((idx) => idx + 1);
      setSlideProgress(0);
    } else if (selectedStoryIndex < DETAILED_STORIES_DATA.length - 1) {
      const nextIndex = selectedStoryIndex + 1;
      setSelectedStoryIndex(nextIndex);
      setActiveStoryId(DETAILED_STORIES_DATA[nextIndex].id);
      setActiveSlideIndex(0);
      setSlideProgress(0);
    }
  };

  const handleLikeToggle = () => {
    setIsLiked((prev) => !prev);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleSendComment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: StoryComment = {
      id: `comment-${Date.now()}`,
      author: "baibur1216",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      text: newCommentText.trim(),
      timeAgo: "Just now",
      likes: 0,
    };

    setComments((prev) => [newComment, ...prev]);
    setNewCommentText("");
  };

  const handleSendQuickReaction = (emoji: string) => {
    const reactionComment: StoryComment = {
      id: `reaction-${Date.now()}`,
      author: "baibur1216",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      text: emoji,
      timeAgo: "Just now",
      likes: 0,
    };
    setComments((prev) => [reactionComment, ...prev]);
  };

  const handleExit = () => {
    setActiveStoryId(null);
    onClose?.();
  };

  // Scroll to change stories with debounce cooldown
  const lastScrollTime = useRef<number>(0);

  const handleNextStory = () => {
    if (selectedStoryIndex < DETAILED_STORIES_DATA.length - 1) {
      const nextIndex = selectedStoryIndex + 1;
      setSelectedStoryIndex(nextIndex);
      setActiveStoryId(DETAILED_STORIES_DATA[nextIndex].id);
    }
  };

  const handlePrevStory = () => {
    if (selectedStoryIndex > 0) {
      const prevIndex = selectedStoryIndex - 1;
      setSelectedStoryIndex(prevIndex);
      setActiveStoryId(DETAILED_STORIES_DATA[prevIndex].id);
    }
  };

  // Mouse wheel navigation for stories
  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    // 450ms cooldown prevents rapid multi-skipping on smooth trackpads/mouse wheels
    if (now - lastScrollTime.current < 450) return;

    if (e.deltaY > 35) {
      lastScrollTime.current = now;
      handleNextStory();
    } else if (e.deltaY < -35) {
      lastScrollTime.current = now;
      handlePrevStory();
    }
  };

  // Keyboard navigation: ArrowUp/Down for stories, ArrowLeft/Right for slides, Escape to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleExit();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        handleNextStory();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        handlePrevStory();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedStoryIndex, activeSlideIndex]);

  // Lock body scroll while full screen stories panel is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onWheel={handleWheel}
      className="fixed inset-0 z-50 w-screen h-screen overflow-hidden bg-white dark:bg-[#121316] text-ink flex flex-col select-none"
    >
      {/* 3-COLUMN STORIES INTERFACE FULL PAGE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 w-full h-full">
        {/* ======================================================== */}
        {/* 1. LEFT COLUMN: STORIES LIST & CREATION (4 cols)         */}
        {/* ======================================================== */}
        <div
          onWheel={(e) => e.stopPropagation()}
          className="lg:col-span-4 border-r border-border p-6 flex flex-col bg-surface-soft/40 dark:bg-card/20 h-full overflow-hidden"
        >
          <div className="flex flex-col h-full space-y-5">
            {/* Header: Title + Subtitle */}
            <div className="flex items-start gap-3 shrink-0">
              <div className="w-10 h-10 rounded-full bg-coral/10 dark:bg-coral/20 text-coral flex items-center justify-center shrink-0">
                <History className="w-5 h-5 stroke-[2.3]" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-ink font-quicksand leading-tight">
                  Stories
                </h2>
                <p className="text-xs text-ink-muted mt-0.5">
                  See what&apos;s happening in our pet community
                </p>
              </div>
            </div>

            {/* "Your Story" Creation Card */}
            <div className="p-3.5 rounded-2xl bg-linear-to-r from-[#fff1eb] to-[#fff6f2] dark:from-[#2a1d18] dark:to-[#221a16] border border-border-peach flex items-center gap-3.5 transition-all hover:shadow-xs cursor-pointer group shrink-0">
              <div className="relative shrink-0">
                <div className="size-12 rounded-full overflow-hidden border-2 border-white dark:border-zinc-800 shadow-2xs">
                  <Image
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    alt="Your avatar"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-coral text-white flex items-center justify-center border-2 border-white dark:border-zinc-900 shadow-xs">
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-ink group-hover:text-coral transition-colors font-quicksand">
                  Your Story
                </h4>
                <p className="text-xs text-ink-muted">
                  Share a moment with your pets
                </p>
              </div>
            </div>

            {/* Filter Tabs: All Stories / Following / Popular */}
            <div className="flex items-center gap-1.5 border-b border-border/80 pb-3 shrink-0">
              {(
                [
                  { id: "all", label: "All Stories" },
                  { id: "following", label: "Following" },
                  { id: "popular", label: "Popular" },
                ] as const
              ).map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer font-quicksand",
                      isActive
                        ? "bg-coral-light dark:bg-coral/20 text-coral shadow-2xs border border-coral/30"
                        : "text-ink-muted hover:text-ink hover:bg-surface-muted/60"
                    )}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Stories Vertical List - Full remaining height */}
            <div className="space-y-1.5 overflow-y-auto flex-1 pr-1.5 scrollbar-thin">
              {DETAILED_STORIES_DATA.map((story, index) => {
                const isSelected = selectedStoryIndex === index;
                return (
                  <div
                    key={story.id}
                    onClick={() => {
                      setSelectedStoryIndex(index);
                      setActiveSlideIndex(0);
                      setSlideProgress(0);
                      setActiveStoryId(story.id);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-2.5 rounded-2xl transition-all cursor-pointer group",
                      isSelected
                        ? "bg-linear-to-r from-coral/10 via-coral/5 to-transparent border border-coral/20 shadow-2xs"
                        : "hover:bg-surface-muted/60 border border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar with colorful ring */}
                      <div className="relative shrink-0">
                        <div
                          className={cn(
                            "size-12 rounded-full p-[2.5px] transition-transform group-hover:scale-105",
                            story.hasUnseenStory
                              ? "bg-linear-to-tr from-coral via-[#ff9e7d] to-[#ffe66d]"
                              : "bg-surface-muted"
                          )}
                        >
                          <div className="size-full rounded-full overflow-hidden bg-card border-2 border-white dark:border-zinc-900">
                            <Image
                              src={story.avatar}
                              alt={story.name}
                              width={48}
                              height={48}
                              className="object-cover size-full"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="text-left">
                        <h4
                          className={cn(
                            "text-sm font-bold font-quicksand flex items-center gap-1 transition-colors",
                            isSelected
                              ? "text-coral"
                              : "text-ink group-hover:text-coral"
                          )}
                        >
                          <span>{story.name}</span>
                          <span>{story.petIcon}</span>
                        </h4>
                        <p className="text-xs text-ink-muted">
                          {story.timeAgo} • {story.storiesCount} stories
                        </p>
                      </div>
                    </div>

                    {/* Unread indicator dot */}
                    {story.hasUnseenStory && (
                      <div className="size-2 rounded-full bg-coral shrink-0 mr-1.5" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. MIDDLE COLUMN: IMMERSIVE STORY SLIDE VIEWER (5 cols)  */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 p-0 sm:py-2 flex items-center justify-center bg-zinc-900/5 dark:bg-black/40 h-full overflow-hidden">
          <div className="relative w-full max-w-[500px] h-full sm:max-h-[calc(100vh-24px)] sm:rounded-3xl aspect-[9/16] overflow-hidden shadow-2xl bg-black flex flex-col justify-between group">
            {/* Background Story Media */}
            <div className="absolute inset-0 z-0">
              <Image
                src={currentSlide.mediaUrl}
                alt={currentStory.name}
                fill
                className="object-cover transition-opacity duration-300"
                priority
              />
              {/* Top and Bottom Vignette Overlays for Maximum Legibility */}
              <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black/75 via-black/35 to-transparent pointer-events-none z-10" />
              <div className="absolute inset-x-0 bottom-0 h-36 bg-linear-to-t from-black/85 via-black/45 to-transparent pointer-events-none z-10" />
            </div>

            {/* TOP HEADER: Segmented Progress Bars & Author Profile */}
            <div className="relative z-20 p-4 space-y-3">
              {/* Story Slide Progress Bars */}
              <div className="flex items-center gap-1.5 w-full">
                {slides.map((slide, idx) => {
                  let fillPercent = 0;
                  if (idx < activeSlideIndex) fillPercent = 100;
                  else if (idx === activeSlideIndex) fillPercent = slideProgress;
                  else fillPercent = 0;

                  return (
                    <div
                      key={slide.id}
                      className="h-1 flex-1 bg-white/35 rounded-full overflow-hidden cursor-pointer"
                      onClick={() => {
                        setActiveSlideIndex(idx);
                        setSlideProgress(0);
                      }}
                    >
                      <div
                        className="h-full bg-white transition-all ease-linear"
                        style={{ width: `${fillPercent}%` }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Author Info + Play/Pause & Sound Controls */}
              <div className="flex items-center justify-between text-white pt-1">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-full overflow-hidden border-2 border-white/80 shadow-xs">
                    <Image
                      src={currentStory.avatar}
                      alt={currentStory.name}
                      width={36}
                      height={36}
                      className="object-cover size-full"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-quicksand flex items-center gap-1 drop-shadow-sm">
                      <span>{currentStory.name}</span>
                      <span>{currentStory.petIcon}</span>
                    </h3>
                    <p className="text-[11px] text-white/80 font-medium drop-shadow-2xs">
                      {currentStory.timeAgo}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsPaused((prev) => !prev)}
                    className="size-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md flex items-center justify-center text-white transition-colors cursor-pointer"
                    aria-label={isPaused ? "Play story" : "Pause story"}
                  >
                    {isPaused ? (
                      <Play className="w-3.5 h-3.5 fill-white" />
                    ) : (
                      <Pause className="w-3.5 h-3.5 fill-white" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsMuted((prev) => !prev)}
                    className="size-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md flex items-center justify-center text-white transition-colors cursor-pointer"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* PREV / NEXT NAVIGATION ARROWS (VERTICALLY CENTERED ON STORY) */}
            <div className="absolute inset-y-0 inset-x-3 z-30 flex items-center justify-between pointer-events-none">
              <button
                type="button"
                onClick={handlePrevSlide}
                className="size-11 rounded-full bg-black/45 hover:bg-black/75 backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer pointer-events-auto shadow-lg hover:scale-110 active:scale-95 border border-white/10"
                aria-label="Previous story slide"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={handleNextSlide}
                className="size-11 rounded-full bg-black/45 hover:bg-black/75 backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer pointer-events-auto shadow-lg hover:scale-110 active:scale-95 border border-white/10"
                aria-label="Next story slide"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. RIGHT COLUMN: DETAILS, COMMENTS & EXIT (3 cols)       */}
        {/* ======================================================== */}
        <div
          onWheel={(e) => e.stopPropagation()}
          className="lg:col-span-3 border-l border-border p-6 flex flex-col bg-surface-soft/40 dark:bg-card/20 relative h-full overflow-hidden"
        >
          {/* Top Row: Author Card & Global Close Button */}
          <div className="flex flex-col flex-1 min-h-0 space-y-4">
            <div className="flex items-start justify-between shrink-0">
              {/* Author profile + Follow button */}
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-full overflow-hidden border border-border shadow-2xs">
                  <Image
                    src={currentStory.avatar}
                    alt={currentStory.name}
                    width={44}
                    height={44}
                    className="object-cover size-full"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink font-quicksand flex items-center gap-1.5">
                    <span>{currentStory.name}</span>
                    <span className="text-base leading-none">{currentStory.petIcon}</span>
                  </h3>
                  <p className="text-xs text-ink-muted">{currentStory.timeAgo}</p>
                </div>
              </div>

              {/* Action Buttons: Follow + Close (X) */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsFollowing((prev) => !prev)}
                  className={cn(
                    "px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer font-quicksand",
                    isFollowing
                      ? "bg-surface-muted text-ink-muted hover:text-ink"
                      : "bg-coral-light text-coral hover:bg-coral hover:text-white border border-coral/30"
                  )}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>

                {/* Close Stories Replacement view and return to normal Feed */}
                <button
                  type="button"
                  onClick={handleExit}
                  className="size-8 rounded-full bg-surface-muted hover:bg-surface-muted/80 text-ink-muted hover:text-ink flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close stories feed and return to normal feed"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Story Caption and Hashtags */}
            <div className="space-y-2 shrink-0">
              <p className="text-sm text-ink font-normal leading-relaxed">
                {currentStory.caption}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {currentStory.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-coral-light/70 dark:bg-coral/20 text-coral font-quicksand"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats Row: Likes, Comments, Share */}
            <div className="flex items-center justify-between py-2.5 border-y border-border text-ink-muted shrink-0">
              <div className="flex items-center gap-5">
                <button
                  type="button"
                  onClick={handleLikeToggle}
                  className="flex items-center gap-1.5 text-xs font-medium hover:text-coral transition-colors cursor-pointer"
                >
                  <Heart
                    className={cn(
                      "w-4 h-4",
                      isLiked ? "fill-coral text-coral" : "text-ink-muted"
                    )}
                  />
                  <span>{likesCount}</span>
                </button>

                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <MessageCircle className="w-4 h-4 text-ink-muted" />
                  <span>{comments.length}</span>
                </div>

                <button
                  type="button"
                  className="hover:text-coral transition-colors cursor-pointer"
                  aria-label="Share story"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                className="hover:text-ink transition-colors cursor-pointer"
                aria-label="More options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Comments Section - Takes full remaining height */}
            <div className="flex flex-col flex-1 min-h-0 space-y-2.5 pt-1">
              <div className="flex items-center justify-between shrink-0">
                <h4 className="text-xs font-bold text-ink font-quicksand">
                  Comments ({comments.length})
                </h4>
                <span className="text-xs text-ink-muted font-normal cursor-pointer hover:text-ink">
                  Most recent ▾
                </span>
              </div>

              {/* Scrollable Comments List - Expands to fill available height */}
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1.5 scrollbar-thin">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-2.5 group">
                    <div className="size-8 rounded-full overflow-hidden shrink-0 border border-border">
                      <Image
                        src={comment.avatar}
                        alt={comment.author}
                        width={32}
                        height={32}
                        className="object-cover size-full"
                      />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-ink font-quicksand">
                          {comment.author}
                        </span>
                        <span className="text-xs text-ink-muted">
                          {comment.timeAgo}
                        </span>
                      </div>
                      <p className="text-xs text-ink font-normal leading-relaxed">
                        {comment.text}
                      </p>
                      <div className="flex items-center gap-3.5 text-xs text-ink-muted font-normal pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setComments((prev) =>
                              prev.map((c) =>
                                c.id === comment.id
                                  ? { ...c, likes: (c.likes || 0) + 1 }
                                  : c
                              )
                            );
                          }}
                          className="hover:text-coral transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Heart className="w-3.5 h-3.5" />
                          <span>{comment.likes > 0 ? comment.likes : ""}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewCommentText(`@${comment.author} `);
                            setIsWritingComment(true);
                            commentInputRef.current?.focus();
                          }}
                          className="hover:text-coral font-medium transition-colors cursor-pointer"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row: Write Comment Input */}
          <form
            onSubmit={handleSendComment}
            className="pt-4 border-t border-border mt-3 flex items-center gap-2 shrink-0"
          >
            <div className="size-8 rounded-full overflow-hidden shrink-0 border border-border">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Your avatar"
                width={32}
                height={32}
                className="object-cover size-full"
              />
            </div>

            <div className="relative flex-1">
              <input
                ref={commentInputRef}
                type="text"
                value={newCommentText}
                onFocus={() => setIsWritingComment(true)}
                onBlur={() => {
                  if (!newCommentText.trim()) {
                    setIsWritingComment(false);
                  }
                }}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full bg-surface-muted/60 dark:bg-card border border-border rounded-full py-2 pl-3.5 pr-8 text-xs text-ink placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-coral/40"
              />
              <button
                type="button"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors cursor-pointer"
              >
                <Smile className="w-4 h-4" />
              </button>
            </div>

            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className="size-8 rounded-full bg-coral disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-xs hover:scale-105 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
