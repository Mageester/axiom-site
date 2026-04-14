import React from 'react';
import { RevealBlock } from './ui/RevealBlock';
import { responsiveImages, type ResponsiveSource } from '../lib/responsiveImages';

type WorkPreview = {
  name: string;
  description: string;
  industryTag: string;
  image: ResponsiveSource;
  alt: string;
};

const browserDots = [
  'bg-[#ff5f57]',
  'bg-[#febc2e]',
  'bg-[#28c840]',
] as const;

const workPreviews: WorkPreview[] = [
  {
    name: 'Restaurant project',
    description: 'Reservations, menu access, and contact details stay visible on every screen.',
    industryTag: 'Restaurant & Hospitality',
    image: responsiveImages.workRestaurant,
    alt: 'Restaurant project site preview',
  },
  {
    name: 'Landscaping project',
    description: 'Project photos and quote requests are presented without clutter.',
    industryTag: 'Landscaping & Outdoor',
    image: responsiveImages.workLandscaping,
    alt: 'Landscaping project site preview',
  },
  {
    name: 'Roofing project',
    description: 'Urgent calls and estimate requests each have a clear path.',
    industryTag: 'Roofing & Exterior Services',
    image: responsiveImages.workRoofing,
    alt: 'Roofing project site preview',
  },
];

const browserImageSizes = '(min-width: 1024px) 24rem, (min-width: 768px) 50vw, w-full';

const WorkPreviewCard: React.FC<{ preview: WorkPreview; index: number }> = ({ preview, index }) => {
  return (
    <RevealBlock
      as="article"
      delay={index * 0.08}
      variant="card"
      className="machined-card reveal-on-scroll flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[var(--axiom-elevated)]"
    >
      <div className="border-b border-white/10 bg-[#0b0f16] px-4 py-3">
        <div className="flex items-center gap-2">
          {browserDots.map((dot) => (
            <span key={dot} className={`h-3 w-3 rounded-full ${dot}`} aria-hidden="true" />
          ))}
        </div>
      </div>

      <div className="overflow-hidden border-b border-white/10 bg-[#090d15]">
        <picture>
          <source type="image/avif" srcSet={preview.image.avifSrcSet} sizes={browserImageSizes} />
          <source type="image/webp" srcSet={preview.image.webpSrcSet} sizes={browserImageSizes} />
          <img
            src={preview.image.fallbackSrc}
            alt={preview.alt}
            className="aspect-[16/10] h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div>
          <h3 className="text-[1.1rem] font-semibold tracking-tight text-[#F2F4F7]">{preview.name}</h3>
          <p className="mt-2 text-[15px] md:text-sm leading-6 text-slate-300">{preview.description}</p>
        </div>

        <div className="mt-5">
          <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-axiomMono text-[15px] md:text-[10px] uppercase tracking-[0.16em] text-white/65">
            {preview.industryTag}
          </span>
        </div>
      </div>
    </RevealBlock>
  );
};

const WorkPreviewGrid: React.FC = () => {
  return (
    <section aria-labelledby="work-preview-grid-heading" className="pt-16 md:pt-20">
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-2xl">
          <p className="section-eyebrow">SELECTED WORK</p>
          <h2 id="work-preview-grid-heading" className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
            Selected work
          </h2>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {workPreviews.map((preview, index) => (
            <WorkPreviewCard key={preview.name} preview={preview} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkPreviewGrid;
