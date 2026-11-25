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
  Sparkles,
  Utensils,
  Package,
  BookOpen,
  Pill,
  ShieldCheck,
  Truck,
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
import { useUploadMediaMutation } from "@/store/Api/Media/media.api";
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
  { id: "LIVE_PET", label: "Live Pet", icon: <Sparkles className="size-4" />, subtitle: "Breeder pedigrees & live animals" },
  { id: "PET_FOOD", label: "Pet Food", icon: <Utensils className="size-4" />, subtitle: "Seeds, kibble & supplements" },
  { id: "GEAR_ACCESSORIES", label: "Accessories", icon: <Package className="size-4" />, subtitle: "Cages, perches & gear" },
  { id: "BOOKS", label: "Books & Media", icon: <BookOpen className="size-4" />, subtitle: "Breeding & care literature" },
  { id: "MEDICINE", label: "Medicine & Health", icon: <Pill className="size-4" />, subtitle: "Veterinary healthcare & vitamins" },
];

const STORE_OPTIONS = [
  { value: "PetNest Official Direct", label: "PetNest Official Direct" },
  { value: "Willow Creek Kennels", label: "Willow Creek Kennels" },
  { value: "SilverMist Cattery", label: "SilverMist Cattery" },
  { value: "Bengal Aviary & Birds", label: "Bengal Aviary & Birds" },
  { value: "CozyPaws Essentials", label: "CozyPaws Essentials" },
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
  const [inventory, setInventory] = useState("1");
  const [description, setDescription] = useState("");
  const [storeName, setStoreName] = useState("PetNest Official Direct");
  const [isFeatured, setIsFeatured] = useState(false);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

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

  // Upload selected gallery files to backend
  const uploadGalleryImages = async (): Promise<string[]> => {
    if (!galleryFiles.length) {
      return ["https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80"];
    }

    const uploadedUrls: string[] = [];
    for (const file of galleryFiles) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "marketplace");
        const res = await uploadMedia(formData).unwrap();
        if (res?.data?.url) uploadedUrls.push(res.data.url);
      } catch {
        // Fallback placeholder if upload error
        uploadedUrls.push(URL.createObjectURL(file));
      }
    }
    return uploadedUrls.length ? uploadedUrls : ["https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80"];
  };

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
      const imageUrls = await uploadGalleryImages();
      const coverImage = imageUrls[0];
      const galleryImages = imageUrls.slice(1);
      const parsedPrice = parseFloat(price);
      const parsedSalePrice = salePrice ? parseFloat(salePrice) : undefined;
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
          coverImage,
          galleryImages,
          description: description || "No description provided.",
          isFeatured,
          status,
          storeName,
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
          coverImage,
          galleryImages,
          description: description || "No description provided.",
          isFeatured,
          status,
          storeName,
        }).unwrap();
      } else if (activeTab === "GEAR_ACCESSORIES") {
        await createAccessory({
          title,
          price: parsedPrice,
          salePrice: parsedSalePrice,
          stockQuantity: parsedQty,
          category: accessoryCategory,
          brand: accessoryBrand || undefined,
          targetSpeciesId: accessoryTargetSpeciesId || undefined,
          dimensions: accessoryDimensions || undefined,
          barSpacing: accessoryBarSpacing || undefined,
          material: accessoryMaterial || undefined,
          color: accessoryColor || undefined,
          sizeOption: accessorySizeOption || undefined,
          coverImage,
          galleryImages,
          description: description || "No description provided.",
          isFeatured,
          status,
          storeName,
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
          stockQuantity: parsedQty,
          author: bookAuthor,
          publisher: bookPublisher || undefined,
          language: bookLanguage,
          format: bookFormat,
          isbn: bookIsbn || undefined,
          totalPages: bookPages ? parseInt(bookPages, 10) : undefined,
          publicationYear: bookYear ? parseInt(bookYear, 10) : undefined,
          downloadUrl: bookDownloadUrl || undefined,
          coverImage,
          galleryImages,
          description: description || "No description provided.",
          isFeatured,
          status,
          storeName,
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
          stockQuantity: parsedQty,
          genericName: medicineGenericName,
          manufacturer: medicineManufacturer || undefined,
          dosageForm: medicineDosageForm,
          packSize: medicinePackSize,
          prescriptionRequired: medicinePrescriptionRequired,
          dosageInstructions: medicineDosageInstructions || "Follow veterinarian advice.",
          expiryDate: medicineExpiryDate || undefined,
          batchNumber: medicineBatchNumber || undefined,
          coverImage,
          galleryImages,
          description: description || "No description provided.",
          isFeatured,
          status,
          storeName,
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    label={activeTab === "LIVE_PET" ? "Animals / Pairs" : "Available Stock"}
                    type="number"
                    min="1"
                    placeholder="1"
                    value={inventory}
                    onChange={(e) => setInventory(e.target.value)}
                    required
                  />
                </div>
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

            {/* Right Column: Settings, Store & Media Sidebar */}
            <div className="space-y-6">
              <div className="rounded-lg border border-border-peach bg-card p-6 shadow-xs space-y-5">
                <h3 className="text-base font-bold text-ink flex items-center gap-2">
                  <Sliders className="size-4 text-coral" /> Listing Settings
                </h3>

                {/* Reusable FormSelect: Store */}
                <div>
                  <FormSelect
                    label="Fulfilling Store / Seller"
                    placeholder="Select store..."
                    options={STORE_OPTIONS}
                    value={storeName}
                    onChange={(val) => setStoreName(val)}
                    searchable
                    required
                  />
                </div>

                <div className="pt-1">
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

                {/* Reusable FileUpload: Product Gallery */}
                <div className="pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-2">
                    Product Gallery (Images)
                  </label>
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
