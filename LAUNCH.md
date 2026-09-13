# Production review — 13 September 2026

The local site has completed its final copy, functionality, accessibility and SEO pass. It has not been uploaded to the live domain.

## What was corrected

- Clear, consistent British English, locally relevant page titles/descriptions, and menu links explicitly labelled as requests.
- Booking success requires an explicit successful response from FormSubmit. Rejected, malformed, empty, offline and timed-out responses show the on-page email/phone fallback and retain the visitor's entered details. Repeated submission while sending is blocked.
- File-based previews show the contact fallback instead of trying to submit a booking. Use the local web server to preview integrations.
- A booking enquiry does not reserve a room; this is explained beside the form and in its confirmation message.
- A short privacy and enquiries section explains the form's data flow and gives a contact for information requests.
- Mobile navigation remains available if JavaScript is unavailable. Menu links close the expanded navigation.
- Windows-style image URLs were normalised for hosting. Invisible obsolete exterior photos no longer download. The original selected exterior retains its proportions, and banner controls remain accessible on small screens.
- Per-page canonical URLs, social sharing metadata, local-business and page JSON-LD, robots.txt and a four-page sitemap.

## Checks completed

- Existing four-page functional review at 1440, 390 and 320 pixels: images, menus, all ten ale dialogs, six room gallery images, keyboard/focus return, date validation, sports filtering, partial feed failure, UK summer time and legacy redirects.
- Room gallery audit: accessible controls, viewport fit, keyboard navigation and working direct photo links without JavaScript.
- Release audit at 1850, 1000, 700, 390 and 320 pixels: no horizontal overflow, no clipped banner controls and no automated WCAG A/AA violations.
- Local links and fragment targets return usable content. Each page has a local title, canonical URL, social metadata and valid JSON-LD.
- Six intercepted booking responses: success, rejection, missing success flag, HTML instead of JSON, network error and timeout. The browser stays on Rooms and failures preserve inputs. No real enquiry email was sent.
- Browser checks of the live sports service returned fixtures for all four configured competitions at review time. This is a limited third-party fixture guide, not a confirmed pub screening schedule.

Automated accessibility checks do not replace testing with actual assistive technology. Search rankings and email delivery cannot be established by local browser tests.

## Upload

1. Run `node scripts/package-site.cjs`. It prints a new directory under `dist/` containing only the 64 files needed by this release (the count can change as the site changes).
2. Back up the existing host files, then upload the **contents** of that directory to the public web root. Serve with HTTPS at `https://thekingsheadinn.pub`; this is the configured canonical origin.
3. Open each page on the live domain. Check CSS/JavaScript/image responses and confirm the live server serves HTML, JavaScript, CSS and WebP with their correct content types. Refresh caches after replacing the old site.
4. Submit a real enquiry from the hosted Rooms page using an address you control. If FormSubmit sends an activation email to `kingsheadinnbookings@gmail.com`, confirm it, submit again, and check receipt plus reply-to behaviour. This mailbox check remains outstanding.
5. Visit `/robots.txt` and `/sitemap.xml`, run the live URLs through Google's Rich Results Test, and submit the sitemap in Search Console. Confirm the domain redirects consistently to HTTPS/non-www. Host-level permanent redirects from the old URLs are preferred if your hosting supports them; the included immediate HTML redirects remain as fallbacks.

Do not upload the whole development folder. The generated directory excludes scripts, review screenshots, unused images, development dependencies and Git files.

## Content still supplied by the pub

No current food/drinks menu PDFs, price list or confirmed music dates are in the project. The site therefore offers menu enquiries and links to the pub's event announcements. Replace those links with the approved current menus or dated listings when available.

Contact details, opening hours and the 17th-century coaching-inn description match the current live website. Check-out at 11am is retained from the original Rooms/reservation content. The pub should keep those operational details current.

## Reference checks

- [Current Kings Head Inn website](https://thekingsheadinn.pub/) — contact details, opening hours, history and function space.
- [FormSubmit setup](https://formsubmit.co/) and [AJAX documentation](https://formsubmit.co/ajax-documentation) — in-page sending and initial mailbox confirmation.
- [TheSportsDB documentation](https://www.thesportsdb.com/documentation) — public key 123 and limited free fixtures.
- [Google's local-business structured data guidance](https://developers.google.com/search/docs/appearance/structured-data/local-business) — business identity and opening-hours metadata, validation and sitemap submission.
