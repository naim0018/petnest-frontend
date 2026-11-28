"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Reply,
  Pencil,
  Trash2,
  Send,
  Loader2,
  ShieldCheck,
  ThumbsUp,
  Bookmark,
} from "lucide-react";
import { toast } from "sonner";
import { useAppSelector } from "@/hooks/useRedux";
import {
  useGetGuideCommentsQuery,
  useCreateGuideCommentMutation,
  useUpdateGuideCommentMutation,
  useDeleteGuideCommentMutation,
  useToggleLikeMutation,
  useToggleBookmarkMutation,
} from "@/store/Api/Guides/guides.api";
import type { GuideCommentItem } from "@/store/Api/Guides/guides.types";
import { cn } from "@/lib/utils";

interface CommentNode extends GuideCommentItem {
  children: CommentNode[];
}

function buildCommentTree(items: GuideCommentItem[]): CommentNode[] {
  const map = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  for (const item of items) {
    map.set(item.id, { ...item, children: [] });
  }

  for (const node of map.values()) {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

function getDisplayName(user: GuideCommentItem["user"]) {
  return user.name || "Pet Lover";
}

interface CommentItemProps {
  node: CommentNode;
  depth: number;
  guideId: string;
  currentUserId?: string;
  isAdmin: boolean;
  onReply: (
    parentId: string,
    content: string,
    reset: () => void
  ) => Promise<void>;
  onUpdate: (
    commentId: string,
    content: string,
    reset: () => void
  ) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
}

function CommentItem({
  node,
  depth,
  guideId,
  currentUserId,
  isAdmin,
  onReply,
  onUpdate,
  onDelete,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(node.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwner = Boolean(currentUserId && currentUserId === node.user.id);
  const canDelete = isOwner || isAdmin;
  const isAuthorAdmin =
    node.user.role === "ADMIN" || node.user.role === "SUPERADMIN";
  const displayName = getDisplayName(node.user);
  const initial = displayName.charAt(0).toUpperCase();

  // Cap visual indentation at 4 levels so deep infinite threads stay readable
  const indentClass = depth > 0 && depth <= 4 ? "ml-4 sm:ml-7 pl-3 sm:pl-4 border-l-2 border-border-peach/70 dark:border-slate-700" : "";

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onReply(node.id, replyText, () => {
        setReplyText("");
        setIsReplying(false);
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editText.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onUpdate(node.id, editText, () => {
        setIsEditing(false);
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("space-y-3", indentClass)}>
      <div className="p-3.5 sm:p-4 rounded-xl bg-surface-soft/70 dark:bg-slate-800/40 border border-border-peach/60 dark:border-slate-800">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {node.user.profile?.avatar ? (
              <img
                src={node.user.profile.avatar}
                alt={displayName}
                className="size-8 rounded-full object-cover shrink-0 border border-border-peach"
              />
            ) : (
              <div className="size-8 rounded-full bg-coral/15 text-coral font-bold text-xs flex items-center justify-center shrink-0">
                {initial}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs sm:text-sm font-bold text-ink truncate font-quicksand">
                  {displayName}
                </span>
                {isAuthorAdmin && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-coral/10 text-coral">
                    <ShieldCheck className="size-3" />
                    Admin
                  </span>
                )}
                {node.isEdited && (
                  <span className="text-[10px] text-ink-muted">(edited)</span>
                )}
              </div>
              <p className="text-[11px] text-ink-muted">
                {new Date(node.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {currentUserId && (
              <button
                type="button"
                onClick={() => setIsReplying((v) => !v)}
                className="p-1.5 rounded-lg text-ink-muted hover:text-coral hover:bg-coral/10 transition-colors cursor-pointer"
                title="Reply"
              >
                <Reply className="size-3.5" />
              </button>
            )}
            {isOwner && (
              <button
                type="button"
                onClick={() => {
                  setEditText(node.content);
                  setIsEditing((v) => !v);
                }}
                className="p-1.5 rounded-lg text-ink-muted hover:text-coral hover:bg-coral/10 transition-colors cursor-pointer"
                title="Edit"
              >
                <Pencil className="size-3.5" />
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                onClick={() => onDelete(node.id)}
                className="p-1.5 rounded-lg text-ink-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                title={isAdmin && !isOwner ? "Delete (Admin)" : "Delete"}
              >
                <Trash2 className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="mt-3 space-y-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-border-peach bg-card px-3 py-2 text-xs sm:text-sm text-ink focus:outline-none focus:ring-2 focus:ring-coral/30"
            />
            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-ink-muted hover:bg-surface-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !editText.trim()}
                className="px-3.5 py-1.5 rounded-lg bg-coral text-white text-xs font-bold hover:bg-coral-dark disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        ) : (
          <p className="mt-2.5 text-xs sm:text-sm text-ink/90 whitespace-pre-wrap leading-relaxed">
            {node.content}
          </p>
        )}

        {isReplying && (
          <form onSubmit={handleReplySubmit} className="mt-3 space-y-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${displayName}...`}
              rows={2}
              className="w-full rounded-xl border border-border-peach bg-card px-3 py-2 text-xs sm:text-sm text-ink focus:outline-none focus:ring-2 focus:ring-coral/30"
            />
            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => setIsReplying(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-ink-muted hover:bg-surface-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !replyText.trim()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-coral text-white text-xs font-bold hover:bg-coral-dark disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Send className="size-3.5" />
                )}
                <span>Reply</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {node.children.length > 0 && (
        <div className="space-y-3">
          {node.children.map((child) => (
            <CommentItem
              key={child.id}
              node={child}
              depth={depth + 1}
              guideId={guideId}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onReply={onReply}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function GuideCommentsSection({
  guideId,
  initialLikeCount = 0,
  initialBookmarkCount = 0,
  initialIsLiked = false,
  initialIsBookmarked = false,
}: {
  guideId: string;
  initialLikeCount?: number;
  initialBookmarkCount?: number;
  initialIsLiked?: boolean;
  initialIsBookmarked?: boolean;
}) {
  const user = useAppSelector((state) => state.auth.user);
  const currentUserId =
    (user as { id?: string; userId?: string } | null)?.id ||
    (user as { id?: string; userId?: string } | null)?.userId;
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPERADMIN";

  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [bookmarkCount, setBookmarkCount] = useState(initialBookmarkCount);

  const [toggleLike] = useToggleLikeMutation();
  const [toggleBookmark] = useToggleBookmarkMutation();

  const handleToggleLike = async () => {
    if (!currentUserId) {
      toast.info("Please sign in to like this guide");
      return;
    }
    const prevLiked = isLiked;
    const prevCount = likeCount;
    setIsLiked(!prevLiked);
    setLikeCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);
    try {
      const res = await toggleLike(guideId).unwrap();
      if (res?.data) {
        setIsLiked(res.data.liked);
        setLikeCount(res.data.likeCount);
      }
    } catch {
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
      toast.error("Failed to update like");
    }
  };

  const handleToggleBookmark = async () => {
    if (!currentUserId) {
      toast.info("Please sign in to bookmark this guide");
      return;
    }
    const prevSaved = isBookmarked;
    const prevCount = bookmarkCount;
    setIsBookmarked(!prevSaved);
    setBookmarkCount(prevSaved ? Math.max(0, prevCount - 1) : prevCount + 1);
    try {
      const res = await toggleBookmark(guideId).unwrap();
      if (res?.data) {
        setIsBookmarked(res.data.bookmarked);
        setBookmarkCount(res.data.bookmarkCount);
        toast.success(
          res.data.bookmarked ? "Saved to bookmarks" : "Removed from bookmarks"
        );
      }
    } catch {
      setIsBookmarked(prevSaved);
      setBookmarkCount(prevCount);
      toast.error("Failed to update bookmark");
    }
  };

  const [newComment, setNewComment] = useState("");
  const { data, isLoading } = useGetGuideCommentsQuery(guideId, {
    skip: !guideId,
  });
  const [createComment, { isLoading: isCreating }] =
    useCreateGuideCommentMutation();
  const [updateComment] = useUpdateGuideCommentMutation();
  const [deleteComment] = useDeleteGuideCommentMutation();

  const items = data?.data?.items || [];
  const total = data?.data?.total ?? items.length;
  const tree = useMemo(() => buildCommentTree(items), [items]);

  const handleCreateTopLevel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isCreating) return;
    try {
      await createComment({ guideId, content: newComment.trim() }).unwrap();
      setNewComment("");
      toast.success("Comment posted");
    } catch {
      toast.error("Failed to post comment");
    }
  };

  const handleReply = async (
    parentId: string,
    content: string,
    reset: () => void
  ) => {
    try {
      await createComment({
        guideId,
        content: content.trim(),
        parentId,
      }).unwrap();
      reset();
      toast.success("Reply posted");
    } catch {
      toast.error("Failed to post reply");
    }
  };

  const handleUpdate = async (
    commentId: string,
    content: string,
    reset: () => void
  ) => {
    try {
      await updateComment({
        commentId,
        guideId,
        content: content.trim(),
      }).unwrap();
      reset();
      toast.success("Comment updated");
    } catch {
      toast.error("Failed to update comment");
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment({ commentId, guideId }).unwrap();
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  return (
    <section
      id="comments"
      className="mt-6 space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-lg bg-coral/10 text-coral flex items-center justify-center">
            <MessageSquare className="size-4.5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-ink font-quicksand">
              Community Discussion ({total})
            </h3>
            <p className="text-xs text-ink-muted">
              Ask questions or share your experience with this guide
            </p>
          </div>
        </div>

        {/* Like (ThumbsUp) & Bookmark Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleToggleLike}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer",
              isLiked
                ? "bg-coral/10 border-coral text-coral"
                : "bg-card border-border-peach text-ink-muted hover:text-coral hover:border-coral/50"
            )}
          >
            <ThumbsUp
              className={cn("size-4", isLiked && "fill-coral text-coral")}
            />
            <span>Like</span>
            <span className="px-1.5 py-0.5 rounded bg-surface-muted text-[11px] font-extrabold">
              {likeCount}
            </span>
          </button>

          <button
            type="button"
            onClick={handleToggleBookmark}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer",
              isBookmarked
                ? "bg-coral/10 border-coral text-coral"
                : "bg-card border-border-peach text-ink-muted hover:text-coral hover:border-coral/50"
            )}
          >
            <Bookmark
              className={cn("size-4", isBookmarked && "fill-coral text-coral")}
            />
            <span>{isBookmarked ? "Saved" : "Save"}</span>
            <span className="px-1.5 py-0.5 rounded bg-surface-muted text-[11px] font-extrabold">
              {bookmarkCount}
            </span>
          </button>
        </div>
      </div>

      {/* Top-level composer */}
      {currentUserId ? (
        <form onSubmit={handleCreateTopLevel} className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            className="w-full rounded-lg border border-border-peach bg-card px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-coral/30"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isCreating || !newComment.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-coral text-white text-xs sm:text-sm font-bold font-quicksand hover:bg-coral-dark transition-all disabled:opacity-50 cursor-pointer"
            >
              {isCreating ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              <span>Post Comment</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="p-4 rounded-2xl bg-surface-soft/80 dark:bg-slate-800/40 border border-border-peach/70 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs sm:text-sm text-ink-muted font-medium">
            Sign in to join the discussion, like, or bookmark this guide.
          </p>
          <Link
            href="/login"
            className="px-5 py-2 rounded-full bg-coral text-white text-xs font-bold font-quicksand hover:bg-coral-dark transition-colors shrink-0"
          >
            Sign In
          </Link>
        </div>
      )}

      {/* Comments list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8 text-ink-muted gap-2 text-sm">
          <Loader2 className="size-4 animate-spin text-coral" />
          <span>Loading comments...</span>
        </div>
      ) : tree.length > 0 ? (
        <div className="space-y-4">
          {tree.map((node) => (
            <CommentItem
              key={node.id}
              node={node}
              depth={0}
              guideId={guideId}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onReply={handleReply}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 rounded-lg bg-surface-muted/40 border border-dashed border-border-peach">
          <p className="text-xs sm:text-sm text-ink-muted font-medium">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      )}
    </section>
  );
}
