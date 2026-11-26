"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import PrimaryButton from "@/components/common/PrimaryButton";
import FormSelect from "@/components/common/FormSelect";
import { FormInput } from "@/components/common/FormInput";
import { FormTextarea } from "@/components/common/FormTextarea";
import { FileUpload } from "@/components/common/DynamicForm/FormFields/FileUpload";
import {
  ShoppingBag,
  Save,
  Sliders,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  PawPrint,
  Utensils,
  Package,
  BookOpen,
  Pill,
  ShieldCheck,
  Truck,
  Video,
  UploadCloud,
  Film,
  Trash2,
  Loader2,
  Link2,
} from "lucide-react";
import { toast } from "sonner";
import {
  useCreateAccessoryMutation,
  useCreateBookMutation,
  useCreateLivePetMutation,
  useCreateMedicineMutation,
  useCreatePetFoodMutation,
} from "@/store/Api/Marketplace/marketplace.api";
import {
  useFindAllSpeciesQuery,
  useFindBreedsBySpeciesQuery,
} from "@/store/Api/Pets/pets.api";
import { useUploadMediaMutation, useUploadVideoMutation } from "@/store/Api/Media/media.api";
import {
  AccessoryCategory,
  BookFormat,
  FoodLifeStage,
  FoodType,
  HealthVerificationStatus,
  ListingStatus,
  LiveDeliveryMethod,
  MedicineDosageForm,
  PetGender,
  WeightUnit,
} from "@/store/Api/Marketplace/marketplace.types";

type DomainTab = "LIVE_PET" | "PET_FOOD" | "GEAR_ACCESSORIES" | "BOOKS" | "MEDICINE";

const DOMAIN_TABS: { id: DomainTab; label: string; icon: React.ReactNode; subtitle: string }[] = [
  { id: "LIVE_PET", label: "Live Pet", icon: <PawPrint className="size-4" />, subtitle: "Breeder pedigrees & live animals" },
  { id: "PET_FOOD", label: "Pet Food", icon: <Utensils className="size-4" />, subtitle: "Seeds, kibble & supplements" },
  { id: "GEAR_ACCESSORIES", label: "Accessories", icon: <Package className="size-4" />, subtitle: "Cages, perches & gear" },
  { id: "BOOKS", label: "Books & Media", icon: <BookOpen className="size-4" />, subtitle: "Breeding & care literature" },
  { id: "MEDICINE", label: "Medicine & Health", icon: <Pill className="size-4" />, subtitle: "Veterinary healthcare & vitamins" },
];

export default function CreateListingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DomainTab>("LIVE_PET");

  // API Mutations
  const [createLivePet, { isLoading: isPetLoading }] = useCreateLivePetMutation();
  const [createPetFood, { isLoading: isFoodLoading }] = useCreatePetFoodMutation();
  const [createAccessory, { isLoading: isAccessoryLoading }] = useCreateAccessoryMutation();
  const [createBook, { isLoading: isBookLoading }] = useCreateBookMutation();
  const [createMedicine, { isLoading: isMedicineLoading }] = useCreateMedicineMutation();
  const [uploadMedia] = useUploadMediaMutation();
  const [uploadVideo] = useUploadVideoMutation();

  // Pet Catalog queries
  const { data: speciesData } = useFindAllSpeciesQuery();
  const speciesList = speciesData?.data?.items || [];
  const speciesOptions = useMemo(
    () => speciesList.map((s) => ({ value: s.id, label: s.name })),
    [speciesList]
  );

  // Common listing state
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [buyingPrice, setBuyingPrice] = useState("");
  const [inventory, setInventory] = useState("1");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 3-Tier Media State
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  // Video State (Cloudflare R2 Direct Upload + YouTube/Vimeo Links)
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [videoInputUrl, setVideoInputUrl] = useState("");
  const [isVideoUploading, setIsVideoUploading] = useState(false);

  // Live Pet state
  const [petSpeciesId, setPetSpeciesId] = useState("");
  const [petBreedId, setPetBreedId] = useState("");
  const [petGender, setPetGender] = useState<PetGender>("UNSEXED");
  const [petAge, setPetAge] = useState("");
  const [petMutation, setPetMutation] = useState("");
  const [petRingNumber, setPetRingNumber] = useState("");
  const [petMicrochip, setPetMicrochip] = useState("");
  const [petHealthStatus, setPetHealthStatus] = useState<HealthVerificationStatus>("HEALTHY_UNVERIFIED");
  const [petDewormed, setPetDewormed] = useState(false);
  const [petVaccinated, setPetVaccinated] = useState(false);
  const [petDeliveryMethod, setPetDeliveryMethod] = useState<LiveDeliveryMethod>("LOCAL_PICKUP");
  const [petTransitGuarantee, setPetTransitGuarantee] = useState(true);

  // Query breeds dynamically for selected species
  const { data: breedsData } = useFindBreedsBySpeciesQuery(
    { speciesIdOrSlug: petSpeciesId },
    {
      skip: !petSpeciesId,
    }
  );
  const breedOptions = useMemo(
    () => (breedsData?.data?.items || []).map((b) => ({ value: b.id, label: b.name })),
    [breedsData]
  );

  // Pet Food state
  const [foodTargetSpeciesId, setFoodTargetSpeciesId] = useState("");
  const [foodBrand, setFoodBrand] = useState("");
  const [foodType, setFoodType] = useState<FoodType>("SEED_MIX");
  const [foodLifeStage, setFoodLifeStage] = useState<FoodLifeStage>("ALL_STAGES");
  const [foodNetWeight, setFoodNetWeight] = useState("1.0");
  const [foodWeightUnit, setFoodWeightUnit] = useState<WeightUnit>("KG");
  const [foodIngredients, setFoodIngredients] = useState("");
  const [foodExpiryDate, setFoodExpiryDate] = useState("");
  const [foodIsOrganic, setFoodIsOrganic] = useState(false);

  // Accessory state
  const [accessoryCategory, setAccessoryCategory] = useState<AccessoryCategory>("CAGE");
  const [accessoryTargetSpeciesId, setAccessoryTargetSpeciesId] = useState("");
  const [accessoryBrand, setAccessoryBrand] = useState("");
  const [accessoryDimensions, setAccessoryDimensions] = useState("");
  const [accessoryBarSpacing, setAccessoryBarSpacing] = useState("");
  const [accessoryMaterial, setAccessoryMaterial] = useState("");
  const [accessoryColor, setAccessoryColor] = useState("");
  const [accessorySizeOption, setAccessorySizeOption] = useState("");

  // Book state
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookPublisher, setBookPublisher] = useState("");
  const [bookLanguage, setBookLanguage] = useState("English");
  const [bookFormat, setBookFormat] = useState<BookFormat>("PAPERBACK");
  const [bookIsbn, setBookIsbn] = useState("");
  const [bookPages, setBookPages] = useState("");
  const [bookYear, setBookYear] = useState(new Date().getFullYear().toString());
  const [bookDownloadUrl, setBookDownloadUrl] = useState("");

  // Medicine state
  const [medicineGenericName, setMedicineGenericName] = useState("");
  const [medicineManufacturer, setMedicineManufacturer] = useState("");
  const [medicineDosageForm, setMedicineDosageForm] = useState<MedicineDosageForm>("WATER_SOLUBLE_POWDER");
  const [medicinePackSize, setMedicinePackSize] = useState("");
  const [medicinePrescriptionRequired, setMedicinePrescriptionRequired] = useState(false);
  const [medicineDosageInstructions, setMedicineDosageInstructions] = useState("");
  const [medicineExpiryDate, setMedicineExpiryDate] = useState("");
  const [medicineBatchNumber, setMedicineBatchNumber] = useState("");

  const isSubmitting =
    isPetLoading || isFoodLoading || isAccessoryLoading || isBookLoading || isMedicineLoading;

  const handleSaveListing = async (status: ListingStatus) => {
    if (!title.trim()) {
      toast.error("Please enter a listing title");
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    try {
      // 1. Upload thumbnail
      let thumbnailUrl: string | undefined;
      if (thumbnailFile) {
        const formData = new FormData();
        formData.append("file", thumbnailFile);
        formData.append("folder", "marketplace");
        const res = await uploadMedia(formData).unwrap();
        if (res?.data?.url) thumbnailUrl = res.data.url;
      }

      // 2. Upload banner
      let bannerUrl: string | undefined;
      if (bannerFile) {
        const formData = new FormData();
        formData.append("file", bannerFile);
        formData.append("folder", "marketplace");
        const res = await uploadMedia(formData).unwrap();
        if (res?.data?.url) bannerUrl = res.data.url;
      }

      // 3. Fallback resolution between thumbnail and banner
      const effectiveThumbnail =
        thumbnailUrl ||
        bannerUrl ||
        "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80";
      const effectiveCover = bannerUrl || thumbnailUrl || effectiveThumbnail;

      // 4. Upload gallery images
      const galleryUrls: string[] = [];
      for (const file of galleryFiles) {
        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", "marketplace");
          const res = await uploadMedia(formData).unwrap();
          if (res?.data?.url) galleryUrls.push(res.data.url);
        } catch {
          galleryUrls.push(URL.createObjectURL(file));
        }
      }

      const parsedPrice = parseFloat(price);
      const parsedSalePrice = salePrice ? parseFloat(salePrice) : undefined;
      const parsedBuyingPrice = buyingPrice ? parseFloat(buyingPrice) : undefined;
      const parsedQty = parseInt(inventory, 10) || 1;

      if (activeTab === "LIVE_PET") {
        if (!petSpeciesId) {
          toast.error("Please select a pet species from the Pet Catalog");
          return;
        }
        if (!petAge.trim()) {
          toast.error("Please enter age or weaning status for the animal");
          return;
        }

        await createLivePet({
          title,
          price: parsedPrice,
          salePrice: parsedSalePrice,
          buyingPrice: parsedBuyingPrice,
          quantity: parsedQty,
          speciesId: petSpeciesId,
          breedId: petBreedId || undefined,
          gender: petGender,
          ageText: petAge,
          colorMutation: petMutation || undefined,
          ringNumber: petRingNumber || undefined,
          microchipId: petMicrochip || undefined,
          healthStatus: petHealthStatus,
          dewormed: petDewormed,
          vaccinated: petVaccinated,
          deliveryMethod: petDeliveryMethod,
          transitGuarantee: petTransitGuarantee,
          thumbnailImage: effectiveThumbnail,
          coverImage: effectiveCover,
          galleryImages: galleryUrls,
          videoUrls,
          description: description || "No description provided.",
          isFeatured,
          status,
          storeName: "PetNest Official Direct",
        }).unwrap();
      } else if (activeTab === "PET_FOOD") {
        if (!foodBrand.trim()) {
          toast.error("Please enter the food brand name");
          return;
        }
        if (!foodTargetSpeciesId) {
          toast.error("Please select target species for this food");
          return;
        }

        await createPetFood({
          title,
          price: parsedPrice,
          salePrice: parsedSalePrice,
          buyingPrice: parsedBuyingPrice,
          stockQuantity: parsedQty,
          brand: foodBrand,
          foodType,
          lifeStage: foodLifeStage,
          netWeight: parseFloat(foodNetWeight) || 1.0,
          weightUnit: foodWeightUnit,
          targetSpeciesId: foodTargetSpeciesId,
          ingredients: foodIngredients || undefined,
          expiryDate: foodExpiryDate || undefined,
          isOrganic: foodIsOrganic,
          thumbnailImage: effectiveThumbnail,
          coverImage: effectiveCover,
          galleryImages: galleryUrls,
          videoUrls,
          description: description || "No description provided.",
          isFeatured,
          status,
          storeName: "PetNest Official Direct",
        }).unwrap();
      } else if (activeTab === "GEAR_ACCESSORIES") {
        await createAccessory({
          title,
          price: parsedPrice,
          salePrice: parsedSalePrice,
          buyingPrice: parsedBuyingPrice,
          stockQuantity: parsedQty,
          category: accessoryCategory,
          brand: accessoryBrand || undefined,
          targetSpeciesId: accessoryTargetSpeciesId || undefined,
          dimensions: accessoryDimensions || undefined,
          barSpacing: accessoryBarSpacing || undefined,
          material: accessoryMaterial || undefined,
          color: accessoryColor || undefined,
          sizeOption: accessorySizeOption || undefined,
          thumbnailImage: effectiveThumbnail,
          coverImage: effectiveCover,
          galleryImages: galleryUrls,
          videoUrls,
          description: description || "No description provided.",
          isFeatured,
          status,
          storeName: "PetNest Official Direct",
        }).unwrap();
      } else if (activeTab === "BOOKS") {
        if (!bookAuthor.trim()) {
          toast.error("Please enter author name");
          return;
        }

        await createBook({
          title,
          price: parsedPrice,
          salePrice: parsedSalePrice,
          buyingPrice: parsedBuyingPrice,
          stockQuantity: parsedQty,
          author: bookAuthor,
          publisher: bookPublisher || undefined,
          language: bookLanguage,
          format: bookFormat,
          isbn: bookIsbn || undefined,
          totalPages: bookPages ? parseInt(bookPages, 10) : undefined,
          publicationYear: bookYear ? parseInt(bookYear, 10) : undefined,
          downloadUrl: bookDownloadUrl || undefined,
          thumbnailImage: effectiveThumbnail,
          coverImage: effectiveCover,
          galleryImages: galleryUrls,
          videoUrls,
          description: description || "No description provided.",
          isFeatured,
          status,
          storeName: "PetNest Official Direct",
        }).unwrap();
      } else if (activeTab === "MEDICINE") {
        if (!medicineGenericName.trim()) {
          toast.error("Please specify generic active chemical name");
          return;
        }
        if (!medicinePackSize.trim()) {
          toast.error("Please enter packaging size (e.g., 100g sachet, 50ml bottle)");
          return;
        }

        await createMedicine({
          title,
          price: parsedPrice,
          salePrice: parsedSalePrice,
          buyingPrice: parsedBuyingPrice,
          stockQuantity: parsedQty,
          genericName: medicineGenericName,
          manufacturer: medicineManufacturer || undefined,
          dosageForm: medicineDosageForm,
          packSize: medicinePackSize,
          prescriptionRequired: medicinePrescriptionRequired,
          dosageInstructions: medicineDosageInstructions || "Follow veterinarian advice.",
          expiryDate: medicineExpiryDate || undefined,
          batchNumber: medicineBatchNumber || undefined,
          thumbnailImage: effectiveThumbnail,
          coverImage: effectiveCover,
          galleryImages: galleryUrls,
          videoUrls,
          description: description || "No description provided.",
          isFeatured,
          status,
          storeName: "PetNest Official Direct",
        }).unwrap();
      }

      setIsSuccess(true);
      toast.success(
        status === "ACTIVE"
          ? "Marketplace listing published successfully!"
          : "Marketplace listing draft saved!"
      );
      router.push("/admin/marketplace/listings");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save marketplace listing");
    }
  };

  return (
    <div className="w-full space-y-6">
      {isSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Marketplace listing saved successfully to database catalog.</span>
          </div>
          <button
            type="button"
            onClick={() => setIsSuccess(false)}
            className="text-emerald-700 dark:text-emerald-400 hover:underline text-xs cursor-pointer font-quicksand font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TOP DOMAIN SELECTOR PILLS */}
      <div className="rounded-xl border border-border-peach bg-card p-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {DOMAIN_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-quicksand ${
                  isActive
                    ? "bg-coral text-white shadow-sm"
                    : "bg-surface-muted text-ink hover:bg-peach/30 hover:text-coral"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatedContainer delay={0.1}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveListing("ACTIVE");
          }}
          className="space-y-6 w-full"
        >
          {/* Main 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            {/* Left Column: Core & Specialized Listing Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Card 1: Primary Details */}
              <div className="rounded-lg border border-border-peach bg-card p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-border-peach pb-3">
                  <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
                    General Listing Info ({DOMAIN_TABS.find((t) => t.id === activeTab)?.label})
                  </h3>
                  <span className="text-xs text-ink-muted">
                    {DOMAIN_TABS.find((t) => t.id === activeTab)?.subtitle}
                  </span>
                </div>

                <FormInput
                  label="Listing Title"
                  placeholder={
                    activeTab === "LIVE_PET"
                      ? "e.g., Hand-Tamed Lutino Cockatiel Pair"
                      : activeTab === "PET_FOOD"
                      ? "e.g., Versele-Laga Prestige Premium Budgies Seed Mix"
                      : activeTab === "GEAR_ACCESSORIES"
                      ? "e.g., Powder-Coated Medium Flight Cage with Stand"
                      : activeTab === "BOOKS"
                      ? "e.g., The Complete Guide to Budgerigar Color Mutations"
                      : "e.g., Avian Electrolyte Plus Soluble Powder"
                  }
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />

                <FormTextarea
                  label="Full Description & Specifications"
                  placeholder="Detail temperament, lineage, diet, care guidelines, package contents or usage notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <FormInput
                    label="Price (BDT ৳)"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 1500.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                  <FormInput
                    label="Sale Price (Optional)"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 1350.00"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                  />
                  <FormInput
                    label="Buying Price / Cost (Optional)"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 950.00"
                    value={buyingPrice}
                    onChange={(e) => setBuyingPrice(e.target.value)}
                  />
                  <FormInput
                    label={activeTab === "LIVE_PET" ? "Animals / Pairs" : "Available Stock"}
                    type="number"
                    min="1"
                    placeholder="1"
                    value={inventory}
                    onChange={(e) => setInventory(e.target.value)}
                    required
                  />
                </div>

                {/* Live Margin Calculation Badge */}
                {(() => {
                  const effectiveRetail = parseFloat(salePrice || price);
                  const cost = parseFloat(buyingPrice);
                  if (isNaN(effectiveRetail) || effectiveRetail <= 0 || isNaN(cost) || cost < 0) {
                    return null;
                  }
                  const grossProfit = effectiveRetail - cost;
                  const marginPercent = ((grossProfit / effectiveRetail) * 100).toFixed(1);
                  const isProfitable = grossProfit >= 0;

                  return (
                    <div
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold ${
                        isProfitable
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                          : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                      }`}
                    >
                      {isProfitable ? (
                        <>
                          <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>
                            Estimated Profit: <strong className="font-bold">৳{grossProfit.toFixed(2)}</strong> ({marginPercent}% margin)
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
                          <span>
                            ⚠️ Warning: Selling below buying price by <strong className="font-bold">৳{Math.abs(grossProfit).toFixed(2)}</strong> ({marginPercent}%)
                          </span>
                        </>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Card 2: Domain-Specific Fields */}
              <div className="rounded-lg border border-border-peach bg-card p-6 shadow-xs space-y-5">
                <div className="border-b border-border-peach pb-3">
                  <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
                    {DOMAIN_TABS.find((t) => t.id === activeTab)?.label} Specifications
                  </h3>
                </div>

                {/* 1. LIVE PET FIELDS */}
                {activeTab === "LIVE_PET" && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormSelect
                        label="Pet Catalog Species"
                        placeholder="Select species..."
                        options={speciesOptions}
                        value={petSpeciesId}
                        onChange={(val) => {
                          setPetSpeciesId(val);
                          setPetBreedId("");
                        }}
                        searchable
                        required
                      />
                      <FormSelect
                        label="Pet Catalog Breed"
                        placeholder={petSpeciesId ? "Select breed..." : "Choose species first"}
                        options={breedOptions}
                        value={petBreedId}
                        onChange={(val) => setPetBreedId(val)}
                        searchable
                        disabled={!petSpeciesId}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormSelect
                        label="Gender"
                        options={[
                          { value: "UNSEXED", label: "Unsexed" },
                          { value: "MALE", label: "Male" },
                          { value: "FEMALE", label: "Female" },
                          { value: "PROVEN_PAIR", label: "Proven Pair" },
                        ]}
                        value={petGender}
                        onChange={(val) => setPetGender(val as PetGender)}
                        required
                      />
                      <FormInput
                        label="Age / Weaning Status"
                        placeholder="e.g., 3 Months, Self-feeding"
                        value={petAge}
                        onChange={(e) => setPetAge(e.target.value)}
                        required
                      />
                      <FormInput
                        label="Color Mutation"
                        placeholder="e.g. Lutino, Opaline Blue"
                        value={petMutation}
                        onChange={(e) => setPetMutation(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput
                        label="Avian Ring / Leg Band ID"
                        placeholder="e.g. BVA-2026-4402"
                        value={petRingNumber}
                        onChange={(e) => setPetRingNumber(e.target.value)}
                      />
                      <FormInput
                        label="Microchip Number (Dogs/Cats)"
                        placeholder="e.g. 985141002348123"
                        value={petMicrochip}
                        onChange={(e) => setPetMicrochip(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormSelect
                        label="Health Status"
                        options={[
                          { value: "HEALTHY_UNVERIFIED", label: "Healthy (Standard)" },
                          { value: "VACCINATED", label: "Vaccinated" },
                          { value: "DEWORMED", label: "Dewormed" },
                          { value: "VET_CERTIFIED", label: "Vet Certified" },
                        ]}
                        value={petHealthStatus}
                        onChange={(val) => setPetHealthStatus(val as HealthVerificationStatus)}
                      />
                      <FormSelect
                        label="Live Transit Delivery Method"
                        options={[
                          { value: "LOCAL_PICKUP", label: "Local Pickup Only" },
                          { value: "BREEDER_SPECIAL_TRANSIT", label: "Special Live Pet Transit" },
                        ]}
                        value={petDeliveryMethod}
                        onChange={(val) => setPetDeliveryMethod(val as LiveDeliveryMethod)}
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-ink">
                        <input
                          type="checkbox"
                          checked={petVaccinated}
                          onChange={(e) => setPetVaccinated(e.target.checked)}
                          className="h-4 w-4 rounded border-border-peach text-coral focus:ring-coral/20 cursor-pointer"
                        />
                        <span>Vaccinated</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-ink">
                        <input
                          type="checkbox"
                          checked={petDewormed}
                          onChange={(e) => setPetDewormed(e.target.checked)}
                          className="h-4 w-4 rounded border-border-peach text-coral focus:ring-coral/20 cursor-pointer"
                        />
                        <span>Dewormed</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-ink">
                        <input
                          type="checkbox"
                          checked={petTransitGuarantee}
                          onChange={(e) => setPetTransitGuarantee(e.target.checked)}
                          className="h-4 w-4 rounded border-border-peach text-coral focus:ring-coral/20 cursor-pointer"
                        />
                        <span>Live Arrival Guarantee Included</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* 2. PET FOOD FIELDS */}
                {activeTab === "PET_FOOD" && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput
                        label="Brand Name"
                        placeholder="e.g. Versele-Laga, Royal Canin"
                        value={foodBrand}
                        onChange={(e) => setFoodBrand(e.target.value)}
                        required
                      />
                      <FormSelect
                        label="Target Species"
                        placeholder="Select target species..."
                        options={speciesOptions}
                        value={foodTargetSpeciesId}
                        onChange={(val) => setFoodTargetSpeciesId(val)}
                        searchable
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormSelect
                        label="Food Type"
                        options={[
                          { value: "SEED_MIX", label: "Seed Mix" },
                          { value: "PELLETS", label: "Pellets" },
                          { value: "DRY_KIBBLE", label: "Dry Kibble" },
                          { value: "WET_CANNED", label: "Wet / Canned" },
                          { value: "TREATS", label: "Treats & Snacks" },
                          { value: "SUPPLEMENT", label: "Nutritional Supplement" },
                        ]}
                        value={foodType}
                        onChange={(val) => setFoodType(val as FoodType)}
                        required
                      />
                      <FormSelect
                        label="Life Stage"
                        options={[
                          { value: "ALL_STAGES", label: "All Life Stages" },
                          { value: "BABY_HANDFEEDING", label: "Baby / Hand-feeding" },
                          { value: "JUNIOR", label: "Junior / Weaning" },
                          { value: "ADULT", label: "Adult Maintenance" },
                          { value: "BREEDING", label: "Breeding / Conditioning" },
                          { value: "SENIOR", label: "Senior" },
                        ]}
                        value={foodLifeStage}
                        onChange={(val) => setFoodLifeStage(val as FoodLifeStage)}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <FormInput
                          label="Net Weight"
                          type="number"
                          step="0.01"
                          placeholder="1.0"
                          value={foodNetWeight}
                          onChange={(e) => setFoodNetWeight(e.target.value)}
                          required
                        />
                        <FormSelect
                          label="Unit"
                          options={[
                            { value: "KG", label: "kg" },
                            { value: "G", label: "g" },
                            { value: "LB", label: "lbs" },
                            { value: "OZ", label: "oz" },
                          ]}
                          value={foodWeightUnit}
                          onChange={(val) => setFoodWeightUnit(val as WeightUnit)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput
                        label="Expiration Date"
                        type="date"
                        value={foodExpiryDate}
                        onChange={(e) => setFoodExpiryDate(e.target.value)}
                      />
                      <div className="flex items-center pt-6">
                        <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-ink">
                          <input
                            type="checkbox"
                            checked={foodIsOrganic}
                            onChange={(e) => setFoodIsOrganic(e.target.checked)}
                            className="h-4 w-4 rounded border-border-peach text-coral focus:ring-coral/20 cursor-pointer"
                          />
                          <span>100% Certified Organic Ingredients</span>
                        </label>
                      </div>
                    </div>

                    <FormTextarea
                      label="Ingredients Summary"
                      placeholder="e.g. Canary seed, yellow millet, red millet, peeled oats, vitamins A, D3, E..."
                      value={foodIngredients}
                      onChange={(e) => setFoodIngredients(e.target.value)}
                      rows={3}
                    />
                  </div>
                )}

                {/* 3. ACCESSORIES FIELDS */}
                {activeTab === "GEAR_ACCESSORIES" && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormSelect
                        label="Accessory Category"
                        options={[
                          { value: "CAGE", label: "Cage & Enclosure" },
                          { value: "AQUARIUM_TERRARIUM", label: "Aquarium & Terrarium" },
                          { value: "PERCH_BRANCH", label: "Perch & Standing Branch" },
                          { value: "FEEDER_BOWL", label: "Feeder & Water Bowl" },
                          { value: "BED_NEST", label: "Bed, Nest Box & Cushion" },
                          { value: "TOY", label: "Toy & Enrichment" },
                          { value: "CARRIER", label: "Travel Carrier" },
                          { value: "HARNESS_LEASH", label: "Harness & Leash" },
                          { value: "GROOMING_TOOL", label: "Grooming Tool" },
                        ]}
                        value={accessoryCategory}
                        onChange={(val) => setAccessoryCategory(val as AccessoryCategory)}
                        required
                      />
                      <FormSelect
                        label="Target Species (Optional)"
                        placeholder="Suitable for species..."
                        options={speciesOptions}
                        value={accessoryTargetSpeciesId}
                        onChange={(val) => setAccessoryTargetSpeciesId(val)}
                        searchable
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormInput
                        label="Dimensions (L x W x H)"
                        placeholder="e.g. 60 x 38 x 52 cm"
                        value={accessoryDimensions}
                        onChange={(e) => setAccessoryDimensions(e.target.value)}
                      />
                      <FormInput
                        label="Cage Bar Spacing (Avian)"
                        placeholder="e.g. 10 mm / 0.5 inch"
                        value={accessoryBarSpacing}
                        onChange={(e) => setAccessoryBarSpacing(e.target.value)}
                      />
                      <FormInput
                        label="Material"
                        placeholder="e.g. Powder-coated iron, Java wood"
                        value={accessoryMaterial}
                        onChange={(e) => setAccessoryMaterial(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormInput
                        label="Brand / Manufacturer"
                        placeholder="e.g. Prevue, Vision, Hagen"
                        value={accessoryBrand}
                        onChange={(e) => setAccessoryBrand(e.target.value)}
                      />
                      <FormInput
                        label="Color"
                        placeholder="e.g. Black, White, Teal"
                        value={accessoryColor}
                        onChange={(e) => setAccessoryColor(e.target.value)}
                      />
                      <FormInput
                        label="Size Option"
                        placeholder="e.g. S, M, L, XL"
                        value={accessorySizeOption}
                        onChange={(e) => setAccessorySizeOption(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* 4. BOOKS FIELDS */}
                {activeTab === "BOOKS" && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput
                        label="Author / Writer"
                        placeholder="e.g. Dr. Matthew M. Vriends"
                        value={bookAuthor}
                        onChange={(e) => setBookAuthor(e.target.value)}
                        required
                      />
                      <FormInput
                        label="Publisher"
                        placeholder="e.g. TFH Publications, PetNest Press"
                        value={bookPublisher}
                        onChange={(e) => setBookPublisher(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormSelect
                        label="Language"
                        options={[
                          { value: "Bangla", label: "Bangla (বাংলা)" },
                          { value: "English", label: "English" },
                        ]}
                        value={bookLanguage}
                        onChange={(val) => setBookLanguage(val)}
                      />
                      <FormSelect
                        label="Book Format"
                        options={[
                          { value: "PAPERBACK", label: "Paperback" },
                          { value: "HARDCOVER", label: "Hardcover" },
                          { value: "DIGITAL_PDF", label: "Digital E-Book (PDF)" },
                        ]}
                        value={bookFormat}
                        onChange={(val) => setBookFormat(val as BookFormat)}
                      />
                      <FormInput
                        label="ISBN Number"
                        placeholder="e.g. 978-0-7938-0518-1"
                        value={bookIsbn}
                        onChange={(e) => setBookIsbn(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormInput
                        label="Total Pages"
                        type="number"
                        placeholder="e.g. 192"
                        value={bookPages}
                        onChange={(e) => setBookPages(e.target.value)}
                      />
                      <FormInput
                        label="Publication Year"
                        type="number"
                        placeholder="2026"
                        value={bookYear}
                        onChange={(e) => setBookYear(e.target.value)}
                      />
                      {bookFormat === "DIGITAL_PDF" && (
                        <FormInput
                          label="Download URL (PDF)"
                          placeholder="https://..."
                          value={bookDownloadUrl}
                          onChange={(e) => setBookDownloadUrl(e.target.value)}
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* 5. MEDICINE FIELDS */}
                {activeTab === "MEDICINE" && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput
                        label="Generic Chemical Name / Active Drug"
                        placeholder="e.g. Doxycycline Hyclate 10%, Electrolytes + B-Complex"
                        value={medicineGenericName}
                        onChange={(e) => setMedicineGenericName(e.target.value)}
                        required
                      />
                      <FormInput
                        label="Pharmaceutical Manufacturer"
                        placeholder="e.g. Square Agrovet, Versele-Laga Oropharma"
                        value={medicineManufacturer}
                        onChange={(e) => setMedicineManufacturer(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormSelect
                        label="Dosage Form"
                        options={[
                          { value: "WATER_SOLUBLE_POWDER", label: "Water Soluble Powder" },
                          { value: "ORAL_DROPS", label: "Oral Liquid Drops" },
                          { value: "TABLET", label: "Tablet / Capsule" },
                          { value: "TOPICAL_SPRAY", label: "Topical Spray" },
                          { value: "OINTMENT", label: "Ointment" },
                          { value: "INJECTION", label: "Injectable Solution" },
                        ]}
                        value={medicineDosageForm}
                        onChange={(val) => setMedicineDosageForm(val as MedicineDosageForm)}
                        required
                      />
                      <FormInput
                        label="Packaging / Pack Size"
                        placeholder="e.g. 100g sachet, 50ml bottle"
                        value={medicinePackSize}
                        onChange={(e) => setMedicinePackSize(e.target.value)}
                        required
                      />
                      <FormInput
                        label="Batch / Lot Number"
                        placeholder="e.g. B-2026-08"
                        value={medicineBatchNumber}
                        onChange={(e) => setMedicineBatchNumber(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput
                        label="Expiration Date"
                        type="date"
                        value={medicineExpiryDate}
                        onChange={(e) => setMedicineExpiryDate(e.target.value)}
                      />
                      <div className="flex items-center pt-6">
                        <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-ink">
                          <input
                            type="checkbox"
                            checked={medicinePrescriptionRequired}
                            onChange={(e) => setMedicinePrescriptionRequired(e.target.checked)}
                            className="h-4 w-4 rounded border-border-peach text-coral focus:ring-coral/20 cursor-pointer"
                          />
                          <span>Requires Prescription (Rx)</span>
                        </label>
                      </div>
                    </div>

                    <FormTextarea
                      label="Dosage & Administration Instructions"
                      placeholder="e.g. Dissolve 1g per 1 Liter of fresh drinking water. Administer for 5 to 7 consecutive days..."
                      value={medicineDosageInstructions}
                      onChange={(e) => setMedicineDosageInstructions(e.target.value)}
                      rows={3}
                      required
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Settings, 3-Tier Media & Video Sidebar */}
            <div className="space-y-6">
              {/* Card 1: Listing Visibility & Feature */}
              <div className="rounded-lg border border-border-peach bg-card p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-ink flex items-center gap-2">
                  <Sliders className="size-4 text-coral" /> Listing Settings
                </h3>

                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-border-peach text-coral focus:ring-coral/20 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-ink block">
                      Mark as Featured Listing
                    </span>
                    <span className="text-[11px] text-ink-muted">
                      Display in homepage & marketplace carousels
                    </span>
                  </div>
                </label>
              </div>

              {/* Card 2: 3-Tier Image Uploaders */}
              <div className="rounded-lg border border-border-peach bg-card p-6 shadow-xs space-y-5">
                <h3 className="text-base font-bold text-ink flex items-center gap-2">
                  <ShoppingBag className="size-4 text-coral" /> Product Imagery
                </h3>

                {/* 1. Card Thumbnail (1:1 / 4:3) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-ink">
                      Card Thumbnail <span className="text-coral">*</span>
                    </label>
                    <span className="text-[10px] text-ink-muted">1:1 or 4:3 Card view</span>
                  </div>
                  <p className="text-[11px] text-ink-muted">Main photo shown on catalog cards, grid views, and search results.</p>
                  <FileUpload
                    value={thumbnailFile}
                    onChange={(val) => {
                      if (!val) setThumbnailFile(null);
                      else if (Array.isArray(val)) setThumbnailFile(val[0]);
                      else setThumbnailFile(val);
                    }}
                    accept="image/*"
                  />
                </div>

                {/* 2. Banner Cover (16:9 Hero) */}
                <div className="space-y-1.5 pt-2 border-t border-border-peach/60">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-ink">
                      Banner Cover <span className="text-ink-muted font-normal text-[11px]">(Optional)</span>
                    </label>
                    <span className="text-[10px] text-ink-muted">16:9 Wide Banner</span>
                  </div>
                  <p className="text-[11px] text-ink-muted">Wide hero banner for listing page header. Falls back to Card Thumbnail if omitted.</p>
                  <FileUpload
                    value={bannerFile}
                    onChange={(val) => {
                      if (!val) setBannerFile(null);
                      else if (Array.isArray(val)) setBannerFile(val[0]);
                      else setBannerFile(val);
                    }}
                    accept="image/*"
                  />
                </div>

                {/* 3. Product Gallery */}
                <div className="space-y-1.5 pt-2 border-t border-border-peach/60">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-ink">
                      Product Gallery <span className="text-ink-muted font-normal text-[11px]">(Optional)</span>
                    </label>
                    <span className="text-[10px] text-ink-muted">Multiple Angles</span>
                  </div>
                  <p className="text-[11px] text-ink-muted">Additional photos for lightbox slider, packaging details, and angles.</p>
                  <FileUpload
                    value={galleryFiles}
                    onChange={(val) => {
                      if (!val) setGalleryFiles([]);
                      else if (Array.isArray(val)) setGalleryFiles(val);
                      else setGalleryFiles([val]);
                    }}
                    accept="image/*"
                    multiple
                  />
                </div>
              </div>

              {/* Card 3: Dual Video Manager (Cloudflare Direct + YouTube/Vimeo Links) */}
              <div className="rounded-lg border border-border-peach bg-card p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-ink flex items-center gap-2">
                    <Video className="size-4 text-coral" /> Product Videos
                  </h3>
                  <span className="text-[11px] font-semibold text-coral bg-coral-light px-2 py-0.5 rounded-full">
                    {videoUrls.length} added
                  </span>
                </div>
                <p className="text-[11px] text-ink-muted">
                  Directly upload videos to Cloudflare R2 or embed YouTube/Vimeo links.
                </p>

                {/* Direct Video Upload to Cloudflare */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-ink">Direct Upload (Cloudflare R2)</label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-border-peach hover:border-coral/60 rounded-xl p-4 cursor-pointer bg-surface-muted/50 hover:bg-peach/10 transition-colors">
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      className="hidden"
                      disabled={isVideoUploading}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 50 * 1024 * 1024) {
                          toast.error("Video file size cannot exceed 50 MB");
                          return;
                        }
                        try {
                          setIsVideoUploading(true);
                          const formData = new FormData();
                          formData.append("file", file);
                          formData.append("folder", "marketplace");
                          const res = await uploadVideo(formData).unwrap();
                          if (res?.data?.url) {
                            setVideoUrls((prev) => [...prev, res.data.url]);
                            toast.success("Video uploaded to Cloudflare R2!");
                          }
                        } catch (err: any) {
                          toast.error(err?.data?.message || "Failed to upload video to Cloudflare");
                        } finally {
                          setIsVideoUploading(false);
                          e.target.value = "";
                        }
                      }}
                    />
                    <div className="flex flex-col items-center gap-1.5 text-center">
                      {isVideoUploading ? (
                        <>
                          <Loader2 className="size-6 text-coral animate-spin" />
                          <span className="text-xs font-semibold text-coral">Uploading video to Cloudflare R2...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="size-6 text-coral" />
                          <span className="text-xs font-bold text-ink">Upload MP4, WebM or MOV</span>
                          <span className="text-[10px] text-ink-muted">Direct high-speed Cloudflare R2 stream (Max 50MB)</span>
                        </>
                      )}
                    </div>
                  </label>
                </div>

                {/* External Video Link (YouTube / Vimeo) */}
                <div className="space-y-1.5 pt-2 border-t border-border-peach/60">
                  <label className="block text-xs font-bold text-ink">Or Paste Video Link (YouTube / Vimeo)</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      value={videoInputUrl}
                      onChange={(e) => setVideoInputUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (videoInputUrl.trim()) {
                            setVideoUrls((prev) => [...prev, videoInputUrl.trim()]);
                            setVideoInputUrl("");
                            toast.success("Video link added");
                          }
                        }
                      }}
                      className="flex-1 text-xs px-3 py-2 rounded-lg border border-border-peach bg-surface-muted text-ink focus:outline-none focus:ring-1 focus:ring-coral"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!videoInputUrl.trim()) return;
                        setVideoUrls((prev) => [...prev, videoInputUrl.trim()]);
                        setVideoInputUrl("");
                        toast.success("Video link added");
                      }}
                      className="px-3 py-2 rounded-lg bg-coral text-white text-xs font-bold hover:bg-coral/90 cursor-pointer shrink-0"
                    >
                      Add Link
                    </button>
                  </div>
                </div>

                {/* Video Queue List */}
                {videoUrls.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-border-peach/60">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                      Attached Videos ({videoUrls.length})
                    </span>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {videoUrls.map((url, idx) => {
                        const isCloudflare = url.includes("cloudflarestorage.com") || url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".mov");
                        const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-2 p-2 rounded-lg bg-surface-muted border border-border-peach text-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <Film className="size-4 text-coral shrink-0" />
                              <div className="min-w-0">
                                <span className="block truncate font-mono text-[11px] text-ink">
                                  {url}
                                </span>
                                <span className="text-[9px] uppercase font-bold text-coral">
                                  {isCloudflare ? "Cloudflare R2" : isYouTube ? "YouTube" : "External"}
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setVideoUrls((prev) => prev.filter((_, i) => i !== idx))}
                              className="text-ink-muted hover:text-rose-500 p-1 cursor-pointer transition-colors"
                              title="Remove video"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Informational Guidance Card */}
              <div className="p-4 rounded-xl bg-surface-muted border border-border-peach text-ink space-y-2">
                <div className="flex items-start gap-2.5">
                  {activeTab === "LIVE_PET" ? (
                    <ShieldCheck className="size-5 text-coral shrink-0 mt-0.5" />
                  ) : activeTab === "MEDICINE" ? (
                    <AlertCircle className="size-5 text-coral shrink-0 mt-0.5" />
                  ) : (
                    <Truck className="size-5 text-coral shrink-0 mt-0.5" />
                  )}
                  <p className="text-xs text-ink-muted leading-relaxed">
                    {activeTab === "LIVE_PET"
                      ? "Live animal listings are strictly cross-referenced with ethical breeding standards. Standard couriers are disabled."
                      : activeTab === "MEDICINE"
                      ? "Pharmaceutical products must carry valid expiry dates and clear dosage guidelines."
                      : "Items will be cataloged under PetNest standard inventory and published immediately upon admin confirmation."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-lg border border-border-peach bg-card shadow-xs">
            <button
              type="button"
              onClick={() => router.push("/admin/marketplace/listings")}
              className="inline-flex items-center gap-2 text-xs font-bold text-ink-muted hover:text-coral transition-colors font-quicksand cursor-pointer"
            >
              <ArrowLeft className="size-3.5" />
              <span>Cancel & Return to Listings</span>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <PrimaryButton
                type="button"
                variant="outline"
                size="md"
                leftIcon={<Save className="size-4" />}
                onClick={() => handleSaveListing("DRAFT")}
                disabled={isSubmitting}
              >
                Save Draft
              </PrimaryButton>
              <PrimaryButton
                type="submit"
                variant="primary"
                size="md"
                leftIcon={<ShoppingBag className="size-4" />}
                isLoading={isSubmitting}
              >
                Publish Listing
              </PrimaryButton>
            </div>
          </div>
        </form>
      </AnimatedContainer>
    </div>
  );
}
