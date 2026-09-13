"""Create transparent, tightly cropped brand and favicon assets.

The supplied KingsHeadOutline.png remains unchanged. Its near-white background is
removed using colour separation from the gold artwork, then the mark is exported
at web-friendly sizes without inventing or redrawing any detail.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "images" / "KingsHeadOutline.png"

with Image.open(SOURCE) as opened:
    source = opened.convert("RGB")

rgba = Image.new("RGBA", source.size)
source_pixels = source.load()
output_pixels = rgba.load()

for y in range(source.height):
    for x in range(source.width):
        red, green, blue = source_pixels[x, y]
        # The artwork is warm gold; the supplied background is almost neutral.
        # A soft chroma mask retains anti-aliased gold edges without a white box.
        red_blue = red - blue
        red_green = red - green
        if red_blue <= 12 or red_green <= 3:
            alpha = 0
        else:
            alpha = max(0, min(255, round(min((red_blue - 12) * 6, (red_green - 3) * 18))))
        output_pixels[x, y] = (red, green, blue, alpha)

alpha_box = rgba.getchannel("A").getbbox()
if not alpha_box:
    raise RuntimeError("No gold artwork detected in KingsHeadOutline.png")

left, top, right, bottom = alpha_box
padding = round(max(right - left, bottom - top) * 0.045)
left = max(0, left - padding)
top = max(0, top - padding)
right = min(rgba.width, right + padding)
bottom = min(rgba.height, bottom + padding)
mark = rgba.crop((left, top, right, bottom))

brand_width = 320
brand_height = round(mark.height * brand_width / mark.width)
brand = mark.resize((brand_width, brand_height), Image.Resampling.LANCZOS)
brand.save(ROOT / "images" / "kings-head-mark.png", optimize=True)

# Centre the complete portrait in a square canvas so browsers do not crop it.
favicon = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
fit_height = 58
fit_width = round(mark.width * fit_height / mark.height)
small = mark.resize((fit_width, fit_height), Image.Resampling.LANCZOS)
favicon.alpha_composite(small, ((64 - fit_width) // 2, (64 - fit_height) // 2))
favicon.save(ROOT / "images" / "favicon.png", optimize=True)

print(f"Created kings-head-mark.png ({brand.width}x{brand.height}) and favicon.png (64x64)")
