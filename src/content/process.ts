import type { IconName } from '../lib/icons';

export type ProcessStep = {
  number: string;
  timing: string;
  title: string;
  icon: IconName;
  summary: string;
  details: string[];
  you: string;
};

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    timing: 'Week 1',
    title: 'Review',
    icon: 'compass',
    summary: 'We look at your business, your current site and how customers find and choose you, then agree what the new site has to do.',
    details: [
      'A conversation about your services, customers and goals',
      'A review of your current site, if you have one',
      'A recommended package and next step',
    ],
    you: 'Share your current site, your main services and what you want visitors to do.',
  },
  {
    number: '02',
    timing: 'Week 2',
    title: 'Scope',
    icon: 'clipboard',
    summary: 'We confirm the pages, contact paths, content and price in writing before design starts. Decisions happen here, not mid-build.',
    details: [
      'A written scope with a fixed project price',
      'Page list and the main action for each page',
      'A simple checklist of the content we need from you',
    ],
    you: 'Approve the scope, sign the agreement and pay the 50% deposit.',
  },
  {
    number: '03',
    timing: 'Weeks 2–3',
    title: 'Design & build',
    icon: 'pen',
    summary: 'We design and build the full site from your material, edit the copy for clarity and share a private staging link for review.',
    details: [
      'Custom design and development for every agreed page',
      'Mobile layout, speed and accessibility built in from the start',
      'Two consolidated revision rounds on the staging site',
    ],
    you: 'Send logo, photos and text, then gather feedback into each revision round.',
  },
  {
    number: '04',
    timing: 'Weeks 3–4',
    title: 'Launch & support',
    icon: 'rocket',
    summary: 'We test on real devices, connect your domain, set up the SEO basics and go live — then stay on hand for thirty days.',
    details: [
      'Launch testing of pages, forms and links across devices',
      'Domain connection and first-year basic hosting',
      'Thirty days of post-launch defect support',
    ],
    you: 'Approve the staging site and pay the remaining 50% before launch.',
  },
];

export const standards = [
  {
    icon: 'message',
    title: 'Written in your customers’ language',
    text: 'Pages explain what you do and why it matters in plain words, not industry jargon or technical detail.',
  },
  {
    icon: 'shield',
    title: 'Honest proof only',
    text: 'Reviews, results and credentials appear only when they are real and you can stand behind them. Concepts are labelled as concepts.',
  },
  {
    icon: 'smartphone',
    title: 'Phone first, always',
    text: 'Layouts, tap targets, forms and image crops are judged on a phone first, because that is where most local decisions happen.',
  },
  {
    icon: 'target',
    title: 'One clear next step',
    text: 'Every page leads to a single, obvious action, whether that is a call, a booking or a quote request.',
  },
] as const satisfies ReadonlyArray<{ icon: IconName; title: string; text: string }>;

export const approachFaq = [
  {
    question: 'What counts as a revision round?',
    answer:
      'A revision round is one consolidated set of feedback on the staging site, gathered from everyone who needs to approve it. Every standard package includes two rounds. Changes beyond the agreed scope can be quoted separately.',
  },
  {
    question: 'What if my content isn’t ready yet?',
    answer:
      'Timelines start once the essentials are ready. We send a simple content checklist during scoping and can shape rough notes into page copy. If a project stalls for more than ten business days waiting on content or feedback, our Terms of Service explain how we proceed.',
  },
  {
    question: 'Do we need to meet in person?',
    answer:
      'No. Projects run by phone, video call and email, which also makes it easy to work with businesses outside Kitchener-Waterloo.',
  },
  {
    question: 'What happens after launch?',
    answer:
      'Standard packages include thirty days of post-launch defect support. After that, basic hosting continues from CAD $120 per year, and further changes or new pages can be quoted whenever you need them.',
  },
] as const;
