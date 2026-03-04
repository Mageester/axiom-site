import React from 'react';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const scrollToIntake = () => {
    document.getElementById('intake')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#090A0B] text-axiom-text-main">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[10%] -left-[20%] h-[600px] w-[600px] rounded-full bg-[#253a7a] opacity-40 blur-[200px]" />
        <div className="absolute top-[35%] -right-[20%] h-[600px] w-[600px] rounded-full bg-[#B05D41] opacity-60 blur-[240px]" />
        <div
          className="absolute inset-0 opacity-[0.08] animate-grid-drift"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(167,179,188,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(167,179,188,0.12) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-axiom-border bg-axiom-base/86 backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 md:px-8">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center rounded-md transition-transform duration-700 hover:scale-110"
            aria-label="Axiom Infrastructure home"
          >
            <img
              src="/logo.png"
              alt="Axiom Infrastructure"
              className="h-14 w-auto object-contain drop-shadow-[0_0_20px_rgba(228,87,46,0.24)]"
            />
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

      <div className="relative z-10 pt-24 md:pt-28 noise-overlay">{children}</div>
    </div>
  );
};

export default Layout;
