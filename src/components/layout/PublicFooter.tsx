"use client";

import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import CommonWrapper from "@/components/common/CommonWrapper";
import PrimaryButton from "@/components/common/PrimaryButton";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Community", href: "/community" },
  { label: "Guides", href: "/guides" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Adoption", href: "/adoption" },
  { label: "Shelter", href: "/shelter" },
];

const socialLinks = [
  { icon: FaFacebook, href: "https://facebook.com", label: "Facebook" },
  { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
];

export default function PublicFooter() {
  return (
    <footer className="bg-coral dark:bg-slate-900 pb-24 md:pb-0 border-t border-border-peach">
      <CommonWrapper className="px-4 xl:px-0 py-10 text-white">
        {/* Top Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-base font-bold mb-3 text-white font-quicksand">About PetNest</h3>
            <p className="text-sm text-white/80 leading-relaxed max-w-xs">
              We are a passionate community dedicated to pet welfare, shelter adoptions, and care guides.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-bold mb-3 text-white font-quicksand">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 hover:text-white no-underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-base font-bold mb-3 text-white font-quicksand">Follow Us</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-base font-bold mb-3 text-white font-quicksand">Newsletter</h3>
            <p className="text-sm text-white/80 mb-4 leading-relaxed">
              Subscribe to our newsletter to get the latest updates.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 text-sm focus:outline-none focus:border-white/50 transition-colors"
              />
              <PrimaryButton
                type="submit"
                variant="outline"
                size="md"
                className="bg-white text-coral hover:bg-white/90 hover:text-coral border-none font-bold"
              >
                Subscribe
              </PrimaryButton>
            </form>
          </div>
        </div>

        {/* Divider + Copyright */}
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-center">
          <p className="text-xs text-white/60">
            &copy; {new Date().getFullYear()} PetNest. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            Built with Next.js App Router &amp; TypeScript
          </p>
        </div>
      </CommonWrapper>
    </footer>
  );
}
