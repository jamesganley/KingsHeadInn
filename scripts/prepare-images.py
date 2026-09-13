"""Conservative photo preparation: no generation, object edits or enlargement.

Original files are retained. Run: python scripts/prepare-images.py
"""
from pathlib import Path
import json
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'images' / 'web'
OUT.mkdir(exist_ok=True)
PHOTOS = {
    'bar': ('FullBarWithPerson.png', 1.0, 1.0),
    'garden': ('outsideLongView.png', 1.0, 1.0),
    'bedroom': ('KH1BedroomJ.jpg', 1.07, 1.02),
    'room-detail': ('KH2Bedroom.jpg', 1.06, 1.02),
    'food-fish': ('KHFood_3.jpg', 1.02, .96),
    'food-burger': ('KHFood_2.jpg', 1.0, .93),
    'food-cookies': ('KHFood_1.jpg', 1.02, .96),
    'music': ('events-live-music.png', 1.03, 1.0),
    'event-room': ('BandNightFullRoom.png', 1.0, 1.0),
    'sport': ('events-live-sport.png', 1.0, 1.0),
    'coasters': ('ales-coasters.png', 1.0, 1.0),
    'food-wall': ('food-drink-hero-clean.png', 1.0, 1.0),
    'exterior': ('KHFrontBig.jpg', 1.02, 1.0),
}
report = []
for name, (filename, brightness, colour) in PHOTOS.items():
    source = ROOT / 'images' / filename
    with Image.open(source) as opened:
        original = ImageOps.exif_transpose(opened).convert('RGB')
        corrected = ImageEnhance.Brightness(original).enhance(brightness)
        corrected = ImageEnhance.Color(corrected).enhance(colour)
        sizes = sorted(set([min(640, original.width), min(1200, original.width), min(1920, original.width)]))
        files = []
        for width in sizes:
            height = round(original.height * width / original.width)
            image = corrected.resize((width, height), Image.Resampling.LANCZOS)
            image = image.filter(ImageFilter.UnsharpMask(radius=.65, percent=45, threshold=4))
            destination = OUT / f'{name}-{width}.webp'
            image.save(destination, 'WEBP', quality=88, method=6)
            files.append({'file': str(destination.relative_to(ROOT)), 'width': width, 'height': height, 'bytes': destination.stat().st_size})
        report.append({'name': name, 'source': filename, 'original_bytes': source.stat().st_size, 'brightness': brightness, 'colour': colour, 'outputs': files})
(OUT / 'manifest.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(f'Prepared {len(report)} photos; all originals retained.')
print(f'Largest exports: {sum(r["outputs"][-1]["bytes"] for r in report):,} bytes; originals: {sum(r["original_bytes"] for r in report):,} bytes')
