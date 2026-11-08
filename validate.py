import pathlib, re, json, xml.etree.ElementTree as ET
from html.parser import HTMLParser
root = pathlib.Path(__file__).parent / 'site'
class Parser(HTMLParser):
    def __init__(self): super().__init__(); self.links=[]; self.ids=set(); self.title=False; self.lang=False
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if 'id' in a: self.ids.add(a['id'])
        if tag=='html': self.lang=a.get('lang')=='en'
        if tag=='a' and 'href' in a: self.links.append(a['href'])
        if tag=='title': self.title=True
parsers={}
for file in root.glob('*.html'):
    text=file.read_text(encoding='utf-8'); p=Parser(); p.feed(text); parsers[file.name]=p
    assert p.title and p.lang, file
    assert '<style>:root' in text, 'Preview must include styles: ' + str(file)
    assert 'src="assets/app.js"' not in text, 'Preview must not depend on external local scripts'
    assert 'id="fixbook-config"' in text, file
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>',text): json.loads(block)
for name,p in parsers.items():
    for link in p.links:
        if re.match(r'^(https?:|mailto:)',link): continue
        target,_,anchor=link.partition('#'); target=target or name
        assert (root/target).exists(), (name,link)
        if anchor and target in parsers: assert anchor in parsers[target].ids,(name,link)
for file in ['feed.xml','sitemap.xml']: ET.parse(root/file)
config=json.loads((root/'assets/config.json').read_text())
assert config['repo']=='sumlif/fixbook'
whatsapp=(root/'whatsapp-desktop-wrong-spellcheck-language.html').read_text(encoding='utf-8')
assert 'reg delete' in whatsapp and 'Not tested here' in whatsapp and 'WhatsApp.Root.exe' in whatsapp
assert len(list(root.glob('*.html')))==6
print('PASS: six English pages, internal links, anchors, structured data, XML, rollback and configuration.')
