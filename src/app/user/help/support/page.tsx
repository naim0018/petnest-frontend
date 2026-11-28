"use client";

import React, { useState } from "react";
import {
  Headphones,
  Mail,
  MessageCircle,
  HelpCircle,
  Send,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import PrimaryButton from "@/components/common/PrimaryButton";

const FAQS = [
  {
    q: "How do I bookmark a pet care guide?",
    a: "Open any guide or click the bookmark icon on a guide card. All saved guides appear in your Bookmarked Guides page.",
  },
  {
    q: "How can I update my profile or password?",
    a: "Go to Settings in your dashboard sidebar to update your name, bio, location, avatar, or password.",
  },
  {
    q: "How do I contact a vet or ask a question?",
    a: "Visit the Community section from Quick Actions or the main navigation to post questions and connect with pet experts.",
  },
];

export default function HelpSupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in both subject and message.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubject("");
      setMessage("");
      toast.success("Support request sent! Our team will reply soon.");
    }, 400);
  };

  return (
    <div className="w-full space-y-6 font-quicksand">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: FAQs */}
        <AnimatedContainer
          delay={0.05}
          className="lg:col-span-7 bg-card border border-border-peach/60 rounded-xl p-5 sm:p-6 shadow-xs space-y-4"
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle className="size-5 text-coral" />
            <h2 className="text-lg font-extrabold text-ink tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-xl border border-border-peach/50 bg-[#FAF9F8] dark:bg-surface-muted/30 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-3 p-4 text-left"
                  >
                    <span className="text-sm font-bold text-ink">{faq.q}</span>
                    <ChevronDown
                      className={`size-4 text-ink-muted shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs sm:text-sm text-ink-muted leading-relaxed font-medium">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </AnimatedContainer>

        {/* Right: Contact Support Form */}
        <AnimatedContainer
          delay={0.1}
          className="lg:col-span-5 bg-card border border-border-peach/60 rounded-xl p-5 sm:p-6 shadow-xs space-y-4"
        >
          <div className="flex items-center gap-2.5">
            <Headphones className="size-5 text-coral" />
            <h2 className="text-lg font-extrabold text-ink tracking-tight">
              Contact Support
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Issue with saved guides"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border-peach bg-surface-muted/40 text-ink placeholder:text-ink-muted focus:outline-none focus:border-coral transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                Message
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe how we can help..."
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border-peach bg-surface-muted/40 text-ink placeholder:text-ink-muted focus:outline-none focus:border-coral transition-colors resize-none"
              />
            </div>

            <PrimaryButton
              type="submit"
              variant="primary"
              size="md"
              isLoading={submitting}
              leftIcon={<Send className="size-4" />}
              className="w-full font-bold"
            >
              Send Message
            </PrimaryButton>
          </form>

          <div className="pt-2 border-t border-border-peach/40 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-muted font-medium">
            <span className="inline-flex items-center gap-1.5">
              <Mail className="size-3.5 text-coral" />
              support@petnest.com
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MessageCircle className="size-3.5 text-coral" />
              Avg. reply: &lt; 24h
            </span>
          </div>
        </AnimatedContainer>
      </div>
    </div>
  );
}
