#!/usr/bin/env python3
"""Export the site's generated JSON CV without parsing free-form Markdown.

Education is maintained in _data/cv.json; publications in _publications.
Usage: python3 scripts/cv_markdown_to_json.py --output local/cv.json
"""
import argparse
import json
from pathlib import Path
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parent.parent

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, default=ROOT / 'local/cv.json')
    args = parser.parse_args()
    output = args.output.resolve()
    if output == (ROOT / '_data/cv.json').resolve():
        parser.error('Export cannot overwrite the structured source _data/cv.json.')
    with tempfile.TemporaryDirectory(prefix='academic-cv-') as directory:
        subprocess.run(['bundle', 'exec', 'jekyll', 'build', '--strict_front_matter', '--destination', directory], cwd=ROOT, check=True)
        data = json.loads((Path(directory) / 'cv.json').read_text())
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    print(f'Exported {len(data["education"])} education entries to {output}')

if __name__ == '__main__':
    main()
