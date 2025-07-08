"""
This script will create basic empty web files in current folder for convenience.

Which currently includes: index.html, index.css, index.js
"""

from pathlib import Path

current_dir = Path(__file__).parent

html_content = """<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Learn web</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="./index.css">
    <script src="./index.js" defer></script>
  </head>

  <body> 
  </body>

</html>
"""

file_arr = [
    current_dir / "index.html",
    current_dir / "index.css",
    current_dir / "index.js",
]

for p in file_arr:
    if not p.is_file():
        with open(str(p), "w") as f:
            if p.suffix.endswith("html"):
                f.write(html_content)
            else:
                pass
    else:
        print("Skip..")
