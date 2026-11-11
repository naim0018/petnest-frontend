"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import PrimaryButton from "@/components/common/PrimaryButton";
import { FormInput } from "@/components/common/FormInput";
import { FormTextarea } from "@/components/common/FormTextarea";
import FormSelect, { FormSelectOption } from "@/components/common/FormSelect";
import ImageUpload from "@/components/common/ImageUpload";
import { useHeaderAction } from "@/context/HeaderActionContext";
import { useFindOneSpeciesQuery, useCreateBreedMutation } from "@/store/Api/Pets/pets.api";
import { useUploadMediaMutation } from "@/store/Api/Media/media.api";
import type { PetSize, CareLevel } from "@/store/Api/Pets/pets.types";
import { Award, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

const sizeOptions: FormSelectOption[] = [
  { label: "Small (under 25 lbs)", value: "SMALL" },
  { label: "Medium (25 - 55 lbs)", value: "MEDIUM" },
  { label: "Large (55 - 85 lbs)", value: "LARGE" },
  { label: "Giant (85+ lbs)", value: "GIANT" },
];

const careLevelOptions: FormSelectOption[] = [
  { label: "Low Care (Self-sufficient)", value: "LOW" },
  { label: "Moderate Care (Regular grooming / exercise)", value: "MODERATE" },
  { label: "High Care (Intense activity / grooming)", value: "HIGH" },
];

export default function AddNewBreedPage({
  params,
}: {
  params: Promise<{ typeId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { setHeaderAction } = useHeaderAction();
  const typeId = resolvedParams.typeId;

  // Fetch parent species
  const { data: speciesResponse, isLoading: isSpeciesLoading } = useFindOneSpeciesQuery(typeId);
  const species = speciesResponse?.data;
  const parentSpeciesId = species?.id;
  const speciesDisplayName = species?.name || typeId;

  const [createBreed, { isLoading: isCreating }] = useCreateBreedMutation();
  const [uploadMedia, { isLoading: isUploading }] = useUploadMediaMutation();

  const [name, setName] = useState("");
  const [originCountry, setOriginCountry] = useState("");
  const [size, setSize] = useState<PetSize>("MEDIUM");
  const [careLevel, setCareLevel] = useState<CareLevel>("MODERATE");
  const [temperament, setTemperament] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ name?: string }>({});

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setErrors({ name: "Breed name must be at least 2 characters" });
      toast.error("Please enter a valid breed name (minimum 2 characters)");
      return;
    }
    setErrors({});

    const targetSpeciesId = parentSpeciesId || (typeId.includes("-") ? typeId : undefined);
    if (!targetSpeciesId) {
      toast.error("Could not resolve parent species ID. Please try again.");
      return;
    }

    setIsSubmitting(true);
    try {
      let finalImageUrl = imageUrl;

      // Upload local image if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("folder", "pets");
        const uploadRes = await uploadMedia(formData).unwrap();
        if (uploadRes?.data?.url) {
          finalImageUrl = uploadRes.data.url;
        }
      }

      await createBreed({
        name: trimmedName,
        speciesId: targetSpeciesId,
        originCountry: originCountry.trim() || undefined,
        size,
        careLevel,
        temperament: temperament.trim() || undefined,
        image: finalImageUrl || undefined,
      }).unwrap();

      toast.success(`Breed "${trimmedName}" registered successfully!`);
      setSuccess(true);
      setTimeout(() => {
        router.push(`/admin/pet-catalog/${typeId}`);
      }, 700);
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        (err as { message?: string })?.message ||
        "Failed to register breed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isActionDisabled = isSubmitting || isCreating || isUploading;

  return (
    <div className="w-full space-y-6">
      <AnimatedContainer delay={0.05}>
        <div className="bg-card border border-border-peach rounded-xl p-6 sm:p-8 shadow-xs">
          <div className="border-b border-border-peach pb-4 mb-6">
            <h2 className="text-xl font-bold font-quicksand text-ink flex items-center gap-2">
              <Award className="size-5 text-coral" />
              Add Breed to {speciesDisplayName}
            </h2>
            <p className="text-xs text-ink-muted mt-1">
              Specify breed origins, behavioral temperaments, physical scale, and maintenance care intensity.
            </p>
          </div>

          {isSpeciesLoading ? (
            <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
              <Loader2 className="size-8 text-coral animate-spin" />
              <p className="text-sm font-semibold text-ink-muted">Loading parent pet classification...</p>
            </div>
          ) : success ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="size-12 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-ink text-lg font-quicksand">Breed Profile Registered!</h3>
              <p className="text-xs text-ink-muted">Redirecting to {speciesDisplayName} catalog...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Two Column Grid: Left Fields, Right Image Upload */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Left Column: Reusable Form Inputs */}
                <div className="space-y-4">
                  <FormInput
                    label="Breed Name"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors({});
                    }}
                    placeholder="e.g. Australian Shepherd"
                    error={errors.name}
                  />

                  <FormInput
                    label="Origin / Country"
                    value={originCountry}
                    onChange={(e) => setOriginCountry(e.target.value)}
                    placeholder="e.g. United States / Western Pyrenees"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormSelect
                      label="Size Category"
                      options={sizeOptions}
                      value={size}
                      onChange={(val) => setSize(val as PetSize)}
                      placeholder="Select size..."
                    />

                    <FormSelect
                      label="Care Level"
                      options={careLevelOptions}
                      value={careLevel}
                      onChange={(val) => setCareLevel(val as CareLevel)}
                      placeholder="Select care level..."
                    />
                  </div>

                  <FormTextarea
                    label="Temperament Traits"
                    rows={3}
                    value={temperament}
                    onChange={(e) => setTemperament(e.target.value)}
                    placeholder="e.g. Intelligent, Work-oriented, Highly Energetic, Devoted"
                  />
                </div>

                {/* Right Column: Reusable Image Upload & Preview */}
                <div className="w-full">
                  <ImageUpload
                    label="Breed Photo Upload & Preview"
                    value={imageUrl}
                    onChange={(url) => setImageUrl(url)}
                    onFileSelect={(file) => setSelectedFile(file)}
                    placeholder="Click to upload or drag & drop breed photo"
                    helperText="PNG, JPG, WEBP, or SVG (Up to 10MB)"
                    height="h-[360px]"
                    allowManualInput={true}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-peach">
                <PrimaryButton
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/admin/pet-catalog/${typeId}`)}
                  disabled={isActionDisabled}
                >
                  Cancel
                </PrimaryButton>
                <PrimaryButton
                  type="submit"
                  variant="primary"
                  disabled={isActionDisabled}
                  className="min-w-36"
                >
                  {isActionDisabled ? "Registering..." : "Save Breed"}
                </PrimaryButton>
              </div>
            </form>
          )}
        </div>
      </AnimatedContainer>
    </div>
  );
}
