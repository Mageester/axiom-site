import React, { useEffect, useState } from 'react';

type Testimonial = {
  quote: string;
  name: string;
  title: string;
  avatar: string;
};

const testimonials: Testimonial[] = [
  {
    quote: 'They bridge the gap between ambitious visual concepts and operational reality.',
    name: 'Jake Young',
    title: 'Co-Founder and CEO',
    avatar: '/images/avatar-jake.jpg',
  },
  {
    quote: 'The new infrastructure elevated our brand while making the entire sales journey effortless.',
    name: 'Sarah Mitchell',
    title: 'Managing Partner',
    avatar: '/images/avatar-sarah.jpg',
  },
  {
    quote: 'Every touchpoint now communicates authority. We finally look as premium as we perform.',
    name: 'Daniel Porter',
    title: 'Founder',
    avatar: '/images/avatar-daniel.jpg',
  },
];

const Testimonials: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="w-full max-w-5xl mx-auto px-8 py-24">
      <div className="relative min-h-[220px]">
        {testimonials.map((item, itemIndex) => {
          const active = itemIndex === index;

          return (
            <article
              key={item.name}
              className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-opacity duration-700 ease-out ${active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              <blockquote className="max-w-4xl text-2xl md:text-4xl italic leading-[1.35] tracking-tight text-[#F2F4F7]">
                {item.quote}
              </blockquote>

              <div className="mt-8 flex items-center gap-4">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="h-14 w-14 rounded-full object-cover ring-1 ring-[#34406c]"
                  loading="lazy"
                />
                <p className="text-left text-sm md:text-base text-[#A7B3BC]">
                  <span className="block text-[#F2F4F7] font-semibold">{item.name}</span>
                  <span>{item.title}</span>
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Testimonials;
