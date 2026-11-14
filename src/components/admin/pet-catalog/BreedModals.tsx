"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import PrimaryButton from "@/components/common/PrimaryButton";
import { FormInput } from "@/components/common/FormInput";
import { FormTextarea } from "@/components/common/FormTextarea";
import FormSelect, { FormSelectOption } from "@/components/common/FormSelect";
import FormTagsInput from "@/components/common/FormTagsInput";
import ImageUpload from "@/components/common/ImageUpload";
import ConfirmModal from "@/components/reuseable/ConfirmModal";
import { useUpdateBreedMutation, useRemoveBreedMutation } from "@/store/Api/Pets/pets.api";
import { useUploadMediaMutation } from "@/store/Api/Media/media.api";
import { COUNTRY_OPTIONS, COUNTRIES } from "@/lib/data/countries";
import type { PetBreed, PetSize, CareLevel } from "@/store/Api/Pets/pets.types";
import { PawPrint, Globe, Shield, Heart, Award, Pencil, CheckCircle2 } from "lucide-react";
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

function formatCareLevel(level?: string | null) {
  if (!level) return null;
  const upper = level.toUpperCase();
  if (upper === "LOW") return "Low";
  if (upper === "HIGH") return "High";
  return "Moderate";
}

function formatSize(size?: string | null) {
  if (!size) return null;
  const upper = size.toUpperCase();
  if (upper === "SMALL") return "Small (under 10 kg)";
  if (upper === "MEDIUM") return "Medium (10 - 25 kg)";
  if (upper === "LARGE") return "Large (25 - 45 kg)";
  if (upper === "GIANT") return "Giant (45+ kg)";
  return size;
}

function getCountryFlag(countryName?: string | null) {
  if (!countryName) return "";
  const found = COUNTRIES.find(
    (c) =>
      c.name.toLowerCase() === countryName.toLowerCase() ||
      countryName.toLowerCase().includes(c.name.toLowerCase())
  );
  return found ? found.flag : "🌍";
}

// ============================================
// 1. BREED DETAILS MODAL
// ============================================

interface BreedDetailsModalProps {
  breed: PetBreed | null;
  speciesName?: string;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
}

export function BreedDetailsModal({
  breed,
  speciesName,
  isOpen,
  onClose,
  onEdit,
}: BreedDetailsModalProps) {
  if (!breed) return null;

  const formattedCare = formatCareLevel(breed.careLevel);
  const formattedSizeText = formatSize(breed.size);
  const flag = getCountryFlag(breed.originCountry);

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <ModalHeader
          title={breed.name}
          description={`Standardized profile for ${speciesName || breed.species?.name || "pet breed"}`}
        />

        <ModalBody className="space-y-4">
          {/* Banner Image - Fully visible, uncropped */}
          <div className="relative h-52 w-full rounded-xl overflow-hidden border border-border-peach bg-gradient-to-b from-surface-soft via-surface-muted/30 to-surface-soft/60 p-2 flex items-center justify-center shadow-2xs">
            <div className="relative w-full h-full">
              <Image
                src={breed.image || "/CareGuideCard/dog-faq-mascot.png"}
                alt={breed.name}
                fill
                className="object-contain drop-shadow-sm p-1.5"
              />
            </div>
            {formattedCare && (
              <span
                className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-bold shadow-md z-10 ${
                  formattedCare === "High"
                    ? "bg-rose-50 text-rose-600 dark:bg-rose-950/90 dark:text-rose-300"
                    : formattedCare === "Moderate"
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-950/90 dark:text-amber-300"
                    : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/90 dark:text-emerald-300"
                }`}
              >
                {formattedCare} Care
              </span>
            )}
          </div>

          {/* Quick Stats Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-2.5 rounded-xl bg-surface-soft border border-border-peach/60 space-y-0.5">
              <span className="text-[10px] text-ink-muted font-bold uppercase flex items-center gap-1">
                <Globe className="size-3 text-sky-500" /> Origin
              </span>
              <p className="text-xs font-bold text-ink truncate">
                {flag} {breed.originCountry || "Worldwide"}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-surface-soft border border-border-peach/60 space-y-0.5">
              <span className="text-[10px] text-ink-muted font-bold uppercase flex items-center gap-1">
                <Shield className="size-3 text-coral" /> Size Scale
              </span>
              <p className="text-xs font-bold text-ink truncate">
                {formattedSizeText || "Medium"}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-surface-soft border border-border-peach/60 space-y-0.5 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-ink-muted font-bold uppercase flex items-center gap-1">
                <CheckCircle2 className="size-3 text-emerald-500" /> Status
              </span>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Active Catalog
              </p>
            </div>
          </div>

          {/* Temperament Traits */}
          {breed.temperament && (
            <div className="space-y-1.5">
              <h5 className="text-xs font-bold text-ink uppercase tracking-wider font-quicksand flex items-center gap-1.5">
                <Heart className="size-3.5 text-coral" />
                Temperament Traits
              </h5>
              <div className="p-3 rounded-xl bg-card border border-border-peach text-xs font-medium text-ink italic leading-relaxed">
                &ldquo;{breed.temperament}&rdquo;
              </div>
            </div>
          )}

          {/* Tags & Keywords */}
          {breed.tags && breed.tags.length > 0 && (
            <div className="space-y-1.5">
              <h5 className="text-xs font-bold text-ink uppercase tracking-wider font-quicksand">
                Tags & Lifestyle Keywords
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {breed.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-coral-light/30 text-coral border border-coral/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Short Description */}
          <div className="space-y-1.5">
            <h5 className="text-xs font-bold text-ink uppercase tracking-wider font-quicksand">
              Overview & Care Guide Notes
            </h5>
            <div className="p-3.5 rounded-xl bg-card border border-border-peach text-xs text-ink-muted leading-relaxed max-h-36 overflow-y-auto">
              {breed.shortDescription || "No detailed overview notes entered for this breed."}
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <PrimaryButton
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Close
          </PrimaryButton>
          {onEdit && (
            <PrimaryButton
              variant="primary"
              size="sm"
              onClick={() => {
                onClose();
                onEdit();
              }}
              leftIcon={<Pencil className="size-3.5" />}
            >
              Edit Breed
            </PrimaryButton>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// ============================================
// 2. BREED EDIT MODAL
// ============================================

interface BreedEditModalProps {
  breed: PetBreed | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BreedEditModal({ breed, isOpen, onClose }: BreedEditModalProps) {
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
  const [errors, setErrors] = useState<{ name?: string }>({});

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
      setSelectedFile(null);
      setErrors({});
    }
  }, [breed, isOpen]);

  if (!breed) return null;

  const isSubmitting = isUpdating || isUploading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setErrors({ name: "Breed name must be at least 2 characters" });
      toast.error("Please enter a valid breed name");
      return;
    }
    setErrors({});

    try {
      let finalImageUrl = imageUrl.trim();

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
      onClose();
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        (err as { message?: string })?.message ||
        "Failed to update breed";
      toast.error(errorMsg);
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <ModalContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
        <ModalHeader
          title={`Edit ${breed.name}`}
          description="Update breed taxonomy, size scaling, temperament, and care level."
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <ModalBody className="space-y-4">
            {/* Name and Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                label="URL Slug (Optional)"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. australian-shepherd"
              />
            </div>

            {/* Origin Country with Search & Pagination */}
            <FormSelect
              label="Origin Country"
              value={originCountry}
              onChange={(val) => setOriginCountry(val as string)}
              options={COUNTRY_OPTIONS}
              searchable
              paginated
              pageSize={10}
              placeholder="Search or select country..."
            />

            {/* Size Category & Care Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormSelect
                label="Size Category"
                value={size}
                onChange={(val) => setSize(val as PetSize)}
                options={sizeOptions}
              />
              <FormSelect
                label="Care Level"
                value={careLevel}
                onChange={(val) => setCareLevel(val as CareLevel)}
                options={careLevelOptions}
              />
            </div>

            {/* Temperament Traits */}
            <FormInput
              label="Temperament Traits"
              value={temperament}
              onChange={(e) => setTemperament(e.target.value)}
              placeholder="e.g. Friendly, Intelligent, Devoted, Energetic"
            />

            {/* Tags and Keywords */}
            <FormTagsInput
              label="Tags & Keywords"
              value={tags}
              onChange={setTags}
              suggestions={defaultTagSuggestions}
              maxTags={20}
              helperText="Keywords used for filters, recommendations, and search matching"
            />

            {/* Overview / Description */}
            <FormTextarea
              label="Overview / Description"
              rows={3}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Provide a concise description of breed history and companionship..."
            />

            {/* Breed Photo Upload */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-ink uppercase tracking-wider font-quicksand">
                Breed Photo
              </label>
              <ImageUpload
                value={imageUrl}
                onChange={(val) => setImageUrl(val)}
                onFileSelect={(file) => setSelectedFile(file)}
                height="h-36"
                helperText="PNG, JPG, WEBP, or SVG up to 10MB"
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <PrimaryButton
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </PrimaryButton>
            <PrimaryButton
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
            >
              Save Changes
            </PrimaryButton>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

// ============================================
// 3. BREED DELETE MODAL
// ============================================

interface BreedDeleteModalProps {
  breed: PetBreed | null;
  speciesName?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function BreedDeleteModal({ breed, isOpen, onClose, onSuccess }: BreedDeleteModalProps) {
  const [removeBreed, { isLoading: isDeleting }] = useRemoveBreedMutation();

  if (!breed) return null;

  const handleDelete = async () => {
    try {
      await removeBreed(breed.id).unwrap();
      toast.success(`Breed "${breed.name}" deleted successfully!`);
      onClose();
      onSuccess?.();
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        (err as { message?: string })?.message ||
        "Failed to delete breed";
      toast.error(errorMsg);
    }
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      loading={isDeleting}
      variant="danger"
      title={`Delete "${breed.name}"?`}
      description="Are you sure you want to delete this breed? It will be permanently removed from the catalog and search indexing."
      confirmText="Yes, Delete Breed"
      cancelText="Cancel"
    />
  );
}
