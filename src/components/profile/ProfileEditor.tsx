"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Camera,
  Loader2,
  Sparkles,
  Heart,
  Save,
  KeyRound,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import PrimaryButton from "@/components/common/PrimaryButton";
import FormInput from "@/components/common/FormInput";
import PasswordInput from "@/components/common/PasswordInput";
import FormTextarea from "@/components/common/FormTextarea";
import FormSelect from "@/components/common/FormSelect";
import { useAppDispatch } from "@/hooks/useRedux";
import { setUser } from "@/store/features/AuthSlice/authSlice";
import {
  useGetMeQuery,
  useUpdateMeMutation,
  useChangePasswordMutation,
} from "@/store/Api/User/user.api";
import { useUploadMediaMutation } from "@/store/Api/Media/media.api";
import { useFindAllSpeciesQuery } from "@/store/Api/Pets/pets.api";
import { toast } from "sonner";

interface ProfileEditorProps {
  roleScope: "admin" | "user";
}

export default function ProfileEditor({ roleScope }: ProfileEditorProps) {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Queries & Mutations
  const { data: meResponse, isLoading: isMeLoading } = useGetMeQuery();
  const { data: speciesResponse } = useFindAllSpeciesQuery();
  const [updateMe, { isLoading: isUpdating }] = useUpdateMeMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [uploadMedia, { isLoading: isUploadingAvatar }] = useUploadMediaMutation();

  const user = meResponse?.data;
  const speciesList = speciesResponse?.data?.items || [];

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [interestedSpeciesId, setInterestedSpeciesId] = useState<string>("");
  const [interestedBreedId, setInterestedBreedId] = useState<string>("");

  // Change Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Populate form when user data loads
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setBio(user.profile?.bio || "");
      setSpecialization(user.profile?.specialization || "");
      setAvatar(user.profile?.avatar || "");
      setAddress(user.profile?.address || "");
      setCity(user.profile?.city && user.profile.city !== "Unknown" ? user.profile.city : "");
      setCountry(user.profile?.country && user.profile.country !== "Unknown" ? user.profile.country : "");
      setZipCode(user.profile?.zipCode || "");
      setInterestedSpeciesId(user.interestedSpeciesId || "");
      setInterestedBreedId(user.interestedBreedId || "");
    }
  }, [user]);

  // Selected species for filtering breeds
  const selectedSpecies = speciesList.find((s) => s.id === interestedSpeciesId);
  const availableBreeds = selectedSpecies?.breeds || [];

  // Reusable FormSelect options
  const speciesOptions = [
    { value: "", label: "No preference (All Pets)" },
    ...speciesList.map((s) => ({ value: s.id, label: s.name })),
  ];

  const breedOptions = [
    {
      value: "",
      label: !interestedSpeciesId
        ? "Select a species first"
        : availableBreeds.length === 0
        ? "No breeds in catalog"
        : "No preference (Any Breed)",
    },
    ...availableBreeds.map((b) => ({ value: b.id, label: b.name })),
  ];

  // Handle species change
  const handleSpeciesChange = (speciesId: string) => {
    setInterestedSpeciesId(speciesId);
    setInterestedBreedId(""); // Reset breed when species changes
  };

  // Cleanup object URL when preview changes or component unmounts
  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  // Local file selection for avatar preview (deferred upload on save)
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (PNG, JPG, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    if (avatarPreview && avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    setAvatarFile(file);
    toast.info("Photo preview updated. Click 'Save Profile Changes' to apply.");
  };

  // Generate random Dicebear avatar
  const handleGenerateAvatar = () => {
    if (avatarPreview && avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarFile(null);
    setAvatarPreview("");
    const randomSeed = Math.random().toString(36).substring(7);
    const newAvatarUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${randomSeed}`;
    setAvatar(newAvatarUrl);
    toast.info("Generated new avatar. Click 'Save Profile Changes' to apply.");
  };

  // Save profile
  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      let finalAvatarUrl = avatar;

      // Upload staged avatar photo only when saving profile changes
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        formData.append("folder", "avatars");

        const uploadRes = await uploadMedia(formData).unwrap();
        const uploadedUrl = uploadRes?.data?.url;
        if (uploadedUrl) {
          finalAvatarUrl = uploadedUrl;
        }
      }

      const payload = {
        name: name.trim(),
        phone: phone.trim() || undefined,
        bio: bio.trim() || undefined,
        specialization: specialization.trim() || undefined,
        avatar: finalAvatarUrl ? finalAvatarUrl.trim() : undefined,
        address: address.trim() || undefined,
        city: city.trim() || undefined,
        country: country.trim() || undefined,
        zipCode: zipCode.trim() || undefined,
        interestedSpeciesId: interestedSpeciesId || null,
        interestedBreedId: interestedBreedId || null,
      };

      const response = await updateMe(payload).unwrap();
      const updatedUser = response?.data;

      if (updatedUser) {
        setAvatar(updatedUser.profile?.avatar || finalAvatarUrl);
        setAvatarFile(null);
        setAvatarPreview("");
        dispatch(
          setUser({
            ...updatedUser,
            userId: updatedUser.id,
          })
        );
      }

      toast.success("Profile updated successfully!");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.message || "Failed to update profile";
      toast.error(errorMsg);
    }
  };

  // Change password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("Current password is required");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      await changePassword({
        currentPassword,
        newPassword,
      }).unwrap();

      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.message || "Failed to change password";
      toast.error(errorMsg);
    }
  };

  if (isMeLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-coral" />
      </div>
    );
  }

  const displayAvatar =
    avatarPreview ||
    avatar ||
    `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(name || "PetNest")}`;

  const currentRole = user?.role || (roleScope === "admin" ? "ADMIN" : "USER");

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="w-full space-y-6">
      {/* Top Bar Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-quicksand text-ink">
            {roleScope === "admin" ? "Admin Profile" : "My Profile"}
          </h2>
          <p className="text-sm text-ink-muted mt-1">
            Manage your personal credentials, contact details, pet preferences, and security.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PrimaryButton
            variant="primary"
            size="md"
            leftIcon={<Save className="size-4" />}
            isLoading={isUpdating || isUploadingAvatar}
            onClick={() => handleSaveProfile()}
            className="font-bold cursor-pointer"
          >
            Save Profile Changes
          </PrimaryButton>
        </div>
      </div>

      {/* Main Grid: 2 Columns on Desktop */}
      <AnimatedContainer delay={0.1}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Form Cards (Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card 1: Personal Details */}
            <div className="rounded-xl border border-border-peach bg-card p-6 sm:p-7 shadow-xs space-y-5">
              <div className="border-b border-border-peach pb-4 flex items-center justify-between">
                <h3 className="text-base font-bold font-quicksand text-ink flex items-center gap-2">
                  <User className="size-4.5 text-coral" />
                  Personal Information
                </h3>
                <span className="text-xs text-ink-muted font-medium">
                  Public profile details
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Reusable FormInput: Full Name */}
                <FormInput
                  label="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  leftIcon={<User className="size-4" />}
                />

                {/* Reusable FormInput: Email Address (Disabled) */}
                <FormInput
                  label="Email Address"
                  type="email"
                  disabled
                  value={user?.email || ""}
                  leftIcon={<Mail className="size-4" />}
                  rightIcon={<Lock className="size-4 text-ink-faint" />}
                  helperText="Account email cannot be modified"
                />

                {/* Reusable FormInput: Phone Number */}
                <FormInput
                  label="Phone Number"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +14155552671"
                  leftIcon={<Phone className="size-4" />}
                  helperText="Include country prefix (+1, +880, etc.)"
                />

                {/* Reusable FormInput: Professional Title / Specialization */}
                <FormInput
                  label="Professional Title / Byline"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g. DVM · Avian Specialist or Pet Parent"
                  maxLength={150}
                  leftIcon={<Briefcase className="size-4" />}
                  helperText="Shown alongside guides & comments"
                />

                {/* Reusable FormTextarea: Bio & Introduction */}
                <FormTextarea
                  label="Bio & Introduction"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  charCount={bio.length}
                  maxCharCount={300}
                  placeholder="Share a short introduction about your veterinary experience, pet rescue journey, or care passion..."
                  containerClassName="sm:col-span-2"
                />
              </div>
            </div>

            {/* Card 2: Location & Address */}
            <div className="rounded-xl border border-border-peach bg-card p-6 sm:p-7 shadow-xs space-y-5">
              <div className="border-b border-border-peach pb-4 flex items-center justify-between">
                <h3 className="text-base font-bold font-quicksand text-ink flex items-center gap-2">
                  <MapPin className="size-4.5 text-coral" />
                  Address & Location
                </h3>
                <span className="text-xs text-ink-muted font-medium">
                  Regional recommendations
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <FormInput
                  label="Street Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 124 Pet Haven Way"
                  leftIcon={<MapPin className="size-4" />}
                  containerClassName="sm:col-span-2"
                />

                <FormInput
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. San Francisco"
                />

                <FormInput
                  label="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. United States"
                />
              </div>
            </div>

            {/* Card 3: Pet Companion Preferences with Reusable FormSelect */}
            <div className="rounded-xl border border-border-peach bg-card p-6 sm:p-7 shadow-xs space-y-5">
              <div className="border-b border-border-peach pb-4 flex items-center justify-between">
                <h3 className="text-base font-bold font-quicksand text-ink flex items-center gap-2">
                  <Heart className="size-4.5 text-coral" />
                  Pet Companion Preferences
                </h3>
                <span className="text-xs text-ink-muted font-medium">
                  Customized feed & alerts
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormSelect
                  label="Preferred Species"
                  placeholder="No preference (All Pets)"
                  options={speciesOptions}
                  value={interestedSpeciesId}
                  onChange={handleSpeciesChange}
                  leftIcon={<Heart className="size-4 text-coral" />}
                  searchable
                />

                <FormSelect
                  label="Preferred Breed"
                  placeholder={
                    !interestedSpeciesId
                      ? "Select a species first"
                      : availableBreeds.length === 0
                      ? "No breeds in catalog"
                      : "No preference (Any Breed)"
                  }
                  options={breedOptions}
                  value={interestedBreedId}
                  onChange={(val) => setInterestedBreedId(val)}
                  disabled={!interestedSpeciesId || availableBreeds.length === 0}
                  leftIcon={<Heart className="size-4 text-coral" />}
                  searchable
                />
              </div>
            </div>
          </div>

          {/* Right Column: Avatar & Security (Span 1) */}
          <div className="space-y-6">
            {/* Avatar Card */}
            <div className="rounded-xl border border-border-peach bg-card p-6 shadow-xs space-y-5 text-center">
              <div className="border-b border-border-peach pb-4 flex items-center justify-between">
                <h3 className="text-base font-bold font-quicksand text-ink flex items-center gap-2">
                  <Camera className="size-4.5 text-coral" />
                  Profile Photo
                </h3>
                {avatarPreview ? (
                  <span className="text-[11px] text-amber-600 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full">
                    Preview (Unsaved)
                  </span>
                ) : (
                  <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>

              {/* Avatar Photo Frame */}
              <div className="relative mx-auto size-32 rounded-2xl overflow-hidden border-2 border-border-peach bg-surface-muted shadow-xs group">
                <Image
                  src={displayAvatar}
                  alt={name || "Avatar"}
                  width={128}
                  height={128}
                  unoptimized
                  className="w-full h-full object-cover"
                />

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarFileChange}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUpdating || isUploadingAvatar}
                  className="absolute inset-0 bg-ink/50 backdrop-blur-xs flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:opacity-50"
                >
                  <Camera className="size-6 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {avatarPreview ? "Change Photo" : "Upload"}
                  </span>
                </button>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-sm text-ink font-quicksand">{name || "User"}</p>
                <p className="text-xs text-ink-muted">{user?.email}</p>
                <div className="pt-2">
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-coral/10 text-coral border border-coral/20">
                    {currentRole}
                  </span>
                </div>
              </div>

              {/* Photo Actions */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-9 rounded-lg border border-border-peach hover:border-coral bg-surface-muted hover:bg-coral-light/20 text-xs font-semibold text-ink transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Camera className="size-3.5 text-coral" />
                  <span>Upload Custom Photo</span>
                </button>
                <button
                  type="button"
                  onClick={handleGenerateAvatar}
                  className="w-full h-9 rounded-lg border border-border-peach hover:border-coral bg-surface-muted hover:bg-coral-light/20 text-xs font-semibold text-ink transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="size-3.5 text-amber-500" />
                  <span>Generate Avatar</span>
                </button>
              </div>

              <p className="text-[10px] text-ink-muted pt-1">
                Supports PNG, JPG, or WEBP up to 5MB
              </p>
            </div>

            {/* Password Change Card with Reusable PasswordInput */}
            <div className="rounded-xl border border-border-peach bg-card p-6 shadow-xs space-y-4">
              <div className="border-b border-border-peach pb-4 flex items-center justify-between">
                <h3 className="text-base font-bold font-quicksand text-ink flex items-center gap-2">
                  <KeyRound className="size-4.5 text-coral" />
                  Change Password
                </h3>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-3.5">
                <PasswordInput
                  label="Current Password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                />

                <PasswordInput
                  label="New Password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  helperText="At least 6 characters"
                />

                <PasswordInput
                  label="Confirm Password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />

                <div className="pt-2">
                  <PrimaryButton
                    variant="outline"
                    size="sm"
                    fullWidth
                    leftIcon={<KeyRound className="size-3.5 text-coral" />}
                    isLoading={isChangingPassword}
                    type="submit"
                    className="font-bold cursor-pointer"
                  >
                    Update Password
                  </PrimaryButton>
                </div>
              </form>
            </div>

            {/* Account Details Card */}
            <div className="rounded-xl border border-border-peach bg-card p-6 shadow-xs space-y-3.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink border-b border-border-peach pb-3">
                Account Summary
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-ink-muted">Account Status</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" /> Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-muted">System Role</span>
                  <span className="font-bold text-ink">{currentRole}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-muted">Member Since</span>
                  <span className="font-bold text-ink">{formattedDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedContainer>
    </div>
  );
}
