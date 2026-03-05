import React from 'react';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import { SEO } from '../components/SEO';

const Deployments: React.FC = () => {
  return (
    <>
      <SEO
        title="Deployments | Axiom Infrastructure"
        description="Deployment architecture and execution standards from Axiom Infrastructure."
      />
      <Layout>
        <main className="mx-auto w-full max-w-7xl px-6 py-20 md:px-8 md:py-28">
          <section className="grid gap-6 md:grid-cols-12">
            <article className="md:col-span-7 rounded-2xl border border-white/10 bg-[#0d1323]/60 p-8 backdrop-blur-xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] md:p-12">
              <p className="font-axiomMono text-xs uppercase tracking-[0.1em] text-axiom-text-mute">Deployments</p>
              <h1 className="mt-4 text-[clamp(2.25rem,4vw,3.5rem)] font-extrabold tracking-tight text-axiom-text-main">
                Launch Discipline
              </h1>
              <p className="mt-4 max-w-2xl text-slate-300">
                Release orchestration, QA gates, and production rollout sequencing will be presented here.
              </p>
            </article>
            <article className="md:col-span-5 rounded-2xl border border-white/10 bg-[#0d1323]/60 p-8 backdrop-blur-xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
              <p className="font-axiomMono text-xs uppercase tracking-[0.1em] text-axiom-text-mute">Readiness</p>
              <p className="mt-4 text-xl font-semibold text-axiom-text-main">Transition Ready</p>
              <p className="mt-3 text-sm text-slate-300">Route shell, footer, and background system are now aligned with the main experience.</p>
            </article>
          </section>
        </main>
        <Footer />
      </Layout>
    </>
  );
};

export default Deployments;
