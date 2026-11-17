/** SAMPLE catalog, community copy, and shop facts. Prices for kits match the brief and stay marked SAMPLE until the client confirms. Course prices, merch prices, specs, policies, and legal rules are placeholders. */

export const PHOTOS = {
  hero: "assets/images/banners/home-hero-welder-sparks.jpg",
  merchBanner: "assets/images/banners/promo-merch-wear.jpg",
  giveawayBanner: "assets/images/banners/promo-giveaway-prize-pack.jpg",
  newsletter: "assets/images/banners/promo-newsletter.jpg",
  auth: "assets/images/banners/auth-background.jpg",
  catKits: "assets/images/products/cat-welding-kits.jpg",
  catLaser: "assets/images/products/cat-laser-cut-creations.jpg",
  catMerch: "assets/images/products/cat-merchandise.jpg",
  catCustom: "assets/images/products/cat-custom-fabrication.jpg",
  kitBeginner: "assets/images/products/kit-beginner-welding.jpg",
  kitPractice: "assets/images/products/kit-welding-practice.jpg",
  kitMetal: "assets/images/products/kit-metal-project.jpg",
  kitWorkshop: "assets/images/products/kit-featured-workshop.jpg",
  onb1: "assets/images/onboarding/onb-01-welding-kits.jpg",
  onb2: "assets/images/onboarding/onb-02-custom-fabrication.jpg",
  onb3: "assets/images/onboarding/onb-03-learn-to-weld.jpg",
  onb4: "assets/images/onboarding/onb-04-community.jpg",
  svcMetal: "assets/images/services/service-custom-metal-fabrication.jpg",
  svcLaser: "assets/images/services/service-precision-laser-cutting.jpg",
  svcPersonal: "assets/images/services/service-personalized-metalwork.jpg",
  courseBeginner: "assets/images/courses/course-beginner-welding.jpg",
  courseSafety: "assets/images/courses/course-welding-safety.jpg",
  courseFab: "assets/images/courses/course-fabrication-basics.jpg",
  courseLaser: "assets/images/courses/course-laser-design.jpg",
  galWeld: "assets/images/gallery/gallery-structural-weld.jpg",
  galWildlife: "assets/images/gallery/gallery-wildlife.jpg",
  bible: "assets/images/community/bible-exchange.jpg",
  devotional: "assets/images/community/devotional-header.jpg",
  sparks: "assets/images/community/updates-sparks.jpg",
  interior: "assets/images/community/updates-interior.jpg",
  prize: "assets/images/community/giveaway-prize-pack.jpg",
} as const;

export type PhotoKey = keyof typeof PHOTOS;

export const SAFETY_NOTE =
  "Welding involves heat, sparks and sharp metal. Always follow safety guidelines.";

export const SHOP = {
  name: "Angry Anvil Fabrication",
  tagline: "Built in the shop. Made to stand out.",
  announcement: "Gear for the shop. Projects worth showing off.",
  phone: "(606) 271-2461",
  phoneHref: "tel:+16062712461",
  email: "angryanvil.fab@gmail.com",
  website: "https://www.angryanvil.store/",
  hours: "Mon–Fri 9:00 am – 5:00 pm. Saturday and Sunday closed.",
} as const;

export const DEMO_EMAIL = "builder@angryanvil.store";
export const DEMO_PASSWORD = "ShopDemo1";

export type CategoryId = "kits" | "laser" | "merch" | "custom";
export type Stock = "in_stock" | "made_to_order";
export type ProductBadge = "beginner" | "staff";
export type Fulfillment = "shop" | "printify" | "quote";

export type Product = {
  id: string;
  name: string;
  summary: string;
  description: string;
  price: number | null;
  category: CategoryId;
  badge?: ProductBadge;
  stock: Stock;
  leadTime?: string;
  photos: PhotoKey[];
  fulfillment: Fulfillment;
  included: string[];
  /** Spec rows are omitted on purpose. Do not invent measurements. */
  variants?: { name: string; options: string[] }[];
};

export const CATEGORIES: { id: CategoryId; label: string; action: string; photo: PhotoKey; blurb: string }[] = [
  { id: "kits", label: "Welding Kits", action: "Shop Kits", photo: "catKits", blurb: "Starter kits and practice steel for the bench." },
  { id: "laser", label: "Laser-Cut Creations", action: "Explore Metalwork", photo: "catLaser", blurb: "Clean-cut steel artwork and signs." },
  { id: "merch", label: "Merchandise", action: "Shop Apparel", photo: "catMerch", blurb: "Blank-until-print apparel. SAMPLE until Printify syncs." },
  { id: "custom", label: "Custom Fabrication", action: "View Projects", photo: "catCustom", blurb: "Frames and pieces quoted to the job." },
];

const shopProducts: Product[] = [
  {
    id: "kit-beginner",
    name: "Beginner Welding Kit",
    summary: "Everything a first-time builder needs to strike an arc and lay clean beads.",
    description: "A starter setup for someone learning to strike an arc and lay a clean bead. Contents below are SAMPLE until the shop confirms the exact bill of materials.",
    price: 129.99,
    category: "kits",
    badge: "beginner",
    stock: "in_stock",
    photos: ["kitBeginner", "catKits", "courseBeginner"],
    fulfillment: "shop",
    included: ["Welding machine", "Auto-darkening helmet", "Gloves", "Electrodes", "Steel practice pieces"],
  },
  {
    id: "kit-practice",
    name: "Welding Practice Kit",
    summary: "Pre-cut steel coupons, brackets and bars for sharpening technique.",
    description: "Practice steel for repetition: coupons, brackets and bars. SAMPLE contents until the shop confirms the cut list.",
    price: 54.99,
    category: "kits",
    stock: "in_stock",
    photos: ["kitPractice", "galWeld"],
    fulfillment: "shop",
    included: ["Pre-cut steel coupons", "Brackets", "Bars"],
  },
  {
    id: "kit-metal",
    name: "Metal Project Kit",
    summary: "Tubing, plates, brackets and fasteners, a complete parts set for the next build.",
    description: "A parts set for a small build: tubing, plates, brackets and fasteners. SAMPLE contents until the shop confirms the list.",
    price: 89.99,
    category: "kits",
    badge: "staff",
    stock: "in_stock",
    photos: ["kitMetal", "catCustom"],
    fulfillment: "shop",
    included: ["Tubing", "Plates", "Brackets", "Fasteners"],
  },
  {
    id: "kit-workshop",
    name: "Featured Workshop Kit",
    summary: "Flagship setup of machine, headgear, gloves and practice steel.",
    description: "The flagship bench setup: machine, headgear, gloves and practice steel. SAMPLE contents until the shop confirms the exact kit.",
    price: 449.99,
    category: "kits",
    badge: "staff",
    stock: "in_stock",
    photos: ["kitWorkshop", "prize", "kitBeginner"],
    fulfillment: "shop",
    included: ["Welding machine", "Headgear", "Gloves", "Practice steel"],
  },
  {
    id: "laser-wildlife",
    name: "Wildlife Scene Panel",
    summary: "Laser-cut steel wildlife scene. Made to order.",
    description: "A laser-cut steel panel of a wildlife scene. Size and finish are confirmed with the shop. SAMPLE product.",
    price: 164,
    category: "laser",
    badge: "staff",
    stock: "made_to_order",
    leadTime: "SAMPLE lead time — the shop confirms the schedule with the quote.",
    photos: ["galWildlife", "catLaser"],
    fulfillment: "shop",
    included: ["Laser-cut steel panel", "Finish confirmed at order"],
  },
  {
    id: "laser-ridge",
    name: "Mountain Ridge Panel",
    summary: "Layered mountain and pine cut in steel.",
    description: "Mountain and pine laser-cut steel. SAMPLE product. Dimensions are not published until the shop provides them.",
    price: 148,
    category: "laser",
    stock: "made_to_order",
    leadTime: "SAMPLE lead time — the shop confirms the schedule with the quote.",
    photos: ["onb2", "catLaser"],
    fulfillment: "shop",
    included: ["Laser-cut steel panel"],
  },
  {
    id: "custom-bracket",
    name: "Custom Frame or Bracket",
    summary: "Tell the shop what it has to hold. Pricing is by quote.",
    description: "A made-to-order frame, bracket or fitting. There is no fixed price. Scope, pricing and timing are confirmed together.",
    price: null,
    category: "custom",
    stock: "made_to_order",
    leadTime: "Timing is part of the quote.",
    photos: ["svcMetal", "catCustom", "galWeld"],
    fulfillment: "quote",
    included: ["Project inquiry", "Quoted plan before any build"],
  },
];

/** Printify-shaped SAMPLE rows. Replace this function's body with a Printify sync. */
export function listPrintifyProducts(): Product[] {
  const apparel = (id: string, name: string, summary: string, price: number, photos: PhotoKey[]): Product => ({
    id,
    name,
    summary,
    description: `${summary} SAMPLE merchandise until the Printify catalog is connected. No artwork is printed on these photos.`,
    price,
    category: "merch",
    stock: "made_to_order",
    leadTime: "SAMPLE — printed after the order is accepted by the print partner.",
    photos,
    fulfillment: "printify",
    included: ["Printed when ordered", "Size and color selected in the app"],
    variants: [
      { name: "Size", options: ["S", "M", "L", "XL", "XXL"] },
      { name: "Color", options: ["Black", "Charcoal"] },
    ],
  });
  return [
    apparel("merch-tee", "Shop T-Shirt", "Blank work tee, ready for the shop mark.", 32, ["catMerch", "merchBanner"]),
    apparel("merch-hoodie", "Shop Hoodie", "Heavy hoodie for the bench and the drive home.", 58, ["merchBanner", "catMerch"]),
    {
      ...apparel("merch-hat", "Shop Hat", "Unbranded cap until the shop art is synced.", 26, ["catMerch", "merchBanner"]),
      variants: [{ name: "Color", options: ["Black", "Steel"] }],
    },
    {
      id: "merch-tag",
      name: "Shop Tag",
      summary: "Small steel-finished accessory. SAMPLE.",
      description: "A small accessory stand-in. SAMPLE until Printify variants are synced.",
      price: 18,
      category: "merch",
      stock: "made_to_order",
      leadTime: "SAMPLE — printed after the order is accepted by the print partner.",
      photos: ["kitMetal", "merchBanner"],
      fulfillment: "printify",
      included: ["Accessory"],
      variants: [{ name: "Color", options: ["Black", "Copper tone"] }],
    },
  ];
}

export function getCatalog(): Product[] {
  return [...shopProducts, ...listPrintifyProducts()];
}

export function getProduct(id: string) {
  return getCatalog().find((p) => p.id === id);
}

export type Lesson = {
  id: string;
  title: string;
  kind: "video" | "pdf";
  minutes: number;
  freePreview?: boolean;
  notes: string;
};

export type Course = {
  id: string;
  title: string;
  category: string;
  level: string;
  summary: string;
  description: string;
  instructor: string;
  durationLabel: string;
  price: number;
  photo: PhotoKey;
  learn: string[];
  requirements: string[];
  materials: string[];
  chapters: { id: string; title: string; lessons: Lesson[] }[];
};

const sampleInstructor = "Angry Anvil shop team (SAMPLE — biography not confirmed)";

export const COURSES: Course[] = [
  {
    id: "course-beginner",
    title: "Beginner Welding",
    category: "Beginner Welding",
    level: "Beginner",
    summary: "Strike an arc, read the puddle, and lay a bead you can be proud of.",
    description: "A SAMPLE course for someone new to the booth. It is not a certification program. The client will confirm whether the first lesson stays free.",
    instructor: sampleInstructor,
    durationLabel: "SAMPLE length",
    price: 79,
    photo: "courseBeginner",
    learn: ["How to set up a safe practice space", "How to strike and hold an arc", "What a sound bead looks like on practice steel"],
    requirements: ["A place you are allowed to weld", "Willingness to go slow"],
    materials: ["Helmet, gloves and jacket", "Practice steel or the Welding Practice Kit"],
    chapters: [
      {
        id: "b1",
        title: "First arc",
        lessons: [
          { id: "b1l1", title: "Striking an arc", kind: "video", minutes: 8, freePreview: true, notes: "Free preview. The client still needs to confirm this lesson stays open." },
          { id: "b1l2", title: "Reading the puddle", kind: "video", minutes: 10, notes: "Watch the metal, not the sparks." },
          { id: "b1l3", title: "Coupon layout", kind: "pdf", minutes: 6, notes: "A one-page practice layout. SAMPLE pages, not a shop drawing." },
          { id: "b1l4", title: "A clean bead", kind: "video", minutes: 12, notes: "Travel speed and rod angle on flat plate." },
        ],
      },
    ],
  },
  {
    id: "course-safety",
    title: "Welding Safety",
    category: "Safety",
    level: "All levels",
    summary: "PPE, fire watch, and a shop that stays standing.",
    description: "SAMPLE safety orientation. It does not replace the shop's own rules or any required training.",
    instructor: sampleInstructor,
    durationLabel: "SAMPLE length",
    price: 49,
    photo: "courseSafety",
    learn: ["Which PPE belongs on before the arc", "How to set a fire watch", "Why ventilation is part of the setup"],
    requirements: ["None beyond showing up ready to listen"],
    materials: ["Your own helmet, gloves, jacket and eye protection"],
    chapters: [
      {
        id: "s1",
        title: "Before the arc",
        lessons: [
          { id: "s1l1", title: "PPE check", kind: "video", minutes: 7, notes: "Helmet, gloves, jacket, boots." },
          { id: "s1l2", title: "Fire watch", kind: "pdf", minutes: 5, notes: "SAMPLE checklist. Not a legal safety policy." },
          { id: "s1l3", title: "Air and space", kind: "video", minutes: 8, notes: "Keep fumes and clutter out of the booth." },
        ],
      },
    ],
  },
  {
    id: "course-fab",
    title: "Fabrication Basics",
    category: "Fabrication Basics",
    level: "Beginner",
    summary: "Measure, mark, clamp, and fit steel before you weld it.",
    description: "SAMPLE lessons on layout. No certification is offered.",
    instructor: sampleInstructor,
    durationLabel: "SAMPLE length",
    price: 89,
    photo: "courseFab",
    learn: ["Squaring a small frame", "Why fit-up decides the weld", "How to mark steel without guessing"],
    requirements: ["Basic hand tools", "The Beginner Welding course is helpful, not required"],
    materials: ["Square, clamps, marker", "Offcuts or the Metal Project Kit"],
    chapters: [
      {
        id: "f1",
        title: "Fit-up",
        lessons: [
          { id: "f1l1", title: "Measure twice", kind: "video", minutes: 9, notes: "Tape, square, and a mark you can see." },
          { id: "f1l2", title: "Clamps", kind: "pdf", minutes: 4, notes: "SAMPLE notes on holding parts still." },
          { id: "f1l3", title: "Tack and check", kind: "video", minutes: 11, notes: "Tack, measure, then commit." },
        ],
      },
    ],
  },
  {
    id: "course-laser",
    title: "Laser Design",
    category: "Laser Design",
    level: "Intermediate",
    summary: "Turn a sketch into a cut that still looks right in steel.",
    description: "SAMPLE introduction to preparing art for a laser. Software licenses and machine training are not included.",
    instructor: sampleInstructor,
    durationLabel: "SAMPLE length",
    price: 69,
    photo: "courseLaser",
    learn: ["What makes a cut readable in metal", "How bridges hold a design together", "How to talk about finish with the shop"],
    requirements: ["A sketch or photo of what you want"],
    materials: ["Paper sketch", "No machine required for this SAMPLE course"],
    chapters: [
      {
        id: "l1",
        title: "From sketch to cut",
        lessons: [
          { id: "l1l1", title: "Shapes that cut clean", kind: "video", minutes: 8, notes: "Open shapes, bridges, and line weight." },
          { id: "l1l2", title: "Samples on the bench", kind: "pdf", minutes: 5, notes: "SAMPLE photo notes. Not a cut catalog." },
          { id: "l1l3", title: "Edge and finish", kind: "video", minutes: 7, notes: "What to ask for when the cut is done." },
        ],
      },
    ],
  },
];

export function getCourse(id: string) {
  return COURSES.find((c) => c.id === id);
}

export function courseLessons(course: Course) {
  return course.chapters.flatMap((ch) => ch.lessons);
}

export function findLesson(courseId: string, lessonId: string) {
  const course = getCourse(courseId);
  const lesson = course ? courseLessons(course).find((l) => l.id === lessonId) : undefined;
  return { course, lesson };
}

export type Service = {
  id: string;
  title: string;
  summary: string;
  description: string;
  photo: PhotoKey;
  gallery: PhotoKey[];
  included: string[];
  ideal: string[];
  faqs: { q: string; a: string }[];
};

export const PROCESS = [
  { n: "01", title: "Share your idea", body: "Tell us what you want made and how you plan to use it." },
  { n: "02", title: "Work through the details", body: "Size, material, finish and a few reference photos go a long way." },
  { n: "03", title: "Review the plan", body: "Scope, pricing and timing are confirmed together." },
  { n: "04", title: "Bring it to life", body: "The shop builds it and keeps you posted." },
];

export const HELPFUL_DETAILS = [
  "What you want to make",
  "Approximate size and dimensions",
  "Material and finish preferences",
  "Budget and ideal timeline",
];

export const PROJECT_TYPES = ["Custom Metal Fabrication", "Precision Laser Cutting", "Personalized Metalwork", "Not sure yet"];
export const BUDGETS = ["Under $250", "$250–$750", "$750–$2,000", "$2,000+", "Not sure"];
export const TIMELINES = ["As soon as the shop can", "2–4 weeks", "1–2 months", "Flexible"];
export const TIME_SLOTS = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"];

export const SERVICES: Service[] = [
  {
    id: "custom-metal",
    title: "Custom Metal Fabrication",
    summary: "Frames, brackets and made-to-order pieces built around how you plan to use them.",
    description: "Bring a job that has to fit a real space. The shop fabricates frames, brackets and one-off pieces around how you will use them. Pricing is by quote.",
    photo: "svcMetal",
    gallery: ["svcMetal", "galWeld", "catCustom"],
    included: ["A conversation about use, not just shape", "Material and finish options reviewed with you", "A quoted plan before any build"],
    ideal: ["Shop fixtures", "Brackets and frames", "Parts that have to fit existing steel"],
    faqs: [
      { q: "Do you publish a price list?", a: "No. Scope, pricing and timing are confirmed together after we see the idea." },
      { q: "Can I send a sketch?", a: "Yes. A photo, a napkin sketch or a rough dimension is enough to start." },
    ],
  },
  {
    id: "laser-cutting",
    title: "Precision Laser Cutting",
    summary: "Detailed artwork, custom signs and clean-cut steel designs.",
    description: "Detailed artwork, signs and clean-cut steel. The shop reviews the file or sketch, then quotes the cut. No fixed menu price.",
    photo: "svcLaser",
    gallery: ["svcLaser", "galWildlife", "catLaser"],
    included: ["Review of your art or sketch", "Notes on what will cut cleanly", "A quote before cutting"],
    ideal: ["Wall art", "Signs without a rushed deadline", "Panels that need a crisp edge"],
    faqs: [
      { q: "Do I need a finished vector file?", a: "No. A clear sketch is enough to start. The shop will say if the art needs to be redrawn." },
      { q: "Is the price on the laser-cut products the custom price?", a: "Those listings are SAMPLE products. A one-off design is quoted." },
    ],
  },
  {
    id: "personalized",
    title: "Personalized Metalwork",
    summary: "Meaningful pieces for home, shop or a gift.",
    description: "Pieces with a name, a date or a story in the metal. The shop will tell you what can be cut cleanly. Pricing is by quote.",
    photo: "svcPersonal",
    gallery: ["svcPersonal", "onb2", "bible"],
    included: ["Help narrowing the idea", "A proof of the layout before cutting", "A quote that includes finish"],
    ideal: ["Gifts", "Shop signs", "A piece for the house"],
    faqs: [
      { q: "Can you copy a logo I do not own?", a: "No. Send art you have the right to use." },
      { q: "How long does it take?", a: "Timing is part of the quote. It is not promised on this screen." },
    ],
  },
];

export function getService(id: string) {
  return SERVICES.find((s) => s.id === id);
}

export type GalleryCategory = "fabrication" | "laser" | "winners";

export type GalleryProject = {
  id: string;
  title: string;
  category: GalleryCategory;
  description: string;
  materials: string;
  photo: PhotoKey;
};

export const GALLERY: GalleryProject[] = [
  { id: "g-frame", title: "Structural weld, shop frame build", category: "fabrication", description: "A shop frame with the welds left visible.", materials: "SAMPLE — steel. Alloy is confirmed on the job.", photo: "galWeld" },
  { id: "g-wildlife", title: "Custom wildlife scene, laser-cut steel", category: "laser", description: "A wildlife scene cut from steel and set on wood.", materials: "SAMPLE — steel and reclaimed wood.", photo: "galWildlife" },
  { id: "g-prize", title: "Last season's workshop prize pack", category: "winners", description: "The previous workshop giveaway, laid out on the bench.", materials: "SAMPLE — prize photo, not a current offer.", photo: "prize" },
  { id: "g-bracket", title: "Bracket set for a bench", category: "fabrication", description: "Brackets fitted to an existing bench.", materials: "SAMPLE — steel.", photo: "svcMetal" },
  { id: "g-ridge", title: "Mountain ridge panel", category: "laser", description: "Pines and ridgelines cut so the light comes through.", materials: "SAMPLE — steel.", photo: "onb2" },
  { id: "g-sign", title: "Personalized panel", category: "laser", description: "A gift piece with the lettering removed from this photo on purpose.", materials: "SAMPLE — steel.", photo: "svcPersonal" },
  { id: "g-kit", title: "Workshop kit on the bench", category: "winners", description: "A full setup staged the way a winner would unbox it.", materials: "SAMPLE — kit photo.", photo: "kitWorkshop" },
  { id: "g-coupons", title: "Practice coupons after class", category: "fabrication", description: "Coupons from a practice session, brush marks still on the scale.", materials: "SAMPLE — mild steel coupons.", photo: "kitPractice" },
  { id: "g-interior", title: "Bench at opening", category: "winners", description: "The shop before the first arc of the day.", materials: "Shop interior.", photo: "interior" },
];

export type Giveaway = {
  id: string;
  title: string;
  summary: string;
  prize: string;
  deadline: string;
  photo: PhotoKey;
  eligibility: string;
  how: string[];
};

export const GIVEAWAYS: Giveaway[] = [
  {
    id: "shop-starter",
    title: "Shop-Starter Prize Pack",
    summary: "The next big win could be yours.",
    prize: "SAMPLE prize pack — a complete welding setup with machine, headgear, gloves and practice steel, plus a full set of shop gear. The client must confirm the actual prize.",
    deadline: "2027-01-31T23:59:00",
    photo: "prize",
    eligibility: "SAMPLE placeholder: U.S. residents, 18+. Client and legal counsel must confirm eligibility. This is not a final rule.",
    how: [
      "Sign in.",
      "Submit the entry form.",
      "Accept the official rules placeholder and the required consent.",
      "One SAMPLE entry is stored on this device. Winner selection is server-side and is not running here.",
    ],
  },
];

export const RULES_PLACEHOLDER = [
  "SAMPLE PLACEHOLDER. This is not an official rule, not an offer, and not legal advice.",
  "Angry Anvil and its counsel will replace this page with the real official rules before any giveaway is promoted.",
  "Do not rely on the sample eligibility line, the sample deadline, or the sample prize description.",
  "Winner selection, odds, and prize fulfillment are not defined in this mockup.",
];

export type Devotional = {
  id: string;
  date: string;
  title: string;
  reference: string;
  scripture: string;
  reflection: string;
};

export const DEVOTIONALS: Devotional[] = [
  {
    id: "d-work",
    date: "2026-11-17",
    title: "Work as Worship",
    reference: "Colossians 3:23 (KJV)",
    scripture: "And whatsoever ye do, do it heartily, as to the Lord, and not unto men;",
    reflection: "SAMPLE reflection. A clean bead and an honest quote are both worth doing as if someone you respect is watching. The work can be worship without being a performance.",
  },
  {
    id: "d-iron",
    date: "2026-11-16",
    title: "Iron and Iron",
    reference: "Proverbs 27:17 (KJV)",
    scripture: "Iron sharpeneth iron; so a man sharpeneth the countenance of his friend.",
    reflection: "SAMPLE reflection. The shop is louder when someone else is at the bench. Let the people next to you make you more useful, not just busier.",
  },
  {
    id: "d-strength",
    date: "2026-11-15",
    title: "Held Steady",
    reference: "Isaiah 41:10 (KJV)",
    scripture: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.",
    reflection: "SAMPLE reflection. Some days the fit-up will not close. Strength here is not a mood. It is being held while you try again.",
  },
  {
    id: "d-light",
    date: "2026-11-14",
    title: "Light Through the Cut",
    reference: "Matthew 5:16 (KJV)",
    scripture: "Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven.",
    reflection: "SAMPLE reflection. A cut panel only works because light comes through what was removed. What you make can point past itself.",
  },
  {
    id: "d-diligent",
    date: "2026-11-13",
    title: "Show Up and Square It",
    reference: "Proverbs 22:29 (KJV)",
    scripture: "Seest thou a man diligent in his business? he shall stand before kings; he shall not stand before mean men.",
    reflection: "SAMPLE reflection. Diligence in this shop looks ordinary: square the part, answer the inquiry, keep the promise you already made.",
  },
];

export const BIBLE_STEPS = [
  "Tell the shop if you can offer a Bible or if you need one.",
  "The shop reviews what you sent.",
  "Shipping or pickup is arranged with you.",
];

export type ChatTopic = "Order status" | "Custom project question" | "Course access help" | "Giveaway question";
export const CHAT_TOPICS: ChatTopic[] = ["Order status", "Custom project question", "Course access help", "Giveaway question"];

export function money(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-3)}`;
}
