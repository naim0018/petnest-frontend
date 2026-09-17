"use client";

import { useRouter } from "next/navigation";
import { Lock, ArrowLeft, LogIn, UserPlus, Home } from "lucide-react";
import PrimaryButton from "@/components/common/PrimaryButton";
import CommonWrapper from "@/components/common/CommonWrapper";

const Unauthorized = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background py-12">
      <CommonWrapper className="flex justify-center">
        <div className="w-full max-w-md text-center bg-card rounded-2xl border border-border-peach shadow-xl p-8 md:p-10">
          {/* Icon */}
          <div className="size-16 mx-auto mb-6 rounded-2xl bg-coral-light flex items-center justify-center text-coral shadow-xs">
            <Lock className="size-8" />
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-3 font-quicksand">
            Access Restricted
          </h1>

          {/* Description */}
          <p className="text-ink-muted text-sm mb-6 leading-relaxed">
            You don't have permission to access this page. Please authenticate or return to the previous page.
          </p>

          {/* Error Code */}
          <div className="inline-block px-4 py-1.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg text-xs font-semibold mb-8 border border-red-500/20">
            Error 403 - Unauthorized Access
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <PrimaryButton
              variant="outline"
              size="md"
              fullWidth
              onClick={handleBack}
              leftIcon={<ArrowLeft className="size-4" />}
            >
              Go Back
            </PrimaryButton>

            <PrimaryButton
              variant="primary"
              size="md"
              fullWidth
              onClick={handleLogin}
              leftIcon={<LogIn className="size-4" />}
            >
              Login
            </PrimaryButton>
          </div>

          {/* Signup Section */}
          <div className="pt-6 border-t border-border-peach">
            <p className="text-xs text-ink-muted mb-3">Don't have an account?</p>
            <PrimaryButton
              variant="coralLight"
              size="md"
              fullWidth
              onClick={handleSignup}
              leftIcon={<UserPlus className="size-4" />}
            >
              Create New Account
            </PrimaryButton>
          </div>

          {/* Home Link */}
          <div className="mt-6">
            <PrimaryButton
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              leftIcon={<Home className="size-4" />}
            >
              Return to Homepage
            </PrimaryButton>
          </div>
        </div>
      </CommonWrapper>
    </div>
  );
};

export default Unauthorized;