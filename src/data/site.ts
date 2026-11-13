// Single source of truth for site content. Facts mirror the previous
// Rachel's Retreats preview site; edit here and every page updates.

export const contact = {
  email: "reservations@rachelsfarm.com",
  phone: "+44 (0)131 215 1544",
  phoneHref: "tel:+441312151544",
  farmUrl: "https://rachelsfarm.com/",
};

export type Country = "Scotland" | "England" | "Ireland" | "Italy" | "France";
export const countries: Country[] = ["Scotland", "England", "Ireland", "Italy", "France"];

export type GalleryImage = { src: string; alt: string; caption: string; shared?: boolean };

export type Venue = {
  slug: string;
  name: string;
  country: Country;
  location: string;
  tagline: string;
  headline: string;
  intro: string;
  capacity: string;
  maxGuests: number | null;
  bedrooms: string;
  highlights: string[];
  minimumStay: string;
  bookingOptions: string;
  catering: string;
  image: string;
  gallery: GalleryImage[];
  comingSoon?: boolean;
};

const hospitality: GalleryImage[] = [
  {
    src: "/images/food-gnocchi.webp",
    alt: "A plated dish prepared by the Rachel's Retreats chefs",
    caption: "Menus planned around your guests",
    shared: true,
  },
  {
    src: "/images/art.webp",
    alt: "Guests at an art masterclass",
    caption: "Space for your programme",
    shared: true,
  },
  {
    src: "/images/food-fish.webp",
    alt: "A shared meal prepared by the Rachel's Retreats team",
    caption: "Food worth gathering around",
    shared: true,
  },
];

const cateredRequired =
  "Catering and hosting are required and itemised in your quote. Activities are optional.";

export const venues: Venue[] = [
  {
    slug: "buchlyvie",
    name: "Rachel's Farm Buchlyvie",
    country: "Scotland",
    location: "Buchlyvie, Stirlingshire",
    tagline: "The original Rachel's Farm",
    headline: "Room to gather, space to breathe.",
    intro:
      "A private 45-acre estate looking towards the Trossachs, with ten properties, generous shared spaces and a dedicated studio. Gather around the courtyard or spread out across the grounds.",
    capacity: "16 main bedrooms, plus two-bedroom lodges",
    maxGuests: null,
    bedrooms: "16 + lodges",
    highlights: [
      "16 main bedrooms, with additional two-bedroom lodges available",
      "A 1,000 sq ft studio for practice, workshops and gathering",
      "Private hot tubs and space to spend time outdoors",
      "Ten properties across a private 45-acre estate",
    ],
    minimumStay: "4 nights April to October; 2 nights off season",
    bookingOptions: "Exclusive hire or a minimum of 8 bedrooms",
    catering: "Accommodation-only or catered and hosted bookings available.",
    image: "/images/buchlyvie.webp",
    gallery: [
      {
        src: "/images/buchlyvie.webp",
        alt: "Rachel's Farm Buchlyvie and the countryside towards the Trossachs",
        caption: "The estate, looking towards the Trossachs",
      },
      {
        src: "/images/buchlyvie-lodges.webp",
        alt: "The lodges at Rachel's Farm Buchlyvie",
        caption: "Private lodges across the grounds",
      },
      {
        src: "/images/buchlyvie-bedroom.webp",
        alt: "A bedroom at Rachel's Farm Buchlyvie",
        caption: "Bedrooms ready for arrival",
      },
      {
        src: "/images/studio.webp",
        alt: "The studio at Rachel's Farm Buchlyvie",
        caption: "A 1,000 sq ft studio",
      },
      ...hospitality,
    ],
  },
  {
    slug: "glenalmond",
    name: "Glenalmond Retreats",
    country: "Scotland",
    location: "Glenalmond, Perthshire",
    tagline: "Perthshire countryside",
    headline: "A quieter pace in the heart of Perthshire.",
    intro:
      "A countryside setting for groups who want time together, a dedicated studio and room to settle into the experience. Private houses bring the comfort of a home to a shared retreat.",
    capacity: "Up to 28 guests · 14 bedrooms, plus 11 optional rooms",
    maxGuests: 28,
    bedrooms: "14 + 11 optional",
    highlights: [
      "14 bedrooms, with an additional 11-room option by arrangement",
      "A private estate in the Perthshire countryside",
      "Dedicated studio for practice and group sessions",
      "Hot tubs and shared spaces for unhurried evenings",
    ],
    minimumStay: "5 nights",
    bookingOptions: "Exclusive hire or a minimum of 10 bedrooms",
    catering: cateredRequired,
    image: "/images/glenalmond.webp",
    gallery: [
      {
        src: "/images/glenalmond.webp",
        alt: "Glenalmond Retreats in the Perthshire countryside",
        caption: "Perthshire countryside",
      },
      ...hospitality,
    ],
  },
  {
    slug: "manor-house",
    name: "The Manor House",
    country: "Ireland",
    location: "County Monaghan",
    tagline: "Irish country-house hospitality",
    headline: "A country house with room for everyone.",
    intro:
      "Historic rooms, private grounds and the gentle pace of the Irish countryside. The Manor House brings a sense of occasion to time spent learning, practising and dining together.",
    capacity: "Up to 28 guests · 15 bedrooms",
    maxGuests: 28,
    bedrooms: "15",
    highlights: [
      "15 bedrooms; confirm twin, double and bathroom arrangements",
      "400 acres of private Irish countryside",
      "Dedicated spaces for wellbeing and group gatherings",
      "Spring-fed lakes and space to explore the grounds",
    ],
    minimumStay: "5 nights",
    bookingOptions: "Exclusive hire or an 8-bedroom option",
    catering: cateredRequired,
    image: "/images/manor-house.webp",
    gallery: [
      {
        src: "/images/manor-house.webp",
        alt: "The Manor House in County Monaghan",
        caption: "400 acres of private countryside",
      },
      ...hospitality,
    ],
  },
  {
    slug: "villa-senesi",
    name: "Villa Senesi",
    country: "Italy",
    location: "Buonconvento, Tuscany",
    tagline: "The Tuscan escape",
    headline: "Slow mornings. Long tables. Tuscany.",
    intro:
      "Two restored villas on a private Tuscan estate, surrounded by the landscape south of Siena. A setting for creative weeks, shared practice and gathering over good food.",
    capacity: "Up to 30 guests · 15 bedrooms",
    maxGuests: 30,
    bedrooms: "15",
    highlights: [
      "15 air-conditioned bedrooms for up to 30 guests",
      "Two restored villas on a private 250-acre estate",
      "Two pools and generous outdoor gathering spaces",
      "Views across the countryside towards Montalcino",
    ],
    minimumStay: "5 nights",
    bookingOptions: "Exclusive hire",
    catering: cateredRequired,
    image: "/images/villa-senesi.webp",
    gallery: [
      {
        src: "/images/villa-senesi.webp",
        alt: "The grounds of Villa Senesi in Tuscany",
        caption: "Two restored villas south of Siena",
      },
      ...hospitality,
    ],
  },
  {
    slug: "wild-river-lodge",
    name: "Wild River Lodge",
    country: "Scotland",
    location: "Tomintoul, Cairngorms",
    tagline: "Into the Highlands",
    headline: "Let the landscape set the pace.",
    intro:
      "A Highland retreat on a private estate in the Cairngorms, with river access and a converted hall for shared practice. A place to balance time together with time in the landscape.",
    capacity: "Up to 28 guests · 14 bedrooms",
    maxGuests: 28,
    bedrooms: "14",
    highlights: [
      "14 bedrooms for groups of up to 28, subject to rooming",
      "A private 1,000-acre Highland estate",
      "Converted hall for group practice and gathering",
      "Direct river access and natural swimming pools",
    ],
    minimumStay: "5 nights",
    bookingOptions: "Exclusive hire",
    catering: cateredRequired,
    image: "/images/river-lodge.webp",
    gallery: [
      {
        src: "/images/river-lodge.webp",
        alt: "Wild River Lodge in the Cairngorms",
        caption: "A private 1,000-acre Highland estate",
      },
      ...hospitality,
    ],
  },
  {
    slug: "lakeside-lodge",
    name: "Lakeside Lodge",
    country: "England",
    location: "Windermere, Lake District",
    tagline: "Life by the lake",
    headline: "Come together on the shores of Windermere.",
    intro:
      "A Grade II listed Victorian mansion beside Lake Windermere, reserved on an exclusive-use basis. A distinctive setting for private groups, shared experiences and time by the water.",
    capacity: "15 guest bedrooms, plus one leader room",
    maxGuests: null,
    bedrooms: "15 + leader room",
    highlights: [
      "15 guest bedrooms and a separate retreat leader room",
      "A Grade II listed Victorian mansion",
      "A setting on the shore of Lake Windermere",
      "Exclusive use for your group",
    ],
    minimumStay: "5 nights",
    bookingOptions: "Exclusive hire",
    catering: cateredRequired,
    image: "/images/lakeside-lodge.webp",
    gallery: [
      {
        src: "/images/lakeside-lodge.webp",
        alt: "Lakeside Lodge beside Lake Windermere",
        caption: "On the shore of Lake Windermere",
      },
      ...hospitality,
    ],
  },
  {
    slug: "the-chateau",
    name: "The Château",
    country: "France",
    location: "Gascony",
    tagline: "Coming to the collection",
    headline: "A little more room to dream.",
    intro:
      "A private château setting joining the Rachel's Retreats collection. Speak to the team about future plans, dates and the details as they are confirmed.",
    capacity: "15 bedrooms · Release dates to be confirmed",
    maxGuests: null,
    bedrooms: "15",
    highlights: [
      "15 bedrooms in Gascony",
      "Five-night minimum stay",
      "Ask the team about release dates and availability",
    ],
    minimumStay: "5 nights",
    bookingOptions: "Exclusive hire; release dates to be confirmed",
    catering: cateredRequired,
    image: "/images/chateau.webp",
    comingSoon: true,
    gallery: [
      {
        src: "/images/chateau.webp",
        alt: "The Château in Gascony",
        caption: "Joining the collection",
      },
      ...hospitality,
    ],
  },
];

export const getVenue = (slug: string) => venues.find((v) => v.slug === slug);

export type RetreatType =
  | "yoga"
  | "art"
  | "business"
  | "interest"
  | "golf"
  | "scotland";

export const experiences: {
  id: RetreatType;
  label: string;
  short: string;
  title: string;
  body: string;
  image: string;
}[] = [
  {
    id: "yoga",
    label: "Yoga, wellness & fitness",
    short: "Practice, movement, fitness or restoration.",
    title: "A week of practice, held with care.",
    body: "Dedicated studios, menus that support the work and quiet landscapes to return to between sessions. You lead the practice; we look after everything around it.",
    image: "/images/studio.webp",
  },
  {
    id: "art",
    label: "Art, creativity & learning",
    short: "Making, learning and creative communities.",
    title: "Room to make something together.",
    body: "Light-filled spaces for masterclasses and workshops, long tables for the conversations afterwards, and settings that give your group something to draw on.",
    image: "/images/art.webp",
  },
  {
    id: "business",
    label: "Business & leadership",
    short: "Company teams, leaders or professional groups.",
    title: "Step away. Think clearly. Come back aligned.",
    body: "Private estates for company teams and leadership groups, with spaces to work, dine and reconnect — and a team who keep the days running smoothly.",
    image: "/images/manor-house.webp",
  },
  {
    id: "golf",
    label: "Golf & shared interests",
    short: "A group gathering around time on the course.",
    title: "Days on the course. Evenings at the table.",
    body: "A base for golf groups, celebrations and specialist communities, with transfers, meals and hospitality planned around what brings you together.",
    image: "/images/glenalmond.webp",
  },
  {
    id: "scotland",
    label: "Discover Scotland",
    short: "A private base for days of Scottish exploration.",
    title: "Castles, lochs and a little adventure.",
    body: "Explore by day, then return to good food and a familiar welcome each evening. We help shape excursions, transport and hospitality around your plans.",
    image: "/images/stirling-castle.webp",
  },
];

export const hostSteps = [
  {
    n: "01",
    title: "Your idea",
    body: "Tell us the programme, expected group size, dates and length of stay. The Retreat Partnership Team helps you choose a suitable venue.",
    image: "/images/villa-senesi.webp",
  },
  {
    n: "02",
    title: "Your booking",
    body: "Review an itemised quote and the booking terms. A deposit secures your dates; you market the retreat and sell the places.",
    image: "/images/buchlyvie-bedroom.webp",
  },
  {
    n: "03",
    title: "The details",
    body: "Our events team works with you on guest information, dietary needs, activities and scheduled arrivals.",
    image: "/images/food-gnocchi.webp",
  },
  {
    n: "04",
    title: "Your arrival",
    body: "For hosted retreats, a senior host welcomes the group and leads the practical running of the stay, supported by junior hosts.",
    image: "/images/studio.webp",
  },
];

export const faqs = [
  {
    q: "Can I book accommodation only?",
    a: "Buchlyvie can be booked without catering and hosting. At every other venue, catering and hosting are required. Activities are optional and catering is itemised separately in your quote.",
  },
  {
    q: "What are the minimum guests and nights?",
    a: "There is no minimum group size, but minimum accommodation and service charges apply. Buchlyvie has a four-night minimum from April to October and two nights off season. The other listed venues have a five-night minimum.",
  },
  {
    q: "What does the retreat organiser handle?",
    a: "You create and deliver the programme, market the retreat, sell places, collect guest payments and gather guest information. The events team uses that information to coordinate the agreed stay.",
  },
  {
    q: "What affects the quote?",
    a: "Venue, season, nights and room allocation determine accommodation costs. Catering is charged per person, with a minimum based on 10 guests excluding leaders. Activities and transfers are quoted separately.",
  },
];

export const team = [
  {
    n: "01",
    title: "Retreat planners",
    body: "The first conversation, venue options, dates and the plan that brings it all together.",
  },
  {
    n: "02",
    title: "Event managers",
    body: "Guest details, suppliers, itineraries and the practical arrangements around the programme.",
  },
  {
    n: "03",
    title: "Dedicated hosts",
    body: "A warm welcome, daily coordination and support for your guests and retreat leaders.",
  },
  {
    n: "04",
    title: "Private chefs",
    body: "Menus, dietary requirements and food prepared with the group in mind.",
  },
];

export type Retreat = {
  id: string;
  type: string;
  typeId: RetreatType;
  dates: string;
  year: number;
  title: string;
  venue: string;
  venueSlug: string;
  body: string;
  image: string;
};

export const retreats: Retreat[] = [
  {
    id: "voyage-scotland-kendra-2027",
    type: "Yoga & wellbeing",
    typeId: "yoga",
    dates: "3 July 2027 – 10 July 2027",
    year: 2027,
    title: "Voyage Scotland, with Kendra Watson",
    venue: "Rachel's Farm Buchlyvie, Stirlingshire",
    venueSlug: "buchlyvie",
    body: "A week of yoga, Scottish landscapes, castle visits and shared adventures with Kendra Watson.",
    image: "/images/stirling-castle.webp",
  },
  {
    id: "seek-yoga-training-2027",
    type: "Yoga & wellbeing",
    typeId: "yoga",
    dates: "31 October 2027 – 20 November 2027",
    year: 2027,
    title: "200 Hour Yoga Teacher Training in Scotland",
    venue: "Rachel's Farm Buchlyvie, Stirlingshire",
    venueSlug: "buchlyvie",
    body: "A three-week residential immersion with SEEK Yoga, combining yoga practice, study and teacher training in the Scottish countryside.",
    image: "/images/studio.webp",
  },
];

export const heroSlides = [
  { image: "/images/villa-senesi.webp", label: "Villa Senesi", place: "Tuscany, Italy", slug: "villa-senesi" },
  { image: "/images/buchlyvie.webp", label: "Rachel's Farm Buchlyvie", place: "Stirlingshire, Scotland", slug: "buchlyvie" },
  { image: "/images/manor-house.webp", label: "The Manor House", place: "County Monaghan, Ireland", slug: "manor-house" },
  { image: "/images/lakeside-lodge.webp", label: "Lakeside Lodge", place: "Lake District, England", slug: "lakeside-lodge" },
  { image: "/images/river-lodge.webp", label: "Wild River Lodge", place: "Cairngorms, Scotland", slug: "wild-river-lodge" },
];
