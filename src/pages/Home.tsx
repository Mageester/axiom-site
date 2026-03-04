import React from 'react';
import BentoGrid from '../components/BentoGrid';
import Hero from '../components/Hero';
import Layout from '../components/Layout';
import RoiTerminal from '../components/RoiTerminal';
import { SEO } from '../components/SEO';

const Home: React.FC = () => {
  return (
    <>
      <SEO
        title="Axiom Infrastructure | Premium Contractor Web Infrastructure"
        description="Engineered digital infrastructure for high-ticket contractors ready to capture premium demand."
      />

      <Layout>
        <div className="flex flex-col gap-y-40 md:gap-y-64 pb-24 md:pb-32">
          <Hero />
          <BentoGrid />
          <RoiTerminal />
        </div>
      </Layout>
    </>
  );
};

export default Home;
