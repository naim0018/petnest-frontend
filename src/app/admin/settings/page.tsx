"use client";

import React, { useState } from "react";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import PrimaryButton from "@/components/common/PrimaryButton";
import ConfirmModal from "@/components/reuseable/ConfirmModal";
import {
  useGetGeminiConfigQuery,
  useRemoveGeminiKeyMutation,
  useTestGeminiKeyMutation,
  useUpdateGeminiKeyMutation,
} from "@/store/Api/Settings/settings.api";
import {
  CheckCircle2,
  Cpu,
  Database,
  Eye,
  EyeOff,
  FileCode,
  KeyRound,
  Lock,
  RefreshCw,
  Server,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const { data: geminiConfig, isLoading, isFetching, refetch } =
    useGetGeminiConfigQuery();

  const [updateGeminiKey, { isLoading: isSaving }] =
    useUpdateGeminiKeyMutation();
  const [removeGeminiKey, { isLoading: isRemoving }] =
    useRemoveGeminiKeyMutation();
  const [testGeminiKey, { isLoading: isTesting }] = useTestGeminiKeyMutation();

  const [newApiKey, setNewApiKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newApiKey.trim();
    if (!trimmed) {
      toast.error("Please enter a valid Gemini API key.");
      return;
    }

    try {
      await updateGeminiKey({ apiKey: trimmed }).unwrap();
      toast.success(
        "Gemini API key encrypted with AES-256-GCM and saved securely in database!"
      );
      setNewApiKey("");
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Failed to save Gemini API key."
      );
    }
  };

  const handleTestConnection = async () => {
    const keyToTest = newApiKey.trim() || undefined;
    try {
      const res = await testGeminiKey(
        keyToTest ? { apiKey: keyToTest } : undefined
      ).unwrap();
      toast.success(
        res.message || "Google Gemini API connection test succeeded!"
      );
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
          err?.message ||
          "Gemini connection test failed. Check key validity."
      );
    }
  };

  const handleRemoveKey = async () => {
    try {
      await removeGeminiKey().unwrap();
      toast.success("Database Gemini API key removed successfully.");
      setShowDeleteModal(false);
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Failed to remove key."
      );
    }
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            <span>Admin</span>
            <span>/</span>
            <span>Settings</span>
            <span>/</span>
            <span className="text-coral">AI & Security</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Cpu className="size-7 text-coral" />
            System & AI Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure external service credentials, hardware integrations, and database-level AES-256 encryption.
          </p>
        </div>

        <PrimaryButton
          variant="outline"
          size="sm"
          rounded="lg"
          onClick={() => refetch()}
          isLoading={isFetching && !isLoading}
          className="self-start sm:self-auto"
        >
          <RefreshCw className="size-4 mr-1.5" />
          Refresh Status
        </PrimaryButton>
      </div>

      <AnimatedContainer direction="up" className="w-full space-y-6">
        {/* Gemini AI Settings Card */}
        <div className="w-full rounded-lg border border-border bg-card shadow-xs overflow-hidden">
          {/* Card Header */}
          <div className="border-b border-border bg-muted/30 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-coral/10 border border-coral/20 flex items-center justify-center text-coral">
                <Cpu className="size-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Google Gemini AI Integration
                </h2>
                <p className="text-xs text-muted-foreground">
                  Powers automated guide creation, FAQ generation, and editorial drafting
                </p>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {isLoading ? (
                <span className="text-xs text-muted-foreground animate-pulse">
                  Loading status...
                </span>
              ) : geminiConfig?.isConfigured ? (
                <>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    <CheckCircle2 className="size-3.5" />
                    Configured & Active
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-coral/10 text-coral border border-coral/20">
                    {geminiConfig.source === "DATABASE" ? (
                      <>
                        <Database className="size-3.5" />
                        Stored in DB (AES-256-GCM)
                      </>
                    ) : (
                      <>
                        <FileCode className="size-3.5" />
                        Server .env
                      </>
                    )}
                  </span>
                </>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  <ShieldAlert className="size-3.5" />
                  Not Configured
                </span>
              )}
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 space-y-6">
            {/* Active Key Display */}
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <KeyRound className="size-3.5 text-coral" />
                    Current Active Key
                  </div>
                  <div className="text-sm font-mono font-medium text-foreground">
                    {geminiConfig?.isConfigured ? (
                      <span className="tracking-widest">
                        {geminiConfig.maskedKey}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">
                        No active key configured. AI guide generation will be unavailable.
                      </span>
                    )}
                  </div>
                  {geminiConfig?.updatedAt && (
                    <p className="text-[11px] text-muted-foreground">
                      Last encrypted update:{" "}
                      {new Date(geminiConfig.updatedAt).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <PrimaryButton
                    variant="outline"
                    size="sm"
                    rounded="lg"
                    onClick={handleTestConnection}
                    isLoading={isTesting}
                    disabled={!geminiConfig?.isConfigured && !newApiKey.trim()}
                  >
                    <RefreshCw className="size-3.5 mr-1.5" />
                    Test Connection
                  </PrimaryButton>

                  {geminiConfig?.source === "DATABASE" && (
                    <PrimaryButton
                      variant="danger"
                      size="sm"
                      rounded="lg"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <Trash2 className="size-3.5 mr-1.5" />
                      Clear DB Key
                    </PrimaryButton>
                  )}
                </div>
              </div>
            </div>

            {/* Input Form to Update Key */}
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="geminiApiKey"
                  className="text-sm font-bold text-foreground flex items-center justify-between"
                >
                  <span>Update Gemini API Key</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    Google AI Studio Key
                  </span>
                </label>

                <div className="relative">
                  <input
                    id="geminiApiKey"
                    type={showKeyInput ? "text" : "password"}
                    value={newApiKey}
                    onChange={(e) => setNewApiKey(e.target.value)}
                    placeholder="Enter new Gemini API key (e.g. AIzaSy...)"
                    className="w-full h-10 px-3.5 pr-10 text-sm rounded-lg border border-input bg-background text-foreground shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral transition-colors font-mono"
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeyInput(!showKeyInput)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showKeyInput ? "Hide key" : "Show key"}
                  >
                    {showKeyInput ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Get your free API key at{" "}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-coral underline hover:text-coral/80"
                  >
                    Google AI Studio
                  </a>
                  . Key supports Gemini 2.5 Flash, 2.0 Flash, and 1.5 Flash models.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <PrimaryButton
                  type="submit"
                  variant="primary"
                  size="md"
                  rounded="lg"
                  isLoading={isSaving}
                  disabled={!newApiKey.trim()}
                >
                  <Lock className="size-4 mr-2" />
                  Save & Encrypt Key
                </PrimaryButton>

                {newApiKey.trim() && (
                  <PrimaryButton
                    type="button"
                    variant="outline"
                    size="md"
                    rounded="lg"
                    onClick={handleTestConnection}
                    isLoading={isTesting}
                  >
                    Test Input Key
                  </PrimaryButton>
                )}
              </div>
            </form>

            {/* Security Guarantee Notice */}
            <div className="rounded-lg border border-border bg-muted/10 p-4 space-y-2">
              <div className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="size-4 text-emerald-600" />
                Database Security & Tamper Protection
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                When saved, your key is immediately encrypted using authenticated{" "}
                <span className="font-semibold text-foreground">
                  AES-256-GCM
                </span>{" "}
                symmetric encryption. Each entry receives a cryptographically
                random 12-byte initialization vector (IV) and a 16-byte
                authentication tag derived from the server&apos;s secret key. If the
                database is breached or dumped, the encrypted ciphertext cannot be
                decrypted, tampered with, or used without the host server&apos;s
                secret.
              </p>
            </div>
          </div>
        </div>

        {/* System & Architecture Info Card */}
        <div className="w-full rounded-lg border border-border bg-card shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="size-10 rounded-lg bg-surface-muted border border-border-peach flex items-center justify-center text-ink">
              <Server className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                Runtime Resolution Hierarchy
              </h2>
              <p className="text-xs text-muted-foreground">
                Order in which the AI service resolves the Gemini API credentials
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="rounded-lg border border-border p-4 space-y-2 bg-muted/10">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <span className="size-5 rounded-full bg-coral text-white flex items-center justify-center text-[10px]">
                  1
                </span>
                Encrypted Database Setting (Priority)
              </div>
              <p className="text-muted-foreground">
                The application checks the <code className="bg-muted px-1 py-0.5 rounded text-[11px]">SystemSetting</code> table for <code className="bg-muted px-1 py-0.5 rounded text-[11px]">GEMINI_API_KEY</code>. If present, it decrypts it in-memory for the API call.
              </p>
            </div>

            <div className="rounded-lg border border-border p-4 space-y-2 bg-muted/10">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <span className="size-5 rounded-full bg-muted-foreground text-white flex items-center justify-center text-[10px]">
                  2
                </span>
                Environment Variable (Fallback)
              </div>
              <p className="text-muted-foreground">
                If no database key is configured, the server falls back to <code className="bg-muted px-1 py-0.5 rounded text-[11px]">process.env.GEMINI_API_KEY</code> defined in the server&apos;s environment file.
              </p>
            </div>
          </div>
        </div>
      </AnimatedContainer>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleRemoveKey}
        title="Remove Gemini API Key from Database?"
        description="This will permanently delete the encrypted Gemini API key from the database. The system will fall back to server environment variables if available."
        variant="danger"
        confirmText="Remove Key"
        rounded="rounded-lg"
        loading={isRemoving}
      />
    </div>
  );
}
