# Enhanced website imagery

## Wide pub entrance

`KingsHeadEntrance-wide-v2.png` is the landscape, pulled-back version used in the shallow closing banners on Food, Live Sport and Events. It preserves the complete fascia name, both windows, the doorway, lanterns and flower baskets in a more natural architectural composition. It was created with the built-in image editing tool from the reviewed square exterior reconstruction.

### Editing prompt

Use case: precise-object-edit
Asset type: ultra-wide, shallow website footer banner photograph
Primary request: Recompose the same pub exterior as a genuinely wide professional architectural photograph taken from farther back. Keep the complete gold-lettered fascia, both windows, centered doorway, lanterns, restrained flower baskets, upper storey and pavement visible and proportionate. Preserve the exact text "THE KINGS HEAD INN" and keep it unobscured. Use a straight-on, level, natural premium hospitality-photography finish. Avoid close cropping, stretched architecture, extra branding, people, vehicles, neighbouring signage, map controls and invented objects.

## Square pub entrance

`KingsHeadEntrance-square.png` is an AI-assisted exterior reconstruction based on the owner-supplied Street View references of The Kings Head Inn. It removes the map interface and street clutter, corrects the perspective, centres the entrance design and arranges flower baskets around the unobstructed fascia name. Because this is a reconstructed marketing image rather than documentary photography, architectural and decorative fine details should be reviewed before publication.

### Editing prompt

Use case: precise-object-edit
Asset type: square exterior photograph for a premium pub website call-to-action section
Input images: Image 1 and Image 2 are architectural references of the exact Kings Head Inn exterior at 40 High Street, Billingshurst. Image 3 is only a website layout reference showing where the finished photo will be placed—do not reproduce any webpage, browser UI or text from it. Image 4 is a framing reference for the ground-floor doorway area.
Primary request: create a professional, photorealistic, clean square-on exterior photograph of THIS exact pub, centred around the two dark entrance doors and their flanking windows. Correct perspective so the storefront fascia, door posts and windows are level and vertical. Use attractive natural overcast-to-soft-daylight hospitality photography with realistic texture and restrained colour.
Composition/framing: square 1:1 image. Face the entrance directly, symmetrically and at eye level. Include the dark-painted ground-floor frontage, both entrance doors, both flanking windows, the complete fascia above them, and a modest amount of white upper wall for context. Crop out neighbouring businesses. Keep enough pavement at the bottom to ground the building.
Text (verbatim): "THE KINGS HEAD INN" across the fascia, fully visible, correctly spelled, in tasteful gold serif lettering.
Flowers: keep tasteful real hanging flower baskets around the entrance and windows, with pink, white and purple blooms. Reposition/reduce only the central basket so NO flowers, leaves, hooks or objects cover any letter of "THE KINGS HEAD INN". Frame the sign and doorway with flowers rather than covering them.
Constraints: preserve the actual pub's white upper façade, charcoal lower frontage, entrance layout, paired doors, window positions, lanterns, fascia proportions and historic character. No people. Remove Google Maps interface, map pins, Street View labels, navigation controls, watermarks, cars, bollards and distracting street clutter. Do not invent an extra storey, balcony, awning, tables, signage or branding. The façade must remain recognisably this exact building.
Avoid: illustration, painting, architectural render, oversaturated flowers, excessive symmetry that changes the building, fake luxury styling, night scene, dramatic sunset, text errors, hidden sign, logos other than the pub's own name, watermark or border.

The original square version remains available for other layouts. Run `python scripts/prepare-exterior-cta.py` to rebuild the responsive WebP website exports from the wide version.

## Twilight courtyard

`KHOutSideNight-enhanced.png` is an AI-assisted restoration of the owner-supplied `images/KHOutSideNight.jpg`, created with the built-in image editing tool. The original remains untouched. Review fine details against the source before publishing.

## Editing prompt

Use case: lighting-weather
Asset type: wide website banner source for the Rooms page of the same inn
Input images: Image 1 is the EDIT TARGET. Restore and upscale this exact photograph; it is not a loose reference.
Primary request: bring this low-resolution evening courtyard photograph to a professional hospitality-photography standard. Reduce JPEG blocking, colour banding, excessive saturation, blown bulb streaks and digital noise. Restore believable twilight colour, controlled warm string-light glow, natural foliage tones, clean edges and restrained clarity. Correct only minor camera roll if needed.
Composition/framing: preserve the original scene and viewpoint. Retain useful sky and the full run of hanging lights so it can be responsively cropped into a wide horizontal website banner.
Constraints: preserve the exact courtyard structure, roofline, vines and plants, every existing light and cable, and every existing person and silhouette in their original locations. Do not add, remove, replace, move or redesign any object or person. Do not alter identities. Do not invent tables, furniture, buildings, signs, extra foliage, lights, people, text or logos. Do not change the time of day. Keep natural photographic texture and plausible light.
Avoid: HDR look, neon-blue sky, magenta cast, starburst flares, halos, artificial bokeh, plastic foliage, painterly detail, watermark, border, before-and-after layout.

Run `python scripts/prepare-night-banner.py` to rebuild the responsive WebP website exports.
