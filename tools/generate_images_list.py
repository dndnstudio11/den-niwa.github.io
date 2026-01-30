#!/usr/bin/env python3
"""
Generate images/list.json locally, matching the GitHub Action logic.
This does not affect CI unless you commit the output.
"""
import os
import json
import re

# Root directory containing images
ROOT = os.path.join(os.path.dirname(__file__), "..", "images")

# Allowed image extensions
EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}


def alphanum_key(s: str):
    """Split string into alpha and numeric chunks to sort naturally."""
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", s)]


def main():
    files = []
    for name in os.listdir(ROOT):
        _, ext = os.path.splitext(name)
        if ext.lower() in EXTS:
            files.append(name)

    files.sort(key=alphanum_key)

    out_path = os.path.join(ROOT, "list.json")
    with open(out_path, "w") as f:
        json.dump(files, f)

    print(f"Wrote {out_path} ({len(files)} items)")


if __name__ == "__main__":
    main()
