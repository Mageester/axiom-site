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
        <main className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center px-8 py-24 md:py-32">
          <section className="axiom-bento w-full p-10 md:p-14">
            <p className="font-axiomMono text-xs uppercase tracking-[0.1em] text-axiom-text-mute">Architects</p>
            <h1 className="mt-4 text-[clamp(2.25rem,4vw,3.5rem)] font-extrabold tracking-tight text-axiom-text-main">Architects</h1>
            <p className="mt-4 max-w-2xl text-slate-300">Page scaffold is live. Content architecture can be added next.</p>
          </section>
        </main>
        <Footer />
      </Layout>
    </>
  );
};

export default Architects;
