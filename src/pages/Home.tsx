import React from 'react';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import IntakeTerminal from '../components/IntakeTerminal';
import Layout from '../components/Layout';
import StatsGrid from '../components/StatsGrid';
import Testimonials from '../components/Testimonials';
import TrustCarousel from '../components/TrustCarousel';
import WorksCarousel from '../components/WorksCarousel';
import { SEO } from '../components/SEO';

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
          <TrustCarousel />
          <WorksCarousel />
          <StatsGrid />
          <Testimonials />
          <IntakeTerminal />
          <Footer />
        </div>
      </Layout>
    </>
  );
};

export default Home;
