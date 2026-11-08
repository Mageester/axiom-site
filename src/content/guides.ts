import { packages } from './pricing';

export type GuideSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type Guide = {
  slug: string;
  /** The question the guide answers, as people search for it. */
  title: string;
  metaTitle: string;
  metaDescription: string;
  lead: string;
  /** ISO date the guide was last checked against our published prices and process. */
  updated: string;
  readMinutes: number;
  sections: GuideSection[];
  faqs: Array<{ question: string; answer: string }>;
  related: Array<{ href: string; label: string }>;
};

const price = (key: string) => packages.find((pkg) => pkg.key === key)?.price ?? '';

// Guides answer the questions buyers type before they contact anyone. They use our
// published prices and process only; no market statistics we cannot stand behind.
export const guides: Guide[] = [
  {
    slug: 'small-business-website-cost-ontario',
    title: 'How much does a small business website cost in Ontario?',
    metaTitle: 'Small Business Website Cost in Ontario (2026 Guide)',
    metaDescription:
      'What a small business website costs in Ontario in 2026: real package prices in CAD, what changes the price, what you pay after launch and what to ask first.',
    lead:
      'The honest answer is a range, and most of it depends on a few decisions you control. Here are our published prices, what moves a project up or down, and the costs that continue after launch.',
    updated: '2026-11-08',
    readMinutes: 5,
    sections: [
      {
        id: 'short-answer',
        title: 'The short answer',
        paragraphs: [
          `At Axiom Web, a one-page site starts at ${price('local-launch')}, a site of up to three pages starts at ${price('local-business')} and a site of up to five pages starts at ${price('expanded')}. Online stores, customer accounts, custom booking systems and large migrations are quoted separately.`,
          'Every package includes the first year of basic hosting. After that, basic hosting starts at CAD $120 a year, and your domain renews in your name at the registrar’s own price.',
        ],
      },
      {
        id: 'what-changes-the-price',
        title: 'What changes the price',
        paragraphs: ['Five things decide most of the cost of a small business website:'],
        bullets: [
          'How many pages you need. One focused page suits a business with one main service. Several services with different customers and questions usually deserve their own pages.',
          'Whether your words and photos are ready. Light editing of your text is included. Writing everything from nothing, or arranging photography, takes more time.',
          'What the site has to connect to. Linking your existing booking platform is included. Payments, inventory, customer logins and custom forms that feed other software are custom work.',
          'Whether an old site is being replaced. Keeping useful pages and redirecting old addresses protects what already brings you enquiries, and a large site takes longer to plan.',
          'How distinctive the design should be. Every Axiom site is designed for the business, but motion, illustration and interactive pieces add design and testing time.',
        ],
      },
      {
        id: 'after-launch',
        title: 'What you pay after launch',
        paragraphs: [
          'A website has small running costs. Ask about every one of them before you sign, from any designer.',
        ],
        bullets: [
          'Hosting: included for year one with us, then from CAD $120 a year.',
          'Your domain: registered in your name and renewed at the registrar’s price.',
          'Third-party tools you choose, such as a booking app or email marketing: billed to your own account.',
          'Changes after launch: our packages include thirty days of fixes after launch. Agree in writing how later edits are handled.',
        ],
      },
      {
        id: 'what-you-should-get',
        title: 'What a fair price should include',
        paragraphs: [
          'Whoever you hire, a professional site for a local business should come with a design made for your business, a layout that works on a phone, page titles and descriptions written for search, your domain connected, testing on real devices before launch and a clear number of revision rounds.',
          'Just as important is ownership. Your domain should be registered in your name, and the words and photos you supply should remain yours.',
        ],
      },
      {
        id: 'how-payment-works',
        title: 'How payment usually works',
        paragraphs: [
          'We ask for 50% once the written scope is approved and the agreement is signed, and the other 50% after you approve the finished site on a private preview, before it goes public. You never pay the balance for something you have not seen.',
        ],
      },
      {
        id: 'questions-to-ask',
        title: 'Questions to ask before you pay anyone',
        paragraphs: ['These questions protect you no matter who builds the site:'],
        bullets: [
          'Whose name is the domain registered in?',
          'What exactly does the price include, and how many rounds of changes?',
          'What does hosting cost after the first year, and can I move the site elsewhere later?',
          'Who writes the words, and who supplies the photos?',
          'When is each payment due, and what do I see before the final one?',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is CAD $900 enough for a professional website?',
        answer:
          'For a very small business with one main service, yes. One well-designed page with up to six sections can say what you do, show real proof, answer common questions and make calling or booking easy. Businesses with several distinct services usually need more pages.',
      },
      {
        question: 'Are there monthly fees?',
        answer:
          'Not for the website itself. After the first year, basic hosting starts at CAD $120 a year and your domain renews at the registrar’s price. Any booking or marketing tools you choose are billed by those companies.',
      },
      {
        question: 'Who owns the website once it is paid for?',
        answer:
          'Your domain is registered in your name, and the content you supply stays yours. The project agreement sets out hosting and any handoff before work begins.',
      },
    ],
    related: [
      { href: '/pricing/', label: 'Compare our packages' },
      { href: '/guides/what-to-put-on-a-one-page-website/', label: 'What to put on a one-page website' },
      { href: '/start-a-project/', label: 'Start a project' },
    ],
  },
  {
    slug: 'what-to-put-on-a-one-page-website',
    title: 'What should a one-page website include?',
    metaTitle: 'What to Put on a One-Page Business Website',
    metaDescription:
      'The six sections a one-page small business website needs, who a one-page site suits, how it works with your business card, and when to add more pages.',
    lead:
      'A single page is often all a small business needs, if every section earns its place. Here is what to put on it, in order, and how to tell when you have outgrown it.',
    updated: '2026-11-08',
    readMinutes: 4,
    sections: [
      {
        id: 'who-it-suits',
        title: 'Who a one-page website suits',
        paragraphs: [
          'One page works well when you offer one main service, or a few closely related ones, and most people contact you the same way. Solo practitioners, event entertainers, personal trainers, mobile detailers, cleaners, tutors and new businesses are all good fits.',
          'It works especially well for people whose customers find them in person first. When a guest takes your card at an event or a neighbour mentions your name, the page only has to confirm you are the right choice and make contact easy.',
        ],
      },
      {
        id: 'six-sections',
        title: 'The six sections, in order',
        paragraphs: ['Most effective one-page sites follow the same order, because it matches the questions a visitor has:'],
        bullets: [
          'The first screen: your name, what you do, where you work, and one clear button, such as Call, Book or Request a quote.',
          'What you offer: the services or packages in plain words, with who each one suits. Starting prices help if you are comfortable sharing them.',
          'Proof: real photos of your work, the credentials you can document and the kinds of clients or events you serve. Never invented reviews.',
          'What to expect: how a booking, visit or first appointment works, step by step. This removes the hesitation that stops people from reaching out.',
          'About you: a short, human introduction with a real photo. People hire people.',
          'Contact: phone, email and any booking link, each one tap away on a phone, plus your service area or address and hours.',
        ],
      },
      {
        id: 'phones-and-cards',
        title: 'Design it for a phone and a business card',
        paragraphs: [
          'Most visitors will see your site on a phone, often right after meeting you. Keep the call or booking button visible, keep sections short and make sure the page loads quickly on mobile data.',
          'If you hand out cards, add a short web address and a QR code that opens the page. The card a guest takes home then leads straight back to you.',
        ],
      },
      {
        id: 'when-to-add-pages',
        title: 'When to add more pages',
        paragraphs: [
          'Add pages when one page starts to feel crowded or when different customers need different answers. A business with several distinct services, separate wedding and corporate offers, or a large gallery is usually clearer with dedicated pages. Separate pages also help when you want to be found for several services or towns.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is a one-page website bad for SEO?',
        answer:
          'No. One page can be found for your name and your main service in your area, especially with a clear title, a good description and a Google Business Profile. Dedicated pages help when you want to be found for several different services or towns.',
      },
      {
        question: 'Can a one-page website take bookings?',
        answer:
          'Yes. We can link a booking platform you already use, or add a short enquiry form. Custom booking systems with payments are quoted separately.',
      },
      {
        question: 'How much does a one-page website cost?',
        answer: `Our Local Launch Special starts at ${price('local-launch')} for one page with up to six sections, including the first year of basic hosting.`,
      },
    ],
    related: [
      { href: '/industries/events-weddings/', label: 'Websites for event and wedding vendors' },
      { href: '/guides/small-business-website-cost-ontario/', label: 'What a small business website costs' },
      { href: '/pricing/', label: 'See the Local Launch Special' },
    ],
  },
  {
    slug: 'what-to-prepare-before-hiring-a-web-designer',
    title: 'What to prepare before you hire a web designer',
    metaTitle: 'What to Prepare Before Hiring a Web Designer',
    metaDescription:
      'A practical checklist for small business owners: the words, photos, accounts and decisions to gather before a website project, so it launches faster.',
    lead:
      'Most website projects slow down waiting for the business, not the designer. Gather these things first and your project moves faster, costs less to change and launches sooner.',
    updated: '2026-11-08',
    readMinutes: 4,
    sections: [
      {
        id: 'decisions',
        title: 'Three decisions to make first',
        paragraphs: ['Before anyone designs anything, be clear on these:'],
        bullets: [
          'The one action you most want visitors to take: call, book, request a quote or visit.',
          'Who your best customers are, and the questions they ask before they hire you.',
          'Where you work: a single address, a list of towns you travel to, or both.',
        ],
      },
      {
        id: 'content',
        title: 'Words and photos',
        paragraphs: [
          'You do not need finished copy. Notes in your own words are a strong start, and light editing is part of a normal project.',
        ],
        bullets: [
          'Your services, with a sentence or two on each and starting prices if you share them.',
          'Your best real photos of your work, your space and yourself. Phone photos taken in good daylight are often fine.',
          'Your logo in the best format you have.',
          'Credentials, licences or insurance you can document.',
          'The questions customers ask you most, with your usual answers.',
        ],
      },
      {
        id: 'accounts',
        title: 'Accounts and access',
        paragraphs: ['Collect these logins, or know who holds them:'],
        bullets: [
          'Your domain registrar, if you already own a domain.',
          'Your current website and hosting, if you are replacing a site.',
          'Your booking platform, if you use one.',
          'Your Google Business Profile, so its details can match the new site.',
        ],
      },
      {
        id: 'existing-site',
        title: 'If you are replacing a website',
        paragraphs: [
          'List the pages that bring you enquiries today and keep their addresses in mind. Where an address has to change, a redirect sends visitors and search engines to the new page, so you do not lose what already works.',
        ],
      },
      {
        id: 'examples',
        title: 'Two or three examples you like',
        paragraphs: [
          'Send links to sites you like, from any industry, with a note on what you like about each one: the colours, the calm layout, the way the menu works. It is the fastest way to share taste.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Do I need to write all the text myself?',
        answer:
          'No. Rough notes in your own words are enough to start. We shape them into clear, concise copy and you approve the final wording before launch.',
      },
      {
        question: 'What if I do not have good photos yet?',
        answer:
          'We can launch with the best images you have and show you where better photos would make the biggest difference. Real photos of your own work always beat stock images.',
      },
      {
        question: 'How long does a small business website take?',
        answer:
          'Most of our projects take two to four weeks from an approved scope to launch. Having your content ready is the biggest factor in staying on that schedule.',
      },
    ],
    related: [
      { href: '/approach/', label: 'How our process works' },
      { href: '/guides/small-business-website-cost-ontario/', label: 'What a small business website costs' },
      { href: '/start-a-project/', label: 'Start a project' },
    ],
  },
];

export const getGuide = (slug: string) => guides.find((guide) => guide.slug === slug);
