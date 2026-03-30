import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import { SEO } from '../components/SEO';

const VALUES = [
  'Be clear.',
  'Do the work well.',
  'Tell the truth about what we can do.',
  'Keep the process simple.',
];

const About: React.FC = () => {
  return (
    <>
      <SEO
        title="About | Axiom"
        description="Axiom is a small founder-led studio that builds simple websites for service businesses."
      />

      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
          <section className="pt-12 md:pt-20">
            <div className="max-w-4xl">
              <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">About</p>
              <h1 className="mt-4 max-w-3xl text-[clamp(2.4rem,5.2vw,4.4rem)] font-extrabold leading-[1.04] text-[#F2F4F7]">
                We are two founders who like clear work.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200/90 md:text-lg">
                Axiom started because too many service businesses were stuck with websites that looked generic and said too little.
                We wanted to build something simpler, sharper, and easier to trust.
              </p>
              <div className="mt-8">
                <Link to="/apply" className="btn-primary btn-lg whitespace-nowrap">
                  Start a project
                </Link>
              </div>
            </div>
          </section>

          <section className="pt-20 md:pt-24">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">Why we built Axiom</p>
                <h2 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-bold tracking-tight text-[#F2F4F7]">
                  We wanted a more honest kind of web design.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                  Most small-business sites try to do too much. They hide the real offer, repeat the same point three ways, and bury the contact step.
                </p>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                  We keep the work simple so the site can do its job: explain the business, earn trust, and make it easy to reach out.
                </p>
              </div>

              <div className="space-y-0 border-t border-white/10 pt-5">
                <p className="text-sm leading-7 text-slate-300 md:text-base">
                  We write the page in plain English.
                </p>
                <p className="border-t border-white/[0.06] pt-4 text-sm leading-7 text-slate-300 md:text-base">
                  We keep the layout calm and easy to read.
                </p>
                <p className="border-t border-white/[0.06] pt-4 text-sm leading-7 text-slate-300 md:text-base">
                  We stay involved until the site is launched cleanly.
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
                  There is no account layer and no handoff maze. We talk to clients ourselves and do the work ourselves.
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
                If your business needs a better site, let&apos;s talk.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                We keep the conversation short and honest. If it is a fit, we will say so.
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
