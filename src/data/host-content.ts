// Content for /host. Editorial copy is the approved text. Journey stages and
// sample days are built only from facts already published on the site (quotes,
// deposits, events team, senior/junior hosts) and must not promise more.

export const hostMeta = {
  title: "Host a Retreat: Venues & Planning Support | Rachel’s Retreats",
  description:
    "Planning a yoga, wellness, creative or corporate retreat? Explore luxury venues and personalised retreat hosting support across the UK and Europe.",
};

export const hostHero = {
  intro:
    "Have a retreat idea you would love to bring to life? Whether you are an experienced yoga teacher, wellness practitioner, creative educator or business leader, Rachel’s Retreats helps you turn your programme into a memorable residential experience.",
  tagline: "You create the experience. We help bring the practical details together.",
  collection:
    "Explore exclusive-use retreat venues across Scotland, England, Ireland and Italy, with a French château joining our collection soon. From accommodation and catering to guest arrangements and optional activities, our team helps coordinate the agreed hospitality around your retreat.",
};

export const serviceCards = [
  {
    n: "01",
    label: "The setting",
    title: "Venue & accommodation",
    image: "/images/buchlyvie-lodges.webp",
    alt: "Lodges across the estate at Rachel’s Farm Buchlyvie",
    body: "Discover private estates, characterful villas and countryside properties chosen around your group. Our team can guide you through venue suitability, room configurations and shared spaces, helping you find accommodation that complements your programme and the experience you want guests to enjoy.",
    cta: { label: "Explore our venues", to: "/venues" as const },
  },
  {
    n: "02",
    label: "The table",
    title: "Catering & dietary planning",
    image: "/images/food-gnocchi.webp",
    alt: "A dish prepared by the Rachel’s Retreats chefs",
    body: "From relaxed shared breakfasts to memorable evening meals, dining becomes part of the retreat experience. We help coordinate the agreed menus, dietary requirements and catering arrangements, so mealtimes fit naturally around your programme and your guests feel thoughtfully considered.",
    cta: { label: "How we help", to: "/how-we-help" as const },
  },
  {
    n: "03",
    label: "The experience",
    title: "Activities & excursions",
    image: "/images/highland-cattle.webp",
    alt: "Highland cattle in the Scottish countryside",
    body: "Build memorable moments around your core retreat programme. Depending on the destination, our team can help explore local activities, specialist sessions, countryside experiences and excursions, with arrangements confirmed according to your group's interests, requirements and the options available.",
    cta: { label: "Discover Scotland", to: "/discover-scotland" as const },
  },
  {
    n: "04",
    label: "The people",
    title: "Guest care & coordination",
    // Placeholder until approved photography of hosts with guests is available.
    image: "/images/art.webp",
    alt: "Guests gathered for a session at Rachel’s Retreats",
    body: "Thoughtful preparation makes a retreat feel effortless. Our events team helps coordinate agreed guest information, arrival arrangements and practical requirements. For hosted retreats, on-site hosts support the daily running of the stay, allowing you to concentrate on your guests and programme.",
    cta: { label: "Meet the team", to: "/how-we-help" as const },
  },
];

export const journey = {
  heading: "Your retreat. Our expertise. One seamless journey.",
  intro:
    "Five stages from first idea to arrival, with a clear view of what you lead and what our team coordinates at each one.",
  steps: [
    {
      key: "discover",
      label: "Discover",
      title: "Start with your vision",
      image: "/images/villa-senesi.webp",
      alt: "Villa Senesi, Tuscany",
      you: "Share the retreat concept, preferred dates, approximate group size and the experiences you want to create.",
      us: "Help assess your requirements, discuss suitable venues and establish the practical shape of your stay.",
      outcome: "A clearer retreat concept and potential venue options.",
    },
    {
      key: "shape",
      label: "Shape",
      title: "Shape the stay around your programme",
      image: "/images/buchlyvie-bedroom.webp",
      alt: "A bedroom at Rachel’s Farm Buchlyvie",
      you: "Outline your programme, the rooming mix you need, your catering preferences and any optional activities or transfers.",
      us: "Prepare an itemised quote, with accommodation, catering, activities and transfers shown separately, and explain the venue’s booking options.",
      outcome: "An itemised proposal you can review against your programme and pricing.",
    },
    {
      key: "confirm",
      label: "Confirm",
      title: "Secure your dates",
      image: "/images/glenalmond.webp",
      alt: "Glenalmond Retreats, Perthshire",
      you: "Review the quote and booking terms, then pay the deposit to secure your dates.",
      us: "Confirm the booking and supply venue images and information you can use to market your retreat.",
      outcome: "Your dates are secured and you are ready to launch and sell places.",
    },
    {
      key: "prepare",
      label: "Prepare",
      title: "Bring the details together",
      image: "/images/food-fish.webp",
      alt: "A meal prepared by the Rachel’s Retreats team",
      you: "Market the retreat, sell places, collect guest payments and gather the guest information the team needs.",
      us: "Our events team works with you on guest information, dietary requirements, agreed activities and scheduled arrivals.",
      outcome: "Arrangements agreed and guests prepared for their stay.",
    },
    {
      key: "host",
      label: "Host",
      title: "Arrive and lead your retreat",
      image: "/images/studio.webp",
      alt: "The studio at Rachel’s Farm Buchlyvie",
      you: "Welcome your guests and deliver the programme you have created.",
      us: "For hosted retreats, a senior host leads the practical running of the stay, supported by junior hosts and additional hosts for larger groups.",
      outcome: "More time with your guests, and less time on the detail.",
    },
  ],
};

export const dayExplorer = {
  heading: "Your programme sets the pace. We help everything around it flow.",
  disclaimer: "Illustrative itineraries, not fixed packages or guaranteed services.",
  formats: [
    {
      key: "wellness",
      label: "Wellness",
      plannerType: "yoga",
      image: "/images/studio.webp",
      alt: "A studio set up for group practice",
      day: [
        {
          time: "08:00",
          title: "Breakfast and a gentle start",
          note: "Hospitality arrangements, where included",
        },
        {
          time: "09:30",
          title: "Morning yoga and guided practice",
          note: "Organiser-led programme",
        },
        {
          time: "12:30",
          title: "Lunch and time to recharge",
          note: "Hospitality arrangements, where included",
        },
        {
          time: "15:00",
          title: "Optional excursion or relaxation",
          note: "Activities and support subject to the agreed programme",
        },
        {
          time: "19:00",
          title: "Shared dinner and reflection",
          note: "Hospitality arrangements, where included",
        },
      ],
    },
    {
      key: "creative",
      label: "Creative",
      plannerType: "art",
      image: "/images/art.webp",
      alt: "Guests at an art masterclass",
      day: [
        {
          time: "08:00",
          title: "Breakfast and an unhurried start",
          note: "Hospitality arrangements, where included",
        },
        {
          time: "09:30",
          title: "Morning workshop or masterclass",
          note: "Organiser-led programme",
        },
        {
          time: "12:30",
          title: "Lunch together",
          note: "Hospitality arrangements, where included",
        },
        {
          time: "15:00",
          title: "Independent work or an optional outing",
          note: "Activities and support subject to the agreed programme",
        },
        {
          time: "19:00",
          title: "Dinner and sharing the day’s work",
          note: "Hospitality arrangements, where included",
        },
      ],
    },
    {
      key: "leadership",
      label: "Leadership",
      plannerType: "business",
      image: "/images/manor-house.webp",
      alt: "The Manor House, County Monaghan",
      day: [
        {
          time: "08:00",
          title: "Breakfast and informal networking",
          note: "Hospitality arrangements, where included",
        },
        {
          time: "09:30",
          title: "Leadership or strategy workshop",
          note: "Organiser-led programme",
        },
        { time: "12:30", title: "Shared lunch", note: "Hospitality arrangements, where included" },
        {
          time: "15:00",
          title: "Team activity or facilitated session",
          note: "Activities and support subject to the agreed programme",
        },
        {
          time: "19:00",
          title: "Evening dinner and conversation",
          note: "Hospitality arrangements, where included",
        },
      ],
    },
  ],
};

export const visionSupport = {
  heading: "Your Vision. Our Support. A Retreat Designed Around Your People.",
  intro: [
    "Hosting a successful retreat involves more than choosing an attractive venue. It requires a clear programme, suitable accommodation, thoughtful arrangements for guests and enough time to prepare for the unexpected.",
  ],
  youLead:
    "As the retreat organiser, you remain responsible for developing your programme, promoting your retreat, selling places and managing your relationship with participants.",
  weSupport: [
    "Rachel’s Retreats supports the agreed accommodation and hospitality arrangements around that programme. Our Retreat Partnership Team can help you explore venues, discuss rooming configurations and understand the services available at your chosen destination.",
    "Once your arrangements are agreed, the events team can coordinate relevant guest information, catering, activities and scheduled arrivals. For hosted retreats, the on-site team supports the practical running of the stay.",
  ],
  outro:
    "This division of responsibilities allows you to focus on creating a retreat that reflects your expertise, while knowing who is coordinating the hospitality elements.",
  youList: [
    "Develop and deliver your programme",
    "Promote the retreat and sell places",
    "Collect guest payments",
    "Manage your relationship with participants",
  ],
  usList: [
    "Explore venues and rooming configurations",
    "Coordinate the agreed accommodation and catering",
    "Organise agreed activities and scheduled arrivals",
    "On-site hosting for hosted retreats",
  ],
};

export const programmeFlow = {
  heading: "Create a Retreat Programme That Flows Naturally",
  body: [
    "One of the most important decisions when organising a retreat is finding the right balance between planned activities and time for guests to relax.",
    "A yoga retreat might begin with a morning practice, followed by breakfast, a workshop and an afternoon exploring the countryside. A creative retreat may require longer uninterrupted sessions, while a leadership retreat might combine structured discussions with activities that encourage informal conversation.",
    "The right accommodation and hospitality arrangements should complement that programme rather than dictate it.",
    "Consider how much time your guests will spend together, what facilities your sessions require and when meals or optional excursions would fit most naturally.",
    "Our team can discuss the practical implications of your proposed schedule and help coordinate suitable services available at your selected venue.",
  ],
};

export const costs = {
  heading: "Understanding Venue Hire, Hosting and Retreat Costs",
  intro:
    "Before confirming a retreat venue, it is important to understand what your booking includes and which arrangements will be quoted separately.",
  panels: [
    {
      title: "Accommodation & rooming",
      body: [
        "Accommodation costs depend on factors such as the property, season, number of nights and room allocation. Catering, hosting, activities and transfers may have different requirements depending on the venue.",
        "At Rachel’s Farm Buchlyvie, accommodation-only bookings are available. Other venues in the current collection require catering and hosting arrangements as part of their retreat bookings.",
      ],
    },
    {
      title: "Minimum stays",
      body: [
        "Minimum stays also vary. Buchlyvie currently has a four-night minimum between April and October and a two-night minimum outside that period. The other listed venues currently have a five-night minimum.",
        "Although there is no universal minimum group size, minimum accommodation and service charges can apply.",
      ],
    },
    {
      title: "Costs & inclusions",
      body: [
        "Our team will explain the applicable booking terms and prepare an itemised quotation so you can review the arrangements before making a commitment.",
      ],
    },
  ],
};

export const firstRetreat = {
  heading: "Planning Your First Retreat?",
  body: [
    "You do not need years of experience as a retreat organiser to begin exploring your first residential programme.",
    "Start by identifying who the retreat is for and what you would like guests to gain from attending. Consider the number of participants you can realistically attract, the teaching or facilitation you will provide and the time needed to prepare your programme.",
    "From there, you can explore destinations, suitable group accommodation and the practical arrangements that may influence your pricing.",
    "You will also need to consider how you market the retreat, collect guest payments, manage cancellations and communicate important information to participants.",
    "Rachel’s Retreats can help you understand the venue and hospitality elements, allowing you to make informed decisions as you develop your concept.",
  ],
};

export const chooseVenue = {
  heading: "Choosing the Right Venue for Your Retreat",
  body: [
    "Different retreats require different environments.",
    "For wellness programmes, you may prioritise practice spaces, peaceful surroundings and dining arrangements that fit your schedule. For corporate and leadership retreats, group meeting areas, privacy and convenient travel arrangements may be more important.",
    "Creative programmes may benefit from natural light, comfortable workshop areas and opportunities for independent work.",
    "Guest accommodation also needs careful consideration. A property's maximum guest capacity is not necessarily the number of people who can each have their own bedroom.",
    "Our collection includes countryside estates in Scotland, a historic manor house in Ireland, a lakeside property in England and a private Tuscan villa in Italy.",
    "You can browse the venues independently or share your requirements with our team to explore potentially suitable properties.",
  ],
};

export const hostFaqs = {
  heading: "Frequently Asked Questions About Hosting a Retreat",
  items: [
    {
      q: "Can I organise a retreat if I have never hosted one before?",
      a: "Yes. You can approach Rachel’s Retreats with an initial concept, approximate group size and preferred dates. Our team can help you understand suitable venue options and the practical hospitality arrangements, while you remain responsible for developing and selling your own retreat programme.",
    },
    {
      q: "Do I need to have all my guests confirmed before enquiring?",
      a: "No. You can begin with an estimated group size. However, the property, rooming arrangements and booking terms need to be considered before making a financial commitment. Any subsequent changes to guest numbers will need to be assessed against the agreed booking conditions.",
    },
    {
      q: "What is included in a hosted retreat?",
      a: "The exact arrangements depend on your selected venue and agreed proposal. They may include accommodation, catering, hosting, guest coordination and optional experiences. Your quotation should identify the relevant services, requirements and costs rather than assuming every property offers the same package.",
    },
    {
      q: "Who collects payments from retreat guests?",
      a: "The retreat organiser is responsible for selling places and collecting payments from participants. Rachel’s Retreats provides the venue and agreed hospitality services according to the applicable booking arrangements. Organisers should establish their own participant booking terms, cancellation policies and payment procedures.",
    },
    {
      q: "Can I customise meals, activities and the daily schedule?",
      a: "You can discuss your preferred programme, catering requirements and optional activities with the Retreat Partnership Team. The team will explain what may be possible at your chosen venue and confirm the services included in your proposal. Specialist activities and transfers may involve additional costs.",
    },
    // Retained from the existing practical questions.
    {
      q: "Can I book accommodation only?",
      a: "Buchlyvie can be booked without catering and hosting. At every other venue, catering and hosting are required. Activities are optional and catering is itemised separately in your quote.",
    },
    {
      q: "What affects the quote?",
      a: "Venue, season, nights and room allocation determine accommodation costs. Catering is charged per person, with a minimum based on 10 guests excluding leaders. Activities and transfers are quoted separately.",
    },
  ],
};

export const hostClosing = {
  heading: "Your Retreat Begins with a Conversation",
  body: [
    "Whether you have a complete programme ready to launch or an idea that is still taking shape, we would love to hear what you are planning.",
    "Tell us about your guests, preferred dates, destination and retreat concept. Our team can help you explore the next steps towards creating an experience that feels entirely your own.",
  ],
  cta: "Design Your Retreat",
};
