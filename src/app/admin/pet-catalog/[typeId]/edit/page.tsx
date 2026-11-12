"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import PrimaryButton from "@/components/common/PrimaryButton";
import { FormInput } from "@/components/common/FormInput";
import { FormTextarea } from "@/components/common/FormTextarea";
import ImageUpload from "@/components/common/ImageUpload";
import { useHeaderAction } from "@/context/HeaderActionContext";
import {
  useFindOneSpeciesQuery,
  useUpdateSpeciesMutation,
} from "@/store/Api/Pets/pets.api";
import { useUploadMediaMutation } from "@/store/Api/Media/media.api";
import { PawPrint, CheckCircle2, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const presetImages = [
  { label: "Dog", url: "/CareGuideCard/dog-faq-mascot.png" },
  { label: "Cat", url: "/CareGuideCard/cat-faq-mascot.png" },
  { label: "Bird", url: "/CareGuideCard/budgie-faq-mascot.png" },
  { label: "Aquatic", url: "/CareGuideCard/aquatic-faq-mascot.png" },
  { label: "Small Pet", url: "/CareGuideCard/hamster-faq-mascot.png" },
  { label: "Reptile", url: "/CareGuideCard/reptile-faq-mascot.png" },
];

export default function EditPetTypePage({
  params,
}: {
  params: Promise<{ typeId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { setHeaderAction } = useHeaderAction();
  const typeId = resolvedParams.typeId;

  const {
    data: speciesResponse,
    isLoading: isLoadingSpecies,
    isError,
  } = useFindOneSpeciesQuery(typeId);
  const species = speciesResponse?.data;

  const [updateSpecies, { isLoading: isUpdating }] = useUpdateSpeciesMutation();
  const [uploadMedia, { isLoading: isUploading }] = useUploadMediaMutation();

  const [name, setName] = useState("");
  const [scientificGroup, setScientificGroup] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState("/CareGuideCard/dog-faq-mascot.png");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ name?: string }>({});

  // Pre-populate state when species data is loaded
  useEffect(() => {
    if (species) {
      setName(species.name || "");
      setScientificGroup(species.scientificGroup || "");
      setDescription(species.shortDescription || "");
      setSelectedImage(species.image || "/CareGuideCard/dog-faq-mascot.png");
    }
  }, [species]);

  const isSubmitting = isUpdating || isUploading;

  // Header Cancel Action
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setErrors({ name: "Pet type name must be at least 2 characters" });
      toast.error("Please enter a valid pet type name (minimum 2 characters)");
      return;
    }
    setErrors({});

    if (!species) return;

    try {
      let finalImageUrl = selectedImage;

      // If user selected a new local file, upload it first
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("folder", "pets");
        const uploadRes = await uploadMedia(formData).unwrap();
        if (uploadRes?.data?.url) {
          finalImageUrl = uploadRes.data.url;
        }
      }

      await updateSpecies({
        id: species.id,
        payload: {
          name: trimmedName,
          scientificGroup: scientificGroup.trim() || undefined,
          shortDescription: description.trim() || undefined,
          image: finalImageUrl || undefined,
        },
      }).unwrap();

      toast.success(`Pet Type "${trimmedName}" updated successfully!`);
      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/pet-catalog");
      }, 700);
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        (err as { message?: string })?.message ||
        "Failed to update pet type. Please try again.";
      toast.error(errorMsg);
    }
  };

  if (isLoadingSpecies) {
    return (
      <div className="p-16 text-center flex flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 text-coral animate-spin" />
        <p className="text-sm font-semibold text-ink-muted">Loading pet type classification...</p>
      </div>
    );
  }

  if (isError || !species) {
    return (
      <div className="p-12 text-center rounded-xl bg-card border border-border-peach space-y-3">
        <AlertCircle className="size-10 text-coral mx-auto" />
        <h3 className="font-bold text-ink text-base">Pet Classification Not Found</h3>
        <p className="text-xs text-ink-muted">
          Could not locate the requested pet classification record.
        </p>
        <div className="pt-2">
          <PrimaryButton
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/pet-catalog")}
          >
            Back to Pet Catalog
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <AnimatedContainer delay={0.05}>
        <div className="bg-card border border-border-peach rounded-xl p-6 sm:p-8 shadow-xs">
          <div className="border-b border-border-peach pb-4 mb-6">
            <h2 className="text-xl font-bold font-quicksand text-ink flex items-center gap-2">
              <PawPrint className="size-5 text-coral" />
              Edit {species.name}
            </h2>
            <p className="text-xs text-ink-muted mt-1">
              Update primary taxonomy classification, scientific group, and display mascot.
            </p>
          </div>

          {success ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="size-12 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-ink text-lg font-quicksand">Changes Saved Successfully!</h3>
              <p className="text-xs text-ink-muted">Redirecting to Pet Catalog directory...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Two Column Layout: Left Details, Right Image Upload */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Left Column: Reusable Inputs */}
                <div className="space-y-4">
                  <FormInput
                    label="Pet Type Name"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors({});
                    }}
                    placeholder="e.g. Horses (Equine)"
                    error={errors.name}
                  />

                  <FormInput
                    label="Scientific Classification"
                    value={scientificGroup}
                    onChange={(e) => setScientificGroup(e.target.value)}
                    placeholder="e.g. Equus caballus"
                  />

                  <FormTextarea
                    label="Description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide an overview of species companionship, lifestyle compatibility, and care overview..."
                  />
                </div>

                {/* Right Column: Mascots & Reusable Image Upload */}
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-ink font-quicksand mb-1.5 uppercase tracking-wider">
                      Or choose a preset mascot:
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {presetImages.map((img) => (
                        <button
                          type="button"
                          key={img.label}
                          onClick={() => {
                            setSelectedImage(img.url);
                            setSelectedFile(null);
                          }}
                          className={`relative p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                            selectedImage === img.url && !selectedFile
                              ? "border-coral bg-coral-light/60 ring-2 ring-coral/20"
                              : "border-border-peach bg-surface-soft hover:border-coral/50"
                          }`}
                        >
                          <div className="relative size-8">
                            <Image
                              src={img.url}
                              alt={img.label}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <span className="text-[9px] font-bold text-ink font-quicksand truncate">
                            {img.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <ImageUpload
                    label="Class Mascot / Display Photo"
                    value={selectedImage}
                    onChange={(url) => setSelectedImage(url)}
                    onFileSelect={(file) => setSelectedFile(file)}
                    placeholder="Click to upload or drag & drop mascot photo"
                    helperText="PNG, JPG, SVG, or WEBP (Up to 10MB)"
                    height="h-[300px]"
                    allowManualInput={true}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-peach">
                <PrimaryButton
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/pet-catalog")}
                  disabled={isSubmitting}
                >
                  Cancel
                </PrimaryButton>
                <PrimaryButton
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                  className="min-w-36"
                >
                  Save Changes
                </PrimaryButton>
              </div>
            </form>
          )}
        </div>
      </AnimatedContainer>
    </div>
  );
}
