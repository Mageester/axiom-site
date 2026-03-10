import type { RestaurantContent } from './types'

export const restaurantContent: RestaurantContent = {
  brand: {
    name: 'Atelier Meridian',
    city: 'Toronto',
    tagline: 'Seasonal tasting house with coastal influence',
    phone: '+1 (416) 555-0182',
    email: 'reservations@ateliermeridian.ca',
    address: '112 Harbor Lane, Toronto, ON M5V 2L6',
    hours: [
      'Tuesday to Thursday: 5:00 PM to 10:00 PM',
      'Friday to Saturday: 5:00 PM to 11:00 PM',
      'Sunday: 4:30 PM to 9:30 PM',
      'Monday: Closed',
    ],
  },
  home: {
    hero: {
      eyebrow: 'Chef-led dining in Toronto',
      title: 'A reservation-first dining experience built for modern hospitality.',
      description:
        'Atelier Meridian delivers a premium evening of precise plating, focused service, and ingredient-led menus designed around Ontario seasonality.',
      primaryCta: 'Reserve a table',
      secondaryCta: 'Explore menu',
    },
    highlights: [
      {
        title: 'Chef-led tasting cadence',
        description:
          'A rotating progression of small and full plates coordinated to your table pace.',
      },
      {
        title: 'Curated beverage pairing',
        description:
          'Low-intervention wines, signature zero-proof options, and guided pairings by course.',
      },
      {
        title: 'Private dining studio',
        description:
          'An intimate 12-seat room for celebrations, team dinners, and host-led experiences.',
      },
    ],
    experience: {
      title: 'Designed for seamless booking and confident planning',
      description:
        'The experience begins before arrival with clear reservation windows, party-size guidance, and direct contact channels.',
      points: [
        'Real-time reservation intake for dinner service',
        'Dedicated concierge response for dietary and accessibility needs',
        'Transparent pricing and cancellation guidance before booking',
      ],
    },
  },
  menu: {
    intro:
      'Our menu is updated weekly based on regional harvests and fishery availability. Sample offerings below.',
    sections: [
      {
        title: 'First Plates',
        note: 'Small-format dishes to open the evening.',
        items: [
          {
            name: 'East Coast Oysters',
            description: 'Preserved lemon mignonette, kelp oil',
            price: '24',
          },
          {
            name: 'Smoked Beet Tartare',
            description: 'Black garlic aioli, toasted rye crumble',
            price: '19',
          },
          {
            name: 'Scallop Crudo',
            description: 'Green strawberry, fennel pollen, sea herbs',
            price: '26',
          },
        ],
      },
      {
        title: 'Main Courses',
        note: 'Composed plates built around local proteins and produce.',
        items: [
          {
            name: 'Dry-Aged Duck Breast',
            description: 'Sour cherry jus, charred leek, confit potato',
            price: '46',
          },
          {
            name: 'Arctic Char',
            description: 'Brown butter emulsion, snap peas, dill ash',
            price: '42',
          },
          {
            name: 'Forest Mushroom Pithivier',
            description: 'Truffle broth, crispy shallots, herb salad',
            price: '38',
          },
        ],
      },
      {
        title: 'Dessert',
        note: 'Final courses with restrained sweetness.',
        items: [
          {
            name: 'Chocolate Tarte',
            description: 'Salted buckwheat praline, espresso cream',
            price: '16',
          },
          {
            name: 'Citrus Pavlova',
            description: 'Mandarin curd, basil meringue, candied peel',
            price: '15',
          },
          {
            name: 'Ontario Cheese Service',
            description: 'Three selections, honeycomb, seed crisps',
            price: '18',
          },
        ],
      },
    ],
  },
  about: {
    intro:
      'Atelier Meridian was established to combine meticulous cuisine with calm, human hospitality.',
    story: [
      'Our kitchen works in short seasonal cycles. Menus are tested daily and adjusted to match the quality of incoming ingredients.',
      'Service is paced to feel unhurried. We focus on host awareness, clear communication, and guest comfort over scripted formality.',
      'The room was designed around natural textures and soft acoustics, creating an atmosphere that supports conversation and occasion.',
    ],
    values: [
      {
        title: 'Ingredient transparency',
        description:
          'We source from partner farms and fisheries with direct visibility into origin and harvest timing.',
      },
      {
        title: 'Accessible premium dining',
        description:
          'Every guest receives clear options for dietary accommodations and table accessibility.',
      },
      {
        title: 'Operational consistency',
        description:
          'From booking confirmations to final course delivery, we design each touchpoint for reliability.',
      },
    ],
    team: [
      {
        name: 'Camille Hart',
        role: 'Executive Chef',
        bio: 'Camille leads menu development with a focus on coastal techniques and regional produce.',
      },
      {
        name: 'Noah Pereira',
        role: 'Restaurant Director',
        bio: 'Noah oversees front-of-house operations and guest experience delivery.',
      },
      {
        name: 'Sora Kim',
        role: 'Pastry Chef',
        bio: 'Sora creates seasonal desserts centered on texture, restraint, and balance.',
      },
    ],
  },
  reservations: {
    intro:
      'Reservations open 30 days in advance. For parties above eight guests, contact our concierge directly.',
    policies: [
      'A valid card is required to hold dinner reservations.',
      'Cancellations made within 24 hours may be subject to a per-seat fee.',
      'Please notify us of allergies or dietary requests at least 48 hours before arrival.',
    ],
    channels: [
      {
        label: 'Book online',
        value: 'Open reservation portal',
        href: 'https://www.opentable.com/',
      },
      {
        label: 'Call reservations',
        value: '+1 (416) 555-0182',
        href: 'tel:+14165550182',
      },
      {
        label: 'Email concierge',
        value: 'reservations@ateliermeridian.ca',
        href: 'mailto:reservations@ateliermeridian.ca',
      },
    ],
  },
}
