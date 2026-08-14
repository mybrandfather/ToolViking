from pathlib import Path
from html.parser import HTMLParser
import json, zipfile

root = Path(__file__).resolve().parents[1]
data = json.loads((root / "data/catalog.json").read_text(encoding="utf-8"))
errors = []

class Links(HTMLParser):
    def __init__(self): super().__init__(); self.links=[]
    def handle_starttag(self, tag, attrs):
        if tag in ("a", "link", "script"):
            attrs=dict(attrs); value=attrs.get("href") or attrs.get("src")
            if value: self.links.append(value)

for page in root.rglob("*.html"):
    parser=Links(); parser.feed(page.read_text(encoding="utf-8"))
    for link in parser.links:
        if not link.startswith("/") or link.startswith("//"): continue
        clean=link.split("#")[0].split("?")[0]
        target=root/clean.lstrip("/")
        if clean.endswith("/"): target/= "index.html"
        if not target.exists(): errors.append(f"broken: {page.relative_to(root)} -> {clean}")

expected=(58,25,6)
actual=(len(data["tools"]),len(data["skills"]),len(data["dashboards"]))
if actual != expected: errors.append(f"catalog counts {actual}, expected {expected}")

for tool in data["tools"]:
    if not (root/"tools"/tool["slug"]/"index.html").exists(): errors.append(f"missing tool {tool['slug']}")
for skill in data["skills"]:
    archive=root/"downloads"/"skills"/f"{skill['slug']}.zip"
    if not archive.exists(): errors.append(f"missing skill archive {skill['slug']}")
    else:
        with zipfile.ZipFile(archive) as z:
            if f"{skill['slug']}/SKILL.md" not in z.namelist(): errors.append(f"bad skill archive {skill['slug']}")

for required in ("robots.txt","sitemap.xml","privacy/index.html","terms/index.html","disclaimer/index.html","contact/index.html","downloads/saas-admin-free-starter.zip"):
    if not (root/required).exists(): errors.append(f"missing {required}")

print(json.dumps({"status":"PASS" if not errors else "FAIL","catalog":actual,"html_pages":len(list(root.rglob('*.html'))),"errors":errors},indent=2))
raise SystemExit(bool(errors))
