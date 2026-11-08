/** Fernhill's copy, kept out of the page markup so it is easy to read and change. */

export type Chapter = {
  id: string;
  season: string;
  when: string;
  title: string;
  body: string;
  included: string[];
  try?: string;
  cta: string;
  service: string;
};

export const chapters: Chapter[] = [
  {
    id: 'summer',
    season: 'Summer',
    when: 'May to October',
    title: 'Cut every week, by the same crew.',
    body: 'Your lawn is cut on the same day each week, at the right height for the weather. We trim every edge, then blow the clippings off the driveway, walks and patio before we leave.',
    included: ['Mowing, trimming and edging', 'Clippings mulched back in, or bagged if you prefer', 'A text the evening before, and when we’re done'],
    cta: 'Price weekly lawn care',
    service: 'lawn',
  },
  {
    id: 'autumn',
    season: 'Autumn',
    when: 'September to November',
    title: 'Leaves off before the snow comes.',
    body: 'Leaves left on a lawn all winter smother it, and the damage shows in April. We clear the lawn and beds, aerate and overseed thin patches, and set the last cut low so the grass goes into winter healthy.',
    included: ['Leaf removal from lawns and garden beds', 'Core aeration and overseeding', 'Everything hauled away, nothing left at the curb'],
    cta: 'Book a fall cleanup',
    service: 'cleanup',
  },
  {
    id: 'winter',
    season: 'Winter',
    when: 'November 15 to April 15',
    title: 'Out before you are.',
    body: 'Driveways and front walks are cleared once the snow reaches 5 cm, and before 7 a.m. on weekdays so you can get to work. We come back for the ridge the city plow leaves at the end of the drive.',
    included: ['Driveway, front walk and steps', 'Salt, or pet-friendlier ice melt on request', 'One price for the whole season'],
    try: 'Drag across the snow to clear a path.',
    cta: 'Reserve a spot on the route',
    service: 'snow',
  },
  {
    id: 'spring',
    season: 'Spring',
    when: 'April to June',
    title: 'Then it’s April again.',
    body: 'We rake out what winter left, edge and mulch the beds, and relevel interlock that heaved in the frost. Spring is when new gardens go in and patios get built, so we draw the plans over the winter.',
    included: ['Spring cleanup and the first cut', 'Garden design and planting', 'Interlock and natural-stone patios, walks and walls'],
    cta: 'Plan a garden or patio',
    service: 'garden',
  },
];

export type Service = { id: string; title: string; when: string; body: string; included: string[] };

export const services: Service[] = [
  {
    id: 'lawn',
    title: 'Weekly lawn care',
    when: 'May to October',
    body: 'Mowing, trimming and edging on the same day every week. We set the height for the weather, so the lawn is never scalped in a July dry spell.',
    included: [
      'Mowing, with clippings mulched back in or bagged',
      'Trimming around beds, fences, trees and the shed',
      'Clean edges along walks and the driveway',
      'Clippings blown off every hard surface',
      'A text the evening before and when we finish',
    ],
  },
  {
    id: 'garden',
    title: 'Garden design and planting',
    when: 'Spring and early fall',
    body: 'A planting plan drawn for your yard, its light and its soil, then planted by the people who drew it. Native and low-water plants wherever they suit.',
    included: [
      'A design visit and a drawn plan with a plant list',
      'Bed preparation, new soil and mulch',
      'Planting, and a watering schedule you can keep',
      'A check-in visit a few weeks later',
    ],
  },
  {
    id: 'stone',
    title: 'Interlock and natural stone',
    when: 'Mid-April to mid-November',
    body: 'Patios, front walks, steps and low garden walls in interlocking pavers or natural stone, built on a proper base so they stay level through the freeze and thaw.',
    included: [
      'A drawing and an itemized, written quote',
      'Excavation and a compacted gravel base',
      'Pavers or stone, with polymeric sand in the joints',
      'Lifting and relevelling interlock that has sunk or heaved',
    ],
  },
  {
    id: 'cleanup',
    title: 'Spring and fall cleanups',
    when: 'April, and October to November',
    body: 'One visit in spring to clear what winter left behind, and one or two in fall to get the leaves off before the snow.',
    included: [
      'Leaves and debris cleared from the lawn and beds',
      'Perennials cut back and beds edged',
      'The last cut of the year, set a little lower',
      'Everything hauled away for composting',
    ],
  },
  {
    id: 'snow',
    title: 'Snow clearing',
    when: 'November 15 to April 15',
    body: 'Residential driveways and front walks, cleared after every snowfall of 5 cm or more, on a seasonal contract with one price for the winter.',
    included: [
      'Driveway, front walk and steps',
      'Done before 7 a.m. on weekdays after overnight snow',
      'The ridge the city plow leaves at the end of the drive',
      'Salt, or pet-friendlier ice melt on request',
    ],
  },
];

export const months = [
  { name: 'January', season: 'Winter', work: ['Snow clearing after every 5 cm', 'Garden design visits for spring', 'Patio and walkway quotes for the year'] },
  { name: 'February', season: 'Winter', work: ['Snow clearing', 'Planting plans drawn and priced', 'Spring cleanup bookings open'] },
  { name: 'March', season: 'Late winter', work: ['Snow clearing as the season winds down', 'Yard walk-throughs as the snow goes', 'Stone work scheduled for spring'] },
  { name: 'April', season: 'Spring', work: ['Spring cleanups', 'The first cut of the year', 'Interlock that heaved in the frost, relevelled', 'Snow season ends April 15'] },
  { name: 'May', season: 'Spring', work: ['Weekly lawn care begins', 'New gardens planted', 'Beds edged and mulched'] },
  { name: 'June', season: 'Summer', work: ['Weekly lawn care', 'Patios and walkways built', 'Planting continues'] },
  { name: 'July', season: 'Summer', work: ['Weekly lawn care, cut higher in the heat', 'Watering advice for new plantings', 'Garden walls and steps'] },
  { name: 'August', season: 'Summer', work: ['Weekly lawn care', 'Patios and walls', 'Aeration and overseeding booked'] },
  { name: 'September', season: 'Early fall', work: ['Core aeration and overseeding', 'Trees, shrubs and bulbs planted', 'Weekly lawn care'] },
  { name: 'October', season: 'Fall', work: ['Fall cleanups and leaf removal', 'The last weekly cuts', 'Snow contracts signed for winter'] },
  { name: 'November', season: 'Late fall', work: ['Final leaf pickup', 'The last cut, set low', 'Driveway markers go in', 'Snow season starts November 15'] },
  { name: 'December', season: 'Winter', work: ['Snow clearing', 'Design visits for next spring'] },
];

/** Bars on a 24-column grid, two columns per month, as [first line, last line, kind]. */
export const timeline: Array<{ name: string; when: string; bars: Array<[number, number, string?]> }> = [
  { name: 'Weekly lawn care', when: 'May to October', bars: [[9, 21]] },
  {
    name: 'Garden design and planting',
    when: 'Planting mid-April to June and in early fall; planning over the winter',
    bars: [[1, 7, 'plan'], [8, 13], [17, 20], [23, 25, 'plan']],
  },
  { name: 'Interlock and stone', when: 'Mid-April to mid-November', bars: [[8, 22]] },
  { name: 'Spring and fall cleanups', when: 'April to mid-May, and October to November', bars: [[7, 10], [19, 23]] },
  { name: 'Snow clearing', when: 'November 15 to April 15', bars: [[1, 8], [22, 25]] },
];

export const steps = [
  { title: 'Tell us about the yard', body: 'Send the form or call. We reply within one business day to set a time to come by.' },
  { title: 'We walk it with you', body: 'About twenty minutes: the lawn, the beds, any stone, and where the snow will go. Can’t be there? We’ll walk it alone and call you after.' },
  { title: 'You get a written price', body: 'Within two business days, itemized by service, with the day of the week we would come.' },
  { title: 'The same crew from then on', body: 'No contract for lawn care; stop with a week’s notice. Snow clearing is booked by the season.' },
];

export const faqs: Array<[string, string]> = [
  [
    'Do I need to be home when you come?',
    'No, and most people aren’t. Leave the side gate unlocked or give us the code, and we’ll text you when we’re done. For the first walk-through we like to meet you, but we can walk the yard on our own if that’s easier.',
  ],
  [
    'What about my dog?',
    'Tell us about pets when you book. We close every gate behind us and walk the yard before we start a mower. If a dog is out in the yard, we knock or text and wait. We never open a gate on a loose dog.',
  ],
  [
    'Do I have to sign a contract for snow clearing?',
    'Yes, for the season, November 15 to April 15. That’s how we can promise you a place on the route before 7 a.m. You pay one price for the winter, split into monthly payments, however much it snows.',
  ],
  [
    'Is there a contract for lawn care?',
    'No. Weekly lawn care runs month to month. Give us a week’s notice to stop or pause it.',
  ],
  [
    'What happens when it rains on my day?',
    'We cut on the next dry day, usually within one day, and text you the new time. Cutting wet grass tears it and ruts the lawn.',
  ],
  [
    'Do you spray weeds?',
    'Ontario bans most cosmetic pesticides, so no. We keep weeds down the way that lasts: thick grass, overseeding in the fall, and hand-pulling in the beds.',
  ],
  [
    'Will ice melt hurt my interlock or my dog’s paws?',
    'Rock salt can do both. Ask for a pet-friendlier ice melt and we use it on your walk and steps. It costs a little more, and the quote says exactly how much.',
  ],
];
