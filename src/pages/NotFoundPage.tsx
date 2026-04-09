import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import Layout from '../components/Layout';
import { SEO } from '../components/SEO';
import { CTA } from '../lib/cta';
import { SEO_ROUTES } from '../lib/seo';

const NotFoundPage: React.FC = () => {
  const location = useLocation();
  const requestedPath = `${location.pathname}${location.search}${location.hash}` || '/';

  return (
    <>
      <SEO {...SEO_ROUTES.notFound} />

      <Layout>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl px-6 pb-24 pt-20 md:px-10 md:pb-32 md:pt-28">
          <section className="max-w-3xl">
            <p className="font-axiomMono text-[11px] uppercase tracking-[0.2em] text-[#A7B3BC]">404</p>
            <h1 className="mt-3 text-[clamp(2.4rem,5vw,4.5rem)] font-extrabold leading-[1.04] text-[#F2F4F7]">
              That page isn&apos;t here.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              The address you opened does not point to a live page. Use the main links below to continue.
            </p>

            <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="font-axiomMono text-[10px] uppercase tracking-[0.16em] text-[#A7B3BC]">Requested path</p>
              <p className="mt-2 break-all font-axiomMono text-[13px] text-[#F2F4F7]">
                {requestedPath}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to={CTA.primary.to} className="btn-primary btn-lg w-full sm:w-auto">
                {CTA.primary.label}
              </Link>
              <Link to={CTA.work.to} className="btn-secondary w-full sm:w-auto">
                {CTA.work.label}
              </Link>
              <Link to={CTA.process.to} className="btn-secondary w-full sm:w-auto">
                {CTA.process.label}
              </Link>
            </div>

            <p className="mt-5 text-sm text-slate-400">
              Or return to{' '}
              <Link
                to="/"
                className="inline-flex min-h-11 items-center text-slate-200 underline decoration-white/30 underline-offset-2 transition-colors hover:text-white"
              >
                home
              </Link>
              .
            </p>
          </section>
        </main>

        <Footer />
      </Layout>
    </>
  );
};

export default NotFoundPage;
