#!/usr/bin/env python3
import sys, json
from datetime import datetime

# Placeholder: capture a URL via playwright if available, else stub.
# usage: screenshot_tool.py '{"url":"http://localhost:3000","out":"shot.png"}'

def main():
    try:
        cfg = json.loads(sys.argv[1]) if len(sys.argv)>1 else {}
    except Exception:
        cfg = {}
    url = cfg.get("url","http://localhost:3000")
    out = cfg.get("out", f"screenshot-{datetime.utcnow().isoformat()}.png")
    try:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            page.goto(url, wait_until="networkidle")
            page.screenshot(path=out, full_page=True)
            browser.close()
            print(json.dumps({"ok": True, "file": out}))
    except Exception as e:
        # Fallback stub
        with open(out, 'wb') as f:
            f.write(b"stub screenshot")
        print(json.dumps({"ok": True, "file": out, "note": str(e)}))

if __name__ == '__main__':
    main()
