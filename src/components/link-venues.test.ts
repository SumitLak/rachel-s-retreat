import { describe, expect, it } from "vitest";
import { linkVenueMentions } from "./ui-luxe";

const links = (segs: ReturnType<typeof linkVenueMentions>) =>
  segs.flat().filter((s): s is { slug: string; name: string } => "slug" in s);

describe("linkVenueMentions", () => {
  it("links the first mention of each venue once across paragraphs", () => {
    const out = linkVenueMentions([
      "Villa Senesi is in Tuscany. Villa Senesi has two pools.",
      "Unlike Villa Senesi, The Manor House is in Ireland.",
    ]);
    expect(links(out).map((l) => l.slug)).toEqual(["villa-senesi", "manor-house"]);
  });

  it("keeps all text, in order", () => {
    const text = "Our European collection includes The Château in Gascony, France.";
    const out = linkVenueMentions([text]);
    const joined = out[0]!.map((s) => ("slug" in s ? s.name : s.text)).join("");
    expect(joined).toBe(text);
    expect(links(out)[0]?.slug).toBe("the-chateau");
  });

  it("prefers the longest name and respects exclusions", () => {
    const out = linkVenueMentions(["Glenalmond Retreats sits near Glenalmond."]);
    expect(links(out)).toEqual([{ slug: "glenalmond", name: "Glenalmond Retreats" }]);
    expect(links(linkVenueMentions(["Visit Glenalmond Retreats."], ["glenalmond"]))).toEqual([]);
  });

  it("is deterministic across repeated calls", () => {
    const input = ["Rachel’s Farm Buchlyvie and Wild River Lodge."];
    expect(linkVenueMentions(input)).toEqual(linkVenueMentions(input));
  });
});
