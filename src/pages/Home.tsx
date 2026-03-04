import React from 'react';
import BentoGrid from '../components/BentoGrid';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import IntakeTerminal from '../components/IntakeTerminal';
import Layout from '../components/Layout';
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
          <BentoGrid />
          <IntakeTerminal />
          <Footer />
        </div>
      </Layout>
    </>
  );
};

export default Home;
