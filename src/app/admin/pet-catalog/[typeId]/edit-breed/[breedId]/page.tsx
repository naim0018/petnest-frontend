"use client";

import React, { use, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import PrimaryButton from "@/components/common/PrimaryButton";
import { FormInput } from "@/components/common/FormInput";
import { FormTextarea } from "@/components/common/FormTextarea";
import FormSelect, { FormSelectOption } from "@/components/common/FormSelect";
import FormTagsInput from "@/components/common/FormTagsInput";
import ImageUpload from "@/components/common/ImageUpload";
import { useHeaderAction } from "@/context/HeaderActionContext";
import {
  useFindOneSpeciesQuery,
  useFindOneBreedQuery,
  useUpdateBreedMutation,
} from "@/store/Api/Pets/pets.api";
import { useUploadMediaMutation } from "@/store/Api/Media/media.api";
import { COUNTRY_OPTIONS } from "@/lib/data/countries";
import { TEMPERAMENT_OPTIONS } from "@/lib/data/temperaments";
import type { PetSize, CareLevel } from "@/store/Api/Pets/pets.types";
import { Award, CheckCircle2, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const sizeOptions: FormSelectOption[] = [
  { label: "Small (under 10 kg)", value: "SMALL" },
  { label: "Medium (10 - 25 kg)", value: "MEDIUM" },
  { label: "Large (25 - 45 kg)", value: "LARGE" },
  { label: "Giant (45+ kg)", value: "GIANT" },
];

const careLevelOptions: FormSelectOption[] = [
  { label: "Low Care (Self-sufficient)", value: "LOW" },
  { label: "Moderate Care (Regular grooming / exercise)", value: "MODERATE" },
  { label: "High Care (Intense activity / grooming)", value: "HIGH" },
];

const defaultTagSuggestions = [
  "Friendly",
  "Active",
  "Family-friendly",
  "Intelligent",
  "Gentle",
  "Playful",
  "Calm",
  "Affectionate",
  "Loyal",
  "Alert",
  "Easy to Train",
];

export default function EditBreedPage({
  params,
}: {
  params: Promise<{ typeId: string; breedId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { setHeaderAction } = useHeaderAction();
  const { typeId, breedId } = resolvedParams;

  // Fetch parent species
  const { data: speciesResponse, isLoading: isSpeciesLoading } = useFindOneSpeciesQuery(typeId);
  const species = speciesResponse?.data;
  const speciesDisplayName = species?.name || typeId;

  // Fetch current breed
  const {
    data: breedResponse,
    isLoading: isBreedLoading,
    isError: isBreedError,
  } = useFindOneBreedQuery(breedId);
  const breed = breedResponse?.data;

  const [updateBreed, { isLoading: isUpdating }] = useUpdateBreedMutation();
  const [uploadMedia, { isLoading: isUploading }] = useUploadMediaMutation();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [originCountry, setOriginCountry] = useState("");
  const [size, setSize] = useState<PetSize>("MEDIUM");
  const [careLevel, setCareLevel] = useState<CareLevel>("MODERATE");
  const [temperament, setTemperament] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [shortDescription, setShortDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ name?: string }>({});

  // Pre-populate form when breed is loaded
  useEffect(() => {
    if (breed) {
      setName(breed.name || "");
      setSlug(breed.slug || "");
      setOriginCountry(breed.originCountry || "");
      setSize((breed.size as PetSize) || "MEDIUM");
      setCareLevel((breed.careLevel as CareLevel) || "MODERATE");
      setTemperament(breed.temperament || "");
      setTags(breed.tags || []);
      setShortDescription(breed.shortDescription || "");
      setImageUrl(breed.image || "");
    }
  }, [breed]);

  // Header Cancel Action
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

  const isSubmitting = isUpdating || isUploading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setErrors({ name: "Breed name must be at least 2 characters" });
      toast.error("Please enter a valid breed name (minimum 2 characters)");
      return;
    }
    setErrors({});

    if (!breed) return;

    try {
      let finalImageUrl = imageUrl.trim();

      // If user uploaded a new local file, upload it first
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("folder", "pets");
        const uploadRes = await uploadMedia(formData).unwrap();
        if (uploadRes?.data?.url) {
          finalImageUrl = uploadRes.data.url;
        }
      }

      await updateBreed({
        id: breed.id,
        payload: {
          name: trimmedName,
          slug: slug.trim() || undefined,
          originCountry: originCountry.trim() || undefined,
          size,
          careLevel,
          temperament: temperament.trim() || undefined,
          tags: tags.length > 0 ? tags : undefined,
          shortDescription: shortDescription.trim() || undefined,
          image: finalImageUrl || undefined,
        },
      }).unwrap();

      toast.success(`Breed "${trimmedName}" updated successfully!`);
      setSuccess(true);
      setTimeout(() => {
        router.push(`/admin/pet-catalog/${typeId}`);
      }, 700);
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        (err as { message?: string })?.message ||
        "Failed to update breed. Please try again.";
      toast.error(errorMsg);
    }
  };

  if (isSpeciesLoading || isBreedLoading) {
    return (
      <div className="p-16 text-center flex flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 text-coral animate-spin" />
        <p className="text-sm font-semibold text-ink-muted">Loading breed profile details...</p>
      </div>
    );
  }

  if (isBreedError || !breed) {
    return (
      <div className="p-12 text-center rounded-xl bg-card border border-border-peach space-y-3">
        <AlertCircle className="size-10 text-coral mx-auto" />
        <h3 className="font-bold text-ink text-base">Breed Not Found</h3>
        <p className="text-xs text-ink-muted">The requested breed record does not exist or failed to load.</p>
        <div className="pt-2">
          <PrimaryButton
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/pet-catalog/${typeId}`)}
          >
            Back to Breeds
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
              <Award className="size-5 text-coral" />
              Edit {breed.name} ({speciesDisplayName})
            </h2>
            <p className="text-xs text-ink-muted mt-1">
              Update breed origins, behavioral temperaments, physical scale, maintenance care, keywords, and overview.
            </p>
          </div>

          {success ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="size-12 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-ink text-lg font-quicksand">Changes Saved Successfully!</h3>
              <p className="text-xs text-ink-muted">Redirecting to breed catalog...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Two Column Grid: Left Fields, Right Media & Overview */}
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
                    placeholder="e.g. Golden Retriever"
                    error={errors.name}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormSelect
                      label="Origin / Country"
                      options={COUNTRY_OPTIONS}
                      value={originCountry}
                      onChange={(val) => setOriginCountry(val as string)}
                      placeholder="Select origin country..."
                      searchable={true}
                      paginated={true}
                      pageSize={8}
                    />

                    <FormInput
                      label="URL Slug (Optional)"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="e.g. golden-retriever"
                    />
                  </div>

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

                  <FormSelect
                    label="Temperament Traits"
                    options={TEMPERAMENT_OPTIONS}
                    value={temperament}
                    onChange={(val) => setTemperament(val as string)}
                    placeholder="Select temperament traits..."
                    multiple={true}
                    searchable={true}
                  />

                  {/* Reusable FormTagsInput */}
                  <FormTagsInput
                    label="Tags & Keywords"
                    value={tags}
                    onChange={setTags}
                    placeholder="Type a tag and press Enter or comma..."
                    suggestions={defaultTagSuggestions}
                    maxTags={20}
                    helperText="Keywords used for filters, recommendations, and search matching"
                  />
                </div>

                {/* Right Column: Media, Preview & Overview */}
                <div className="space-y-4">
                  <ImageUpload
                    label="Breed Photo Upload & Preview"
                    value={imageUrl}
                    onChange={(val) => setImageUrl(val)}
                    onFileSelect={(file) => setSelectedFile(file)}
                    placeholder="Click to upload or drag & drop breed photo"
                    helperText="PNG, JPG, WEBP, or SVG (Up to 10MB)"
                    height="h-[220px]"
                    allowManualInput={true}
                  />

                  {/* Live Breed Summary Card Preview */}
                  <div className="p-4 rounded-xl bg-surface-soft border border-border-peach space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-ink-muted uppercase tracking-wider font-quicksand">
                        Live Preview
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-coral/10 text-coral border border-coral/20">
                        {speciesDisplayName}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative size-14 rounded-lg bg-surface-muted overflow-hidden shrink-0 border border-border-peach">
                        <Image
                          src={imageUrl || species?.image || "/CareGuideCard/dog-faq-mascot.png"}
                          alt={name || "Preview"}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm text-ink truncate font-quicksand">
                          {name || "Breed Name"}
                        </p>
                        <p className="text-xs text-ink-muted truncate">
                          {originCountry || "Origin unspecified"} • {size} Size
                        </p>
                        {temperament && (
                          <p className="text-[11px] text-ink-faint truncate italic">
                            &ldquo;{temperament}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Reusable FormTextarea */}
                  <FormTextarea
                    label="Overview / Short Description"
                    rows={4}
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="A concise description of breed history, physical attributes, and personality..."
                  />
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-peach">
                <PrimaryButton
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/admin/pet-catalog/${typeId}`)}
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
