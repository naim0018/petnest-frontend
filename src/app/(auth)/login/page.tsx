"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  PawPrint,
  Heart,
  Users,
  ShoppingCart,
  Check,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Logo from "@/components/common/Logo";
import PrimaryButton from "@/components/common/PrimaryButton";
import CommonWrapper from "@/components/common/CommonWrapper";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import FormSelect from "@/components/common/FormSelect";
import { PET_CATEGORIES_WITH_BREEDS } from "@/lib/data/petCategoriesData";
import { useLoginMutation, useSignupMutation } from "@/store/Api/Auth/auth.api";
import { useAppDispatch } from "@/hooks/useRedux";
import { setUser } from "@/store/features/AuthSlice/authSlice";

// ============================================
// 🐾 Validation Schemas (Zod)
// ============================================
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email or username is required" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean(),
});

const signupSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Full name is required" })
    .min(2, { message: "Name must be at least 2 characters" }),
  email: z
    .string()
    .min(1, { message: "Email address is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
  petType: z.string().min(1, { message: "Please select pet type" }),
  breed: z.string().min(1, { message: "Please select breed" }),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms & Privacy",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loginMutation] = useLoginMutation();
  const [signupMutation] = useSignupMutation();

  // 🔄 Card Flip State: false = Login, true = Sign Up
  const [isSignUp, setIsSignUp] = useState(false);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login Form Hook
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    setValue: setLoginValue,
    watch: watchLogin,
    formState: { errors: loginErrors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "naim0018@gmail.com",
      password: "naim@@18",
      rememberMe: true,
    },
  });

  // Sign Up Form Hook
  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    setValue: setSignupValue,
    watch: watchSignup,
    formState: { errors: signupErrors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      petType: "",
      breed: "",
      agreeTerms: false,
    },
  });

  const rememberMe = watchLogin("rememberMe");
  const agreeTerms = watchSignup("agreeTerms");

  // 🐶 Pet Types & Breeds Options for Sign Up Form
  const petTypeOptions = PET_CATEGORIES_WITH_BREEDS.map((cat) => ({
    value: cat.id,
    label: cat.label,
  }));

  const selectedPetType = watchSignup("petType");
  const selectedCategory = PET_CATEGORIES_WITH_BREEDS.find(
    (c) => c.id === selectedPetType
  );

  const breedOptions = selectedCategory
    ? [
        ...selectedCategory.breeds
          .filter((b) => b.id !== "all")
          .map((b) => ({ value: b.label, label: b.label })),
        { value: "Mixed / Other", label: "Mixed / Other" },
      ]
    : [{ value: "Mixed / Other", label: "Mixed / Other" }];

  const handlePetTypeChange = (newType: string) => {
    setSignupValue("petType", newType, { shouldValidate: true });
    setSignupValue("breed", "", { shouldValidate: false });
  };

  // Handle Login Submission
  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await loginMutation({
        email: data.email,
        password: data.password,
      }).unwrap();

      const user = response?.data;
      if (user) {
        dispatch(setUser(user));
      }
      toast.success("Welcome back! Login successful.");
      if (user?.role === "ADMIN" || user?.role === "SUPERADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Invalid email or password. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Sign Up Submission
  const onSignupSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await signupMutation({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: "+14155552671",
      }).unwrap();

      const user = response?.data?.user || response?.data;
      if (user) {
        dispatch(setUser(user));
      }
      toast.success("Account created successfully! Welcome to PetNest.");
      router.push("/");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Failed to create account. Please check your details.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider: "Google" | "Apple") => {
    toast.info(`Connecting to ${provider}...`);
  };

  // ============================================
  // 🔘 Reusable Segmented Capsule Tab Control
  // ============================================
  const renderSegmentedTab = (faceIsSignUp: boolean) => (
    <div className="w-full bg-surface-muted dark:bg-surface-soft p-1.5 rounded-full border border-border-peach flex items-center relative mb-4">
      <button
        type="button"
        onClick={() => setIsSignUp(false)}
        className={cn(
          "flex-1 py-2 text-sm sm:text-base font-bold font-quicksand rounded-full transition-colors duration-200 relative z-10 cursor-pointer flex items-center justify-center",
          !faceIsSignUp
            ? "text-white"
            : "text-ink-muted hover:text-ink"
        )}
      >
        {!faceIsSignUp && (
          <div className="absolute inset-0 bg-coral rounded-full shadow-xs" />
        )}
        <span className="relative z-10">Login</span>
      </button>

      <button
        type="button"
        onClick={() => setIsSignUp(true)}
        className={cn(
          "flex-1 py-2 text-sm sm:text-base font-bold font-quicksand rounded-full transition-colors duration-200 relative z-10 cursor-pointer flex items-center justify-center",
          faceIsSignUp
            ? "text-white"
            : "text-ink-muted hover:text-ink"
        )}
      >
        {faceIsSignUp && (
          <div className="absolute inset-0 bg-coral rounded-full shadow-xs" />
        )}
        <span className="relative z-10">Sign Up</span>
      </button>
    </div>
  );

  return (
    <div className="h-screen max-h-screen w-full relative overflow-hidden flex flex-col justify-between select-none">
      {/* ======================================================== */}
      {/* 🖼️ SINGLE UNIFIED FULL-SCREEN BACKGROUND                */}
      {/* ======================================================== */}
      <Image
        src="/auth-bg.jpg"
        alt="PetNest companions and cozy room backdrop"
        fill
        priority
        className="object-cover object-bottom pointer-events-none z-0"
      />

      {/* Subtle top vignette for crystal clear text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none z-1" />

      {/* ======================================================== */}
      {/* 🐾 TOP BAR: Brand Logo & Theme Switcher via CommonWrapper*/}
      {/* ======================================================== */}
      <header className="w-full relative z-10">
        <CommonWrapper className="max-w-[1600px] py-4 sm:py-6 flex items-center justify-between">
          <Link
            href="/"
            className="transition-transform hover:scale-105 active:scale-95 inline-block"
          >
            <Logo />
          </Link>

          <div className="bg-card/80 dark:bg-card/60 backdrop-blur-md rounded-full p-1 border border-border-peach shadow-xs">
            <ThemeToggle />
          </div>
        </CommonWrapper>
      </header>

      {/* ======================================================== */}
      {/* 🌟 MAIN UNIFIED LAYOUT CONTAINER via CommonWrapper       */}
      {/* ======================================================== */}
      <main className="w-full flex-1 flex items-start justify-center relative z-10 overflow-y-auto lg:overflow-visible">
        <CommonWrapper className="max-w-[1600px] pt-1 sm:pt-4 lg:pt-6 pb-6 flex-1 flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-12">
          {/* Left Side: Headline, Subtitle & Badges matching mockup */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full lg:max-w-xl space-y-6 lg:pb-32 self-start pt-2 lg:pt-4"
          >
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-quicksand text-white leading-[1.15] tracking-tight drop-shadow-md">
              A Happier Life <br className="hidden sm:inline" />
              for Your{" "}
              <span className="text-3xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#A78BFA] via-[#C084FC] to-[#818CF8] bg-clip-text text-transparent drop-shadow-md">
                Furry Friend
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-white/90 font-normal leading-relaxed max-w-md drop-shadow-xs">
              Discover pet care tips, connect with fellow pet lovers, and give
              your pets the best life.
            </p>

            {/* Feature Tags matching system design & mockup */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-5 pt-2">
              <div className="inline-flex items-center gap-2.5">
                <div className="size-8 sm:size-9 rounded-full bg-[#7C3AED]/30 border border-[#8B5CF6]/40 flex items-center justify-center shrink-0 backdrop-blur-xs shadow-xs">
                  <Heart className="size-4 text-[#C084FC] fill-[#C084FC]" />
                </div>
                <span className="text-white font-medium text-xs sm:text-sm tracking-normal select-none drop-shadow-xs">
                  Expert Care Tips
                </span>
              </div>

              <div className="hidden sm:block h-4.5 w-px bg-white/20 shrink-0" aria-hidden="true" />

              <div className="inline-flex items-center gap-2.5">
                <div className="size-8 sm:size-9 rounded-full bg-[#7C3AED]/30 border border-[#8B5CF6]/40 flex items-center justify-center shrink-0 backdrop-blur-xs shadow-xs">
                  <Users className="size-4 text-[#C084FC]" strokeWidth={2.2} />
                </div>
                <span className="text-white font-medium text-xs sm:text-sm tracking-normal select-none drop-shadow-xs">
                  Pet Community
                </span>
              </div>

              <div className="hidden sm:block h-4.5 w-px bg-white/20 shrink-0" aria-hidden="true" />

              <div className="inline-flex items-center gap-2.5">
                <div className="size-8 sm:size-9 rounded-full bg-[#7C3AED]/30 border border-[#8B5CF6]/40 flex items-center justify-center shrink-0 backdrop-blur-xs shadow-xs">
                  <ShoppingCart className="size-4 text-[#C084FC]" strokeWidth={2.2} />
                </div>
                <span className="text-white font-medium text-xs sm:text-sm tracking-normal select-none drop-shadow-xs">
                  Shop Essentials
                </span>
              </div>
            </div>
          </motion.div>

          {/* ======================================================== */}
          {/* 🔄 REDESIGNED 3D CARD ROTATION (SMOOTH, CRISP & NO CUTOFF) */}
          {/* ======================================================== */}
          <div
            style={{ perspective: 1400 }}
            className="w-full max-w-md shrink-0 relative self-start"
          >
            <AnimatePresence mode="wait" initial={false}>
              {!isSignUp ? (
                /* ==================================================== */
                /* 🚪 FRONT FACE: LOGIN CARD                            */
                /* ==================================================== */
                <motion.div
                  key="login"
                  initial={{ rotateY: -75, opacity: 0, scale: 0.98 }}
                  animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                  exit={{ rotateY: 75, opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: "center center" }}
                  className="w-full bg-card border border-border-peach rounded-2xl shadow-md p-6 sm:px-8 sm:py-6 flex flex-col relative"
                >
                  {/* Decorative Watermark Paw in Top Right */}
                  <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                    <div className="absolute -top-4 -right-4 opacity-40 dark:opacity-20 text-coral/10">
                      <PawPrint className="size-24" />
                    </div>
                  </div>

                  {/* 🔘 Segmented Capsule Tab Control (Login Active) */}
                  <div className="relative z-10">
                    {renderSegmentedTab(false)}
                  </div>

                  {/* Card Header */}
                  <div className="text-center space-y-1 mb-5 relative z-10">
                    <h2 className="text-2xl sm:text-3xl font-bold font-quicksand text-ink tracking-tight">
                      Welcome Back!
                    </h2>
                    <p className="text-xs sm:text-sm text-ink-muted">
                      Login to continue your pet journey
                    </p>
                  </div>

                  {/* Login Form */}
                  <form
                    onSubmit={handleLoginSubmit(onLoginSubmit)}
                    noValidate
                    className="space-y-3.5 relative z-10"
                  >
                    {/* Email Address */}
                    <div className="space-y-1">
                      <div
                        className={cn(
                          "flex items-center gap-3 px-4 h-[42px] shrink-0 box-border rounded-md border bg-surface-soft dark:bg-surface-muted transition-colors",
                          loginErrors.email
                            ? "border-red-500 focus-within:ring-2 focus-within:ring-red-500/20"
                            : "border-border-peach focus-within:border-coral focus-within:ring-2 focus-within:ring-coral/20"
                        )}
                      >
                        <Mail className="size-5 text-ink-muted shrink-0" />
                        <input
                          type="text"
                          id="login-email"
                          placeholder="Email or Username"
                          autoComplete="username"
                          className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
                          {...registerLogin("email")}
                        />
                      </div>
                      {loginErrors.email && (
                        <p className="text-xs font-semibold text-red-500 px-1">
                          {loginErrors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                      <div
                        className={cn(
                          "flex items-center gap-3 px-4 h-[42px] shrink-0 box-border rounded-md border bg-surface-soft dark:bg-surface-muted transition-colors",
                          loginErrors.password
                            ? "border-red-500 focus-within:ring-2 focus-within:ring-red-500/20"
                            : "border-border-peach focus-within:border-coral focus-within:ring-2 focus-within:ring-coral/20"
                        )}
                      >
                        <Lock className="size-5 text-ink-muted shrink-0" />
                        <input
                          type={showPassword ? "text" : "password"}
                          id="login-password"
                          placeholder="Password"
                          autoComplete="current-password"
                          className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
                          {...registerLogin("password")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          className="text-ink-muted hover:text-coral p-1 transition-colors shrink-0 cursor-pointer"
                        >
                          {showPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </div>
                      {loginErrors.password && (
                        <p className="text-xs font-semibold text-red-500 px-1">
                          {loginErrors.password.message}
                        </p>
                      )}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between text-sm pt-0.5">
                      <label
                        htmlFor="login-rememberMe"
                        className="flex items-center gap-2 cursor-pointer group select-none"
                      >
                        <div
                          className={cn(
                            "size-4 rounded-md border flex items-center justify-center transition-all",
                            rememberMe
                              ? "bg-coral border-coral text-white"
                              : "border-border-peach bg-card group-hover:border-coral"
                          )}
                        >
                          {rememberMe && <Check className="size-3 stroke-[3]" />}
                        </div>
                        <input
                          type="checkbox"
                          id="login-rememberMe"
                          className="sr-only"
                          checked={rememberMe}
                          onChange={(e) => setLoginValue("rememberMe", e.target.checked)}
                        />
                        <span className="text-xs sm:text-sm font-medium text-ink-muted group-hover:text-ink transition-colors">
                          Remember me
                        </span>
                      </label>

                      <Link
                        href="/forgot-password"
                        className="text-xs sm:text-sm font-semibold text-coral hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </div>

                    {/* Submit Action using PetNest PrimaryButton */}
                    <div className="pt-1">
                      <PrimaryButton
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        isLoading={isSubmitting}
                        leftIcon={<PawPrint className="size-4 shrink-0" />}
                        title="Login"
                        className="rounded-full shadow-xs"
                      />
                    </div>
                  </form>

                  {/* Social Separator */}
                  <div className="relative my-3.5 flex items-center justify-center z-10">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border-peach" />
                    </div>
                    <span className="relative bg-card px-3 text-xs uppercase tracking-wider text-ink-faint font-semibold">
                      or
                    </span>
                  </div>

                  {/* Social Buttons */}
                  <div className="space-y-2.5 relative z-10">
                    <button
                      type="button"
                      onClick={() => handleSocialLogin("Google")}
                      className="w-full h-11 flex items-center justify-center gap-3 rounded-full border border-border-peach bg-surface-soft dark:bg-surface-muted hover:bg-card text-ink font-semibold text-sm transition-all shadow-2xs hover:border-coral/50 cursor-pointer"
                    >
                      <svg className="size-5 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSocialLogin("Apple")}
                      className="w-full h-11 flex items-center justify-center gap-3 rounded-full border border-border-peach bg-surface-soft dark:bg-surface-muted hover:bg-card text-ink font-semibold text-sm transition-all shadow-2xs hover:border-coral/50 cursor-pointer"
                    >
                      <svg
                        className="size-5 shrink-0 fill-current text-ink"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.4c.67-.82 1.13-1.96.99-3.1-.97.05-2.16.66-2.85 1.48-.61.71-1.14 1.87-.99 2.98 1.09.08 2.22-.56 2.85-1.36z" />
                      </svg>
                      <span>Continue with Apple</span>
                    </button>
                  </div>

                  {/* Footer prompt that flips card to Sign Up */}
                  <p className="text-center text-sm text-ink-muted mt-3.5 relative z-10">
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(true)}
                      className="text-coral font-bold hover:underline ml-1 cursor-pointer"
                    >
                      Sign Up
                    </button>
                  </p>
                </motion.div>
              ) : (
                /* ==================================================== */
                /* 🚪 BACK FACE: SIGN UP CARD                           */
                /* ==================================================== */
                <motion.div
                  key="signup"
                  initial={{ rotateY: -75, opacity: 0, scale: 0.98 }}
                  animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                  exit={{ rotateY: 75, opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: "center center" }}
                  className="w-full bg-card border border-border-peach rounded-2xl shadow-md p-6 sm:px-8 sm:py-6 flex flex-col relative"
                >
                  {/* Decorative Watermark Paw in Top Right */}
                  <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                    <div className="absolute -top-4 -right-4 opacity-40 dark:opacity-20 text-coral/10">
                      <PawPrint className="size-24" />
                    </div>
                  </div>

                  {/* 🔘 Segmented Capsule Tab Control (Sign Up Active) */}
                  <div className="relative z-10">
                    {renderSegmentedTab(true)}
                  </div>

                  {/* Card Header */}
                  <div className="text-center space-y-1 mb-3 relative z-10">
                    <h2 className="text-2xl sm:text-3xl font-bold font-quicksand text-ink tracking-tight">
                      Join PetNest!
                    </h2>
                    <p className="text-xs sm:text-sm text-ink-muted">
                      Create your account to start your pet journey
                    </p>
                  </div>

                  {/* Sign Up Form */}
                  <form
                    onSubmit={handleSignupSubmit(onSignupSubmit)}
                    noValidate
                    className="space-y-2.5 relative z-10"
                  >
                    {/* Full Name */}
                    <div className="space-y-1">
                      <div
                        className={cn(
                          "flex items-center gap-3 px-4 h-[42px] shrink-0 box-border rounded-md border bg-surface-soft dark:bg-surface-muted transition-colors",
                          signupErrors.name
                            ? "border-red-500 focus-within:ring-2 focus-within:ring-red-500/20"
                            : "border-border-peach focus-within:border-coral focus-within:ring-2 focus-within:ring-coral/20"
                        )}
                      >
                        <User className="size-5 text-ink-muted shrink-0" />
                        <input
                          type="text"
                          id="signup-name"
                          placeholder="Full Name"
                          autoComplete="name"
                          className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
                          {...registerSignup("name")}
                        />
                      </div>
                      {signupErrors.name && (
                        <p className="text-xs font-semibold text-red-500 px-1">
                          {signupErrors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email Address */}
                    <div className="space-y-1">
                      <div
                        className={cn(
                          "flex items-center gap-3 px-4 h-[42px] shrink-0 box-border rounded-md border bg-surface-soft dark:bg-surface-muted transition-colors",
                          signupErrors.email
                            ? "border-red-500 focus-within:ring-2 focus-within:ring-red-500/20"
                            : "border-border-peach focus-within:border-coral focus-within:ring-2 focus-within:ring-coral/20"
                        )}
                      >
                        <Mail className="size-5 text-ink-muted shrink-0" />
                        <input
                          type="email"
                          id="signup-email"
                          placeholder="Email Address"
                          autoComplete="email"
                          className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
                          {...registerSignup("email")}
                        />
                      </div>
                      {signupErrors.email && (
                        <p className="text-xs font-semibold text-red-500 px-1">
                          {signupErrors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                      <div
                        className={cn(
                          "flex items-center gap-3 px-4 h-[42px] shrink-0 box-border rounded-md border bg-surface-soft dark:bg-surface-muted transition-colors",
                          signupErrors.password
                            ? "border-red-500 focus-within:ring-2 focus-within:ring-red-500/20"
                            : "border-border-peach focus-within:border-coral focus-within:ring-2 focus-within:ring-coral/20"
                        )}
                      >
                        <Lock className="size-5 text-ink-muted shrink-0" />
                        <input
                          type={showSignupPassword ? "text" : "password"}
                          id="signup-password"
                          placeholder="Create Password"
                          autoComplete="new-password"
                          className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
                          {...registerSignup("password")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          aria-label={showSignupPassword ? "Hide password" : "Show password"}
                          className="text-ink-muted hover:text-coral p-1 transition-colors shrink-0 cursor-pointer"
                        >
                          {showSignupPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </div>
                      {signupErrors.password && (
                        <p className="text-xs font-semibold text-red-500 px-1">
                          {signupErrors.password.message}
                        </p>
                      )}
                    </div>

                    {/* 🐾 Pet Type & Breed Select Fields (2 Columns) */}
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                      <FormSelect
                        id="signup-pet-type"
                        placeholder="Pet Type"
                        options={petTypeOptions}
                        value={watchSignup("petType")}
                        onChange={handlePetTypeChange}
                        leftIcon={<PawPrint className="size-4" />}
                        error={signupErrors.petType?.message}
                      />

                      <FormSelect
                        id="signup-breed"
                        placeholder="Breed"
                        options={breedOptions}
                        value={watchSignup("breed")}
                        onChange={(val) =>
                          setSignupValue("breed", val, { shouldValidate: true })
                        }
                        leftIcon={<Sparkles className="size-4" />}
                        searchable
                        error={signupErrors.breed?.message}
                      />
                    </div>

                    {/* Terms Agreement Checkbox */}
                    <div className="space-y-1 pt-0.5">
                      <label
                        htmlFor="signup-agreeTerms"
                        className="flex items-center gap-2 cursor-pointer group select-none"
                      >
                        <div
                          className={cn(
                            "size-4 rounded-md border flex items-center justify-center transition-all shrink-0",
                            agreeTerms
                              ? "bg-coral border-coral text-white"
                              : "border-border-peach bg-card group-hover:border-coral"
                          )}
                        >
                          {agreeTerms && <Check className="size-3 stroke-[3]" />}
                        </div>
                        <input
                          type="checkbox"
                          id="signup-agreeTerms"
                          className="sr-only"
                          checked={agreeTerms}
                          onChange={(e) => setSignupValue("agreeTerms", e.target.checked)}
                        />
                        <span className="text-xs text-ink-muted group-hover:text-ink transition-colors leading-tight">
                          I agree to the{" "}
                          <span className="text-coral underline">Terms of Service</span> &{" "}
                          <span className="text-coral underline">Privacy Policy</span>
                        </span>
                      </label>
                      {signupErrors.agreeTerms && (
                        <p className="text-xs font-semibold text-red-500 px-1">
                          {signupErrors.agreeTerms.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Action using PetNest PrimaryButton */}
                    <div className="pt-0.5">
                      <PrimaryButton
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        isLoading={isSubmitting}
                        leftIcon={<PawPrint className="size-4 shrink-0" />}
                        title="Create Account"
                        className="rounded-full shadow-xs"
                      />
                    </div>
                  </form>

                  {/* Social Separator */}
                  <div className="relative my-2.5 flex items-center justify-center z-10">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border-peach" />
                    </div>
                    <span className="relative bg-card px-3 text-xs uppercase tracking-wider text-ink-faint font-semibold">
                      or
                    </span>
                  </div>

                  {/* Social Buttons */}
                  <div className="space-y-2 relative z-10">
                    <button
                      type="button"
                      onClick={() => handleSocialLogin("Google")}
                      className="w-full h-10 flex items-center justify-center gap-3 rounded-full border border-border-peach bg-surface-soft dark:bg-surface-muted hover:bg-card text-ink font-semibold text-xs sm:text-sm transition-all shadow-2xs hover:border-coral/50 cursor-pointer"
                    >
                      <svg className="size-4 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                        />
                      </svg>
                      <span>Sign up with Google</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSocialLogin("Apple")}
                      className="w-full h-10 flex items-center justify-center gap-3 rounded-full border border-border-peach bg-surface-soft dark:bg-surface-muted hover:bg-card text-ink font-semibold text-xs sm:text-sm transition-all shadow-2xs hover:border-coral/50 cursor-pointer"
                    >
                      <svg
                        className="size-4 shrink-0 fill-current text-ink"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.4c.67-.82 1.13-1.96.99-3.1-.97.05-2.16.66-2.85 1.48-.61.71-1.14 1.87-.99 2.98 1.09.08 2.22-.56 2.85-1.36z" />
                      </svg>
                      <span>Sign up with Apple</span>
                    </button>
                  </div>

                  {/* Footer prompt that flips card to Login */}
                  <p className="text-center text-sm text-ink-muted mt-3 relative z-10">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(false)}
                      className="text-coral font-bold hover:underline ml-1 cursor-pointer"
                    >
                      Login
                    </button>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CommonWrapper>
      </main>

      {/* Spacer footer via CommonWrapper */}
      <footer className="w-full relative z-10">
        <CommonWrapper className="max-w-[1600px] py-3 text-center text-xs text-white/60">
          © {new Date().getFullYear()} PetNest Inc. All rights reserved.
        </CommonWrapper>
      </footer>
    </div>
  );
}
