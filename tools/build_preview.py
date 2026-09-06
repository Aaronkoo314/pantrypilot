"""
Dev-only helper: bundle the PantryPilot source into a single no-build HTML page.

This exists purely so the app can be opened and clicked through on a machine
that has no Node.js installed. It is NOT part of the shipped app: the real
build is `npm run dev` / `npm run build` with Vite.

It reads the same files under src/, strips the ES module import/export
keywords, concatenates them in dependency order, and lets Babel Standalone
compile the JSX in the browser.

Usage:
    python tools/build_preview.py
    python -m http.server 8000        # then open /preview/index.html
"""

import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
OUT_DIR = ROOT / "preview"

# Dependency order: anything a file references must be concatenated before it.
MODULES = [
    "data/pantryData.js",
    "utils/mealMatching.js",
    "components/IngredientPicker.jsx",
    "components/MealSetup.jsx",
    "components/MealCard.jsx",
    "components/FilterBar.jsx",
    "components/MealRecommendations.jsx",
    "components/MealDetail.jsx",
    "App.jsx",
    "main.jsx",
]

IMPORT_RE = re.compile(r"^import\s[\s\S]*?;[ \t]*$", re.M)


def strip_modules(source: str) -> str:
    source = IMPORT_RE.sub("", source)
    source = re.sub(r"^export default function\b", "function", source, flags=re.M)
    source = re.sub(r"^export function\b", "function", source, flags=re.M)
    source = re.sub(r"^export const\b", "const", source, flags=re.M)
    return source.strip("\n")


def main() -> None:
    prelude = (
        "const { useState, useEffect, useMemo, StrictMode } = React;\n"
        "const { createRoot } = ReactDOM;\n"
    )

    chunks = [prelude]
    for name in MODULES:
        text = (SRC / name).read_text(encoding="utf-8")
        chunks.append(f"/* ===== {name} ===== */\n{strip_modules(text)}")

    bundle = "\n\n".join(chunks)
    css = (SRC / "styles.css").read_text(encoding="utf-8")

    OUT_DIR.mkdir(exist_ok=True)
    (OUT_DIR / "app.css").write_text(css, encoding="utf-8")
    (OUT_DIR / "app.jsx.txt").write_text(bundle, encoding="utf-8")

    html = f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>PantryPilot (no-build preview)</title>
    <link rel="stylesheet" href="./app.css" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.26.4/babel.min.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/babel" data-presets="react" src="./app.jsx.txt"></script>
  </body>
</html>
"""
    (OUT_DIR / "index.html").write_text(html, encoding="utf-8")
    print(f"wrote {OUT_DIR / 'index.html'} ({len(bundle)} chars of JS)")


if __name__ == "__main__":
    main()
