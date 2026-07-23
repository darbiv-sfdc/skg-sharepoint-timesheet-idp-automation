#!/usr/bin/env python3
"""
numeric_format_validator.py
Validates metric value formats:
  - Capacity Utilisation: XX% (percent required)
  - User Story Delivered: XX% (percent required)
  - Defects Per Days / DpD: decimal (NO % symbol)

Usage:
    python numeric_format_validator.py --input email_body.txt

Exit codes: 0=PASS, 1=FAIL
"""
import argparse
import json
import re
import sys


def validate(text: str) -> dict:
    issues = []

    # Capacity Utilisation must end with %
    cap_match = re.search(r'Capacity [Uu]tilisation[:\s]+(\d+(?:\.\d+)?)\s*(%?)', text)
    if cap_match and not cap_match.group(2):
        issues.append({
            "metric": "Capacity Utilisation",
            "reason": f"Value '{cap_match.group(1)}' missing '%' symbol",
            "fix_preview": f"{cap_match.group(1)}%"
        })

    # User Story Delivered must end with %
    story_match = re.search(r'User Story Delivered[^:]*[:\s]+(\d+(?:\.\d+)?)\s*(%?)', text)
    if story_match and not story_match.group(2):
        issues.append({
            "metric": "User Story Delivered",
            "reason": f"Value '{story_match.group(1)}' missing '%' symbol",
            "fix_preview": f"{story_match.group(1)}%"
        })

    # Defects Per Days / DpD must NOT contain %
    dpd_matches = re.finditer(r'(Defects Per Days|Defect Per Days|DpD)[^.!?\n]*?(\d+\.\d+)\s*%', text)
    for m in dpd_matches:
        issues.append({
            "metric": "Defects Per Days",
            "reason": f"Found '{m.group(2)}%' — DpD must be decimal with NO % symbol",
            "fix_preview": m.group(2)
        })

    # DpD rows should be decimal (with a dot)
    dpd_int_only = re.finditer(r'(Build|SIT|UAT|PROD|Over All Delivery)\s+\|\s*\d+\s*\|\s*\d+\s*\|\s*(\d+)\b(?![.\d])', text)
    for m in dpd_int_only:
        issues.append({
            "metric": "Defects Per Days",
            "reason": f"Phase '{m.group(1)}' DpD value '{m.group(2)}' should be decimal (e.g., '{m.group(2)}.00')",
            "fix_preview": f"{m.group(2)}.00"
        })

    if not issues:
        return {"script": "numeric_format_validator.py", "status": "PASS"}
    return {"script": "numeric_format_validator.py", "status": "FAIL",
            "issues": issues, "auto_fix_available": True}


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
        print(f"{icon} numeric_format_validator: {result['status']}")
        for issue in result.get("issues", []):
            print(f"   - {issue['metric']}: {issue['reason']}")

    sys.exit(0 if result["status"] == "PASS" else 1)


if __name__ == "__main__":
    main()
