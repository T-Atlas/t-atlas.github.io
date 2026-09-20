#!/usr/bin/env python3
"""CSV/TSV import inspired by Academic Pages; no third-party dependencies.

By default, generated files go to local/generated/<collection> for review.
Existing files are never replaced unless --overwrite is explicitly supplied.
"""
import argparse
import csv
from datetime import date
import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent.parent
ALIASES = {'paper_url': 'paperurl', 'slides_url': 'slidesurl', 'poster_url': 'posterurl',
           'bibtex_url': 'bibtexurl', 'code_url': 'codeurl', 'project_url': 'projecturl', 'talk_url': 'link'}
OPTIONAL = {'venue', 'excerpt', 'citation', 'category', 'lang', 'alternate_url', 'type', 'location',
            'paperurl', 'slidesurl', 'posterurl', 'bibtexurl', 'codeurl', 'projecturl', 'arxivurl',
            'doi', 'publication_date', 'publication_year', 'bibtex_key', 'bibtex_type', 'bibtex_note',
            'citation_venue', 'pages', 'publisher', 'authors', 'link'}

def read_rows(path):
    if path.suffix.lower() not in {'.tsv', '.csv'}:
        raise ValueError('Input must be .csv or .tsv.')
    with path.open(encoding='utf-8-sig', newline='') as handle:
        reader = csv.DictReader(handle, delimiter='\t' if path.suffix.lower() == '.tsv' else ',')
        if not reader.fieldnames or len(set(reader.fieldnames)) != len(reader.fieldnames):
            raise ValueError('Missing or duplicate column headers.')
        rows = []
        for line, row in enumerate(reader, 2):
            if None in row:
                raise ValueError(f'Row {line}: too many cells.')
            if not any(row.values()):
                continue
            rows.append((line, {ALIASES.get(k, k): (v or '').strip() for k, v in row.items()}))
        if not rows:
            raise ValueError('Input contains no data rows.')
        return rows

def render(row, collection):
    title, slug = row.get('title', ''), row.get('url_slug', '')
    stamp = row.get('pub_date' if collection == 'publications' else 'date', '')
    if not title or not slug or not stamp:
        raise ValueError('Required: title, url_slug, and pub_date (publications) or date (talks).')
    if not re.fullmatch(r'[\w-]+', slug, re.UNICODE):
        raise ValueError('url_slug must contain only letters, digits, underscores or hyphens.')
    try:
        if date.fromisoformat(stamp).isoformat() != stamp:
            raise ValueError()
    except ValueError:
        raise ValueError('Date must be a valid YYYY-MM-DD value.') from None
    lang = row.get('lang') or 'en'
    if lang not in {'en', 'zh'}:
        raise ValueError('lang must be en or zh.')
    permalink = row.get('permalink') or f'{"/zh" if lang == "zh" else ""}/{"publication" if collection == "publications" else "talks"}/{stamp}-{slug}'
    if not permalink.startswith('/') or permalink.startswith('//') or '..' in permalink:
        raise ValueError('permalink must be a site-relative path without .. segments.')
    data = {'title': title, 'collection': collection, 'permalink': permalink, 'date': stamp, 'lang': lang}
    for key in sorted(OPTIONAL):
        if row.get(key):
            data[key] = row[key]
    if collection == 'publications':
        data.setdefault('category', 'conferences')
    else:
        data.setdefault('type', 'Talk')
    if 'authors' in data:
        authors = json.loads(data['authors']) if data['authors'].startswith('[') else [x.strip() for x in data['authors'].split(';') if x.strip()]
        if not isinstance(authors, list) or not authors or not all(isinstance(x, str) and x for x in authors):
            raise ValueError('authors must be a JSON string array or semicolon-separated names.')
        data['authors'] = authors
    # JSON scalars/lists are valid YAML: preserve quotes, Chinese and ampersands.
    front = '\n'.join(f'{k}: {json.dumps(v, ensure_ascii=False)}' for k, v in data.items())
    body = row.get('description') or row.get('excerpt', '')
    name = f'{stamp}-{slug}.md'
    if lang == 'zh':
        name = 'zh/' + name
    return name, f'---\n{front}\n---\n\n{body}\n'

def run(collection, argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('input', type=Path)
    parser.add_argument('output_dir', type=Path, nargs='?')
    parser.add_argument('--output-dir', type=Path, dest='output_option')
    parser.add_argument('--overwrite', action='store_true')
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args(argv)
    if args.output_dir and args.output_option:
        parser.error('Specify only one output directory.')
    output = args.output_option or args.output_dir or ROOT / 'local/generated' / collection
    try:
        pending = {}
        for line, row in read_rows(args.input):
            try:
                name, content = render(row, collection)
            except (ValueError, json.JSONDecodeError) as exc:
                raise ValueError(f'Row {line}: {exc}') from exc
            if name in pending:
                raise ValueError(f'Row {line}: duplicate output filename {name}.')
            target = output / name
            if target.exists() and not args.overwrite:
                raise ValueError(f'{target} already exists; review it or use --overwrite.')
            pending[name] = content
        if not args.dry_run:
            output.mkdir(parents=True, exist_ok=True)
            for name, content in pending.items():
                target = output / name
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text(content, encoding='utf-8')
        print(f'{"Would generate" if args.dry_run else "Generated"} {len(pending)} files in {output}')
        return 0
    except (ValueError, OSError) as exc:
        print(f'Error: {exc}', file=sys.stderr)
        return 1
