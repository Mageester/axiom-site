import React from 'react';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import { SEO } from '../components/SEO';

const Architects: React.FC = () => {
  return (
    <>
      <SEO
        title="Architects | Axiom Infrastructure"
        description="Meet the architects behind Axiom Infrastructure systems."
      />
      <Layout>
        <main className="mx-auto w-full max-w-7xl px-6 py-20 md:px-8 md:py-28">
          <section className="grid gap-6 md:grid-cols-12">
            <article className="md:col-span-8 rounded-2xl border border-white/10 bg-[#0d1323]/60 p-8 backdrop-blur-xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] md:p-12">
              <p className="font-axiomMono text-xs uppercase tracking-[0.1em] text-axiom-text-mute">Architects</p>
              <h1 className="mt-4 text-[clamp(2.25rem,4vw,3.5rem)] font-extrabold tracking-tight text-axiom-text-main">
                Operator Team
              </h1>
              <p className="mt-4 max-w-2xl text-slate-300">
                Founder profiles, operating principles, and delivery standards will live in this territory.
              </p>
            </article>
            <article className="md:col-span-4 rounded-2xl border border-white/10 bg-[#0d1323]/60 p-8 backdrop-blur-xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
              <p className="font-axiomMono text-xs uppercase tracking-[0.1em] text-axiom-text-mute">Signal</p>
              <p className="mt-4 text-xl font-semibold text-axiom-text-main">Identity Online</p>
              <p className="mt-3 text-sm text-slate-300">Global layout, typography, and transition systems are inherited and active.</p>
            </article>
          </section>
        </main>
        <Footer />
      </Layout>
    </>
  );
};

export default Architects;
