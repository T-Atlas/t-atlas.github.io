"""Regression cases for validation after adding or changing real source records."""
import html
import json
from pathlib import Path
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]

class ValidationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.source = Path(self.temp.name) / 'source'
        self.output = Path(self.temp.name) / 'output'
        for directory in [self.source/'_data',self.source/'_publications',self.output/'publication',self.output/'files/bibtex']:
            directory.mkdir(parents=True)
        (self.source/'_config.yml').write_text(json.dumps({'author':{'name':'Fixture Author'},'collections':{'publications':{'output':True}}}))
        education = [{'institution':f'Fixture institution {i}'} for i in range(4)]
        (self.source/'_data/cv.json').write_text(json.dumps({'education':education}))
        publications = []
        for i in range(6):
            data = {'title':f'Fixture paper {i}','authors':['Fixture Author'],'publication_date':'2026/09/21',
                    'permalink':f'/publication/paper-{i}','bibtex_key':f'paper{i}','bibtex_type':'misc','bibtexurl':f'/files/bibtex/paper{i}.bib'}
            (self.source/f'_publications/paper-{i}.md').write_text('---\n'+json.dumps(data)+'\n---\n')
            text = f'<html><head><link rel="canonical" href="https://example.test{data["permalink"]}"><meta name="description" content="Fixture">'
            for key,value in [('citation_title',data['title']),('citation_author','Fixture Author'),('citation_publication_date',data['publication_date'])]:
                text += f'<meta name="{key}" content="{html.escape(value)}">'
            text += '</head><body><div class="publication-resources"><a href="'+data['bibtexurl']+'">BibTeX</a></div></body></html>'
            (self.output/f'publication/paper-{i}.html').write_text(text)
            (self.output/f'files/bibtex/paper{i}.bib').write_text(f'@misc{{paper{i},\n  author = {{Fixture Author}}\n}}')
            publications.append({'name':data['title'],'releaseDate':'2026-09-21','authors':data['authors']})
        (self.output/'cv.json').write_text(json.dumps({'basics':{'name':'Fixture Author'},'education':education,'publications':publications}))

    def run_validation(self):
        return subprocess.run(['bundle','exec','ruby','scripts/validate_site.rb',str(self.output),str(self.source)],cwd=ROOT,text=True,capture_output=True)

    def test_changed_counts_and_identity_pass(self):
        result = self.run_validation()
        self.assertEqual(result.returncode,0,result.stderr)
        self.assertIn('6 publications, 4 education entries',result.stdout)

    def test_unicode_permalink_is_supported(self):
        source = self.source/'_publications/paper-5.md'
        source.write_text(source.read_text().replace('/publication/paper-5', '/publication/测试-paper-5'))
        output = self.output/'publication/paper-5.html'
        content = output.read_text().replace('/publication/paper-5', '/publication/测试-paper-5')
        output.unlink()
        (self.output/'publication/测试-paper-5.html').write_text(content)
        result = self.run_validation()
        self.assertEqual(result.returncode,0,result.stderr)

    def test_missing_bibtex_is_detected(self):
        (self.output/'files/bibtex/paper5.bib').unlink()
        result = self.run_validation()
        self.assertNotEqual(result.returncode,0)
        self.assertIn('paper5.bib',result.stderr)

    def test_missing_metadata_does_not_silently_skip_paper(self):
        path = self.output/'publication/paper-5.html'
        path.write_text(path.read_text().replace('name="citation_title"','name="missing_title"'))
        result = self.run_validation()
        self.assertNotEqual(result.returncode,0)
        self.assertIn('citation_title',result.stderr)

    def test_cv_must_match_records_not_only_count(self):
        path = self.output/'cv.json';data = json.loads(path.read_text())
        data['publications'][0]['name'] = 'Wrong paper'
        path.write_text(json.dumps(data))
        result = self.run_validation()
        self.assertNotEqual(result.returncode,0)
        self.assertIn('CV publications differ',result.stderr)

if __name__ == '__main__': unittest.main()
