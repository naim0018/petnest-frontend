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
import { Modal, ModalContent } from "@/components/ui/modal";
import { useHeaderAction } from "@/context/HeaderActionContext";
import { useFindOneSpeciesQuery, useCreateBreedMutation } from "@/store/Api/Pets/pets.api";
import { useUploadMediaMutation } from "@/store/Api/Media/media.api";
import { COUNTRY_OPTIONS } from "@/lib/data/countries";
import { TEMPERAMENT_OPTIONS } from "@/lib/data/temperaments";
import type { PetSize, CareLevel } from "@/store/Api/Pets/pets.types";
import { Award, CheckCircle2, ArrowLeft } from "lucide-react";
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
  const [slug, setSlug] = useState("");
  const [originCountry, setOriginCountry] = useState("");
  const [size, setSize] = useState<PetSize>("MEDIUM");
  const [careLevel, setCareLevel] = useState<CareLevel>("MODERATE");
  const [temperament, setTemperament] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [shortDescription, setShortDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdBreedInfo, setCreatedBreedInfo] = useState<{
    name: string;
    image?: string;
    size: PetSize;
    careLevel: CareLevel;
    originCountry?: string;
  } | null>(null);
  const [errors, setErrors] = useState<{ name?: string }>({});

  const handleResetForm = () => {
    setName("");
    setSlug("");
    setOriginCountry("");
    setSize("MEDIUM");
    setCareLevel("MODERATE");
    setTemperament("");
    setTags([]);
    setShortDescription("");
    setImageUrl("");
    setSelectedFile(null);
    setErrors({});
    setShowSuccessModal(false);
    setCreatedBreedInfo(null);
  };

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
        slug: slug.trim() || undefined,
        originCountry: originCountry.trim() || undefined,
        size,
        careLevel,
        temperament: temperament.trim() || undefined,
        shortDescription: shortDescription.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
        image: finalImageUrl || undefined,
      }).unwrap();

      toast.success(`Breed "${trimmedName}" registered successfully!`);
      setCreatedBreedInfo({
        name: trimmedName,
        image: finalImageUrl || undefined,
        size,
        careLevel,
        originCountry: originCountry.trim() || undefined,
      });
      setShowSuccessModal(true);
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
              Specify breed origins, behavioral temperaments, physical scale, maintenance care, keywords, and overview.
            </p>
          </div>

          {isSpeciesLoading ? (
            <div className="space-y-6 animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Left Inputs */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="h-3 w-24 bg-surface-muted rounded" />
                    <div className="h-10 w-full bg-surface-muted/40 rounded-xl" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-3 w-28 bg-surface-muted rounded" />
                      <div className="h-10 w-full bg-surface-muted/40 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-20 bg-surface-muted rounded" />
                      <div className="h-10 w-full bg-surface-muted/40 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-28 bg-surface-muted rounded" />
                    <div className="h-10 w-full bg-surface-muted/40 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-32 bg-surface-muted rounded" />
                    <div className="h-10 w-full bg-surface-muted/40 rounded-xl" />
                  </div>
                </div>

                {/* Right Media & Overview */}
                <div className="space-y-4">
                  <div className="h-44 w-full rounded-xl border-2 border-dashed border-border-peach bg-surface-muted/20" />
                  <div className="space-y-2">
                    <div className="h-3 w-28 bg-surface-muted rounded" />
                    <div className="h-24 w-full bg-surface-muted/40 rounded-xl" />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-border-peach">
                <div className="h-10 w-24 bg-surface-muted rounded-xl" />
                <div className="h-10 w-32 bg-surface-muted rounded-xl" />
              </div>
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
                      onChange={(val) => setOriginCountry(val)}
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
                    onChange={(val) => setTemperament(val)}
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
                    maxTagLength={30}
                    helperText="Keywords used for filters, recommendations, and search matching"
                  />
                </div>

                {/* Right Column: Reusable Image Upload & Overview Description */}
                <div className="space-y-4 w-full">
                  <ImageUpload
                    label="Breed Photo Upload & Preview"
                    value={imageUrl}
                    onChange={(url) => setImageUrl(url)}
                    onFileSelect={(file) => setSelectedFile(file)}
                    placeholder="Click to upload or drag & drop breed photo"
                    helperText="PNG, JPG, WEBP, or SVG (Up to 10MB)"
                    height="h-[320px]"
                    allowManualInput={true}
                  />

                  <FormTextarea
                    label="Overview / Short Description"
                    rows={3}
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="e.g. Friendly, intelligent, and devoted family dogs."
                    maxCharCount={300}
                    charCount={shortDescription.length}
                    helperText="A concise summary of the breed's companion suitability (up to 300 characters)"
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

      {/* Success Modal */}
      <Modal open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <ModalContent className="max-w-md p-6 bg-card border border-border-peach">
          <div className="flex flex-col items-center text-center space-y-3 pt-1">
            <div className="size-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-2xs">
              <CheckCircle2 className="size-8 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-ink font-quicksand">
                Breed Registered Successfully!
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                <span className="font-semibold text-ink">{createdBreedInfo?.name}</span> has been added to the{" "}
                <span className="font-semibold text-coral">{speciesDisplayName}</span> catalog.
              </p>
            </div>
          </div>

          {createdBreedInfo && (
            <div className="p-3 rounded-xl bg-surface-soft border border-border-peach/80 flex items-center gap-3 mt-1">
              <div className="relative size-14 rounded-lg bg-surface-muted overflow-hidden shrink-0 border border-border-peach/50">
                <Image
                  src={createdBreedInfo.image || species?.image || "/CareGuideCard/dog-faq-mascot.png"}
                  alt={createdBreedInfo.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-bold text-ink truncate font-quicksand">
                  {createdBreedInfo.name}
                </p>
                {createdBreedInfo.originCountry && (
                  <p className="text-[11px] text-ink-muted truncate">
                    {createdBreedInfo.originCountry}
                  </p>
                )}
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-card border border-border-peach text-ink-muted">
                    {createdBreedInfo.size.charAt(0) + createdBreedInfo.size.slice(1).toLowerCase()}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-card border border-border-peach text-ink-muted">
                    {createdBreedInfo.careLevel.charAt(0) + createdBreedInfo.careLevel.slice(1).toLowerCase()} Care
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border-peach mt-3">
            <PrimaryButton
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetForm}
              className="font-bold cursor-pointer"
            >
              Add Another
            </PrimaryButton>
            <PrimaryButton
              type="button"
              variant="primary"
              size="sm"
              onClick={() => router.push(`/admin/pet-catalog/${typeId}`)}
              className="font-bold cursor-pointer"
            >
              View in Catalog
            </PrimaryButton>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
