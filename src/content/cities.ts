export type CitySlug = 'kitchener' | 'waterloo' | 'cambridge' | 'guelph' | 'hamilton';

export type City = {
  slug: CitySlug;
  name: string;
  region: string;
  intro: string;
  localContext: string;
  neighborhoods: string[];
};

export const cities: City[] = [
  {
    slug: 'kitchener',
    name: 'Kitchener',
    region: 'Waterloo Region, Ontario',
    intro:
      'Web design for Kitchener local businesses - clinics, trades, studios, shops, and service teams. Clearer offers, stronger proof, and a faster path from phone visit to inquiry.',
    localContext:
      'We are based in Kitchener-Waterloo. Most projects begin with a 30-minute call, in-person or over Zoom, depending on the schedule.',
    neighborhoods: ['Downtown Kitchener', 'Belmont Village', 'Doon', 'Stanley Park', 'Forest Heights'],
  },
  {
    slug: 'waterloo',
    name: 'Waterloo',
    region: 'Waterloo Region, Ontario',
    intro:
      'Web design for Waterloo service businesses that need to look credible quickly. Clearer offer, visible proof, and a mobile experience that makes contacting you easy.',
    localContext:
      'A short drive from our base. We work with practices, clinics, salons, and studios across uptown and the university district.',
    neighborhoods: ['Uptown Waterloo', 'University District', 'Lakeshore', 'Lincoln Heights', 'Beechwood'],
  },
  {
    slug: 'cambridge',
    name: 'Cambridge',
    region: 'Waterloo Region, Ontario',
    intro:
      'Web design for Cambridge businesses that rely on trust before the first call. Built for Galt, Preston, and Hespeler - clear, fast, and credible on the first scroll.',
    localContext:
      'We serve Cambridge clients across Galt, Preston, and Hespeler. Site visits and on-location photography arranged as needed.',
    neighborhoods: ['Galt', 'Preston', 'Hespeler', 'Blair', 'West Galt'],
  },
  {
    slug: 'guelph',
    name: 'Guelph',
    region: 'Wellington County, Ontario',
    intro:
      'Web design for Guelph local businesses. We make the offer obvious, the proof easy to find, and the inquiry path direct so buyers can decide faster.',
    localContext:
      'Half an hour from our base. We work with downtown, south end, and west end clients across professional services, clinics, and studios.',
    neighborhoods: ['Downtown Guelph', 'South End', 'West End', 'Old University', 'Exhibition Park'],
  },
  {
    slug: 'hamilton',
    name: 'Hamilton',
    region: 'Hamilton, Ontario',
    intro:
      'Web design for Hamilton service businesses - clinics, studios, trades, shops, and local teams. Fast, mobile-correct, and built so serious buyers can act.',
    localContext:
      'We serve Hamilton clients across downtown, the mountain, and Ancaster. Calls by Zoom; on-site visits arranged for larger scopes.',
    neighborhoods: ['Downtown Hamilton', 'Westdale', 'The Mountain', 'Stoney Creek', 'Ancaster'],
  },
];

export const getCityBySlug = (slug: string) => cities.find((c) => c.slug === slug);
