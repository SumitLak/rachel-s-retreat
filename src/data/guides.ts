// Guides & FAQs content, migrated from the previous Rachel's Retreats site.
export type GuideSection = { heading: string; body: string[]; table?: string[][] };
export type Guide = {
  slug: string;
  n: string;
  category: "Planning" | "Your stay" | "For guests";
  title: string;
  summary: string;
  intro: string[];
  sections: GuideSection[];
  outro: string;
};

export const guideCategories = [
  {
    id: "Planning",
    title: "Before you book",
    intro: "Choose the venue, understand the commitments and prepare your programme.",
  },
  {
    id: "Your stay",
    title: "Bring the details together",
    intro: "Hosting, food, travel and the practical rhythm of your retreat.",
  },
  {
    id: "For guests",
    title: "Find your place",
    intro: "Know what to ask before joining a listed retreat.",
  },
] as const;

export const guides: Guide[] = [
  {
    slug: "hosting-a-retreat",
    n: "01",
    category: "Planning",
    title: "Host your next retreat",
    summary:
      "How hosting a retreat works, from your first enquiry and venue choice to catering, arrival and on-site support.",
    intro: [
      "Rachel's Retreats helps you plan and run a residential retreat, arranging accommodation, catering, hosting and agreed guest logistics around your programme. We work with yoga teachers, artists, wellness practitioners and other organisers bringing a group together.",
    ],
    sections: [
      {
        heading: "Start with your idea and your group",
        body: [
          "Tell our Retreat Partnership Team what you want to create, your preferred dates, expected guest numbers and the length of stay. We'll discuss the style of your retreat and help you choose a venue that fits your programme.",
          "Room layouts, studio space, dining areas and travel arrangements all matter. Let us know what your group needs so we can discuss the practical details before you commit.",
        ],
      },
      {
        heading: "Agree the venue and quote",
        body: [
          "Your quote is built around the venue, number of nights and group size. Accommodation, catering, optional activities and transfers are priced separately, so you can see how your choices affect the total.",
          "Catering and hosting are required at every venue except Buchlyvie, where accommodation can also be booked on its own. Each venue has minimum room and night commitments.",
        ],
      },
      {
        heading: "Secure your dates and prepare your launch",
        body: [
          "A deposit secures your dates. Our sales team remains your contact for booking and payment questions and can supply venue images and information for your marketing.",
          "You market the retreat, sell the places and collect payments from your guests. You also gather their information and create and deliver the programme. It helps to test interest with your community before deciding how many places to offer.",
        ],
      },
      {
        heading: "Plan the details with our events team",
        body: [
          "Before the retreat, our events team works with you to confirm guest information, dietary requirements, arrival arrangements and any activities or excursions you choose. Scheduled transfers can be arranged as part of your quote.",
        ],
      },
      {
        heading: "Meet your hosts on arrival",
        body: [
          "For retreats booked with catering and hosting, a senior host leads the practical running of the stay, supported by a junior host and additional hosts for larger groups. Hosts stay on site or locally and are available during the day to help with arrangements and schedule changes.",
        ],
      },
    ],
    outro:
      "Tell us your retreat idea, preferred dates and expected group size. Our team will help you explore the venue and support options.",
  },
  {
    slug: "retreat-costs",
    n: "02",
    category: "Planning",
    title: "What affects the cost of a retreat",
    summary:
      "Understand accommodation commitments, catering, activity and transfer costs when planning a retreat for your group.",
    intro: [
      "The cost of running a retreat with Rachel's Retreats depends on the venue, dates, length of stay, group size and services you choose. We prepare an individual quote showing accommodation, catering, activities and transfers separately.",
    ],
    sections: [
      {
        heading: "Accommodation and minimum commitments",
        body: [
          "Accommodation is charged by the night. Some venues offer exclusive hire only; others also have a room-based option with a minimum number of bedrooms. Minimum stays vary by venue and can change with the season.",
          "There is no minimum group size, but minimum room commitments and service charges still apply. A smaller group may therefore pay more per guest. We'll explain the minimum commitment for the venue you are considering.",
        ],
      },
      {
        heading: "Catering and hosting",
        body: [
          "Catering is charged per person according to the package selected, with a minimum charge based on 10 guests, excluding retreat leaders. We'll confirm the arrangements for leaders and co-leaders in your quote.",
          "Catering and hosting must be booked at every venue except Buchlyvie. The hosting team is included in this arrangement, while catering is itemised separately in your quote. At Buchlyvie, you can also choose accommodation only.",
        ],
      },
      {
        heading: "Activities and scheduled transfers",
        body: [
          "Activities are optional and may be priced for the group or per person. Per-person activities and transfers typically have a minimum charge based on eight guests. The arrangements and minimum charges depend on the activity or journey.",
          "Choose experiences that fit your programme and allow for any costs that apply to leaders as well as paying guests. Our team will confirm the transport and other arrangements included in each quoted experience.",
        ],
      },
      {
        heading: "Guest numbers and payment timing",
        body: [
          "The number of paying guests affects how accommodation and other group costs are shared. When setting your guest price, allow for the programme costs and any other expenses you are responsible for alongside the Rachel's Retreats quote.",
          "You collect payments from your guests and pay Rachel's Retreats under the agreed booking terms. Review the deposit, instalment dates and cancellation arrangements before confirming, and take those dates into account when setting your own guest payment schedule.",
          "If you are considering a smaller room allocation, ask which venues offer it and when changes can be made. Room options and booking conditions vary by property.",
        ],
      },
    ],
    outro:
      "Share your expected guest numbers, preferred dates and programme with us. We'll prepare a quote and explain what is included and what is charged separately.",
  },
  {
    slug: "venue-hire-or-hosted-retreat",
    n: "03",
    category: "Planning",
    title: "Venue hire or a hosted retreat",
    summary:
      "Compare accommodation-only hire at Buchlyvie with a retreat booked with catering and hosting.",
    intro: [
      "Rachel's Retreats offers accommodation-only hire at Buchlyvie in Stirlingshire. At every other venue, accommodation must be booked with catering and hosting. Optional activities and scheduled transfers can form part of a retreat quote.",
      "The right arrangement depends on how much of the hospitality and practical running you want our team to handle. In both cases, you remain responsible for your programme, marketing and guest bookings.",
    ],
    sections: [
      {
        heading: "How the two arrangements compare",
        body: [],
        table: [
          ["Arrangement", "Accommodation only", "With catering and hosting"],
          ["Where available", "Buchlyvie", "Across the venue collection"],
          [
            "Catering",
            "Not included in accommodation-only hire",
            "Required and priced separately from accommodation",
          ],
          [
            "Retreat hosts",
            "Not included in accommodation-only hire",
            "Senior and junior hosts, with extra hosts for larger groups",
          ],
        ],
      },
      {
        heading: "What accommodation-only hire means",
        body: [
          "At Buchlyvie, you can book accommodation without the catering and hosting service. Before choosing this option, confirm the rooms and shared spaces included and discuss how you plan to provide food and run the stay. Any permissions or additional services need to be agreed as part of the booking.",
          "Minimum bedroom and night commitments still apply. Accommodation-only hire does not remove your responsibilities for organising and delivering the retreat.",
        ],
      },
      {
        heading: "What the hosting team takes care of",
        body: [
          "When catering and hosting are booked, our team coordinates the agreed accommodation, food service and practical arrangements. A senior host oversees daily delivery and works with you on schedule changes, supported by junior hosts.",
          "Hosts stay on site or locally and are available during the day. Activities and scheduled transfers are arranged and charged according to your quote, so you can choose the additional experiences your group needs.",
        ],
      },
      {
        heading: "What stays with the organiser",
        body: [
          "You create and deliver the programme, market the retreat, sell places and collect guest payments. You also gather guest information and share the details our team needs to plan the stay, including dietary requirements and arrival information.",
        ],
      },
    ],
    outro:
      "Tell us the venue you are considering and the support you need. We'll explain the available arrangement and the responsibilities on each side.",
  },
  {
    slug: "choosing-a-venue",
    n: "04",
    category: "Planning",
    title: "Choose a venue for your retreat",
    summary:
      "Choose a retreat venue around your programme, guest rooming, workshop space, shared facilities and travel.",
    intro: [
      "The right retreat venue needs to work for your programme and the people coming with you. Rachel's Retreats can help you compare the collection through one conversation, starting with your guest numbers, preferred dates, rooming needs and the spaces your programme requires.",
    ],
    sections: [
      {
        heading: "Start with the programme",
        body: [
          "A yoga retreat, a painting course and a leadership programme can need very different spaces. Tell us how you expect to use the venue, including group sessions, equipment, quiet time and any activities away from the property.",
          "If a studio or workshop space is essential, ask about its dimensions, layout and equipment. Check that it can accommodate your planned activity and the full group, rather than relying on the number of bedrooms as a guide.",
        ],
      },
      {
        heading: "Check the rooms your guests will use",
        body: [
          "Decide how many guests will want single occupancy and how many are happy to share. Ask about twin and king arrangements, bathrooms and any separate accommodation for leaders. Bedroom numbers alone do not tell you how many places you can sell.",
          "Tell us about any access or mobility requirements before choosing a property. We'll discuss the relevant venue details with you so you can establish whether the arrangement suits your group.",
        ],
      },
      {
        heading: "Allow space for the whole stay",
        body: [
          "As well as a practice or workshop area, consider where everyone will eat, meet informally and spend time between sessions. If your programme needs breakout rooms, outdoor space or presentation equipment, include that in your enquiry.",
        ],
      },
      {
        heading: "Make travel part of the decision",
        body: [
          "Consider where your guests are travelling from and how much of their first and last days will be spent on the journey. Ask about the nearest suitable airport or station and the scheduled transfer options before recommending flights.",
        ],
      },
      {
        heading: "Match the venue to your booking",
        body: [
          "Each venue has minimum room and night commitments. Some offer exclusive hire only; others also have a room-based option. Catering and hosting are required everywhere except Buchlyvie, where accommodation-only hire is also available.",
          "Our collection includes venues in Scotland, the Lake District, Ireland, Tuscany and Gascony. Tell us whether the location is fixed or whether you would like to compare options around your programme.",
        ],
      },
    ],
    outro:
      "Share your preferred destination, dates, expected guest numbers and essential facilities. We'll help you narrow down the options.",
  },
  {
    slug: "minimum-stays-and-group-sizes",
    n: "05",
    category: "Planning",
    title: "Minimum guests and length of stay",
    summary:
      "Compare minimum stays and accommodation options across the Rachel's Retreats collection, including smaller groups.",
    intro: [
      "Rachel's Retreats has no minimum group size, but each venue has a minimum booking commitment. The number of bedrooms, length of stay and minimum charges for catering and other services determine what a smaller retreat will cost to run.",
    ],
    sections: [
      {
        heading: "Minimum stays by venue",
        body: [],
        table: [
          ["Venue", "Minimum stay", "Accommodation options"],
          [
            "Rachel's Farm Buchlyvie — Buchlyvie, Stirlingshire",
            "4 nights April to October; 2 nights off season",
            "Exclusive hire or a minimum of 8 bedrooms",
          ],
          [
            "Glenalmond Retreats — Glenalmond, Perthshire",
            "5 nights",
            "Exclusive hire or a minimum of 10 bedrooms",
          ],
          [
            "The Manor House — County Monaghan",
            "5 nights",
            "Exclusive hire or an 8-bedroom option",
          ],
          ["Villa Senesi — Buonconvento, Tuscany", "5 nights", "Exclusive hire"],
          ["Wild River Lodge — Tomintoul, Cairngorms", "5 nights", "Exclusive hire"],
          ["Lakeside Lodge — Windermere, Lake District", "5 nights", "Exclusive hire"],
          ["The Château — Gascony", "5 nights", "Exclusive hire; release dates to be confirmed"],
        ],
      },
      {
        heading: "Smaller groups can still book",
        body: [
          "A small group can use a venue, but it must meet the relevant accommodation commitment. Where a room-based option is available, ask which rooms and shared spaces form part of the booking.",
          "Catering is priced on a minimum of 10 guests, excluding leaders. Activities and transfers typically have a minimum charge based on eight guests. These are minimum charging arrangements, rather than a requirement to bring that many people.",
        ],
      },
      {
        heading: "Choose a shorter retreat carefully",
        body: [
          "Buchlyvie's seasonal minimum stays make it an option to discuss for a shorter first retreat. A Thursday-to-Monday stay is four nights, so it would not meet the standard five-night minimum at the other listed venues.",
          "We'll confirm the accommodation commitment and service minimums in your quote before you book.",
        ],
      },
    ],
    outro:
      "Tell us your expected group size and preferred length of stay. We'll explain which booking options fit.",
  },
  {
    slug: "planning-your-first-retreat",
    n: "06",
    category: "Planning",
    title: "Plan your first retreat",
    summary:
      "A practical guide to testing interest, planning your programme, choosing a venue and launching your first retreat.",
    intro: [
      "Start by testing whether your community wants the experience you have in mind. A clear programme, a realistic group size and an understanding of your booking commitments will give your first retreat a firmer basis before you start selling places.",
    ],
    sections: [
      {
        heading: "Find out what your community wants",
        body: [
          "Talk to the people who already attend your classes, workshops or events. Ask which destinations interest them, how long they could travel for and whether they would prefer a focused programme or more time for exploring and rest.",
          "A simple email or social poll can help you gather interest. Treat interest as a starting point rather than a confirmed sale when deciding how much accommodation to commit to.",
        ],
      },
      {
        heading: "Define the programme and group",
        body: [
          "Describe who the retreat is for, what participants will do and any experience they need. Estimate the number of paying guests, the leaders attending and the mix of shared and single rooms.",
          "Choose a length of stay that meets the venue's minimum. Buchlyvie has shorter seasonal options; most other venues in the collection require at least five nights.",
        ],
      },
      {
        heading: "Build a budget you can deliver",
        body: [
          "Ask us for a quote covering accommodation, catering, any activities and scheduled transfers. Allow separately for your programme, travel, marketing and the other costs you will meet as an organiser.",
          "Check the minimum commitments and how costs would be shared if fewer guests book than you hope. Review your payment dates to Rachel's Retreats alongside the instalments you plan to collect from guests.",
        ],
      },
      {
        heading: "Prepare your launch",
        body: [
          "Once the venue and booking arrangements are agreed, build a clear description of the retreat. State the dates, room choices, programme, inclusions and how people can reserve a place. Our sales team can supply venue images and information for your marketing.",
          "Build interest before opening bookings, then keep communicating. Use your classes, email list and social channels to explain the experience and answer the questions people raise.",
        ],
      },
      {
        heading: "Prepare the stay with our team",
        body: [
          "You sell places, collect payments, gather guest information and deliver the programme. Our events team works with you on the agreed hospitality, dietary information, activities and arrival arrangements before the retreat.",
        ],
      },
    ],
    outro:
      "Tell us what you want to create and the community you would like to bring. We'll help you explore a suitable first retreat.",
  },
  {
    slug: "a-day-on-retreat",
    n: "07",
    category: "Your stay",
    title: "Plan a day on your retreat",
    summary:
      "An example day to help you plan teaching, meals, activities and time to relax around your retreat programme.",
    intro: [
      "Your programme shapes the day at a Rachel's Retreats venue. Some groups want focused teaching and practice; others want cultural visits, creative work or a holiday with a lighter programme. We work with the organiser to plan the hospitality and agreed activities around that choice.",
    ],
    sections: [
      {
        heading: "An example structure to adapt",
        body: [
          "Use this outline to start planning with your group. It is an example, rather than a fixed itinerary or a list of services included in every booking.",
        ],
        table: [
          ["Part of the day", "Programme idea", "What to plan around it"],
          [
            "Morning",
            "Your main practice, workshop or group session",
            "Agree the space, equipment and breakfast timing.",
          ],
          [
            "Midday",
            "A break and time to eat together",
            "Allow time between the session, meals and the next activity.",
          ],
          [
            "Afternoon",
            "A second session, optional excursion or free time",
            "Check travel time, activity availability and the needs of guests staying at the venue.",
          ],
          [
            "Evening",
            "Dinner and a quieter group activity",
            "Agree meal arrangements and leave time for guests to unwind.",
          ],
        ],
      },
      {
        heading: "Leave room between sessions",
        body: [
          "Allow for guests moving between spaces, getting ready for excursions and spending time on their own. On arrival and departure days, travel may take up much of the day, so plan those sessions around the agreed collection and departure arrangements.",
        ],
      },
      {
        heading: "Choose experiences that fit",
        body: [
          "An excursion can add to the retreat, but it also uses programme time. Discuss the experiences available at your chosen venue and decide which belong in the main programme. Activities are optional and priced separately.",
          "For an outdoor activity, ask about the arrangements if the weather changes. It helps to have a session you can lead at the venue, provided the agreed space and equipment are suitable.",
        ],
      },
      {
        heading: "Coordinate with your host",
        body: [
          "For retreats booked with catering and hosting, the senior host works with the leader on the practical schedule. Share your programme in advance so meal service, guest logistics and activities can be coordinated. Discuss changes with the host during the stay.",
        ],
      },
    ],
    outro:
      "Share your outline programme and the experiences you would like to include. We'll help you plan the arrangements around it.",
  },
  {
    slug: "retreat-hosts-and-support",
    n: "08",
    category: "Your stay",
    title: "Who looks after your group",
    summary:
      "Understand how planners, the events team and retreat hosts support your group, and what the organiser handles.",
    intro: [
      "For retreats booked with catering and hosting, a senior host leads the practical running of your stay, supported by a junior host and additional junior hosts for larger groups. The hosts stay at the venue or locally and are available during the day.",
    ],
    sections: [
      {
        heading: "Support before you arrive",
        body: [
          "Your first contact is our Retreat Partnership Team, who help you choose a venue and agree the booking. They handle questions about payments, the property and the information you need to market the retreat.",
          "Our events team then works with you on the details of the stay, including guest information, dietary requirements, activities and arrival arrangements. You gather the information from your guests and share it with the team.",
        ],
      },
      {
        heading: "A senior host on arrival",
        body: [
          "The senior host leads arrival day and the arrangements on the ground. They work with the leader to help the group settle in and put the agreed programme into practice.",
          "If your guests are using a scheduled group transfer, make sure everyone has the agreed meeting point and timings. Share changes to arrival information with the team as soon as you know about them.",
        ],
      },
      {
        heading: "Practical help during the stay",
        body: [
          "The senior host coordinates daily arrangements and works with you on schedule changes. Their role can include driving vehicles as part of the agreed logistics. Junior hosts support the delivery of the stay, with the staffing arrangement adjusted for larger groups.",
          "Tell us about the support your programme needs during planning. If an activity needs specialist instruction or particular equipment, agree who will provide it rather than assuming it is part of the general hosting service.",
        ],
      },
      {
        heading: "The organiser remains the programme lead",
        body: [
          "You deliver the teaching, workshops or other retreat content and lead your group. You are also responsible for marketing, selling places, collecting payments and gathering guest information.",
          "Before arrival, agree the contact arrangements for the stay, including what to do outside normal daytime hosting. Accommodation-only bookings at Buchlyvie are a different arrangement; discuss the support included before you book.",
        ],
      },
    ],
    outro:
      "Tell us about your group and the practical support you need. We'll explain how hosting would work for your retreat.",
  },
  {
    slug: "food-and-transfers",
    n: "09",
    category: "Your stay",
    title: "Food and transfers for your retreat",
    summary:
      "Plan catering, share dietary requirements and agree airport transfers and excursion transport for your group.",
    intro: [
      "Rachel's Retreats coordinates the agreed catering and scheduled transfers for your retreat. The organiser gathers guest information, and our events team works with them to confirm the details before arrival. Catering and transfers are separate items in the quote.",
    ],
    sections: [
      {
        heading: "Choose the catering arrangement",
        body: [
          "Catering and hosting are required at every venue except Buchlyvie, where accommodation-only hire is also available. Discuss the catering package alongside your programme so the meal arrangements fit the sessions and any time spent away from the venue.",
          "Check which meals, drinks and other items are included in your chosen package. If you plan an excursion over a mealtime, agree the food arrangements during planning.",
          "Catering is priced per person, with a minimum charge based on 10 guests, excluding leaders. We'll confirm the arrangements for retreat leaders and co-leaders in the quote.",
        ],
      },
      {
        heading: "Share dietary information in advance",
        body: [
          "Retreat leaders collect guests' dietary requirements and pass them to our events team before the stay. Ask guests to describe any allergies or essential requirements clearly so these can be discussed as part of the catering plan.",
          "If a dietary requirement is essential to someone's booking, seek confirmation before they commit. Let the team know if information changes, rather than waiting until arrival. Guests joining a listed retreat should raise their requirements with the organiser.",
        ],
      },
      {
        heading: "Agree scheduled group transfers",
        body: [
          "Airport or station transfers can be arranged as part of the retreat quote. Agree the collection location, dates and timings before telling guests which flights or trains to book. Scheduled group transfers are priced for the agreed arrangement.",
          "Transfer charges are typically based on a minimum of eight guests. The organiser gathers arrival information and shares it with the events team. Check the arrangements for anyone arriving outside the agreed schedule or travelling independently.",
        ],
      },
      {
        heading: "Plan transport for excursions",
        body: [
          "If an activity takes the group away from the venue, ask us to confirm the transport included in that experience. Allow for the journey when planning meals and programme sessions. Any extra journeys need to be agreed and quoted.",
          "Include your catering preferences, dietary requirements and likely arrival arrangements in your enquiry. We'll work through the options with you.",
        ],
      },
    ],
    outro: "",
  },
  {
    slug: "changes-to-your-retreat",
    n: "10",
    category: "Your stay",
    title: "Changes to your retreat plans",
    summary:
      "What to discuss if guest numbers, activities or travel plans change, and how to prepare for weather-dependent plans.",
    intro: [
      "If your guest numbers, programme or travel plans change, contact our team as soon as possible. The options depend on the venue, the timing and the services you have booked. Your written quote and booking terms set out the commitments for your retreat.",
    ],
    sections: [
      {
        heading: "Changing rooms or guest numbers",
        body: [
          "Some venues have a room-based booking option, while others offer exclusive hire only. This affects how much flexibility there may be if your group is smaller than expected. Minimum accommodation and catering charges still matter when reviewing a change.",
          "Ask about the relevant deadlines before confirming your retreat. A guest cancelling their place does not automatically change the organiser's commitment to Rachel's Retreats.",
        ],
      },
      {
        heading: "Adding guests or experiences",
        body: [
          "If you want to add guests, rooms, activities or transfers, check with the team before offering the change to your group. Availability, room arrangements and service minimums need to be considered, and the change may affect the quote.",
        ],
      },
      {
        heading: "Changing the daily schedule",
        body: [
          "During a hosted retreat, the senior host works with the leader on practical schedule changes. Discuss the change with them before moving a session that could affect catering, transport or a booked activity.",
          "If guests' arrival plans change, tell the events team or the agreed contact for your stay promptly. Ask how the change affects the scheduled transfer and whether separate transport will be needed.",
        ],
      },
      {
        heading: "Planning around the weather",
        body: [
          "For weather-dependent activities, discuss the provider's arrangements before booking. Ask whether the activity can move to another time, what alternatives may be available and whether changes would involve extra cost.",
          "It also helps to prepare an alternative session you can lead at the venue, using spaces and equipment agreed for your booking. If the weather changes during the stay, work with your senior host on a practical revision to the day.",
        ],
      },
      {
        heading: "Cancellation and refunds",
        body: [
          "Check the cancellation terms, payment dates and conditions for reducing your booking before paying a deposit. If you need to cancel, contact the team so the terms applying to your booking can be explained. Guests cancelling a place on a listed retreat should contact their organiser.",
        ],
      },
    ],
    outro:
      "Ask us about flexibility and booking commitments while planning your retreat, so you can make decisions with the terms in view.",
  },
  {
    slug: "joining-a-retreat",
    n: "11",
    category: "For guests",
    title: "Before you join a retreat",
    summary:
      "What to check before joining a retreat, including programme, room choices, inclusions, travel and booking arrangements.",
    intro: [
      "If you would like to attend a retreat, start with the retreat listing and send us an enquiry about the one that interests you. Your enquiry comes to Rachel's Retreats first, and we connect you with the organiser for the programme and booking details.",
    ],
    sections: [
      {
        heading: "Check that the programme suits you",
        body: [
          "Retreats have different purposes and levels of activity. Ask the organiser who the retreat is designed for, what experience is needed and how much of the day is scheduled. Check any physical demands and whether particular sessions or excursions are optional.",
        ],
      },
      {
        heading: "Understand what your place includes",
        body: [
          "Before booking, ask for the full description of your place: dates, venue, room type, meals, programme, activities and transport. Check which costs you will need to meet separately, including travel to the destination.",
          "Your retreat organiser sells the places and collects guest payments. Ask them to confirm your booking, payment dates and the terms that apply to your place. Sending an enquiry does not reserve a room.",
        ],
      },
      {
        heading: "Confirm your room and requirements",
        body: [
          "Ask whether your room is shared or for single occupancy, the bed arrangement and the bathroom facilities. If you have access or mobility requirements, raise these before committing so the relevant venue details can be checked.",
          "Share dietary requirements and allergies with the organiser in advance. Where a requirement is essential to your booking, ask for confirmation before paying.",
        ],
      },
      {
        heading: "Plan your journey",
        body: [
          "Confirm the arrival and departure arrangements before booking flights or trains. If a group transfer is offered, check the meeting point, timing and whether it is included in your place. Ask what happens if you arrive outside the scheduled collection.",
        ],
      },
      {
        heading: "Know who to contact",
        body: [
          "Your organiser leads the programme and handles your guest booking. For retreats with catering and hosting, the Rachel's Retreats host team supports the agreed hospitality and practical running of the stay.",
          "If you need to change or cancel your place, contact the organiser and refer to your booking terms. For questions before you have chosen a retreat, send our team an enquiry explaining what you are looking for.",
        ],
      },
    ],
    outro:
      "Tell us which retreat interests you and the questions you would like answered. We'll help you take the next step with the organiser.",
  },
];

export const getGuide = (slug: string) => guides.find((g) => g.slug === slug);
