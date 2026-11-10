// Millrace Plumbing: a fictional local plumber. Names, prices, reviews and the licence line are
// all made up for the concept; the photographs are licensed stock.
import photoData from './photos.json';

export const NAME = 'Millrace Plumbing';
export const BASE = '/work/millrace';
export const PHONE_DISPLAY = '(519) 555-0138';
export const PHONE_HREF = 'tel:+15195550138';
export const EMAIL = 'service@millrace.example';

export type PhotoEntry = (typeof photoData)[keyof typeof photoData];
export const photos = photoData as Record<string, PhotoEntry>;

export type Service = {
  id: string;
  name: string;
  from: string;
  unit: string;
  text: string;
  examples: string[];
};

export const services: Service[] = [
  {
    id: 'leaks',
    name: 'Leaks and repairs',
    from: '$145',
    unit: 'per visit',
    text: 'Dripping taps, running toilets, leaking supply lines and burst pipes, fixed and tested before we leave.',
    examples: ['Tap and cartridge repairs', 'Toilet repairs and replacements', 'Burst or frozen pipes'],
  },
  {
    id: 'drains',
    name: 'Drain clearing',
    from: '$165',
    unit: 'per drain',
    text: 'Slow or blocked sinks, tubs and floor drains cleared, with a camera check if it keeps coming back.',
    examples: ['Kitchen, bathroom and laundry drains', 'Main line clearing', 'Camera inspection'],
  },
  {
    id: 'water-heaters',
    name: 'Water heaters',
    from: '$1,450',
    unit: 'installed',
    text: 'Tank and tankless water heaters supplied, installed and tested, with the old unit taken away.',
    examples: ['Tank replacement, same day where we can', 'Tankless installation', 'Venting and gas connections'],
  },
  {
    id: 'fixtures',
    name: 'Taps and fixtures',
    from: '$120',
    unit: 'per fixture',
    text: 'New taps, sinks, toilets, showers and dishwasher or washing-machine hook-ups, fitted neatly.',
    examples: ['Supply-and-fit or fit-only', 'Shut-off valve replacement', 'Appliance connections'],
  },
  {
    id: 'sump',
    name: 'Sump pumps and basements',
    from: '$385',
    unit: 'per pump',
    text: 'Sump pumps, backflow valves and floor drains that keep a basement dry in spring and in storms.',
    examples: ['Pump replacement and battery backup', 'Backwater valves', 'Floor drain repairs'],
  },
  {
    id: 'renovations',
    name: 'Kitchen and bathroom work',
    from: 'Free quote',
    unit: 'fixed price',
    text: 'Rough-in and finish plumbing for renovations, priced before work starts and scheduled around your trades.',
    examples: ['Rough-ins and relocations', 'Fixture installation', 'Permits and inspections'],
  },
];

export const steps = [
  { title: 'Tell us what is wrong', text: 'Book online or call. Photos help, and for emergencies we send someone straight away.' },
  { title: 'We arrive in your window', text: 'You get a two-hour arrival window, then a text when we are on the way.' },
  { title: 'You approve the price', text: 'We find the cause, tell you the cost in writing and start only when you say yes.' },
];

export const reasons = [
  { title: 'Prices before work starts', text: 'You see the cost in writing and approve it. If we find something else, we stop and ask first.' },
  { title: 'Tidy, on-time crews', text: 'Boot covers, drop sheets and a clean floor when we leave. If we run late, you hear from us before you have to ask.' },
  { title: 'A year on every repair', text: 'If the same problem comes back within twelve months, we come back and fix it at no charge.' },
];

export const reviews = [
  {
    quote: 'The water heater went on a Sunday evening. Someone was at the door within two hours and we had hot water that night.',
    who: 'Sample customer, Cambridge',
    job: 'Water heater replacement',
  },
  {
    quote: 'They told me the price before they started and it did not change. The kitchen floor was cleaner when they left than when they arrived.',
    who: 'Sample customer, Kitchener',
    job: 'Kitchen tap and drain',
  },
  {
    quote: 'We had called two others about the damp basement. Millrace found the cause in ten minutes and fixed it the same day.',
    who: 'Sample customer, Guelph',
    job: 'Sump pump and backwater valve',
  },
];

export const towns = ['Cambridge', 'Hespeler', 'Preston', 'Kitchener', 'Waterloo', 'Guelph', 'Elora', 'Fergus', 'Breslau', 'New Hamburg'];

export const faqs = [
  {
    q: 'Do you offer emergency service?',
    a: 'Yes. For a burst pipe, a flooding basement or no water at all, call us at any hour. After-hours visits carry an emergency fee, which we tell you on the phone before we come.',
  },
  {
    q: 'What does the callout fee cover?',
    a: 'A visit from a licensed plumber to find the cause and quote the fix. The fee is credited toward the repair if you go ahead with us.',
  },
  {
    q: 'Are your prices before or after HST?',
    a: 'Every price on this page is before HST. Your written quote shows the full total including tax.',
  },
  {
    q: 'Do you pull permits?',
    a: 'Yes. Where the work needs a permit, such as moving gas or drain lines, we apply for it and arrange the inspection.',
  },
  {
    q: 'Can I book without calling?',
    a: 'Yes. Use the form on this page and we will confirm your window by text or email within one business hour.',
  },
];

export const jobs = [
  'Leak or burst pipe',
  'Blocked drain',
  'Water heater',
  'Tap, toilet or fixture',
  'Basement or sump pump',
  'Renovation quote',
  'Something else',
];
