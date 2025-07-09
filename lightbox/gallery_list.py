"""
Write image path into json file
"""

from pathlib import Path
import json

py_dir = Path(__file__).absolute().parent

image_folder = py_dir / "static"
json_file = py_dir / "gallery_list.json"

arr = []
for img in image_folder.rglob("*.webp"):
    img_path = "./static/"+ str(img.name)
    arr.append(str(img_path))

with open(str(json_file), 'w', encoding="utf-8") as f:
    json.dump(arr, f, indent=2)