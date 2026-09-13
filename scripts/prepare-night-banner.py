"""Export responsive WebP versions of the reviewed evening courtyard edit."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'images' / 'enhanced' / 'KHOutSideNight-enhanced.png'
OUT = ROOT / 'images' / 'web'
OUT.mkdir(exist_ok=True)

with Image.open(SOURCE) as opened:
    image = opened.convert('RGB')
    for width in sorted({min(640, image.width), min(1200, image.width), image.width}):
        height = round(image.height * width / image.width)
        export = image.resize((width, height), Image.Resampling.LANCZOS)
        destination = OUT / f'night-garden-{width}.webp'
        export.save(destination, 'WEBP', quality=90, method=6)
        print(destination.relative_to(ROOT).as_posix(), width, height, destination.stat().st_size)

