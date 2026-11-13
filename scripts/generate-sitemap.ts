// Regenerates public/sitemap.xml from the site's own data.
// Run after adding or changing venues, retreats or guides:
//   npm run sitemap
// (Node 22.6+ runs this TypeScript file directly.)
import { writeFileSync } from "node:fs";
import { SITE_URL, publicRetreats, venues } from "../src/data/site.ts";
import { guides } from "../src/data/guides.ts";

const staticPaths = [
  "/",
  "/venues",
  "/host",
  "/retreats",
  "/how-we-help",
  "/guides",
  "/discover-scotland",
  "/plan",
  "/list-your-retreat",
];

const paths = [
  ...staticPaths,
  ...venues.map((v) => `/venues/${v.slug}`),
  // Completed retreats keep their URLs (archived, not removed).
  ...publicRetreats.map((r) => `/retreats/${r.slug}`),
  ...guides.map((g) => `/guides/${g.slug}`),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`).join("\n")}
</urlset>
`;

writeFileSync(new URL("../public/sitemap.xml", import.meta.url), xml);
console.log(`Wrote ${paths.length} URLs to public/sitemap.xml`);
