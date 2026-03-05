import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

type BlueprintItem = {
  label: string;
  text: string;
};

type Demo = {
  title: string;
  subtitle: string;
  positioning: string;
  desc: string;
  roi: string;
  problem: string;
  solution: string;
  url: string;
  capabilities: string[];
  features: string[];
  blueprint?: BlueprintItem[];
};

const demos: Demo[] = [
  {
    title: 'HVAC Performance',
    subtitle: 'Apex Climate Systems',
    positioning: 'Dispatch-first infrastructure for emergency HVAC demand windows.',
    desc: 'When the first heatwave hits and your phones blow up, this system filters the tire-kickers so your techs only roll trucks for high-ticket emergency installs.',
    roi: 'Double your emergency dispatch rate during peak weather events.',
    problem: 'Unqualified calls burning dispatch hours - your techs are rolling trucks for $89 tune-ups instead of $4,000 compressor replacements.',
    solution: 'An intake system that asks the right questions upfront, filters out the tire-kickers, and routes real emergency calls straight to dispatch.',
    url: 'https://hvac.getaxiom.ca',
    capabilities: ['Emergency dispatch banner', 'Diagnostic intake routing', 'Dispatch qualification filter'],
    features: ['Emergency Dispatch Banner', 'Service Plan Builder', 'Split-Screen Hero', 'Emergency Dispatch Filter'],
    blueprint: [
      { label: 'Objective', text: "Capture emergency 'No-AC' calls during 35C+ heatwaves in Southern Ontario." },
      { label: 'Result', text: '0.3s load time achieved on 3G networks in rural Ontario field testing.' },
      { label: 'Outcome', text: '22% increase in high-ticket emergency installs in Month 1 post-launch.' },
    ],
  },
  {
    title: 'Roofing Performance',
    subtitle: 'Summit Roofing Co.',
    positioning: 'Storm protocol conversion system for high-volume inspection demand.',
    desc: "When hail storms hit and every roof in town leaks, your site loads instantly while your competitors' sites crash. You get the calls. They get voicemail.",
    roi: "Capture storm-season leads while competitors' sites go down.",
    problem: 'Every time a big storm rolls through, your site grinds to a halt from the traffic spike - and those leads go to whoever loads first.',
    solution: 'Edge-deployed infrastructure that handles traffic spikes without flinching. Your site loads in under a second, even when half the county is searching for roof repair.',
    url: 'https://roofing.getaxiom.ca',
    capabilities: ['Storm protocol timeline', 'Material selector', 'Inspection funnel'],
    features: ['Material Comparison Tool', 'Storm Damage Checklist', 'Insurance Claim Helper', 'Before/After Gallery'],
  },
  {
    title: 'Landscaping Performance',
    subtitle: 'Verdant Landscapes',
    positioning: 'Portfolio-grade consultation system for premium outdoor projects.',
    desc: "You're bidding on $50K hardscape projects against companies with $200 websites. This fixes the gap between the quality of your work and the quality of your online presence.",
    roi: 'Win premium design contracts with a portfolio that matches your craft.',
    problem: 'Competing for $50K+ design projects with a website that looks like a $500 template.',
    solution: 'A portfolio-grade digital experience that positions you as the premium choice before the first phone call.',
    url: 'https://landscaping.getaxiom.ca',
    capabilities: ['Featured project portfolio', 'Seasonal program flow', 'Design consultation funnel'],
    features: ['Before/After Slider', 'Seasonal Project Timeline', 'Full-Screen Gallery', 'Design Consultation Booking'],
  }
];

const ConceptsPage: React.FC = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleDetails = (title: string) => {
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="page-shell">
      <SEO
        title="Concepts | Axiom Infrastructure"
        description="Explore Axiom Professional demo concepts for HVAC, roofing, and landscaping businesses."
      />

      <section className="max-w-3xl mx-auto text-center flex flex-col gap-4 sm:gap-5 mb-16 sm:mb-20">
        <p className="eyebrow-center">Professional Concepts</p>
        <h1 className="text-[28px] sm:text-[40px] md:text-[48px] font-semibold tracking-tight leading-[1.08]">
          Real sites built for real contractors. Not templates.
        </h1>
        <p className="lead text-center mx-auto">
          Each concept is engineered from scratch for a specific industry. Different layouts, different funnels, different conversion strategies.
        </p>
      </section>

      <section className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5">
        {demos.map((demo) => {
          const isExpanded = !!expanded[demo.title];

          return (
            <article
              key={demo.title}
              className={`axiom-bento flex flex-col gap-5 overflow-hidden ${isExpanded ? 'max-h-none' : 'max-h-[82vh] lg:max-h-none'}`}
            >
              <div className="h-[3px] -mx-6 -mt-6 mb-1 bg-axiom-accent" />

              <div className="flex flex-col gap-2">
                <p className="big-figure-label text-axiom-text-mute">{demo.subtitle}</p>
                <h2 className="text-[22px] sm:text-[24px] font-semibold tracking-tight text-axiom-text-main">{demo.title}</h2>
                <p className="text-[14px] text-axiom-text-main/90 leading-[1.65]">{demo.positioning}</p>
              </div>

              <div className="axiom-bento-card p-4">
                <p className="big-figure-label text-axiom-text-mute mb-3">Core Capabilities</p>
                <ul className="space-y-2">
                  {demo.capabilities.slice(0, 3).map((capability) => (
                    <li key={capability} className="flex items-start gap-2 text-[13px] text-axiom-text-mute leading-relaxed">
                      <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-axiom-accent" />
                      <span>{capability}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="hidden lg:block axiom-bento-card overflow-hidden">
                <div className="p-4 flex gap-3 items-start border-b border-axiom-border">
                  <div className="w-1 self-stretch rounded-full shrink-0 bg-axiom-border"></div>
                  <div>
                    <p className="big-figure-label text-axiom-text-mute/70 mb-1">Problem</p>
                    <p className="text-[13px] text-axiom-text-mute leading-[1.7]">{demo.problem}</p>
                  </div>
                </div>
                <div className="p-4 flex gap-3 items-start">
                  <div className="w-1 self-stretch rounded-full shrink-0 bg-axiom-accent/45"></div>
                  <div>
                    <p className="big-figure-label text-axiom-accent/85 mb-1">Solution</p>
                    <p className="text-[13px] text-axiom-text-mute leading-[1.7]">{demo.solution}</p>
                  </div>
                </div>
              </div>

              <div className={`${isExpanded ? 'block' : 'hidden'} lg:hidden space-y-4`}> 
                <div className="axiom-bento-card overflow-hidden">
                  <div className="p-4 flex gap-3 items-start border-b border-axiom-border">
                    <div className="w-1 self-stretch rounded-full shrink-0 bg-axiom-border"></div>
                    <div>
                      <p className="big-figure-label text-axiom-text-mute/70 mb-1">Problem</p>
                      <p className="text-[13px] text-axiom-text-mute leading-[1.7]">{demo.problem}</p>
                    </div>
                  </div>
                  <div className="p-4 flex gap-3 items-start">
                    <div className="w-1 self-stretch rounded-full shrink-0 bg-axiom-accent/45"></div>
                    <div>
                      <p className="big-figure-label text-axiom-accent/85 mb-1">Solution</p>
                      <p className="text-[13px] text-axiom-text-mute leading-[1.7]">{demo.solution}</p>
                    </div>
                  </div>
                </div>

                <div className="axiom-bento-card p-4">
                  <p className="big-figure-label text-axiom-text-mute mb-2">Outcome Signal</p>
                  <p className="text-[13px] text-axiom-text-mute leading-[1.7]">{demo.roi}</p>
                </div>

                {demo.blueprint && (
                  <div className="axiom-bento-card p-4 flex flex-col gap-3">
                    <p className="big-figure-label text-axiom-accent">Project Deep-Dive</p>
                    {demo.blueprint.map((item) => (
                      <div key={item.label} className="flex gap-3 items-start">
                        <span className="big-figure-label text-axiom-text-mute shrink-0 w-16 mt-0.5">{item.label}</span>
                        <p className="text-[13px] text-axiom-text-mute leading-[1.7]">{item.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 mt-auto">
                <a
                  href={demo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full"
                >
                  View Demo {'->'}
                </a>

                <button
                  type="button"
                  onClick={() => toggleDetails(demo.title)}
                  className="lg:hidden btn-secondary w-full"
                >
                  {isExpanded ? 'Hide details' : 'Show details'}
                </button>
              </div>
            </article>
          );
        })}
      </section>

      <section className="max-w-[1100px] mx-auto mt-16 sm:mt-24">
        <div className="inline-cta !m-0">
          <h2 className="text-[24px] sm:text-[32px] md:text-[40px] font-semibold tracking-tight">
            Want this built for your trade?
          </h2>
          <p className="lead text-center mx-auto">
            Every build is engineered from scratch for your specific market. No templates. No shared layouts. No recycled designs from another contractor down the road.
          </p>
          <Link to="/contact" className="btn-primary">
            Book Strategy Call
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ConceptsPage;
