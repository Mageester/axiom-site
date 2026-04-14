import React from 'react';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import { SEO } from '../components/SEO';
import { CTA } from '../lib/cta';
import { SEO_ROUTES } from '../lib/seo';

const Architects: React.FC = () => {
  return (
    <>
      <SEO
        {...SEO_ROUTES.about}
      />
      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl px-6 py-20 md:px-8 md:py-28">
          <section className="grid gap-6 md:grid-cols-12">
            <article className="md:col-span-8 rounded-2xl border border-white/10 bg-[#0d1323]/60 p-8 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] backdrop-blur-xl md:p-12">
              <p className="section-eyebrow">About</p>
              <h1 className="mt-4 text-[clamp(2.25rem,4vw,3.5rem)] font-extrabold tracking-tight text-axiom-text-main">
                Delivery Team
              </h1>
              <p className="mt-4 max-w-2xl text-slate-200/90">Axiom is a senior-led team focused on positioning precision, conversion clarity, and controlled delivery.</p>
              <a href={CTA.primary.to} className="mt-8 inline-flex text-sm font-medium text-[#B05D41] transition-colors hover:text-[#d7a189]">
                            {CTA.primary.label}
              </a>
            </article>
            <article className="md:col-span-4 rounded-2xl border border-white/10 bg-[#0d1323]/60 p-8 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] backdrop-blur-xl">
              <p className="section-eyebrow">Operating Principle</p>
              <p className="mt-4 text-xl font-semibold text-axiom-text-main">Selective Engagements</p>
              <p className="mt-3 text-sm text-slate-200/90">We keep active engagements limited to protect execution quality.</p>
            </article>
          </section>
        </main>
        <Footer />
      </Layout>
    </>
  );
};

export default Architects;
