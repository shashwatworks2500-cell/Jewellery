// PLACEHOLDER — sample/pitch data, replace with verified client data before any real launch.
//
// Every invented value on this site lives in this object and nowhere else.
// No component may hardcode a user-facing string (brief §1).
//
// Deliberate omissions, per §1:
//   - No prices. Gold rates move daily; a fake price destroys credibility.
//   - No awards, no press logos, no celebrity clients.
//   - Reviews are generic sample text and are labelled as such in the UI.

export const SAMPLE_DATA = {
  brand: {
    name: 'Bhagvati Jewellers',
    wordmark: 'Bhagvati',
    established: 1961,
    generations: 'Third generation',
    city: 'Prayagraj',
    state: 'Uttar Pradesh',
    country: 'India',
  },

  contact: {
    // PLACEHOLDER phone — not a real number (reserved fictional range).
    phone: '+91 99999 00000',
    phoneHref: 'tel:+919999900000',
    email: 'appointments@example.com',
    addressLine1: 'Civil Lines',
    addressLine2: 'Prayagraj, Uttar Pradesh 211001',
    hours: [
      { days: 'Monday – Saturday', open: '11:00', close: '20:00' },
      { days: 'Sunday', open: '12:00', close: '18:00' },
    ],
  },

  hero: {
    eyebrow: 'Prayagraj · since 1961',
    headline: 'Bhagvati',
    subhead:
      'Certified diamonds, hallmarked gold, and silver finished by hand in our own workshop.',
    primaryCta: { label: 'Book a bridal appointment', href: '#appointment' },
    secondaryCta: { label: 'See the workshop', href: '#workshop' },
  },

  /** The three pieces. One per material, in scroll order. */
  pieces: [
    {
      id: 'diamond',
      index: '01',
      material: 'Diamond',
      name: 'Four-claw solitaire',
      spec: '0.72 ct · VS1 · IGI certified',
      specParts: ['0.72 ct', 'VS1', 'IGI certified'],
      craftNote:
        'Set by hand over four days. The claws are filed to sit below the girdle so the stone is held without shadowing its pavilion.',
      cta: { label: 'Inspect this piece', href: '#inspect-diamond' },
    },
    {
      id: 'gold',
      index: '02',
      material: 'Gold',
      name: 'Bridal kada, pair',
      spec: '22K · BIS 916 hallmarked',
      specParts: ['22K', 'BIS 916', 'Hallmarked'],
      craftNote:
        'Raised from a single sheet, not cast. The inner face is left unpolished so the piece sits without slipping.',
      cta: { label: 'Inspect this piece', href: '#inspect-gold' },
    },
    {
      id: 'silver',
      index: '03',
      material: 'Silver',
      name: 'Temple-form anklet',
      spec: '999 fine silver',
      specParts: ['999 fine', 'Hand-raised', 'Solid'],
      craftNote:
        'Hammered over a wooden form. The slight irregularity along the profile is the mark of the tool and is not corrected.',
      cta: { label: 'Inspect this piece', href: '#inspect-silver' },
    },
  ],

  /** Proof over persuasion — the positioning argument, stated plainly. */
  assurances: [
    {
      title: 'Every stone certified',
      body: 'Diamonds are supplied with an IGI or GIA grading report. The report number is on the invoice.',
    },
    {
      title: 'Every gram hallmarked',
      body: 'Gold carries the BIS hallmark with the purity mark struck at an assaying centre, not by us.',
    },
    {
      title: 'Finished in-house',
      body: 'Setting, polishing and finishing happen in our own workshop above the showroom.',
    },
  ],

  workshop: {
    eyebrow: 'The workshop',
    headline: 'Four days for a single setting',
    body: 'A solitaire passes through three pairs of hands before it leaves the building — the setter, the polisher, and the person who checks it against the certificate one last time.',
  },

  appointment: {
    eyebrow: 'Appointments',
    headline: 'Bring the design, or bring the idea',
    body: 'Bridal consultations run about ninety minutes. Custom work starts with a drawing and a wax model you approve before any metal is cut.',
    cta: { label: 'Book a bridal appointment', href: '#appointment' },
  },

  // SAMPLE reviews — generic placeholder text, clearly marked in the UI.
  reviewsAreSample: true,
  reviews: [
    { quote: 'The certificate was explained line by line before we bought.', attribution: 'Sample review' },
    { quote: 'They resized the band twice without being asked.', attribution: 'Sample review' },
    { quote: 'The workshop visit made the decision easy.', attribution: 'Sample review' },
  ],

  seo: {
    title: 'Bhagvati Jewellers — Certified diamonds and hallmarked gold, Prayagraj',
    description:
      'A third-generation jeweller in Prayagraj. Certified diamond jewellery, BIS hallmarked 22K and 18K gold, 999 fine silver, bridal sets and custom design.',
    ogImageAlt: 'A brilliant-cut diamond lit in a dark vitrine.',
  },
} as const;

export type Piece = (typeof SAMPLE_DATA)['pieces'][number];
