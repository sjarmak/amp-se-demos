#!/usr/bin/env python3
import sys, os, re, json

# usage: search_in_repo_tool.py 'pattern' [root]

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error":"pattern required"}))
        return
    pattern = sys.argv[1]
    root = sys.argv[2] if len(sys.argv)>2 else os.getcwd()
    rx = re.compile(pattern)
    results = []
    for dirpath, _, files in os.walk(root):
        for fn in files:
            if len(fn) > 200 or fn.endswith(('.png','.jpg','.gif','.pdf','.zip','.jar')):
                continue
            path = os.path.join(dirpath, fn)
            try:
                with open(path, 'r', errors='ignore') as f:
                    for i, line in enumerate(f, 1):
                        if rx.search(line):
                            results.append({"file": path, "line": i, "text": line.strip()[:200]})
            except Exception:
                pass
    print(json.dumps(results))

if __name__ == '__main__':
    main()
