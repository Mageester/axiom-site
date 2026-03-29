import type { RestaurantContent } from './types'

export const restaurantContent: RestaurantContent = {
  brand: {
    name: 'Atelier Meridian',
    city: 'Toronto',
    tagline: "Seasonal dining on Toronto's waterfront",
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
      title: 'A waterfront dining room, reserved with intention.',
      description:
        'Seasonal plates, composed service, and a room paced for long dinners, private tables, and calm conversation.',
      primaryCta: 'Reserve a table',
      secondaryCta: 'View the menu',
    },
    highlights: [
      {
        title: 'Seasonal tasting cadence',
        description: "A composed progression of dishes built around the day's produce.",
      },
      {
        title: 'Curated beverage pairings',
        description: 'Low-intervention wines and zero-proof pairings that support the menu.',
      },
      {
        title: 'Private dining studio',
        description: 'An intimate room for celebrations, hosted dinners, and discreet business tables.',
      },
    ],
    experience: {
      title: 'A dining room calibrated for long, deliberate dinners.',
      description:
        'Clear reservation windows, direct concierge contact, and party-size guidance keep the evening calm from the start.',
      points: [
        'Reservations open 30 days ahead',
        'Private dining for up to 12 guests',
        'Dietary and accessibility requests welcomed in advance',
      ],
    },
  },
  menu: {
    intro:
      "The menu changes with the season. The selections below show the room's balance: restraint, texture, and a clean finish.",
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
      'Atelier Meridian pairs careful cuisine with a service style that stays calm and exacting from booking to final course.',
    story: [
      'The kitchen works in short seasonal cycles, testing dishes daily and editing the menu around the best ingredients available.',
      'Service is paced to feel unhurried without losing precision, so the table can settle into the evening quickly.',
      'The room uses natural textures and soft acoustics to keep attention where it belongs: on the food and the company.',
    ],
    values: [
      {
        title: 'Ingredient restraint',
        description: 'We source from farms and fisheries with visible origin and harvest timing.',
      },
      {
        title: 'Accessible premium dining',
        description: 'Clear accommodations for dietary needs, mobility, and seating preferences.',
      },
      {
        title: 'Operational consistency',
        description: 'From confirmation to final course, each touchpoint is designed to feel calm and reliable.',
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
        bio: 'Noah oversees front-of-house rhythm and reservation flow.',
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
      'Direct requests begin with the form below. Hosted tables and private dining stay with concierge.',
    policies: [
      'A card is required to hold dinner reservations.',
      'Cancellations within 24 hours may incur a per-seat fee.',
      'Please share allergies or accessibility needs at least 48 hours before arrival.',
    ],
    channels: [
      {
        label: 'Call concierge',
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
