# The Kings Head Inn

A static website with four content pages:

- `food.html`: Food, drinks and the interactive ales section.
- `rooms.html`: Bedrooms, six-photo gallery with full-image viewer, stay details and an email enquiry form.
- `live-sport.html`: Sports and upcoming fixtures.
- `events.html`: Live music, social announcements and private gatherings.

`index.html` leads to Food. The old `reservation.html` and `ales.html` addresses redirect to Rooms and Food's ales section, preserving existing links. They are not additional content pages.

## Preview

Run `python -m http.server 8765 --bind 127.0.0.1`, then visit `http://127.0.0.1:8765/`.

Shared design: `css/site.css`. Shared mobile menu and room enquiry behaviour: `js/site.js`. Navigation and footer are static HTML so links remain available without a framework or build step.

## Photos

Originals remain unchanged in `images/`. The current site uses `images/web/` with responsive WebP exports. `python scripts/prepare-images.py` reproduces them using Pillow. This is conventional resizing, modest exposure/colour correction and mild sharpening: no generative additions, replaced backgrounds, altered people, retouched objects or enlargement. Smaller originals are used in smaller layouts. Lost photographic detail cannot be recovered by these adjustments.

The header, footer and favicon use the owner-supplied `images/KingsHeadOutline.png`. Run `python scripts/prepare-brand-icon.py` to reproduce the transparent, tightly cropped `images/kings-head-mark.png` and 64px `images/favicon.png`; the supplied source remains untouched.

`images/web/manifest.json` records original names, adjustments, dimensions and file sizes for the general photo pipeline.

The six room photographs selected by the owner now use separate AI-assisted enhanced versions in `images/rooms-enhanced/`. The editing brief requests exposure/clarity cleanup and straightened verticals without restaging the rooms. These are retouched derivatives, not pixel-identical restorations: fine textures may differ. Originals are preserved for comparison before publishing. See `images/rooms-enhanced/README.md` for the full prompt and source mapping. Run `python scripts/prepare-room-images.py` to rebuild these responsive WebP exports; `images/web/rooms-manifest.json` records source hashes and output dimensions. The gallery retains the photos' aspect ratios and supports keyboard navigation, Escape, focus return, and direct image links without JavaScript.

The Rooms page's final twilight banner uses the AI-assisted restoration `images/enhanced/KHOutSideNight-enhanced.png`. The original `images/KHOutSideNight.jpg` remains untouched. Its complete editing prompt is recorded in `images/enhanced/README.md`; run `python scripts/prepare-night-banner.py` to reproduce the responsive WebP exports.

Food, Live Sport and Events use the owner-selected `images/KingsHeadOutsideSquare.png` directly as a proportional background. The site does not use the earlier stretched frontage crop or the invisible duplicate images. Rooms retains its twilight banner.

## Content and integrations

- No current food menu or prices were supplied. Food menu actions are accurately labelled enquiries; update them to menu files when available.
- Room enquiries are submitted in place through FormSubmit's AJAX endpoint to `kingsheadinnbookings@gmail.com`; visitors remain on the Rooms page. Failure and timeout states direct visitors to the email address and phone number. The first live submission triggers a one-time activation email which the mailbox owner must confirm before later enquiries are forwarded. No payment is taken and no booking is confirmed until the pub replies.
- Music dates are not fabricated; the page links to the pub's existing announcements.
- TheSportsDB's public free feed supplies a limited list of upcoming events for four competitions. Browser requests have a nine-second timeout and results can be cached for 15 minutes. Partial failures, empty filters, invalid/past events and UK daylight saving time are handled. API events are not automatically confirmed pub screenings. Current free terms may change.
- Ale availability/strength is confirmed at the bar, since coaster artwork and serving formats may differ.

## Browser review

Install the `playwright` development dependency in your preferred environment and its Chromium browser (`npx playwright install chromium`). Then, with the preview server running, run `node scripts/review-site.cjs`. To use an installed Chrome instead, set `CHROME_PATH` to its executable. Screenshots go to `.tmp/site-review/`, or the `REVIEW_OUTPUT` environment variable.

The review covers all pages at desktop and mobile widths, images, menu navigation, ale dialogs, enquiry date validation, partial fixture failures, filtering, UK summer time and legacy redirects.

For the room viewer's additional accessibility, viewport-fit and no-JavaScript checks, install `@axe-core/playwright` alongside Playwright and run `node scripts/review-room-gallery.cjs`.

## Design references

Inspiration supplied by the owner: [The Bryntirion Inn](https://www.palehall.co.uk/dine/the-bryntirion-inn), [The Castle Inn](https://www.exclusive.co.uk/the-castle-inn/packages/), [The Swan](https://swaninnfittleworth.com/), [The Rose](https://therosedeal.com/), [The Bear Inn](https://www.thebearinnhodnet.com/), [The Bell at Charlbury](https://www.thebellatcharlbury.com/), [The Alice Hawthorn](https://www.thealicehawthorn.com/). The new layout uses original copy and project-owned photos, with a paper/olive palette, serif typography, photography-led sections and simple navigation.

## Production handoff

See [LAUNCH.md](LAUNCH.md) for the release checks, integration limits and deployment instructions.

Run `node scripts/package-site.cjs` to create a new timestamped directory under `dist/` containing only the four pages, legacy entry points, SEO files and referenced assets. Upload its contents to the web root. This excludes source scripts, original unused photographs, test screenshots, and development files.

The canonical production origin is `https://thekingsheadinn.pub`. Each page has a unique local title and description, an absolute canonical URL, Open Graph/Twitter metadata, and static JSON-LD for the inn and page. `robots.txt` points to `sitemap.xml`, which includes only the four content pages. No unsupported ratings, prices or dated event claims have been added.

Run `node scripts/review-production.cjs` for the additional release audit. It tests accessibility across five widths, links and anchors, metadata and schema, navigation without JavaScript, banner control visibility, and six mocked form success/failure responses. It never sends a real booking enquiry.
