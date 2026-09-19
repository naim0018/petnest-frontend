import Image from "next/image";
import CommonWrapper from "@/components/common/CommonWrapper";

export default function GuidesBanner() {
  return (
    <header className="relative w-full overflow-hidden border-b border-coral/20 bg-linear-to-r from-amber-50/90 via-orange-50/80 to-amber-100/40 h-full">
      <div className="absolute inset-0 z-0 h-full">
        <Image
          src="/CareGuide/petnest-guides.png"
          alt="Pet care guides - Dog and cat together"
          fill
          priority
          className="object-cover object-right opacity-40 h-full sm:opacity-90 lg:opacity-100"
          sizes="100vw"
        />
        {/* Soft gradient mask to guarantee high readability of text on the left */}
        <div className="absolute inset-0 bg-linear-to-r from-amber-50 via-amber-50/85 sm:via-amber-50/60 to-transparent w-full md:w-3/4 lg:w-3/5" />
      </div>

      <CommonWrapper className="relative z-10 w-full flex flex-col justify-center my-20 sm:my-28">
        <div className="max-w-xl space-y-3 sm:space-y-4">
          <span className="inline-block text-xs font-bold text-coral uppercase tracking-wider bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full border border-coral/20 shadow-2xs">
            PETNEST CARE GUIDE
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold text-ink font-quicksand leading-tight">
            Everything your pet needs to thrive.
          </h1>
          <p className="text-sm sm:text-lg text-ink-muted leading-relaxed max-w-lg">
            Trusted guides and vet-approved articles to help you understand, care for, and protect your pet.
          </p>
        </div>
      </CommonWrapper>
    </header>
  );
}
