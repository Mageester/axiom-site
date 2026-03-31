import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import { SEO } from '../components/SEO';

const VALUES = [
  'Be clear.',
  'Keep promises.',
  'Do the work well.',
  'Stay close to the work.',
];

const About: React.FC = () => {
  return (
    <>
      <SEO
        title="About | Axiom"
        description="Axiom is Aidan Magee and Riley Hinsperger. We build higher-trust websites for contractors and service businesses that need clearer messaging and a stronger path to contact."
      />

      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
          <section className="pt-12 md:pt-20">
            <div className="max-w-4xl">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">About</p>
              <h1 className="mt-4 max-w-3xl text-[clamp(2.4rem,5.2vw,4.4rem)] font-extrabold leading-[1.04] text-[#F2F4F7]">
                We are Aidan Magee and Riley Hinsperger. We build higher-trust websites for contractors and service businesses.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200/90 md:text-lg">
                Axiom started because too many good businesses were paying for sites that looked finished but still felt vague, thin on proof, or harder to contact through than they should have been.
                We wanted a company that says things plainly, stays close to the work, and fixes the parts that quietly cost businesses leads.
              </p>
              <div className="mt-8">
                <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                  Book a fit call
                </Link>
              </div>
            </div>
          </section>

          <section className="pt-20 md:pt-24">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Why we built Axiom</p>
                <h2 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-bold tracking-tight text-[#F2F4F7]">
                  We wanted a more useful kind of web design.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                  A lot of small-business sites weaken trust before a visitor ever reaches the contact form. The offer is vague, the proof is thin, the mobile layout is clumsy, or the call to action is buried.
                </p>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                  We fix the message, the page order, and the path to contact so the site feels clearer, stronger, and easier to act on.
                </p>
              </div>

              <div className="space-y-0 border-t border-white/10 pt-5">
                <p className="text-sm leading-7 text-slate-300 md:text-base">
                  We say what the business does.
                </p>
                <p className="border-t border-white/[0.06] pt-4 text-sm leading-7 text-slate-300 md:text-base">
                  We remove the parts that slow people down.
                </p>
                <p className="border-t border-white/[0.06] pt-4 text-sm leading-7 text-slate-300 md:text-base">
                  We stay involved until launch is clean.
                </p>
              </div>
            </div>
          </section>

          <section className="pt-20 md:pt-24">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">The people</p>
                <h2 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-bold tracking-tight text-[#F2F4F7]">
                  You work with us directly.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                  There is no account layer and no handoff maze. We talk to clients ourselves and ship the work ourselves.
                </p>
              </div>

              <div className="space-y-5 border-t border-white/10 pt-5">
                <div className="grid gap-3 border-b border-white/[0.06] pb-5 md:grid-cols-[10rem_minmax(0,1fr)]">
                  <p className="font-axiomMono text-[11px] uppercase tracking-[0.16em] text-[#A7B3BC]">Riley Hinsperger</p>
                  <p className="text-sm leading-7 text-slate-300 md:text-base">
                    Design, frontend, and the visual direction of the site.
                  </p>
                </div>
                <div className="grid gap-3 border-b border-white/[0.06] pb-5 md:grid-cols-[10rem_minmax(0,1fr)]">
                  <p className="font-axiomMono text-[11px] uppercase tracking-[0.16em] text-[#A7B3BC]">Aidan Magee</p>
                  <p className="text-sm leading-7 text-slate-300 md:text-base">
                    Structure, content flow, and launch details.
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-[10rem_minmax(0,1fr)]">
                  <p className="font-axiomMono text-[11px] uppercase tracking-[0.16em] text-[#A7B3BC]">Contact</p>
                  <div className="space-y-2 text-sm text-slate-300 md:text-base">
                    <a href="mailto:riley@getaxiom.ca" className="block transition-colors hover:text-white">
                      riley@getaxiom.ca
                    </a>
                    <a href="mailto:aidan@getaxiom.ca" className="block transition-colors hover:text-white">
                      aidan@getaxiom.ca
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="pt-20 md:pt-24">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">What matters</p>
                <h2 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-bold tracking-tight text-[#F2F4F7]">
                  The work should feel calm and useful.
                </h2>
              </div>

              <div className="space-y-0 border-t border-white/10 pt-5">
                {VALUES.map((value, index) => (
                  <p
                    key={value}
                    className={`${index > 0 ? 'border-t border-white/[0.06] pt-4' : ''} text-sm leading-7 text-slate-300 md:text-base`}
                  >
                    {value}
                  </p>
                ))}
              </div>
            </div>
          </section>

          <section className="pt-20 md:pt-24">
            <div className="max-w-3xl">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Next step</p>
              <h2 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-bold tracking-tight text-[#F2F4F7]">
                If your site is not helping people contact you faster, send it over.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                We will review it ourselves and tell you if we can help. If it is a fit, we will say what we would change first.
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                <Link to="/apply" className="text-[#F2F4F7] underline decoration-white/30 underline-offset-4 transition-colors hover:text-white">
                  Start on the Apply page
                </Link>
                .
              </p>
            </div>
          </section>
        </main>

        <Footer />
      </Layout>
    </>
  );
};

export default About;
