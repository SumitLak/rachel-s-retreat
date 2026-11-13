import { describe, expect, it } from "vitest";
import { emailRetreatSchema, guestEnquirySchema, listingSchema } from "./forms";
import { getRetreat, publicRetreats, retreatNights } from "@/data/site";
import { isUpcoming } from "@/components/retreat-components";

const base = { website: "", startedAt: 1 };

describe("guest enquiry validation", () => {
  const ok = {
    retreat: "Voyage Scotland",
    name: "Alex Example",
    email: "alex@example.com",
    phone: "",
    question: "",
    consent: true as const,
    ...base,
  };
  it("accepts a valid enquiry", () => expect(guestEnquirySchema.safeParse(ok).success).toBe(true));
  it("requires consent and a valid email", () => {
    expect(guestEnquirySchema.safeParse({ ...ok, consent: false }).success).toBe(false);
    expect(guestEnquirySchema.safeParse({ ...ok, email: "nope" }).success).toBe(false);
  });
  it("rejects a filled honeypot", () =>
    expect(guestEnquirySchema.safeParse({ ...ok, website: "bot" }).success).toBe(false));
});

describe("organiser listing validation", () => {
  const ok = {
    organiser: "Sam Organiser",
    email: "sam@example.com",
    website: "",
    organisationSite: "",
    title: "Autumn Retreat",
    dates: "October 2027",
    venue: "Buchlyvie",
    description: "A week of practice and walking in the Trossachs.",
    imageRights: true as const,
    consent: true as const,
    startedAt: 1,
  };
  it("accepts a valid submission", () => expect(listingSchema.safeParse(ok).success).toBe(true));
  it("requires image-rights confirmation", () =>
    expect(listingSchema.safeParse({ ...ok, imageRights: false }).success).toBe(false));
});

describe("email me this retreat", () => {
  it("keeps marketing opt-in separate and optional", () => {
    const r = emailRetreatSchema.safeParse({
      retreatSlug: "x",
      email: "a@b.co",
      marketingOptIn: false,
      ...base,
    });
    expect(r.success).toBe(true);
  });
});

describe("retreat data", () => {
  it("has stable unique slugs and correct durations", () => {
    const slugs = publicRetreats.map((r) => r.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(retreatNights(getRetreat("voyage-scotland-kendra-watson-2027")!)).toBe(7);
    expect(retreatNights(getRetreat("seek-yoga-200-hour-teacher-training-scotland-2027")!)).toBe(
      20,
    );
  });
  it("treats retreats as ended once their end date has passed", () => {
    const r = getRetreat("voyage-scotland-kendra-watson-2027")!;
    expect(isUpcoming(r, new Date("2027-07-10"))).toBe(true);
    expect(isUpcoming(r, new Date("2027-07-11"))).toBe(false);
  });
  it("never lists invented prices", () => {
    expect(publicRetreats.every((r) => r.price === null)).toBe(true);
  });
});
