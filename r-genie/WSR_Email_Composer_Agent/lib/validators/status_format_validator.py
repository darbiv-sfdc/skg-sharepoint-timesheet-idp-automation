#!/usr/bin/env python3
"""
status_format_validator.py
Validates subject line contains 'Status - {Green|Amber|Red}' prefix exactly.

Usage:
    python status_format_validator.py --input subject.txt
    echo "Status - Green" | python status_format_validator.py

Exit codes: 0=PASS, 1=FAIL
"""
import argparse
import json
import re
import sys

VALID_COLORS = ["Green", "Amber", "Red", "GREEN", "AMBER", "RED"]
STATUS_REGEX = r'Status - (Green|Amber|Red|GREEN|AMBER|RED)\b'


def validate(text: str) -> dict:
    text = text.strip()
    if not re.search(STATUS_REGEX, text):
        issues = []
        if re.search(r'Status:\s*\w+', text):
            issues.append({"reason": "Found 'Status:' — must be 'Status -' (hyphen, not colon)"})
        elif re.search(r'Status-\w+', text):
            issues.append({"reason": "Found 'Status-' — must be 'Status - ' with space around hyphen"})
        elif re.search(r'\b(Green|Amber|Red)\b', text, re.IGNORECASE):
            issues.append({"reason": "Color mentioned but missing 'Status - ' prefix"})
        else:
            issues.append({"reason": "No 'Status - {Green|Amber|Red}' found"})
        return {"script": "status_format_validator.py", "status": "FAIL",
                "issues": issues, "auto_fix_available": False}

    match = re.search(STATUS_REGEX, text)
    return {"script": "status_format_validator.py", "status": "PASS",
            "color": match.group(1)}


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
        print(f"{icon} status_format_validator: {result['status']}")
        for issue in result.get("issues", []):
            print(f"   - {issue.get('reason', issue)}")

    sys.exit(0 if result["status"] == "PASS" else 1)


if __name__ == "__main__":
    main()
