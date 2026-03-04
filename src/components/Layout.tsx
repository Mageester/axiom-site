import React from 'react';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const scrollToIntake = () => {
    document.getElementById('intake')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-axiom-base text-axiom-text-main">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-[#E4572E] opacity-[0.15] blur-[160px]" />
        <div className="absolute top-20 -right-20 h-[700px] w-[700px] rounded-full bg-[#1A365D] opacity-[0.20] blur-[160px]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27160%27 viewBox=%270 0 160 160%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.85%27 numOctaves=%272%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27160%27 height=%27160%27 filter=%27url(%23n)%27 opacity=%270.8%27/%3E%3C/svg%3E")',
          }}
        />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-axiom-border bg-axiom-base/86 backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 md:px-8">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center text-[22px] font-extrabold tracking-tighter text-axiom-text-main"
          >
            Axiom<span className="text-axiom-accent">.</span>
          </button>

          <div className="hidden md:flex items-center gap-8 text-[11px] font-axiomMono uppercase tracking-[0.16em] text-axiom-text-mute">
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-axiom-text-main transition-colors">
              Front Gate
            </button>
            <button type="button" onClick={scrollToIntake} className="hover:text-axiom-text-main transition-colors">
              Intake
            </button>
          </div>

          <button type="button" onClick={scrollToIntake} className="btn-primary btn-md whitespace-nowrap">
            Initialize Setup
          </button>
        </div>
      </nav>

      <div className="relative z-10 pt-24 md:pt-28">{children}</div>
    </div>
  );
};

export default Layout;
