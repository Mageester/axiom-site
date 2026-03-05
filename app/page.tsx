import Contact from "@/components/Contact";

export default function HomePage() {
  return (
    <main>
      <section className="relative isolate overflow-hidden px-6 py-24 md:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_20%,rgba(176,93,65,0.22),transparent_35%),linear-gradient(180deg,rgba(13,19,35,0)_0%,rgba(13,19,35,0.92)_100%)]" />
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.32em] text-[#B05D41]">Axiom Infrastructure</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-tight text-white md:text-7xl">
            Cinematic digital infrastructure for high-velocity brands.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-white/70 md:text-lg">
            Kinetic interfaces. Hardened pipelines. Conversion-engineered execution.
          </p>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="mt-10 h-[320px] w-full rounded-3xl border border-white/10 object-cover shadow-glass"
            src="/assets/axiom-hero.mp4"
          />
        </div>
      </section>
      <Contact />
    </main>
  );
}
