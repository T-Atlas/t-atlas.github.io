import csv
import importlib.util
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('generator', ROOT / 'markdown_generator/generate.py')
generator = importlib.util.module_from_spec(spec)
spec.loader.exec_module(generator)

class GeneratorTests(unittest.TestCase):
    def test_bilingual_fields_and_quoting_survive(self):
        row = {'title': '中文 "引用": A & B', 'url_slug': 'example', 'pub_date': '2026-09-20', 'lang': 'zh',
               'alternate_url': '/publication/example', 'posterurl': '/files/poster.pdf', 'authors': 'One Author; Two Author', 'doi': '10.1234/example'}
        name, text = generator.render(row, 'publications')
        self.assertEqual(name, 'zh/2026-09-20-example.md')
        self.assertIn('posterurl: "/files/poster.pdf"', text)
        self.assertIn('authors: ["One Author", "Two Author"]', text)
        self.assertIn('/zh/publication/', text)
        self.assertIn('\\"引用\\"', text)

    def test_invalid_rows_do_not_write_partial_output(self):
        with tempfile.TemporaryDirectory() as temp:
            temp = Path(temp); source = temp/'papers.csv'; output = temp/'out'
            source.write_text('title,url_slug,pub_date\nGood,good,2026-09-20\nBad,bad,2026-02-31\n')
            self.assertEqual(generator.run('publications', [str(source), str(output)]), 1)
            self.assertFalse(output.exists())

    def test_csv_tsv_legacy_and_no_overwrite(self):
        for kind, filename in [('publications','publications.tsv'),('talks','talks.tsv')]:
            with tempfile.TemporaryDirectory() as temp:
                temp = Path(temp); old = ROOT/'markdown_generator'/filename
                with old.open() as handle:
                    rows = list(csv.reader(handle, delimiter='\t'))
                converted = temp/'data.csv'
                with converted.open('w', newline='') as handle: csv.writer(handle).writerows(rows)
                for source, folder in [(old,temp/'tsv'),(converted,temp/'csv')]:
                    self.assertEqual(generator.run(kind,[str(source),str(folder)]),0)
                self.assertEqual({p.name:p.read_text() for p in (temp/'tsv').glob('*.md')}, {p.name:p.read_text() for p in (temp/'csv').glob('*.md')})
                generated = next((temp/'csv').glob('*.md')); before = generated.read_bytes()
                self.assertEqual(generator.run(kind,[str(converted),str(temp/'csv')]),1)
                self.assertEqual(before,generated.read_bytes())

    def test_path_traversal_and_bad_language_are_rejected(self):
        base = {'title':'Test','url_slug':'../escape','date':'2026-01-01'}
        with self.assertRaises(ValueError): generator.render(base,'talks')
        base.update(url_slug='valid',lang='invalid')
        with self.assertRaises(ValueError): generator.render(base,'talks')

if __name__ == '__main__': unittest.main()
