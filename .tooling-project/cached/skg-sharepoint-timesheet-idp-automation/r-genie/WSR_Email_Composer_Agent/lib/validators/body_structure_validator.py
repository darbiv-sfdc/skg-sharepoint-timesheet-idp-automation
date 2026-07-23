#!/usr/bin/env python3
"""
body_structure_validator.py
Verifies required body headers appear verbatim (exact strings from guidelines).

Required headers:
  - 'Summary of WSR:'
  - 'Overall Delivery status' (followed by ' is ' + color)
  - 'GDC project status' (followed by ' is ' + color)
  - 'Ask for/ Attention required by Leaders:'
  - 'Ask :' (with space before colon, per Heineken reference)
  - 'Attention:'
  - 'Delivery Metrics & Quality Details:' OR 'Delivery Metrics'

Usage:
    python body_structure_validator.py --input email_body.txt

Exit codes: 0=PASS, 1=FAIL
"""
import argparse
import json
import re
import sys

REQUIRED_HEADERS = [
    {"name": "Summary of WSR:",                          "pattern": r'Summary of WSR:'},
    {"name": "Overall Delivery status",                  "pattern": r'Overall Delivery status'},
    {"name": "GDC project status",                       "pattern": r'GDC project status'},
    {"name": "Ask for/ Attention required by Leaders:",  "pattern": r'Ask for/ Attention required by Leaders:'},
    {"name": "Ask :",                                    "pattern": r'Ask\s*:'},
    {"name": "Attention:",                               "pattern": r'Attention:'},
    {"name": "Delivery Metrics",                         "pattern": r'Delivery Metrics'},
]


def validate(text: str) -> dict:
    issues = []
    found = []
    for header in REQUIRED_HEADERS:
        if re.search(header["pattern"], text):
            found.append(header["name"])
        else:
            issues.append({
                "header": header["name"],
                "reason": f"Required header '{header['name']}' not found"
            })

    # Check for empty Ask
    ask_empty = re.search(r'Ask\s*:\s*(\n|$)', text)
    if ask_empty:
        issues.append({
            "header": "Ask :",
            "reason": "'Ask :' is empty — use 'Ask : None as of now' when no ask"
        })

    if not issues:
        return {"script": "body_structure_validator.py", "status": "PASS",
                "headers_found": len(found)}
    return {"script": "body_structure_validator.py", "status": "FAIL",
            "issues": issues, "headers_found": len(found),
            "total_required": len(REQUIRED_HEADERS),
            "auto_fix_available": False}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", help="Path to file or stdin")
    parser.add_argument("--format", choices=["json", "human"], default="human")
    args = parser.parse_args()

    text = open(args.input).read() if args.input else sys.stdin.read()
    result = validate(text)

    if args.format == "json":
        print(json.dumps(result, indent=2))
    else:
        icon = "✅" if result["status"] == "PASS" else "❌"
        found = result.get("headers_found", 0)
        total = result.get("total_required", len(REQUIRED_HEADERS))
        print(f"{icon} body_structure_validator: {result['status']} ({found}/{total} headers found)")
        for issue in result.get("issues", []):
            print(f"   - {issue['header']}: {issue['reason']}")

    sys.exit(0 if result["status"] == "PASS" else 1)


if __name__ == "__main__":
    main()
