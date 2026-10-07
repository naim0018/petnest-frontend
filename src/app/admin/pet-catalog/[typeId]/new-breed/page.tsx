"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import PrimaryButton from "@/components/common/PrimaryButton";
import { useHeaderAction } from "@/context/HeaderActionContext";
import { initialPetCatalogData } from "@/lib/data/petCatalog";
import { Award, CheckCircle2, ArrowLeft } from "lucide-react";

export default function AddNewBreedPage({
  params,
}: {
  params: Promise<{ typeId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { setHeaderAction } = useHeaderAction();
  const typeId = resolvedParams.typeId;

  const petType = initialPetCatalogData.find((pt) => pt.id === typeId) || initialPetCatalogData[0];

  const [name, setName] = useState("");
  const [origin, setOrigin] = useState("");
  const [size, setSize] = useState<"Toy" | "Small" | "Medium" | "Large" | "Giant">("Medium");
  const [careLevel, setCareLevel] = useState<"Low" | "Moderate" | "High">("Moderate");
  const [temperament, setTemperament] = useState("");
  const [imageUrl, setImageUrl] = useState("/CareGuide/breeds/dogs/golden-retriever.jpg");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setHeaderAction(
      <PrimaryButton
        variant="outline"
        size="sm"
        onClick={() => router.push(`/admin/pet-catalog/${typeId}`)}
        leftIcon={<ArrowLeft className="size-4" />}
        className="font-bold cursor-pointer"
      >
        Cancel
      </PrimaryButton>
    );

    return () => setHeaderAction(null);
  }, [router, setHeaderAction, typeId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        router.push(`/admin/pet-catalog/${typeId}`);
      }, 800);
    }, 500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <AnimatedContainer delay={0.05}>
        <div className="bg-card border border-border-peach rounded-xl p-6 sm:p-8 shadow-xs">
          <div className="border-b border-border-peach pb-4 mb-6">
            <h2 className="text-xl font-bold font-quicksand text-ink flex items-center gap-2">
              <Award className="size-5 text-coral" />
              Add Breed to {petType.name.split(" ")[0]}
            </h2>
            <p className="text-xs text-ink-muted mt-1">
              Specify breed origins, behavioral temperaments, physical scale, and maintenance care intensity.
            </p>
          </div>

          {success ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="size-12 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-ink text-lg font-quicksand">Breed Profile Registered!</h3>
              <p className="text-xs text-ink-muted">Redirecting to {petType.name} breeds...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-ink mb-1.5 font-quicksand">
                  Breed Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Australian Shepherd"
                  className="w-full px-3.5 py-2.5 bg-surface-soft border border-border-peach rounded-lg text-sm text-ink focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1.5 font-quicksand">
                    Origin / Country
                  </label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="e.g. United States / Western Pyrenees"
                    className="w-full px-3.5 py-2.5 bg-surface-soft border border-border-peach rounded-lg text-sm text-ink focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1.5 font-quicksand">
                    Size Category
                  </label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-surface-soft border border-border-peach rounded-lg text-sm text-ink focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all"
                  >
                    <option value="Toy">Toy</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                    <option value="Giant">Giant</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1.5 font-quicksand">
                    Care Level
                  </label>
                  <select
                    value={careLevel}
                    onChange={(e) => setCareLevel(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-surface-soft border border-border-peach rounded-lg text-sm text-ink focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all"
                  >
                    <option value="Low">Low Care (Self-sufficient)</option>
                    <option value="Moderate">Moderate Care (Regular grooming)</option>
                    <option value="High">High Care (Intense activity / grooming)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1.5 font-quicksand">
                    Photo URL or Local Path
                  </label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface-soft border border-border-peach rounded-lg text-sm text-ink focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1.5 font-quicksand">
                  Temperament Traits
                </label>
                <input
                  type="text"
                  value={temperament}
                  onChange={(e) => setTemperament(e.target.value)}
                  placeholder="e.g. Intelligent, Work-oriented, Highly Energetic, Devoted"
                  className="w-full px-3.5 py-2.5 bg-surface-soft border border-border-peach rounded-lg text-sm text-ink focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-peach">
                <PrimaryButton
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/admin/pet-catalog/${typeId}`)}
                >
                  Cancel
                </PrimaryButton>
                <PrimaryButton
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="min-w-32"
                >
                  {isSubmitting ? "Registering..." : "Save Breed"}
                </PrimaryButton>
              </div>
            </form>
          )}
        </div>
      </AnimatedContainer>
    </div>
  );
}
