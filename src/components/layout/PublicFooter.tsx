"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { toast } from "sonner";
import CommonWrapper from "@/components/common/CommonWrapper";
import PrimaryButton from "@/components/common/PrimaryButton";
import { NAV_FEATURE_FLAGS } from "@/lib/nav";

const rawQuickLinks = [
  { label: "Home", href: "/", feature: "guides" as const },
  { label: "Care Guides", href: "/guides", feature: "guides" as const },
  { label: "Topic Categories", href: "/#topics", feature: "guides" as const },
  { label: "Community", href: "/community", feature: "community" as const },
  { label: "Marketplace", href: "/marketplace", feature: "marketplace" as const },
  { label: "Adoption", href: "/adoption", feature: "adoption" as const },
  { label: "Shelter", href: "/shelter", feature: "shelter" as const },
];

const quickLinks = rawQuickLinks.filter((item) => NAV_FEATURE_FLAGS[item.feature]);

const guideTopics = [
  { label: "Basic Care", href: "/#topics" },
  { label: "Health & Wellness", href: "/#topics" },
  { label: "Nutrition & Diet", href: "/#topics" },
  { label: "Grooming & Hygiene", href: "/#topics" },
  { label: "Training & Skills", href: "/#topics" },
  { label: "Emergency & First Aid", href: "/#topics" },
];

const socialLinks = [
  { icon: FaFacebook, href: "https://facebook.com", label: "Facebook" },
  { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
];

export default function PublicFooter() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Thank you for subscribing to PetNest care guides & wellness tips!");
    setEmail("");
  };

  return (
    <footer className="bg-coral dark:bg-slate-900 pb-24 lg:pb-0 border-t border-border-peach">
      <CommonWrapper className="px-4 sm:px-6 xl:px-0 py-8 sm:py-10 text-white">
        {/* Top Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          {/* Column 1: About */}
          <div className="col-span-2 sm:col-span-1 space-y-3.5">
            <h3 className="text-base font-bold text-white font-quicksand flex items-center gap-2">
              About PetNest
            </h3>
            <p className="text-sm text-white/80 leading-relaxed max-w-sm">
              Your trusted companion for expert pet care. Vet-reviewed guides, balanced nutrition charts, and essential training advice to keep your birds and pets happy and thriving.
            </p>
            <div className="pt-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/70 block mb-2 font-quicksand">
                Follow Us
              </span>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="size-8.5 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-all shadow-2xs"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="col-span-1">
            <h3 className="text-base font-bold mb-3 text-white font-quicksand">Navigation</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 hover:text-white no-underline transition-colors hover:translate-x-0.5 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Care Topics */}
          <div className="col-span-1">
            <h3 className="text-base font-bold mb-3 text-white font-quicksand">Care Topics</h3>
            <ul className="space-y-2">
              {guideTopics.map((topic) => (
                <li key={topic.label}>
                  <Link
                    href={topic.href}
                    className="text-sm text-white/80 hover:text-white no-underline transition-colors hover:translate-x-0.5 inline-block"
                  >
                    {topic.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <h3 className="text-base font-bold mb-3 text-white font-quicksand">Care Newsletter</h3>
            <p className="text-sm text-white/80 mb-3.5 leading-relaxed max-w-sm">
              Subscribe to get the latest vet-reviewed care articles, seasonal pet health tips, and nutrition guides.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2 max-w-md">
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 text-sm focus:outline-none focus:border-white/60 transition-colors"
              />
              <PrimaryButton
                type="submit"
                variant="outline"
                size="md"
                className="bg-white text-coral hover:bg-white/90 hover:text-coral border-none font-bold shrink-0 shadow-sm cursor-pointer"
              >
                Subscribe
              </PrimaryButton>
            </form>
          </div>
        </div>

        {/* Divider + Copyright */}
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-xs text-white/70">
            &copy; {new Date().getFullYear()} PetNest. All rights reserved.
          </p>
          <p className="text-xs text-white/60">
            Vet-reviewed pet care and nutrition guidelines.
          </p>
        </div>
      </CommonWrapper>
    </footer>
  );
}
