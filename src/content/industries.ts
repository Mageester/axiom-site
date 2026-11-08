import type { IconName } from '../lib/icons';
import type { IndustrySlug } from './work';

export type Industry = {
  slug: IndustrySlug;
  icon: IconName;
  name: string;
  examples: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  needs: Array<{ title: string; text: string }>;
  pages: string[];
  workIds: string[];
  packageNote: string;
  faqs: Array<{ question: string; answer: string }>;
};

// Guidance describes what buyers in each sector look for; it does not claim client history.
export const industries: Industry[] = [
  {
    slug: 'home-services',
    icon: 'wrench',
    name: 'Contractors & home services',
    examples: 'Trades, roofing, landscaping, HVAC, cleaning, snow removal',
    title: 'Websites for contractors and home service businesses.',
    metaTitle: 'Contractor, Roofing & Landscaping Website Design | Axiom Web',
    metaDescription:
      'Websites for trades, roofers, landscapers and home service companies in Ontario. Clear service areas, quick quote requests and click-to-call on every screen.',
    intro:
      'Homeowners usually compare a few companies on their phone before calling one. Your site needs to show what you do, where you work and the quality of your work, then make calling or requesting a quote effortless.',
    needs: [
      {
        title: 'Service area, stated plainly',
        text: 'List the towns and neighbourhoods you actually cover, so nobody has to call just to find out.',
      },
      {
        title: 'Urgent and planned work, separated',
        text: 'An emergency repair and a spring project are different decisions. Give each its own path: a call button for urgent work and a quote form for planned work.',
      },
      {
        title: 'Proof of workmanship',
        text: 'Real project photos, licences, insurance and warranties you can verify belong next to the quote button, not on a page nobody opens.',
      },
      {
        title: 'A quote form that respects their time',
        text: 'Ask for the job type, location and timing first. Measurements and photos can follow once the conversation has started.',
      },
    ],
    pages: [
      'Home with services, service area and call and quote actions',
      'Services, with a section or page for each main service',
      'Project gallery with genuine photos of your work',
      'About, with licences, insurance and experience',
      'Contact and quote request',
    ],
    workIds: ['reids-home-and-yard', 'kelvin', 'fernhill'],
    packageNote:
      'Most trades fit the Local Business Website (from CAD $1,200). Companies with several distinct services or a large project gallery usually choose the Expanded Website (from CAD $1,500).',
    faqs: [
      {
        question: 'Should a contractor have a separate page for each service?',
        answer:
          'When each service has different questions, pricing or customers, a focused page helps both visitors and search engines. When the services are closely related, one well-organised Services page is usually clearer.',
      },
      {
        question: 'Can customers send photos with a quote request?',
        answer:
          'We scope the quote form around the details you need to respond. File uploads and connections to estimating or scheduling software are reviewed as additional requirements and may be quoted as Custom.',
      },
    ],
  },
  {
    slug: 'health-clinics',
    icon: 'heart',
    name: 'Clinics & health practices',
    examples: 'Dental, chiropractic, physiotherapy, osteopathy, massage, wellness',
    title: 'Websites for dental, chiropractic and physiotherapy clinics.',
    metaTitle: 'Dental, Chiropractic & Physio Website Design | Axiom Web',
    metaDescription:
      'Websites for dental offices, chiropractors, physiotherapists, osteopaths and massage therapists in Ontario. Plain-language services, credentials and easy booking.',
    intro:
      'New patients want to know they have found the right practice before they book. Your site should explain your services in plain language, introduce the practitioners and make booking or contacting the clinic simple.',
    needs: [
      {
        title: 'Services in patient language',
        text: 'Describe what each treatment helps with and what to expect at a first visit, without clinical jargon.',
      },
      {
        title: 'Practitioners and credentials',
        text: 'Introduce the team with qualifications and registrations you can substantiate. People book with people.',
      },
      {
        title: 'Booking that works on a phone',
        text: 'Link straight to your existing booking platform, with the button visible on every page.',
      },
      {
        title: 'Practical details up front',
        text: 'Hours, location, parking, accessibility and direct billing answer the questions that stop people from booking.',
      },
    ],
    pages: [
      'Home with services, booking and new-patient information',
      'Services or treatments',
      'Team and practitioner profiles',
      'New patients: what to expect, billing and forms',
      'Contact, hours and location',
    ],
    workIds: ['atlas-axis'],
    packageNote:
      'A single-practitioner clinic often fits the Local Business Website (from CAD $1,200). Multi-practitioner clinics with several services usually need the Expanded Website (from CAD $1,500).',
    faqs: [
      {
        question: 'Can a clinic website include patient testimonials?',
        answer:
          'Many Ontario regulatory colleges restrict testimonials and certain claims in advertising. We build within the standards that apply to your profession, and you confirm the final wording before launch.',
      },
      {
        question: 'Can you connect our existing booking system?',
        answer:
          'Yes. We link to your existing online booking platform, ideally straight to the right service where the platform allows it. The booking account and its fees remain yours. Custom scheduling software is quoted separately.',
      },
      {
        question: 'Do you build websites for solo practitioners like osteopaths and massage therapists?',
        answer:
          'Yes. A solo practice often fits the Local Launch Special or the Local Business Website. We write within the advertising standards that apply to your profession, and you approve every claim before launch.',
      },
    ],
  },
  {
    slug: 'salons-personal-care',
    icon: 'scissors',
    name: 'Salons, spas & barbers',
    examples: 'Hair and nail salons, spas, barbershops, aesthetics',
    title: 'Websites for salons, spas and barbershops.',
    metaTitle: 'Website Design for Salons, Spas & Barbers | Axiom Web',
    metaDescription:
      'Websites for salons, nail studios, spas and barbershops. Show your style, list services and prices clearly and keep online booking one tap away.',
    intro:
      'Clients choose a salon on style and convenience. Your site should show your work at its best, make services and prices easy to compare and keep booking one tap away.',
    needs: [
      {
        title: 'Your work, shown well',
        text: 'Strong photography of your space and your results sets expectations before anyone walks in.',
      },
      {
        title: 'Services and prices that scan easily',
        text: 'A clear menu with durations and starting prices answers the first question most clients have.',
      },
      {
        title: 'Booking always in reach',
        text: 'Connect your existing booking platform and keep the button visible on every screen.',
      },
      {
        title: 'Location and hours at a glance',
        text: 'Address, parking and opening hours should never be more than a scroll away.',
      },
    ],
    pages: [
      'Home with booking, style and location',
      'Services and prices',
      'Gallery or lookbook',
      'About the studio and team',
      'Contact, hours and directions',
    ],
    workIds: ['vernis'],
    packageNote:
      'A single-location salon or barbershop often fits the Local Launch Special (from CAD $900) or the Local Business Website (from CAD $1,200).',
    faqs: [
      {
        question: 'Can you connect Booksy, Fresha or another booking app?',
        answer:
          'Yes. We connect your existing booking platform where applicable, so clients can book straight from your site. The booking account and its fees remain yours.',
      },
      {
        question: 'Do I need professional photos?',
        answer:
          'Good photos make a real difference for salons. If you do not have them yet, we can launch with the best images you have and show you where better photos would have the most impact.',
      },
    ],
  },
  {
    slug: 'restaurants-hospitality',
    icon: 'utensils',
    name: 'Restaurants & cafés',
    examples: 'Restaurants, cafés, bakeries, bars, catering',
    title: 'Websites for restaurants, cafés and hospitality.',
    metaTitle: 'Restaurant & Café Website Design | Axiom Web',
    metaDescription:
      'Restaurant and café websites with menus that load fast, clear hours and location, and reservations or ordering one tap away. Designed in Kitchener-Waterloo.',
    intro:
      'Guests decide where to eat in seconds, usually on a phone. Your site should show the food and atmosphere, load the menu instantly and make reserving, ordering or finding you effortless.',
    needs: [
      {
        title: 'A menu that loads instantly',
        text: 'A fast, readable web menu beats a PDF that has to download and be zoomed on a phone.',
      },
      {
        title: 'Hours and location that are always right',
        text: 'Opening hours, holiday changes, address and parking are what most visitors check first.',
      },
      {
        title: 'Reservations and ordering in one tap',
        text: 'Link your existing reservation or ordering platform from the top of every page.',
      },
      {
        title: 'Atmosphere on the first screen',
        text: 'Photography of the room and the food tells guests what kind of visit to expect.',
      },
    ],
    pages: [
      'Home with hours, location and a reservation action',
      'Menu',
      'About and story',
      'Private events or catering, if offered',
      'Contact and directions',
    ],
    workIds: ['cinder-salt'],
    packageNote:
      'Most restaurants fit the Local Business Website (from CAD $1,200). Online ordering systems, gift cards or e-commerce are quoted as Custom.',
    faqs: [
      {
        question: 'Will our menu be a PDF?',
        answer:
          'No. We build the menu as real web content, so it loads quickly, reads well on phones and can be found by search engines. During scoping we agree how menu changes will be handled after launch.',
      },
      {
        question: 'Can guests reserve or order online?',
        answer:
          'Yes, through your existing reservation or ordering platform, linked from every page. A custom ordering or payment system is quoted as Custom.',
      },
    ],
  },
  {
    slug: 'professional-services',
    icon: 'briefcase',
    name: 'Law & professional services',
    examples: 'Law firms, accountants, consultants, advisers',
    title: 'Websites for law firms and professional service firms.',
    metaTitle: 'Law Firm & Accountant Website Design | Axiom Web',
    metaDescription:
      'Websites for law firms, accountants and consultants. Clear practice areas, credible profiles and a simple path to a consultation, without the dense copy.',
    intro:
      'Clients choosing a lawyer, accountant or adviser are looking for competence and clarity. Your site should explain what you handle, who you help and how to start, without asking them to read a wall of text.',
    needs: [
      {
        title: 'Practice areas in plain language',
        text: 'Explain each area in terms of the client’s situation, not internal categories.',
      },
      {
        title: 'Credible people',
        text: 'Professional profiles with qualifications and experience you can substantiate.',
      },
      {
        title: 'A clear first step',
        text: 'Make the consultation process, fee approach and what to prepare easy to find.',
      },
      {
        title: 'Confidence without clutter',
        text: 'Short paragraphs, clear headings and calm design communicate competence better than dense copy.',
      },
    ],
    pages: [
      'Home with practice areas and a consultation action',
      'Practice area or service pages',
      'Team profiles',
      'About the firm',
      'Contact and consultation request',
    ],
    workIds: ['aldous-wren'],
    packageNote:
      'Small firms usually fit the Local Business Website or the Expanded Website. Firms with many practice areas or client portals are scoped as Custom.',
    faqs: [
      {
        question: 'Do you follow professional marketing rules?',
        answer:
          'Yes. We build within the advertising rules that apply to your profession, and you confirm all claims and wording before launch. We do not invent results, awards or testimonials.',
      },
      {
        question: 'Should each practice area have its own page?',
        answer:
          'When practice areas serve different clients with different questions, separate pages help visitors and search engines. Closely related areas can share one page with clear sections.',
      },
    ],
  },
  {
    slug: 'fitness-wellness',
    icon: 'zap',
    name: 'Fitness studios & wellness',
    examples: 'Yoga and pilates studios, gyms, personal trainers, martial arts, holistic practitioners',
    title: 'Websites for yoga studios, gyms and wellness practitioners.',
    metaTitle: 'Yoga Studio, Gym & Fitness Website Design | Axiom Web',
    metaDescription:
      'Websites for yoga and pilates studios, gyms and personal trainers in Ontario. A timetable that works on a phone, clear pricing and an easy first class.',
    intro:
      'Someone new is nervous about their first class. Your site has to show what the space feels like, which class suits a beginner, what it costs and exactly what happens when they walk in.',
    needs: [
      {
        title: 'A timetable people can read on a phone',
        text: 'Filter by day and level, with the teacher, length and intensity on every class, and a link straight to your booking platform.',
      },
      {
        title: 'A first visit with no surprises',
        text: 'What to wear, what to bring, when to arrive and what to tell the instructor. This is the page that turns a curious visitor into a booking.',
      },
      {
        title: 'Pricing in plain sight',
        text: 'Drop-ins, class passes, memberships and any intro offer, laid out so nobody has to email to ask.',
      },
      {
        title: 'The feeling of the room',
        text: 'Light, pace and atmosphere matter in this business. The design should carry the mood of your space before anyone has visited.',
      },
    ],
    pages: [
      'Home with upcoming classes, the intro offer and booking',
      'Class types, with who each one suits',
      'Timetable',
      'Pricing and memberships',
      'Your first visit, the space and contact',
    ],
    workIds: ['tidewater'],
    packageNote:
      'A solo instructor or personal trainer often fits the Local Launch Special (from CAD $900). Studios with a timetable, several class types and memberships usually choose the Local Business Website (from CAD $1,200) or the Expanded Website (from CAD $1,500).',
    faqs: [
      {
        question: 'Can you connect Mindbody, Momence or the booking app we already use?',
        answer:
          'Yes. We link your existing booking platform, ideally straight to the right class or pass where the platform allows it. Your booking account and its fees remain yours. Custom scheduling software is quoted separately.',
      },
      {
        question: 'Can the timetable stay up to date without a developer?',
        answer:
          'If your booking platform offers an embeddable schedule, we can place it on the site so it updates itself. Otherwise we build a simple timetable section that is quick to change.',
      },
    ],
  },
  {
    slug: 'automotive',
    icon: 'gauge',
    name: 'Auto detailing & repair',
    examples: 'Detailers, mechanics, tire shops, body shops, window tinting',
    title: 'Websites for auto detailers, mechanics and repair shops.',
    metaTitle: 'Auto Detailing & Repair Shop Website Design | Axiom Web',
    metaDescription:
      'Websites for auto detailers, mechanics, tire and body shops in Ontario. Packages and prices by vehicle, clear hours and booking requests that suit a busy bay.',
    intro:
      'Drivers want three answers fast: what you do for their kind of vehicle, roughly what it costs and when they can get in. Your site should give all three on a phone, in under a minute.',
    needs: [
      {
        title: 'Packages by vehicle type',
        text: 'A coupe and a pickup are different jobs. Show what each package includes and how pricing changes with size, so every quote starts from the right place.',
      },
      {
        title: 'Booking that suits the bay',
        text: 'Ask for the vehicle, the service and preferred days. Keep it short, and keep the phone number one tap away for anyone who would rather call.',
      },
      {
        title: 'Your work, up close',
        text: 'Before-and-after photos of real vehicles you worked on do more than any slogan. Paint, interiors and wheels deserve to be shown big and sharp.',
      },
      {
        title: 'Drop-off and pickup, explained',
        text: 'Where to park, when to leave the keys and how pickup works answer the questions that otherwise fill your voicemail.',
      },
    ],
    pages: [
      'Home with services, starting prices and booking',
      'Packages and prices by vehicle',
      'Gallery of real work',
      'How drop-off and pickup work',
      'Contact, hours and directions',
    ],
    workIds: ['mirrorline'],
    packageNote:
      'A single-bay detailer often fits the Local Launch Special (from CAD $900). Shops with several services and a pricing table usually choose the Local Business Website (from CAD $1,200).',
    faqs: [
      {
        question: 'Can customers book a specific time online?',
        answer:
          'We can connect a booking platform you already use, or build a short booking request that you confirm by phone or email. Online scheduling with deposits is reviewed as an additional requirement and may be quoted as Custom.',
      },
      {
        question: 'Should our prices be on the website?',
        answer:
          'For detailing and routine service, starting prices by vehicle size save you calls from people who were never going to book. For repairs that depend on a diagnosis, a clear explanation of how you quote works better than a number.',
      },
    ],
  },
  {
    slug: 'shops-makers',
    icon: 'store',
    name: 'Shops, jewellers & makers',
    examples: 'Jewellers, boutiques, galleries, custom studios and makers',
    title: 'Websites for independent shops, jewellers and makers.',
    metaTitle: 'Website Design for Jewellers, Boutiques & Makers | Axiom Web',
    metaDescription:
      'Websites for jewellers, boutiques, galleries and makers in Ontario. Show the craft, explain custom work step by step and make visits and appointments easy.',
    intro:
      'People buy from an independent shop because of the craft and the person behind it. Your site should show the work beautifully, explain how custom orders happen and make a visit or an appointment feel easy.',
    needs: [
      {
        title: 'The work, presented like it matters',
        text: 'Large, carefully lit images with room to breathe. Craft deserves better than a cramped product grid.',
      },
      {
        title: 'Custom work, step by step',
        text: 'Consultation, design, making and pickup, with honest timelines. Clear steps make a large purchase feel safe to start.',
      },
      {
        title: 'Appointments and visits made simple',
        text: 'Hours, parking and an appointment request that asks only for what you need to prepare.',
      },
      {
        title: 'Repairs and services listed plainly',
        text: 'Resizing, repairs, cleaning and alterations bring people through the door. Say what you do and roughly how long it takes.',
      },
    ],
    pages: [
      'Home with the work, the story and how to visit',
      'Custom work and how it happens',
      'Collections or gallery',
      'Repairs and services',
      'Visit, hours and appointments',
    ],
    workIds: ['orrin-vale'],
    packageNote:
      'A single shop or studio often fits the Local Business Website (from CAD $1,200). Selling online with a full catalogue, cart and checkout is scoped as Custom.',
    faqs: [
      {
        question: 'Can I sell online from the site?',
        answer:
          'A few featured pieces can link to a checkout you already use. A full online store with inventory, shipping and taxes is scoped and quoted as Custom.',
      },
      {
        question: 'Do I need professional product photos?',
        answer:
          'Good images matter more for shops than for almost any other business. If you do not have them yet, we can launch with your best images and show you where better photography would have the most impact.',
      },
    ],
  },
  {
    slug: 'events-weddings',
    icon: 'calendar',
    name: 'Event & wedding vendors',
    examples: 'Florists, photographers, DJs, planners, event entertainers',
    title: 'Websites for florists, photographers and event vendors.',
    metaTitle: 'Florist, Photographer & Event Vendor Website Design | Axiom Web',
    metaDescription:
      'Websites for florists, photographers, DJs, planners and event entertainers in Ontario. A portfolio that sells the feeling and an enquiry form planners can use.',
    intro:
      'Most of your work comes from referrals and from the guests at your last event. When a planner or a guest looks you up the next morning, your site has to show your style in seconds and make an enquiry easy, even from a business card.',
    needs: [
      {
        title: 'Your style in the first screen',
        text: 'Couples and planners shortlist vendors on feel. The first screen should show your work and say what you do and where.',
      },
      {
        title: 'An enquiry form that fits how events are booked',
        text: 'Date, venue or city, guest count and budget range: the details you need to say yes or no quickly, without a long form.',
      },
      {
        title: 'A page for planners',
        text: 'Planners book vendors again and again. Give them what you offer, your setup needs, the insurance you can document and the fastest way to reach you, in one place.',
      },
      {
        title: 'Somewhere for guests to land',
        text: 'Guests take your card or see your work at an event. A short web address and a QR code on your card should open a page that makes them want to book you.',
      },
    ],
    pages: [
      'Home with your work and an enquiry button',
      'Services or packages, with starting prices if you share them',
      'Portfolio or gallery',
      'For planners',
      'Enquiry form and contact',
    ],
    workIds: ['marigold-moss'],
    packageNote:
      'Many solo vendors and entertainers fit the Local Launch Special (from CAD $900), a single page with up to six sections. Studios with several services, a large portfolio or separate wedding and corporate offers usually choose the Local Business Website (from CAD $1,200).',
    faqs: [
      {
        question: 'Do I need a booking calendar on my site?',
        answer:
          'Usually not. Most event work starts with an enquiry about a date. We design the form around the details you need to reply, and connect a booking or deposit tool you already use where applicable.',
      },
      {
        question: 'Can you make a QR code for my business card?',
        answer:
          'Yes. We can provide a QR code that opens your site, so the card a guest takes home leads straight back to you.',
      },
    ],
  },
];

export const getIndustryBySlug = (slug: string) => industries.find((industry) => industry.slug === slug);
