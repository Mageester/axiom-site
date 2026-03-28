import type { RestaurantContent } from './types'

export const restaurantContent: RestaurantContent = {
  brand: {
    name: 'Atelier Meridian',
    city: 'Toronto',
    tagline: 'Seasonal dining by Toronto harbour',
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
      title: 'An evening by the water, reserved with intention.',
      description:
        'A quiet dining room shaped by seasonal cooking, attentive hosting, and a menu edited for a clean finish.',
      primaryCta: 'Reserve a table',
      secondaryCta: 'Explore the menu',
    },
    highlights: [
      {
        title: 'Seasonal tasting cadence',
        description: 'A paced progression of plates built around the rhythm of the evening.',
      },
      {
        title: 'Curated beverage pairings',
        description: 'Low-intervention wines and zero-proof pairings selected to support the menu.',
      },
      {
        title: 'Private dining studio',
        description: 'An intimate room for celebrations, hosted dinners, and small business tables.',
      },
    ],
    experience: {
      title: 'Designed for calm arrival and confident booking',
      description:
        'Clear reservation windows, party-size guidance, and direct contact channels help the evening begin without friction.',
      points: [
        'Reservations open 30 days ahead',
        'Private dining for up to 12 guests',
        'Dietary and accessibility requests welcomed in advance',
      ],
    },
  },
  menu: {
    intro:
      'The menu changes with the season. The examples below reflect the room\'s tone rather than a fixed list.',
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
      'Atelier Meridian was created to bring meticulous cuisine and calm hospitality into the same room.',
    story: [
      'Our kitchen works in short seasonal cycles. Menus are tested daily and adjusted to match the quality of incoming ingredients.',
      'Service is paced to feel unhurried, with clear communication and a calm front-of-house rhythm.',
      'The room pairs natural textures with soft acoustics so conversation stays at the center of the evening.',
    ],
    values: [
      {
        title: 'Ingredient restraint',
        description: 'We source from farms and fisheries with direct visibility into origin and harvest timing.',
      },
      {
        title: 'Accessible premium dining',
        description: 'Guests receive clear options for dietary accommodations and table accessibility.',
      },
      {
        title: 'Operational consistency',
        description: 'From booking confirmations to final course delivery, each touchpoint is designed for reliability.',
      },
    ],
    team: [
      {
        name: 'Camille Hart',
        role: 'Executive Chef',
        bio: 'Camille leads menu development with a focus on restraint, balance, and coastal technique.',
      },
      {
        name: 'Noah Pereira',
        role: 'Restaurant Director',
        bio: 'Noah oversees front-of-house rhythm and guest experience delivery.',
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
      'Reservations open 30 days in advance. For hosted tables and private dining, contact our concierge directly.',
    policies: [
      'A card is required to hold dinner reservations.',
      'Cancellations within 24 hours may incur a per-seat fee.',
      'Please share allergies or dietary requests at least 48 hours before arrival.',
    ],
    channels: [
      {
        label: 'Reserve online',
        value: 'Open reservation portal',
        href: 'https://www.opentable.com/',
      },
      {
        label: 'Call concierge',
        value: '+1 (416) 555-0182',
        href: 'tel:+14165550182',
      },
      {
        label: 'Email reservations',
        value: 'reservations@ateliermeridian.ca',
        href: 'mailto:reservations@ateliermeridian.ca',
      },
    ],
  },
}
