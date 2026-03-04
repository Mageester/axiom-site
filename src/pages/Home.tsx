import React from 'react';
import BentoGrid from '../components/BentoGrid';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import IntakeTerminal from '../components/IntakeTerminal';
import Layout from '../components/Layout';
import { SEO } from '../components/SEO';

const trustLogos = ['VERCEL', 'GSAP', 'NOTION', 'AWS', 'CLOUDFLARE', 'FRAMER'];

const Home: React.FC = () => {
  return (
    <>
      <SEO
        title="Axiom Infrastructure | Premium Contractor Web Infrastructure"
        description="Engineered digital infrastructure for high-ticket contractors ready to capture premium demand."
      />

      <Layout>
        <div className="flex flex-col gap-y-48 md:gap-y-64 pb-24 md:pb-32">
          <Hero />
          <section className="w-full max-w-7xl mx-auto px-8 py-6">
            <div className="relative overflow-hidden rounded-full border border-white/10 bg-[#111]/40 backdrop-blur-md">
              <div className="animate-logo-cloud flex w-max items-center gap-6 py-4 px-6">
                {[...trustLogos, ...trustLogos].map((logo, idx) => (
                  <div
                    key={`${logo}-${idx}`}
                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.02] px-5 py-2 text-[11px] font-semibold tracking-[0.22em] text-[#A7B3BC] grayscale hover:grayscale-0 hover:scale-110 transition-all duration-700 transform-gpu"
                  >
                    {logo}
                  </div>
                ))}
              </div>
            </div>
          </section>
          <BentoGrid />
          <IntakeTerminal />
          <Footer />
        </div>
      </Layout>
    </>
  );
};

export default Home;
