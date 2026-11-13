import { describe, expect, it } from "vitest";
import { getVenue } from "@/data/site";
import { contactSchema, defaultAnswers, enquirySchema, type PlannerAnswers } from "./types";
import {
  matchVenue,
  matchVenues,
  minimumNights,
  nightsFromDates,
  recommendations,
} from "./matching";
import { briefText, headline } from "./brief";

const answers = (over: Partial<PlannerAnswers> = {}): PlannerAnswers => ({
  ...defaultAnswers,
  ...over,
});
const venue = (slug: string) => {
  const v = getVenue(slug);
  if (!v) throw new Error(`missing ${slug}`);
  return v;
};

describe("venue matching: hard constraints", () => {
  it("never recommends coming-soon venues", () => {
    const recs = recommendations(answers({ destination: "France" }));
    expect(recs).toHaveLength(0);
    expect(matchVenue(venue("the-chateau"), answers()).status).toBe("not-suitable");
  });

  it("filters by destination", () => {
    const recs = recommendations(answers({ destination: "Italy", nights: 5 }));
    expect(recs.map((m) => m.venue.slug)).toEqual(["villa-senesi"]);
  });

  it("rules out venues whose published maximum is below the group size", () => {
    const m = matchVenue(venue("manor-house"), answers({ guests: 29, nights: 5 }));
    expect(m.status).toBe("not-suitable");
    expect(m.reasons.join(" ")).toContain("up to 28");
    expect(matchVenue(venue("villa-senesi"), answers({ guests: 29, nights: 5 })).status).not.toBe(
      "not-suitable",
    );
  });

  it("requires catering everywhere except Buchlyvie", () => {
    const a = answers({ catering: "Accommodation only (Buchlyvie)", nights: 5 });
    expect(matchVenue(venue("villa-senesi"), a).status).toBe("not-suitable");
    expect(matchVenue(venue("buchlyvie"), a).status).not.toBe("not-suitable");
  });

  it("applies Buchlyvie's seasonal minimum stay", () => {
    expect(minimumNights(venue("buchlyvie"), [7])).toBe(4);
    expect(minimumNights(venue("buchlyvie"), [1])).toBe(2);
    expect(minimumNights(venue("buchlyvie"), [])).toBe(4);
    const winter = answers({ timingMode: "month", month: 1, nights: 3 });
    const summer = answers({ timingMode: "month", month: 7, nights: 3 });
    expect(matchVenue(venue("buchlyvie"), winter).status).not.toBe("not-suitable");
    expect(matchVenue(venue("buchlyvie"), summer).status).toBe("not-suitable");
  });

  it("rules out stays shorter than a five-night minimum", () => {
    expect(matchVenue(venue("glenalmond"), answers({ nights: 4 })).status).toBe("not-suitable");
    expect(matchVenue(venue("glenalmond"), answers({ nights: 5 })).status).not.toBe("not-suitable");
  });

  it("checks private-room bedroom counts", () => {
    const a = answers({
      guests: 20,
      leaders: 1,
      leadersNeedRooms: true,
      rooming: "Private rooms",
      nights: 5,
    });
    expect(matchVenue(venue("villa-senesi"), a).status).toBe("not-suitable");
    // Glenalmond has optional extra rooms, so the team confirms instead.
    expect(matchVenue(venue("glenalmond"), a).status).toBe("confirm");
  });
});

describe("venue matching: confirmation and wording", () => {
  it("asks the team to confirm capacity where none is published", () => {
    const m = matchVenue(
      venue("lakeside-lodge"),
      answers({ guests: 20, rooming: "Shared rooms", nights: 5 }),
    );
    expect(m.status).toBe("confirm");
  });

  it("returns a potential match when every published rule is met", () => {
    const m = matchVenue(
      venue("villa-senesi"),
      answers({ guests: 24, rooming: "Shared rooms", nights: 6 }),
    );
    expect(m.status).toBe("potential");
  });

  it("never claims availability", () => {
    for (const m of matchVenues(answers({ guests: 24 }))) {
      expect(m.summary.toLowerCase()).not.toMatch(/is available|guaranteed|reserved|booked/);
    }
    const m = matchVenue(venue("villa-senesi"), answers({ guests: 24 }));
    expect(m.summary).toBe(
      "Villa Senesi could be a suitable option for your group of 24. Our Retreat Partnership Team will confirm rooming arrangements, dates and availability.",
    );
  });

  it("puts the preferred venue first among equals and preferences don't exclude", () => {
    const a = answers({ destination: "Scotland", venue: "wild-river-lodge", nights: 5 });
    expect(recommendations(a)[0]?.venue.slug).toBe("wild-river-lodge");
    const yoga = matchVenue(venue("villa-senesi"), answers({ experiences: ["yoga"], nights: 5 }));
    expect(yoga.status).toBe("confirm");
    expect(yoga.checks.join(" ")).toContain("Indoor space");
  });

  it("derives nights from a date range", () => {
    expect(nightsFromDates("2027-07-03", "2027-07-10")).toBe(7);
    expect(nightsFromDates("2027-07-10", "2027-07-03")).toBeNull();
    expect(nightsFromDates("", "2027-07-03")).toBeNull();
  });
});

describe("form validation", () => {
  const valid = { name: "Alex Example", email: "alex@example.com", consent: true as const };

  it("accepts a minimal valid contact", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("requires name, a valid email and consent", () => {
    expect(contactSchema.safeParse({ ...valid, name: "" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, phone: "call me" }).success).toBe(false);
  });

  it("rejects a filled honeypot on the server payload", () => {
    const base = { contact: valid, answers: defaultAnswers, brief: "x", startedAt: 1 };
    expect(enquirySchema.safeParse({ ...base, website: "" }).success).toBe(true);
    expect(enquirySchema.safeParse({ ...base, website: "spam" }).success).toBe(false);
  });
});

describe("brief", () => {
  it("summarises choices and states that nothing is reserved", () => {
    const a = answers({
      experiences: ["yoga"],
      guests: 18,
      destination: "Scotland",
      nights: 5,
      rooming: "Flexible",
    });
    expect(headline(a)).toBe("Yoga retreat · Scotland");
    const text = briefText(a);
    expect(text).toContain("Guests: 18 in total, including 1 leader");
    expect(text).toContain("Length of stay: 5 nights");
    expect(text).toContain("No booking or reservation has been made.");
  });
});
