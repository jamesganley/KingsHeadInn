# Room photo enhancement

Six selected original photographs were edited individually with the built-in image editing tool. Originals in images/ are untouched. These are AI-assisted retouched derivatives, not pixel-identical or archival restorations; fine textures may differ. Review against the originals before publishing.

## Prompt used for each photograph

Use case: lighting-weather (faithful photographic restoration).
Asset type: real inn bedroom photograph for the existing Rooms website.
Input image 1 is the EDIT TARGET, not inspiration. Make a professionally corrected version of THIS EXACT PHOTOGRAPH. Improve natural exposure and white balance, recover restrained shadow detail, reduce JPEG artifacts, and gently improve clarity. Correct camera roll and converging architectural verticals so the photo is level and upright, preserving real room proportions and original viewpoint. Keep the original aspect ratio and composition as closely as correction allows. No restaging or redesign. Preserve every existing piece of furniture, the exact wallpaper and textile patterns, bed and pillows, towels, lamps, switches, hangers, reflections and all architectural features. Do not add, remove, replace, move or invent ANY object. Do not invent intricate detail not supported by the source. Retain natural warmth of the lamps and real textures: no dramatic relighting, HDR, waxy smoothing, artificial bokeh, text, border or watermark. Output only one enhanced photo, not before/after.

Each prompt also identified the source filename and preserved its landscape/portrait orientation.

## Files

- KH1Bedroom.jpg → images/rooms-enhanced/KH1Bedroom-enhanced.png
- KH2Bedroom.jpg → images/rooms-enhanced/KH2Bedroom-enhanced.png
- KH3Bedroom.jpg → images/rooms-enhanced/KH3Bedroom-enhanced.png
- KH4Bedroom.jpg → images/rooms-enhanced/KH4Bedroom-enhanced.png
- KH6Bedroom.jpg → images/rooms-enhanced/KH6Bedroom-enhanced.png
- KH7Bedroom.jpg → images/rooms-enhanced/KH7Bedroom-enhanced.png

Run python scripts/prepare-room-images.py to rebuild the responsive WebP exports in images/web. This export step only resizes and compresses; it does not further alter the photographs.

