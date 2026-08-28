import Image from "next/image";

export function ProductsSuiteHero() {
  return (
    <div className="relative mx-auto w-full max-w-2xl" aria-label="School behavior professionals collaborating">
      <div className="absolute -inset-4 rounded-[2rem] bg-[#e4b63d]/10 blur-2xl" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-[1.5rem] border border-white/20 bg-white/95 p-2 shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
        <div className="overflow-hidden rounded-[1.15rem]">
          <Image
            src="/product-suite/hero-collaborate.jpg"
            alt="Four school behavior professionals collaborating around a laptop in a bright office"
            width={1536}
            height={1024}
            priority
            className="aspect-[4/3] w-full object-cover object-center"
          />
        </div>
        <p className="px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-[#51645d]">
          Built for school BCBA practice
        </p>
      </div>
    </div>
  );
}
