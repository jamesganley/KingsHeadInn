"""Create the fixed frontage banner from the owner-supplied square exterior."""
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "images" / "KingsHeadOutsideSquare.png"
DESTINATION = ROOT / "images" / "web" / "kings-head-frontage-fixed.webp"

with Image.open(SOURCE) as opened:
    image = opened.convert("RGB")
    # Keep the complete charcoal frontage: fascia, windows, flowers and doorway.
    frontage = image.crop((270, 625, 1175, 1078))
    frontage = frontage.resize((1810, 906), Image.Resampling.LANCZOS)
    DESTINATION.parent.mkdir(exist_ok=True)
    frontage.save(DESTINATION, "WEBP", quality=92, method=6)
    print(DESTINATION.relative_to(ROOT).as_posix(), frontage.size)
