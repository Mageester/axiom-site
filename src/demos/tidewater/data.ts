// Tidewater Yoga: everything the page says, in one place. Fictional business, fictional details.

export const NAME = 'Tidewater Yoga';
export const PHONE_DISPLAY = '(519) 555-0174';
export const PHONE_HREF = 'tel:+15195550174';
export const EMAIL = 'hello@tidewater.example';
export const ADDRESS_LINES = ['61 Regina Street North', 'Waterloo, Ontario'];

export type Level = 'new' | 'all' | 'some';
export type ClassId = 'flow' | 'yin' | 'beginners' | 'prenatal' | 'restore';

export type ClassType = {
  id: ClassId;
  name: string;
  minutes: number;
  /** 1 to 3, shown as tide marks with a word beside them. */
  effort: 1 | 2 | 3;
  effortLabel: string;
  level: Level;
  levelLabel: string;
  what: string;
  suits: string;
  note?: string;
};

export const classTypes: ClassType[] = [
  {
    id: 'flow',
    name: 'Slow flow',
    minutes: 60,
    effort: 3,
    effortLabel: 'Steady, you will get warm',
    level: 'some',
    levelLabel: 'Some yoga helps',
    what: 'Standing poses linked together at the pace of the breath, some balance, a little strength, then a long rest on your back. Unhurried, but you will work.',
    suits: 'People who have taken a few classes or finished the beginners series. Fit first-timers are welcome; the teacher shows an easier version of everything.',
  },
  {
    id: 'yin',
    name: 'Yin',
    minutes: 75,
    effort: 2,
    effortLabel: 'Quiet, but you feel it',
    level: 'all',
    levelLabel: 'All levels',
    what: 'Floor poses held for three to five minutes each, with bolsters and blocks to rest on. Very little moving around, and more of a stretch than it looks.',
    suits: 'Anyone. A good fit for the evening after a long day at a desk, a long run, or a long week.',
  },
  {
    id: 'beginners',
    name: 'Beginners series',
    minutes: 60,
    effort: 1,
    effortLabel: 'Gentle, lots of explaining',
    level: 'new',
    levelLabel: 'New to yoga',
    what: 'Four weeks, one class a week, the same small group and the same teacher. The basic poses, how to use the props, and how the breathing fits in. Questions are the point.',
    suits: 'Anyone who has never done yoga, or has not in years. A new series starts the first Tuesday and the first Saturday of each month.',
    note: 'Four weeks',
  },
  {
    id: 'prenatal',
    name: 'Prenatal',
    minutes: 60,
    effort: 1,
    effortLabel: 'Gentle, adapted week by week',
    level: 'all',
    levelLabel: 'Any trimester',
    what: 'Gentle movement, supported rest and slow breathing, changed to suit each stage of pregnancy. The last ten minutes are for talking with the other parents-to-be.',
    suits: 'Pregnant people at any stage and any experience. Check with your midwife or doctor before you start, and tell the teacher how far along you are.',
  },
  {
    id: 'restore',
    name: 'Sunday restorative',
    minutes: 75,
    effort: 1,
    effortLabel: 'Almost no effort',
    level: 'all',
    levelLabel: 'All levels',
    what: 'Five or six long rests on bolsters and blankets, lights low, one teacher walking the room with extra blankets. You may fall asleep. That is allowed.',
    suits: 'Everyone, especially the tired. A kind first class if the others sound like too much.',
  },
];

export const classById = Object.fromEntries(classTypes.map((c) => [c.id, c])) as Record<ClassId, ClassType>;

/** Monday first, as studios print it. */
export const days = [
  { id: 'mon', short: 'Mon', name: 'Monday' },
  { id: 'tue', short: 'Tue', name: 'Tuesday' },
  { id: 'wed', short: 'Wed', name: 'Wednesday' },
  { id: 'thu', short: 'Thu', name: 'Thursday' },
  { id: 'fri', short: 'Fri', name: 'Friday' },
  { id: 'sat', short: 'Sat', name: 'Saturday' },
  { id: 'sun', short: 'Sun', name: 'Sunday' },
] as const;
export type DayId = (typeof days)[number]['id'];

export type Slot = {
  day: DayId;
  /** 24-hour start, "07:00" */
  start: string;
  cls: ClassId;
  minutes?: number;
  note?: string;
};

export const timetable: Slot[] = [
  { day: 'mon', start: '07:00', cls: 'flow' },
  { day: 'mon', start: '12:10', cls: 'flow', minutes: 45, note: 'Lunch class' },
  { day: 'mon', start: '18:00', cls: 'flow' },
  { day: 'mon', start: '19:30', cls: 'yin' },

  { day: 'tue', start: '09:30', cls: 'prenatal' },
  { day: 'tue', start: '18:00', cls: 'beginners' },
  { day: 'tue', start: '19:30', cls: 'yin' },

  { day: 'wed', start: '07:00', cls: 'flow' },
  { day: 'wed', start: '12:10', cls: 'flow', minutes: 45, note: 'Lunch class' },
  { day: 'wed', start: '18:00', cls: 'flow' },
  { day: 'wed', start: '19:30', cls: 'yin' },

  { day: 'thu', start: '18:00', cls: 'prenatal' },
  { day: 'thu', start: '19:30', cls: 'flow' },

  { day: 'fri', start: '07:00', cls: 'flow' },
  { day: 'fri', start: '12:10', cls: 'flow', minutes: 45, note: 'Lunch class' },
  { day: 'fri', start: '17:30', cls: 'yin' },

  { day: 'sat', start: '09:00', cls: 'flow' },
  { day: 'sat', start: '10:45', cls: 'prenatal' },
  { day: 'sat', start: '12:30', cls: 'beginners' },

  { day: 'sun', start: '10:00', cls: 'flow' },
  { day: 'sun', start: '16:30', cls: 'restore' },
];

export function timeLabel(start: string) {
  const [h, m] = start.split(':').map(Number);
  const suffix = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m ? `${h12}:${String(m).padStart(2, '0')} ${suffix}` : `${h12} ${suffix}`;
}

export function endLabel(start: string, minutes: number) {
  const [h, m] = start.split(':').map(Number);
  const total = h * 60 + m + minutes;
  return timeLabel(`${Math.floor(total / 60)}:${total % 60}`);
}

export const prices = [
  {
    id: 'intro',
    name: 'New here',
    price: '$45',
    per: 'three weeks, unlimited',
    detail: 'As many classes as you like for your first three weeks. Starts the day of your first class. Once per person.',
    featured: true,
  },
  {
    id: 'drop',
    name: 'Drop-in',
    price: '$23',
    per: 'one class',
    detail: 'Any class on the timetable except the beginners series.',
  },
  {
    id: 'ten',
    name: 'Ten classes',
    price: '$195',
    per: '$19.50 a class',
    detail: 'Good for six months from your first class. Yours only, and it works for any class except the series.',
  },
  {
    id: 'month',
    name: 'Monthly unlimited',
    price: '$135',
    per: 'a month',
    detail: 'Month to month. Pause or stop any time before your next billing date, by email or at the desk.',
  },
  {
    id: 'series',
    name: 'Beginners series',
    price: '$88',
    per: 'four weeks',
    detail: 'Four classes with the same group, then a free week of unlimited classes to try the rest of the timetable.',
  },
];

export const firstClass = [
  {
    when: 'Before you come',
    title: 'Reserve a mat',
    body: 'Classes stop at fourteen people, so reserve a spot from the timetable, by phone or by email. If you are pregnant, injured or recovering from something, mention it now.',
  },
  {
    when: 'Ten minutes early',
    title: 'Arrive, and slow down',
    body: 'Give yourself ten minutes to find the door, sign one short form, and settle. Shoes come off at the entrance; phones go silent in the cubbies.',
  },
  {
    when: 'What to wear',
    title: 'Anything you can move in',
    body: 'Leggings or loose pants and a top that stays put when you bend forward. Bare feet on the mat. Bring a layer for the rest at the end.',
  },
  {
    when: 'What we provide',
    title: 'Everything else',
    body: 'Mats, blocks, straps, bolsters, blankets and eye pillows, cleaned after every class. Filtered water at the tap, so just bring a bottle.',
  },
  {
    when: 'At the door',
    title: 'Tell the teacher',
    body: 'Injuries, surgeries, pregnancy, a bad back today, or simply that it is your first class. It changes what they show you, and it stays between you and them.',
  },
  {
    when: 'During class',
    title: 'Rest whenever you like',
    body: 'Lying down, skipping a pose or leaving early are all fine. Nobody is watching you, and nobody is keeping score.',
  },
];

export const faqs = [
  {
    q: 'I am not flexible. Is that a problem?',
    a: 'No. Flexibility is not the entry fee. Every pose has a version that works for the body you have today, and the props make up the difference.',
  },
  {
    q: 'I have never done yoga. Where do I start?',
    a: 'The beginners series if you want to learn properly, or a yin or Sunday restorative class if you want to try one evening first. Tell the teacher at the door that it is your first time.',
  },
  {
    q: 'Is the room heated?',
    a: 'Warm, not hot. We keep it around 24 degrees, and a little warmer for restorative. There is no hot yoga at Tidewater.',
  },
  {
    q: 'Can I come while pregnant?',
    a: 'Yes. Prenatal runs Tuesday morning, Thursday evening and Saturday morning. Check with your midwife or doctor first, and tell the teacher how far along you are. After the birth, you are welcome back whenever your care provider says you are ready.',
  },
  {
    q: 'What if I need to cancel?',
    a: 'Cancel up to four hours before class and the class goes back on your pass. Later than that, or not showing up, uses the class. If something has genuinely gone wrong, call us.',
  },
  {
    q: 'Do you offer private sessions?',
    a: 'Yes, one-on-one or for a small group, at the studio. Email us with what you have in mind and a few times that suit you.',
  },
  {
    q: 'Is there anywhere to change?',
    a: 'Two change rooms with benches, hooks and cubbies. There are no showers.',
  },
];

export const contactTopics = [
  'My first class',
  'The beginners series',
  'Prenatal classes',
  'Prices and passes',
  'Private sessions',
  'Something else',
];
