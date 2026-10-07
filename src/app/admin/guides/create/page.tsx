"use client";

import React, { useState } from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import PrimaryButton from "@/components/common/PrimaryButton";
import { BookOpen, Sparkles, Image as ImageIcon, Save, Send, HelpCircle } from "lucide-react";

export default function CreateGuidePage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Puppy & Kitten Onboarding");
  const [species, setSpecies] = useState("Dogs");
  const [readTime, setReadTime] = useState("6 min read");
  const [author, setAuthor] = useState("Dr. Sarah Jenkins (DVM)");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSaved(true);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-quicksand text-ink">Create New Care Guide</h2>
          <p className="text-sm text-ink-muted mt-1">
            Author expert pet health, nutrition, and training guides for the PetNest library.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PrimaryButton
            variant="outline"
            size="md"
            leftIcon={<Save className="size-4" />}
            onClick={() => setIsSaved(true)}
          >
            Save Draft
          </PrimaryButton>
          <PrimaryButton
            variant="primary"
            size="md"
            leftIcon={<Send className="size-4" />}
            isLoading={isSubmitting}
            onClick={handleSubmit}
          >
            Submit for Review
          </PrimaryButton>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center justify-between">
          <span>Guide draft saved successfully to the editorial queue.</span>
          <button
            onClick={() => setIsSaved(false)}
            className="text-emerald-700 dark:text-emerald-400 hover:underline text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Editor Form */}
      <AnimatedContainer delay={0.1}>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-border-peach bg-card p-6 shadow-xs space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-2">
                  Article Title <span className="text-coral">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Essential Puppy Socialization Milestones (Weeks 8 to 16)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-border-peach bg-surface-muted text-ink text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-2">
                  Executive Summary / Meta Excerpt <span className="text-coral">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="A clear 2-3 sentence overview of this guide for search cards and social previews..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-border-peach bg-surface-muted text-ink text-sm focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-2">
                  Article Body (Markdown & HTML Supported) <span className="text-coral">*</span>
                </label>
                <textarea
                  rows={14}
                  placeholder="Write complete article chapters, veterinary references, and step-by-step guidance here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-4 rounded-lg border border-border-peach bg-surface-muted text-ink text-sm font-mono focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar Metadata */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border-peach bg-card p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                <Sparkles className="size-4 text-coral" /> Guide Metadata
              </h3>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                  Category Pillar
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border-peach bg-surface-muted text-ink text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-coral/20"
                >
                  <option>Puppy & Kitten Onboarding</option>
                  <option>Clinical Nutrition & Diets</option>
                  <option>Behavior, Training & Socialization</option>
                  <option>Aquatic Life & Tank Chemistry</option>
                  <option>Senior Pet Wellness & Mobility</option>
                  <option>Emergency First Aid & Triage</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                  Target Pet Species
                </label>
                <select
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border-peach bg-surface-muted text-ink text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-coral/20"
                >
                  <option>Dogs</option>
                  <option>Cats</option>
                  <option>Birds</option>
                  <option>Fish & Aquatics</option>
                  <option>Small Pets</option>
                  <option>All Species</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                  Assigned Author
                </label>
                <select
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border-peach bg-surface-muted text-ink text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-coral/20"
                >
                  <option>Dr. Sarah Jenkins (DVM)</option>
                  <option>Elena Rostova (Feline Specialist)</option>
                  <option>Amara Williams (Behaviorist)</option>
                  <option>Marcus Chen (Aquatics Specialist)</option>
                  <option>PetNest Editorial Staff</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                  Estimated Read Time
                </label>
                <input
                  type="text"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border-peach bg-surface-muted text-ink text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-coral/20"
                />
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-2">
                  Featured Cover Image
                </label>
                <div className="border-2 border-dashed border-border-peach rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-surface-muted/50 cursor-pointer transition-colors">
                  <ImageIcon className="size-8 text-coral mb-2" />
                  <p className="text-xs font-bold text-ink">Upload Cover Photo</p>
                  <p className="text-[11px] text-ink-muted mt-0.5">PNG, JPG, or WebP up to 5MB</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-coral-light border border-coral/20 text-ink">
              <div className="flex items-start gap-2.5">
                <HelpCircle className="size-5 text-coral shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-coral">Veterinary Review Requirement</p>
                  <p className="text-ink-muted">
                    Guides addressing clinical conditions, medications, or diets require review from a verified DVM before being published live.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </AnimatedContainer>
    </div>
  );
}
