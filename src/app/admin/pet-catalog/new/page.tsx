"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import PrimaryButton from "@/components/common/PrimaryButton";
import { useHeaderAction } from "@/context/HeaderActionContext";
import { PawPrint, CheckCircle2, ArrowLeft, Upload, Sparkles } from "lucide-react";

export default function AddPetTypePage() {
  const router = useRouter();
  const { setHeaderAction } = useHeaderAction();

  const [name, setName] = useState("");
  const [scientificGroup, setScientificGroup] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState("/CareGuideCard/dog-faq-mascot.png");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Set cancel/back button on Header or let breadcrumb do it
  useEffect(() => {
    setHeaderAction(
      <PrimaryButton
        variant="outline"
        size="sm"
        onClick={() => router.push("/admin/pet-catalog")}
        leftIcon={<ArrowLeft className="size-4" />}
        className="font-bold cursor-pointer"
      >
        Cancel
      </PrimaryButton>
    );

    return () => setHeaderAction(null);
  }, [router, setHeaderAction]);

  const presetImages = [
    { label: "Dog", url: "/CareGuideCard/dog-faq-mascot.png" },
    { label: "Cat", url: "/CareGuideCard/cat-faq-mascot.png" },
    { label: "Bird", url: "/CareGuideCard/budgie-faq-mascot.png" },
    { label: "Aquatic", url: "/CareGuideCard/aquatic-faq-mascot.png" },
    { label: "Small Pet", url: "/CareGuideCard/hamster-faq-mascot.png" },
    { label: "Reptile", url: "/CareGuideCard/reptile-faq-mascot.png" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/pet-catalog");
      }, 800);
    }, 500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <AnimatedContainer delay={0.05}>
        <div className="bg-card border border-border-peach rounded-xl p-6 sm:p-8 shadow-xs">
          <div className="border-b border-border-peach pb-4 mb-6">
            <h2 className="text-xl font-bold font-quicksand text-ink flex items-center gap-2">
              <PawPrint className="size-5 text-coral" />
              Add New Pet Type
            </h2>
            <p className="text-xs text-ink-muted mt-1">
              Create a new primary taxonomy class for companion animals across the PetNest platform.
            </p>
          </div>

          {success ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="size-12 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-ink text-lg font-quicksand">Pet Type Added Successfully!</h3>
              <p className="text-xs text-ink-muted">Redirecting to Pet Catalog directory...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-ink mb-1.5 font-quicksand">
                  Pet Type Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Horses (Equine)"
                  className="w-full px-3.5 py-2.5 bg-surface-soft border border-border-peach rounded-lg text-sm text-ink focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1.5 font-quicksand">
                  Scientific Classification
                </label>
                <input
                  type="text"
                  value={scientificGroup}
                  onChange={(e) => setScientificGroup(e.target.value)}
                  placeholder="e.g. Equus caballus"
                  className="w-full px-3.5 py-2.5 bg-surface-soft border border-border-peach rounded-lg text-sm text-ink focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1.5 font-quicksand">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide an overview of species companionship, lifestyle compatibility, and care overview..."
                  className="w-full px-3.5 py-2.5 bg-surface-soft border border-border-peach rounded-lg text-sm text-ink focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all resize-none"
                />
              </div>

              {/* Photo selection */}
              <div>
                <label className="block text-xs font-bold text-ink mb-1.5 font-quicksand">
                  Class Mascot / Display Photo
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-3">
                  {presetImages.map((img) => (
                    <button
                      type="button"
                      key={img.label}
                      onClick={() => setSelectedImage(img.url)}
                      className={`relative p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        selectedImage === img.url
                          ? "border-coral bg-coral-light/60 ring-2 ring-coral/20"
                          : "border-border-peach bg-surface-soft hover:border-coral/50"
                      }`}
                    >
                      <div className="relative size-12">
                        <Image
                          src={img.url}
                          alt={img.label}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-ink font-quicksand">
                        {img.label}
                      </span>
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={selectedImage}
                  onChange={(e) => setSelectedImage(e.target.value)}
                  placeholder="Custom image URL or /path"
                  className="w-full px-3 py-2 bg-surface-soft border border-border-peach rounded-lg text-xs text-ink focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-peach">
                <PrimaryButton
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/pet-catalog")}
                >
                  Cancel
                </PrimaryButton>
                <PrimaryButton
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="min-w-32"
                >
                  {isSubmitting ? "Saving..." : "Create Pet Type"}
                </PrimaryButton>
              </div>
            </form>
          )}
        </div>
      </AnimatedContainer>
    </div>
  );
}
