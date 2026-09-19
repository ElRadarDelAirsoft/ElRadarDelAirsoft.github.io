"""Lista los carteles activos del banner del home, numerados en el mismo orden
del carrusel (fecha del evento, luego nombre de archivo), con miniatura.

Uso: python scripts/quitarbanner-list.py [salida.html]

Imprime una lista de texto en stdout y escribe un HTML autocontenido (miniaturas
embebidas) para mostrarlo en el panel. Lo usa el comando /quitarbanner.
"""
import base64
import html
import io
import os
import re
import sys
import tempfile

from PIL import Image

sys.stdout.reconfigure(encoding="utf-8")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANNER_DIR = os.path.join(ROOT, "src", "assets", "banner")
RAW_DIR = os.path.join(ROOT, "public", "images", "Banner")
DATES_JS = os.path.join(ROOT, "src", "data", "bannerEventDates.js")
LABELS_JS = os.path.join(ROOT, "src", "data", "bannerLinkLabels.js")


def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def parse_dates():
    out = {}
    for line in read(DATES_JS).splitlines():
        m = re.match(r"\s*'([^']+)':\s*'(\d{4}-\d{2}-\d{2})',?\s*(?://\s*(.*))?$", line)
        if m:
            out[m.group(1)] = (m.group(2), (m.group(3) or "").strip())
    return out


def parse_labels():
    out = {}
    if os.path.exists(LABELS_JS):
        for line in read(LABELS_JS).splitlines():
            m = re.match(r"\s*'([^']+)':\s*'([^']+)',?\s*$", line)
            if m:
                out[m.group(1)] = m.group(2)
    return out


def b64url_decode(s):
    return base64.urlsafe_b64decode(s + "=" * (-len(s) % 4)).decode("utf-8")


def link_info(contacto):
    if re.fullmatch(r"[A-Za-z0-9_-]+", contacto):
        try:
            url = b64url_decode(contacto)
            if re.match(r"https?://", url, re.I):
                return "url", url
        except Exception:
            pass
    digits = re.sub(r"\D", "", contacto)
    return "whatsapp", f"https://wa.me/{digits}"


def find_raw(contacto, kind, href, raw_files):
    """Archivo crudo que corresponde a este cartel (o None)."""
    stems = {f: os.path.splitext(f)[0] for f in raw_files}
    if kind == "whatsapp":
        digits = re.sub(r"\D", "", contacto)
        for f, stem in stems.items():
            if re.fullmatch(r"[+\d ]+", stem) and digits.endswith(re.sub(r"\D", "", stem)):
                return f
        return None
    base, _, frag = href.partition("#")
    mangled = re.sub(r'[:/?*"<>|]', "", base)
    prefix = None
    m = re.fullmatch(r"(\d+)-set", frag)
    if m:
        prefix = f"{m.group(1)} set "
    candidates = []
    for f, stem in stems.items():
        s = re.sub(r"^\d+ set ", "", stem)
        if s == mangled and prefix is None and stem == s:
            return f
        if s.startswith(mangled) and (prefix is None or stem.startswith(prefix)):
            candidates.append(f)
    return candidates[0] if candidates else None


def thumb_data_uri(path):
    im = Image.open(path).convert("RGB")
    im.thumbnail((260, 360))
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=72)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()


def main():
    out_html = sys.argv[1] if len(sys.argv) > 1 else os.path.join(tempfile.gettempdir(), "quitarbanner.html")
    dates, labels = parse_dates(), parse_labels()
    raw_files = os.listdir(RAW_DIR) if os.path.isdir(RAW_DIR) else []

    items = []
    for fname in sorted(os.listdir(BANNER_DIR)):
        if not fname.lower().endswith((".webp", ".jpg", ".jpeg", ".png")):
            continue
        contacto = os.path.splitext(fname)[0]
        kind, href = link_info(contacto)
        date, desc = dates.get(contacto, ("9999-99-99", ""))
        label = labels.get(contacto) or ("Inscribirse" if kind == "url" else contacto)
        items.append({
            "file": fname, "contacto": contacto, "kind": kind, "href": href,
            "date": date, "desc": desc or "(sin descripción)", "label": label,
            "raw": find_raw(contacto, kind, href, raw_files),
            "thumb": thumb_data_uri(os.path.join(BANNER_DIR, fname)),
        })
    items.sort(key=lambda it: it["date"])  # estable: empates por nombre de archivo

    cards = []
    for n, it in enumerate(items, 1):
        fecha = "sin fecha" if it["date"].startswith("9999") else it["date"]
        cards.append(
            f'<div class="card"><div class="n">{n}</div><img src="{it["thumb"]}" alt="">'
            f'<div class="meta"><b>{html.escape(it["desc"])}</b>'
            f'<span>{fecha}</span><span>{html.escape(it["label"])}</span></div></div>'
        )
    page = (
        '<!doctype html><meta charset="utf-8"><title>Quitar banner</title><style>'
        "body{margin:0;padding:20px;background:#111;color:#eee;font:14px system-ui,sans-serif}"
        "h1{font-size:16px;margin:0 0 16px}.grid{display:flex;flex-wrap:wrap;gap:16px}"
        ".card{position:relative;width:200px;background:#1c1c1c;border:1px solid #333;border-radius:6px;overflow:hidden}"
        ".card img{display:block;width:100%;height:280px;object-fit:contain;background:#000}"
        ".n{position:absolute;top:8px;left:8px;min-width:34px;height:34px;padding:0 6px;box-sizing:border-box;"
        "border-radius:17px;background:#6B9B37;color:#000;font:700 18px/34px system-ui;text-align:center}"
        ".meta{padding:10px;display:flex;flex-direction:column;gap:4px}.meta span{color:#aaa;font-size:12px}"
        "</style><h1>Carteles del banner del home — elegí el número a quitar</h1>"
        f'<div class="grid">{"".join(cards)}</div>'
    )
    with open(out_html, "w", encoding="utf-8") as f:
        f.write(page)

    for n, it in enumerate(items, 1):
        fecha = "sin fecha" if it["date"].startswith("9999") else it["date"]
        print(f'{n}. [{fecha}] {it["desc"]} — {it["label"]}')
        print(f'   compilado: {it["file"]}')
        print(f'   raw: {it["raw"] or "(no encontrado)"}')
    print(f"HTML: {out_html}")


main()
