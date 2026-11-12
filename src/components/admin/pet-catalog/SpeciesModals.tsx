"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import PrimaryButton from "@/components/common/PrimaryButton";
import { FormInput } from "@/components/common/FormInput";
import { FormTextarea } from "@/components/common/FormTextarea";
import ImageUpload from "@/components/common/ImageUpload";
import ConfirmModal from "@/components/reuseable/ConfirmModal";
import { useUpdateSpeciesMutation, useRemoveSpeciesMutation } from "@/store/Api/Pets/pets.api";
import { useUploadMediaMutation } from "@/store/Api/Media/media.api";
import type { PetSpecies } from "@/store/Api/Pets/pets.types";
import { PawPrint, Layers, Award, AlertTriangle, Eye, Pencil, ArrowRight, Trash2 } from "lucide-react";
import { toast } from "sonner";

const presetMascots = [
  { label: "Dog", url: "/CareGuideCard/dog-faq-mascot.png" },
  { label: "Cat", url: "/CareGuideCard/cat-faq-mascot.png" },
  { label: "Bird", url: "/CareGuideCard/budgie-faq-mascot.png" },
  { label: "Aquatic", url: "/CareGuideCard/aquatic-faq-mascot.png" },
  { label: "Small Pet", url: "/CareGuideCard/hamster-faq-mascot.png" },
  { label: "Reptile", url: "/CareGuideCard/reptile-faq-mascot.png" },
];

// ============================================
// 1. SPECIES DETAILS MODAL
// ============================================

interface SpeciesDetailsModalProps {
  species: PetSpecies | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
}

export function SpeciesDetailsModal({
  species,
  isOpen,
  onClose,
  onEdit,
}: SpeciesDetailsModalProps) {
  const router = useRouter();
  if (!species) return null;

  const breedCount = species.breeds?.length ?? species._count?.breeds ?? 0;

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent className="max-w-lg">
        <ModalHeader
          title={species.name}
          description="Pet Taxonomy Classification & Catalog Overview"
        />

        <ModalBody className="space-y-4">
          {/* Header Visual Hero */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-surface-soft to-surface-muted/60 border border-border-peach">
            <div className="relative size-20 rounded-xl bg-white dark:bg-card border border-border-peach p-2 shrink-0 shadow-2xs flex items-center justify-center">
              <Image
                src={species.image || "/CareGuideCard/dog-faq-mascot.png"}
                alt={species.name}
                fill
                className="object-contain p-1"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-bold font-quicksand text-ink truncate">
                {species.name}
              </h4>
              <p className="text-xs text-ink-muted italic font-medium">
                {species.scientificGroup || "General Classification"}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-coral/10 text-coral border border-coral/20">
                  {breedCount} Registered {breedCount === 1 ? "Breed" : "Breeds"}
                </span>
                <span className="text-[11px] font-mono text-ink-faint">
                  /{species.slug}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h5 className="text-xs font-bold text-ink uppercase tracking-wider font-quicksand">
              Description & Companion Overview
            </h5>
            <div className="p-3.5 rounded-xl bg-card border border-border-peach text-xs text-ink-muted leading-relaxed max-h-40 overflow-y-auto">
              {species.shortDescription || "No detailed overview provided for this pet classification yet."}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-surface-soft/60 border border-border-peach/60 space-y-0.5">
              <span className="text-[10px] text-ink-muted font-bold uppercase">Created On</span>
              <p className="font-semibold text-ink">
                {species.createdAt ? new Date(species.createdAt).toLocaleDateString() : "System Standard"}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-surface-soft/60 border border-border-peach/60 space-y-0.5">
              <span className="text-[10px] text-ink-muted font-bold uppercase">Last Updated</span>
              <p className="font-semibold text-ink">
                {species.updatedAt ? new Date(species.updatedAt).toLocaleDateString() : "Recent"}
              </p>
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
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onEdit();
              }}
              leftIcon={<Pencil className="size-3.5 text-amber-500" />}
            >
              Edit Pet Type
            </PrimaryButton>
          )}
          <PrimaryButton
            variant="primary"
            size="sm"
            onClick={() => {
              onClose();
              router.push(`/admin/pet-catalog/${species.slug || species.id}`);
            }}
            rightIcon={<ArrowRight className="size-3.5" />}
          >
            Browse Breeds
          </PrimaryButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// ============================================
// 2. SPECIES EDIT MODAL
// ============================================

interface SpeciesEditModalProps {
  species: PetSpecies | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SpeciesEditModal({ species, isOpen, onClose }: SpeciesEditModalProps) {
  const [updateSpecies, { isLoading: isUpdating }] = useUpdateSpeciesMutation();
  const [uploadMedia, { isLoading: isUploading }] = useUploadMediaMutation();

  const [name, setName] = useState("");
  const [scientificGroup, setScientificGroup] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState("/CareGuideCard/dog-faq-mascot.png");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (species) {
      setName(species.name || "");
      setScientificGroup(species.scientificGroup || "");
      setShortDescription(species.shortDescription || "");
      setSelectedImage(species.image || "/CareGuideCard/dog-faq-mascot.png");
      setSelectedFile(null);
      setErrors({});
    }
  }, [species, isOpen]);

  if (!species) return null;

  const isSubmitting = isUpdating || isUploading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setErrors({ name: "Pet type name must be at least 2 characters" });
      toast.error("Please enter a valid pet type name");
      return;
    }
    setErrors({});

    try {
      let finalImageUrl = selectedImage;

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
          shortDescription: shortDescription.trim() || undefined,
          image: finalImageUrl || undefined,
        },
      }).unwrap();

      toast.success(`Pet Type "${trimmedName}" updated successfully!`);
      onClose();
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        (err as { message?: string })?.message ||
        "Failed to update pet type";
      toast.error(errorMsg);
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <ModalContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <ModalHeader
          title={`Edit ${species.name}`}
          description="Update taxonomy classification, scientific group, and display mascot."
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <ModalBody className="space-y-4">
            <FormInput
              label="Pet Type Name"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({});
              }}
              placeholder="e.g. Dogs (Canine)"
              error={errors.name}
            />

            <FormInput
              label="Scientific Classification"
              value={scientificGroup}
              onChange={(e) => setScientificGroup(e.target.value)}
              placeholder="e.g. Canis lupus familiaris"
            />

            <FormTextarea
              label="Description"
              rows={3}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Provide an overview of species companionship and care..."
            />

            {/* Mascot Image Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-ink uppercase tracking-wider font-quicksand">
                Class Mascot / Display Photo
              </label>

              {/* Preset Mascots */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {presetMascots.map((preset) => {
                  const isSelected = selectedImage === preset.url && !selectedFile;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setSelectedImage(preset.url);
                        setSelectedFile(null);
                      }}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "border-coral bg-coral/10 ring-2 ring-coral/20"
                          : "border-border-peach bg-surface-soft hover:border-coral/50"
                      }`}
                    >
                      <div className="relative size-8 mb-1">
                        <Image
                          src={preset.url}
                          alt={preset.label}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-ink line-clamp-1">
                        {preset.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Image Upload or Direct URL */}
              <div className="pt-2">
                <ImageUpload
                  value={selectedImage}
                  onChange={(val) => setSelectedImage(val)}
                  onFileSelect={(file) => setSelectedFile(file)}
                  height="h-32"
                  helperText="PNG, JPG, WEBP or SVG up to 10MB"
                />
              </div>
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
// 3. SPECIES DELETE MODAL
// ============================================

interface SpeciesDeleteModalProps {
  species: PetSpecies | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SpeciesDeleteModal({
  species,
  isOpen,
  onClose,
  onSuccess,
}: SpeciesDeleteModalProps) {
  const router = useRouter();
  const [removeSpecies, { isLoading: isDeleting }] = useRemoveSpeciesMutation();
  const [forceDelete, setForceDelete] = useState(false);

  // Reset force delete state when modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      setForceDelete(false);
    }
  }, [isOpen]);

  if (!species) return null;

  const breedCount = species.breeds?.length ?? species._count?.breeds ?? 0;
  const hasBreeds = breedCount > 0;

  const handleDelete = async (isForced = false) => {
    try {
      await removeSpecies({ id: species.id, force: isForced }).unwrap();
      toast.success(
        isForced && breedCount > 0
          ? `Pet Type "${species.name}" and ${breedCount} registered ${breedCount === 1 ? "breed" : "breeds"} deleted successfully!`
          : `Pet Type "${species.name}" deleted successfully!`
      );
      onClose();
      onSuccess?.();
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        (err as { message?: string })?.message ||
        "Failed to delete pet type";
      toast.error(errorMsg);
    }
  };

  // If species has child breeds, provide dependency notice with a force delete option
  if (hasBreeds) {
    return (
      <Modal open={isOpen} onOpenChange={(open) => !open && !isDeleting && onClose()}>
        <ModalContent className="max-w-md">
          <ModalHeader
            title={forceDelete ? `Force Delete "${species.name}"?` : `Delete "${species.name}"`}
            description={
              forceDelete
                ? "This will cascade-delete this pet classification and all child breeds."
                : "Active dependencies detected in the pet catalog."
            }
          />

          <ModalBody className="space-y-3.5">
            {/* Warning Alert */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300">
              <AlertTriangle className="size-5 shrink-0 text-amber-500 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold">
                  This pet classification contains {breedCount} registered {breedCount === 1 ? "breed" : "breeds"}.
                </p>
                <p className="leading-relaxed opacity-90">
                  To safeguard data integrity, species with breeds are protected by default. You can manage and reassign its breeds, or enable force delete below to remove the classification and all its breeds in one action.
                </p>
              </div>
            </div>

            {/* Force Delete Option Toggle / Checkbox */}
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50/70 dark:bg-red-950/20 border border-red-200/90 dark:border-red-900/40 cursor-pointer select-none transition-colors hover:bg-red-50 dark:hover:bg-red-950/30">
              <input
                type="checkbox"
                checked={forceDelete}
                onChange={(e) => setForceDelete(e.target.checked)}
                disabled={isDeleting}
                className="mt-0.5 size-4 rounded border-red-300 text-coral focus:ring-coral accent-coral cursor-pointer shrink-0"
              />
              <div className="text-xs space-y-1">
                <p className="font-bold text-red-700 dark:text-red-400">
                  Force delete with all {breedCount} registered {breedCount === 1 ? "breed" : "breeds"}
                </p>
                <p className="text-ink-muted leading-relaxed">
                  Permanently cascade-delete this pet type and remove all {breedCount} associated breed profiles from the catalog.
                </p>
              </div>
            </label>
          </ModalBody>

          <ModalFooter>
            <PrimaryButton
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </PrimaryButton>

            {forceDelete ? (
              <PrimaryButton
                variant="danger"
                size="sm"
                onClick={() => handleDelete(true)}
                isLoading={isDeleting}
                leftIcon={<Trash2 className="size-3.5" />}
              >
                Yes, Force Delete All
              </PrimaryButton>
            ) : (
              <PrimaryButton
                variant="primary"
                size="sm"
                onClick={() => {
                  onClose();
                  router.push(`/admin/pet-catalog/${species.slug || species.id}`);
                }}
                rightIcon={<ArrowRight className="size-3.5" />}
              >
                Manage {species.name.split(" ")[0]} Breeds
              </PrimaryButton>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  // If 0 breeds, show standard destructive confirmation
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={() => handleDelete(false)}
      loading={isDeleting}
      variant="danger"
      title={`Delete "${species.name}"?`}
      description="Are you sure you want to delete this pet classification? This action is permanent and cannot be undone."
      confirmText="Yes, Delete Classification"
      cancelText="Cancel"
    />
  );
}
