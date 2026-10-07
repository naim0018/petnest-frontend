"use client";

import React, { useState } from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import PrimaryButton from "@/components/common/PrimaryButton";
import { ShoppingBag, UploadCloud, Save, Sparkles, AlertCircle } from "lucide-react";

export default function CreateListingPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Puppy / Dog");
  const [storeName, setStoreName] = useState("PetNest Official Direct");
  const [price, setPrice] = useState("");
  const [inventory, setInventory] = useState("1");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 700);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-quicksand text-ink">Create Marketplace Listing</h2>
          <p className="text-sm text-ink-muted mt-1">
            Publish direct official products, adoption profiles, or vendor partner merchandise.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PrimaryButton
            variant="outline"
            size="md"
            leftIcon={<Save className="size-4" />}
            onClick={() => setIsSuccess(true)}
          >
            Save Draft
          </PrimaryButton>
          <PrimaryButton
            variant="primary"
            size="md"
            leftIcon={<ShoppingBag className="size-4" />}
            isLoading={isSubmitting}
            onClick={handleSubmit}
          >
            Publish Listing
          </PrimaryButton>
        </div>
      </div>

      {isSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center justify-between">
          <span>Marketplace listing published successfully to live catalog.</span>
          <button
            onClick={() => setIsSuccess(false)}
            className="text-emerald-700 dark:text-emerald-400 hover:underline text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      <AnimatedContainer delay={0.1}>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-border-peach bg-card p-6 shadow-xs space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-2">
                  Listing Title <span className="text-coral">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Purebred Golden Retriever Puppies (CKC Registered)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-border-peach bg-surface-muted text-ink text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-2">
                  Full Description & Specifications <span className="text-coral">*</span>
                </label>
                <textarea
                  rows={8}
                  placeholder="Detail health clearances, microchip info, diet requirements, package contents..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-4 rounded-lg border border-border-peach bg-surface-muted text-ink text-sm focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-2">
                    Price (USD $) <span className="text-coral">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 1850.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-border-peach bg-surface-muted text-ink text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-2">
                    Available Stock / Units <span className="text-coral">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={inventory}
                    onChange={(e) => setInventory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-border-peach bg-surface-muted text-ink text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border-peach bg-card p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                <Sparkles className="size-4 text-coral" /> Listing Settings
              </h3>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                  Marketplace Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border-peach bg-surface-muted text-ink text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-coral/20"
                >
                  <option>Puppy / Dog</option>
                  <option>Kitten / Cat</option>
                  <option>Birds & Avian</option>
                  <option>Supplies & Gear</option>
                  <option>Food & Nutrition</option>
                  <option>Health & Wellness</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                  Fulfilling Store / Seller
                </label>
                <select
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border-peach bg-surface-muted text-ink text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-coral/20"
                >
                  <option>PetNest Official Direct</option>
                  <option>Willow Creek Kennels</option>
                  <option>SilverMist Cattery</option>
                  <option>PetPurity Botanicals</option>
                  <option>CozyPaws Essentials</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-border-peach text-coral focus:ring-coral/20"
                  />
                  <div>
                    <span className="text-xs font-bold text-ink block">Mark as Featured Listing</span>
                    <span className="text-[11px] text-ink-muted">Display on PetNest homepage & marketplace carousel</span>
                  </div>
                </label>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-2">
                  Product Gallery
                </label>
                <div className="border-2 border-dashed border-border-peach rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-surface-muted/50 cursor-pointer transition-colors">
                  <UploadCloud className="size-8 text-coral mb-2" />
                  <p className="text-xs font-bold text-ink">Upload Product Images</p>
                  <p className="text-[11px] text-ink-muted mt-0.5">Drag & drop up to 8 images</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-muted border border-border-peach text-ink">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="size-5 text-coral shrink-0 mt-0.5" />
                <p className="text-xs text-ink-muted leading-relaxed">
                  Breeder listings are cross-referenced with regional ethical breeding registries and mandatory microchip databases.
                </p>
              </div>
            </div>
          </div>
        </form>
      </AnimatedContainer>
    </div>
  );
}
