#!/usr/bin/env python3
import sys, json, urllib.request

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error":"usage: http_request_tool.py '{""method"":"GET",""url"":"https://...",""headers"":{},""body"":null}'"}))
        sys.exit(1)
    spec = json.loads(sys.argv[1])
    req = urllib.request.Request(spec["url"], method=spec.get("method","GET"))
    for k,v in spec.get("headers",{}).items():
        req.add_header(k,v)
    data = spec.get("body")
    if isinstance(data, str):
        data = data.encode("utf-8")
    try:
        with urllib.request.urlopen(req, data=data) as resp:
            out = {
                "status": resp.getcode(),
                "headers": dict(resp.getheaders()),
                "body": resp.read().decode("utf-8","ignore")
            }
            print(json.dumps(out))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
