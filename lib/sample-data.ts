// PLACEHOLDER — sample/pitch data, replace with verified client data before any real launch.
//
// Every invented value lives here and nowhere else. No component hardcodes a
// user-facing string.
//
// IMAGES: photography is from Unsplash under the Unsplash License (free for
// commercial use, no attribution required). It is STOCK — a real launch needs
// the client's own product photography, because a jeweller's pieces are the
// product and stock images are not the pieces being sold.
//
// PRICES: intentionally absent. Gold rates move daily and a fabricated price
// destroys credibility in a pitch. The buy flow uses "price on request", which
// is how maisons and most Indian jewellers actually convert — enquiry first,
// figure confirmed against the day's rate.

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
    // PLACEHOLDER phone — fictional range, not a real number.
    phone: '+91 99999 00000',
    phoneHref: 'tel:+919999900000',
    whatsappHref: 'https://wa.me/919999900000',
    email: 'appointments@example.com',
    addressLine1: 'Civil Lines',
    addressLine2: 'Prayagraj, Uttar Pradesh 211001',
    hours: [
      { days: 'Monday – Saturday', open: '11:00', close: '20:00' },
      { days: 'Sunday', open: '12:00', close: '18:00' },
    ],
  },

  /** Conversion-focused hero. One promise, one primary action. */
  hero: {
    eyebrow: 'Prayagraj · since 1961',
    headline: 'Bhagvati',
    subhead: 'Certified diamonds and hallmarked gold, finished by hand since 1961.',
    body: 'Every stone carries its grading report. Every gram carries its BIS mark. Bring a design or bring an idea — we will make it in our own workshop.',
    primaryCta: { label: 'Book a bridal appointment', href: '#appointment' },
    secondaryCta: { label: 'View the collection', href: '#collection' },
    image: {
      src: '/images/hero.jpg',
      alt: 'A woman in an open white shirt wearing layered fine gold necklaces, a pendant and two rings.',
    },

    /* A single photograph, not a sequence.
     *
     * Three average frames read as a slideshow; one strong campaign image
     * reads as a brand. This also returns the two extra full-viewport decodes
     * the film was costing.
     *
     * `video` stays wired: drop an H.264 MP4 at /public/video/hero.mp4 and set
     * this to that path and the hero switches to a real <video>, keeping this
     * image as poster. MP4, not WebM — iOS Safari before 17.4 will not decode
     * WebM and would sit on the poster.
     */
    video: null as string | null,

    /* Trust row sits directly under the CTA — the three objections a buyer
       raises before they walk in. */
    trust: [
      'IGI & GIA certified diamonds',
      'BIS 916 hallmarked gold',
      'Lifetime buyback on our gold',
    ],
  },

  /** The buy section. Price on request by design — see header note. */
  shop: {
    eyebrow: 'The collection',
    headline: 'Pieces ready to view',
    body: 'Each piece is in the showroom today. Reserve one for a private viewing, or ask for its certificate before you visit.',
    priceNote: 'Price on request — confirmed against the day’s gold rate',
    items: [
      {
        id: 'solitaire',
        name: 'Four-claw solitaire',
        category: 'Diamond ring',
        spec: '0.72 ct · VS1 · IGI',
        detail: 'Set by hand over four days. Claws filed below the girdle so nothing shadows the pavilion.',
        image: { src: '/images/solitaire.jpg', alt: 'A brilliant-cut solitaire ring on a dark presentation box.' },
      },
      {
        id: 'kada',
        name: 'Interlink bracelet',
        category: '22K gold',
        spec: '22K · BIS 916',
        detail: 'Each link closed and filed by hand so the bracelet lies flat rather than twisting on the wrist.',
        image: { src: '/images/bracelet-gold.jpg', alt: 'A gold chain bracelet resting on an open magazine.' },
      },
      {
        id: 'chain',
        name: 'Temple-link chain',
        category: '22K gold',
        spec: '22K · BIS 916 · 18in',
        detail: 'Each link closed by hand. The clasp is tested to twice the weight of the chain.',
        image: { src: '/images/chain-stone.jpg', alt: 'A fine gold chain arranged over a smooth stone.' },
      },
      {
        id: 'riviere',
        name: 'Rivière bracelet',
        category: 'Diamond',
        spec: '2.1 ct total · VS · IGI',
        detail: 'Graduated stones matched for colour across the full length before setting.',
        image: { src: '/images/bracelet-diamond.jpg', alt: 'A diamond bracelet catching light against black.' },
      },
      {
        id: 'pearl',
        name: 'Bridal pearl strand',
        category: 'Pearl & gold',
        spec: 'Hand-knotted · 22K clasp',
        detail: 'Knotted between every pearl, so a broken strand loses one pearl and not the set.',
        image: { src: '/images/pearl.jpg', alt: 'A pearl necklace in a presentation case.' },
      },
      {
        id: 'stack',
        name: 'Everyday stacking bands',
        category: '18K gold',
        spec: '18K · BIS · set of three',
        detail: 'Sized individually so the set sits flush on the finger rather than spinning.',
        image: { src: '/images/rings-book.jpg', alt: 'Gold stacking rings arranged on a book.' },
      },
    ],
    primaryCta: { label: 'Reserve for a viewing', href: '#visit' },
    secondaryCta: { label: 'Ask on WhatsApp', href: 'https://wa.me/919999900000' },
  },

  /** How a commission actually runs. Answers "what happens if I walk in?" */
  process: {
    eyebrow: 'How it works',
    headline: 'Four steps, no surprises',
    steps: [
      { n: '01', title: 'Tell us the occasion', body: 'A message or a call. We ask about the ceremony, the outfit and the budget range before we show anything.' },
      { n: '02', title: 'See it in the room', body: 'We lay out what fits. Certificates on the table, under daylight lamps, no pressure to decide.' },
      { n: '03', title: 'Drawing and wax', body: 'For custom work you approve a drawing and then a wax model. Nothing is cut until you sign it off.' },
      { n: '04', title: 'Finished and checked', body: 'Setter, polisher, then a final check against the certificate. Collected in store or delivered by hand.' },
    ],
  },

  /** Objection handling. The questions that decide the sale. */
  faq: {
    eyebrow: 'Before you ask',
    headline: 'The questions people actually ask',
    items: [
      { q: 'Why is there no price on the site?', a: 'Gold is quoted daily and a diamond is priced on its own certificate. A number published today would be wrong tomorrow, so we quote against the day’s rate when you enquire — in writing, itemised.' },
      { q: 'How do I know the diamond is what you say it is?', a: 'Every diamond comes with an IGI or GIA report, and the report number is printed on your invoice. You are welcome to verify it on the lab’s own site before paying.' },
      { q: 'Is the gold really 916?', a: 'The BIS hallmark is struck at an assaying centre, not by us. You can see the mark under our loupe, and we will show you where it is on the piece.' },
      { q: 'Can you make something from a photograph?', a: 'Usually. We will tell you honestly if a design will not hold up in wear, and suggest the change rather than making something that breaks.' },
      { q: 'What happens if the size is wrong?', a: 'First resize is free, within a year, on anything we made. Chains and bangles we adjust while you wait where the design allows.' },
      { q: 'Do you buy back?', a: 'We buy back our own gold at the day’s rate for as long as the piece exists. Bring the invoice.' },
    ],
  },

  gifting: {
    eyebrow: 'Gifting',
    headline: 'Wrapped, boxed, and quietly done',
    body: 'Every piece leaves in a lined box with its certificate and a hand-written card if you want one. We keep a note of what you bought, so next year we can tell you what would go with it.',
    image: { src: '/images/rings-stone.jpg', alt: 'Gold rings resting against a pale stone.' },
  },

  assurances: [
    {
      title: 'Every stone certified',
      body: 'Diamonds ship with an IGI or GIA grading report. The report number is printed on your invoice.',
    },
    {
      title: 'Every gram hallmarked',
      body: 'Gold carries the BIS hallmark, struck at an assaying centre — not by us.',
    },
    {
      title: 'Finished in-house',
      body: 'Setting, polishing and finishing happen in our workshop above the showroom.',
    },
    {
      title: 'Lifetime buyback',
      body: 'We buy back our own gold at the day’s rate, for as long as the piece exists.',
    },
  ],

  bridal: {
    eyebrow: 'Bridal',
    headline: 'The set is built around the bride, not the calendar',
    body: 'Bridal consultations run about ninety minutes. We start with the outfit and the ceremony, then work back to the pieces. Custom work begins with a drawing and a wax model you approve before any metal is cut.',
    cta: { label: 'Book a bridal appointment', href: '#appointment' },
    image: { src: '/images/bridal-hands.jpg', alt: 'Two hands wearing fine gold bracelets.' },
  },

  workshop: {
    eyebrow: 'The workshop',
    headline: 'Four days for a single setting',
    body: 'A solitaire passes through three pairs of hands before it leaves the building — the setter, the polisher, and the person who checks it against its certificate one last time.',
    image: { src: '/images/gold-chain.jpg', alt: 'A gold chain catching warm light in the workshop.' },
  },

  appointment: {
    eyebrow: 'Visit us',
    headline: 'Come and see them in person',
    body: 'Private viewings run all week. Tell us what you are looking for and we will have it on the table when you arrive.',
    primaryCta: { label: 'Book an appointment', href: 'tel:+919999900000' },
    secondaryCta: { label: 'Message on WhatsApp', href: 'https://wa.me/919999900000' },
  },

  // SAMPLE reviews — generic placeholder text, labelled as such in the UI.
  reviewsAreSample: true,
  reviews: [
    { quote: 'The certificate was explained line by line before we bought.', attribution: 'Sample review' },
    { quote: 'They resized the band twice without being asked.', attribution: 'Sample review' },
    { quote: 'The workshop visit made the decision easy.', attribution: 'Sample review' },
  ],

  seo: {
    title: 'Bhagvati Jewellers — Certified diamonds & hallmarked gold, Prayagraj',
    description:
      'A third-generation jeweller in Prayagraj. Certified diamond jewellery, BIS hallmarked 22K and 18K gold, bridal sets and custom design. Book a private viewing.',
  },
} as const;

export type ShopItem = (typeof SAMPLE_DATA)['shop']['items'][number];
