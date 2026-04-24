import React from 'react';

type Testimonial = {
  quote: string;
  clientName: string;
  businessName: string;
  industryTag: string;
  rating?: number;
};

type CredibilityItem = {
  title: string;
  eyebrow: string;
  description: string;
};

type SocialProofProps = {
  testimonials?: readonly Testimonial[];
  headingId?: string;
  mode?: 'testimonials' | 'credibility';
  className?: string;
};

const defaultCredibilityItems: readonly CredibilityItem[] = [
  {
    eyebrow: 'Performance standard',
    title: 'Engineered for Core Web Vitals from the first build.',
    description: 'Performance is part of the delivery process, not a premium add-on.',
  },
  {
    eyebrow: 'Full ownership',
    title: 'You own the site outright.',
    description: 'No licensing trap, no holdback, no dependency on a monthly platform fee.',
  },
  {
    eyebrow: 'No recurring fees',
    title: 'Pay for the build, not for permission.',
    description: 'The work is scoped up front so the relationship does not turn into rent.',
  },
] as const;

const testimonialSchema = (testimonials: readonly Testimonial[]) => ({
  '@context': 'https://schema.org',
  '@graph': testimonials.map((testimonial) => ({
    '@type': 'Review',
    reviewBody: testimonial.quote,
    author: {
      '@type': 'Person',
      name: testimonial.clientName,
    },
    itemReviewed: {
      '@type': 'LocalBusiness',
      name: 'Axiom Infrastructure',
      url: 'https://getaxiom.ca',
    },
    ...(testimonial.rating
      ? {
          reviewRating: {
            '@type': 'Rating',
            ratingValue: testimonial.rating,
            bestRating: 5,
          },
        }
      : {}),
  })),
});

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, index) => index < rating);

  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {stars.map((filled, index) => (
        <span
          key={`${index}-${filled ? 'filled' : 'empty'}`}
          className={filled ? 'text-[#d4a48e]' : 'text-white/15'}
          aria-hidden="true"
        >
          *
        </span>
      ))}
    </div>
  );
};

const SocialProof: React.FC<SocialProofProps> = ({
  testimonials,
  headingId,
  mode = 'credibility',
  className = '',
}) => {
  const hasTestimonials = mode === 'testimonials' && (testimonials?.length ?? 0) > 0;
  const testimonialCards = hasTestimonials ? (testimonials as readonly Testimonial[]) : [];
  const credibilityCards = defaultCredibilityItems;

  return (
    <div className={className}>
      {hasTestimonials ? (
        <div className="max-w-4xl">
          <p className="section-eyebrow">Testimonials</p>
          <h2 id={headingId} className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
            What clients say
          </h2>
          <p className="mt-4 max-w-3xl text-[15px] leading-[1.7] text-slate-300 md:text-[16px]">
            Verifiable reviews from named clients, shared with permission.
          </p>
        </div>
      ) : (
        <div className="max-w-4xl">
          <p className="section-eyebrow">Why businesses choose Axiom</p>
          <h2 id={headingId} className="mt-3 text-3xl font-bold tracking-tight text-[#F2F4F7] md:text-5xl">
            No fluff. Just reasons buyers can verify.
          </h2>
          <p className="mt-4 max-w-3xl text-[15px] leading-[1.7] text-slate-300 md:text-[16px]">
            When there is no review to show yet, lead with the parts of the offer that are already clear.
          </p>
        </div>
      )}

      {hasTestimonials ? (
        <div className="mt-10 grid grid-flow-col auto-cols-[85%] gap-4 overflow-x-auto pb-2 md:grid-flow-row md:grid-cols-2 md:overflow-visible">
          {testimonialCards.map((testimonial) => (
            <article
              key={`${testimonial.clientName}-${testimonial.businessName}`}
              className="machined-card flex h-full min-h-[16rem] flex-col gap-5 p-6 md:p-8"
            >
              <div className="space-y-4">
                <p className="section-eyebrow">{testimonial.industryTag}</p>
                <blockquote className="max-w-3xl text-[clamp(1.3rem,2vw,1.8rem)] font-medium leading-[1.55] tracking-normal text-[#F2F4F7]">
                  {testimonial.quote}
                </blockquote>
              </div>

              <div className="mt-auto border-t border-white/10 pt-5">
                {typeof testimonial.rating === 'number' ? <StarRating rating={testimonial.rating} /> : null}
                <div className="mt-3">
                  <p className="text-[16px] font-semibold text-[#F2F4F7] md:text-[17px]">{testimonial.clientName}</p>
                  <p className="text-[15px] text-slate-400 md:text-[16px]">{testimonial.businessName}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-10 grid grid-flow-col auto-cols-[85%] gap-4 overflow-x-auto pb-2 md:grid-flow-row md:grid-cols-2 md:overflow-visible">
          {credibilityCards.map((item) => (
            <article key={item.title} className="machined-card flex h-full min-h-[14rem] flex-col gap-5 p-6 md:p-8">
              <div className="space-y-4">
                <p className="section-eyebrow">{item.eyebrow}</p>
                <h3 className="max-w-xl text-[clamp(1.4rem,2vw,1.9rem)] font-semibold leading-[1.2] tracking-normal text-[#F2F4F7]">
                  {item.title}
                </h3>
              </div>

              <p className="mt-auto max-w-xl text-[16px] leading-[1.7] text-slate-300 md:text-[17px]">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      )}

      {hasTestimonials ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(testimonialSchema(testimonialCards)),
          }}
        />
      ) : null}
    </div>
  );
};

export default SocialProof;
