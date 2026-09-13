"""Export reviewed, enhanced room photos. Original JPEGs are never modified."""
from pathlib import Path
import hashlib
import json
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'images' / 'web'
OUT.mkdir(exist_ok=True)
report = []
for number in (1, 2, 3, 4, 6, 7):
    original = ROOT / 'images' / f'KH{number}Bedroom.jpg'
    source = ROOT / 'images' / 'rooms-enhanced' / f'KH{number}Bedroom-enhanced.png'
    outputs = []
    with Image.open(source) as image:
        image = image.convert('RGB')
        for width in sorted({min(480, image.width), min(960, image.width), image.width}):
            height = round(image.height * width / image.width)
            export = image.resize((width, height), Image.Resampling.LANCZOS)
            destination = OUT / f'room-{number}-{width}.webp'
            export.save(destination, 'WEBP', quality=90, method=6)
            outputs.append(dict(file=destination.relative_to(ROOT).as_posix(), width=width, height=height, bytes=destination.stat().st_size))
    report.append(dict(number=number, original=original.relative_to(ROOT).as_posix(), original_sha256=hashlib.sha256(original.read_bytes()).hexdigest(), source=source.relative_to(ROOT).as_posix(), outputs=outputs))
(OUT / 'rooms-manifest.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps(report, indent=2))
