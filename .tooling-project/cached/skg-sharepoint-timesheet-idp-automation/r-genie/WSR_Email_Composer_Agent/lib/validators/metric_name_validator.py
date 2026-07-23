#!/usr/bin/env python3
"""
metric_name_validator.py
Validates exact required phrases for the 3 WSR metrics.

Rules (from guidelines):
  - 'Capacity Utilisation' (British, with %)
  - 'User Story Delivered' (exact phrase, NOT 'Stories Delivered')
  - 'Defects Per Days' (exact phrase, decimal, NO %)

Usage:
    python metric_name_validator.py --input email_body.txt

Exit codes: 0=PASS, 1=FAIL
"""
import argparse
import json
import re
import sys

REQUIRED_PHRASES = [
    {"name": "Capacity Utilisation", "pattern": r'Capacity [Uu]tilisation',
     "common_mistakes": [r'Capacity Utilization', r'Cap Util', r'Capacity Util\b']},
    {"name": "User Story Delivered", "pattern": r'User Story Delivered',
     "common_mistakes": [r'User Stories Delivered', r'Stories Delivered\b', r'US Delivered']},
    {"name": "Defects Per Days", "pattern": r'Defects Per Days',
     "common_mistakes": [r'Defects/Day\b', r'Defect Per Day\b', r'DpD\s*%']},
]


def validate(text: str) -> dict:
    issues = []
    for metric in REQUIRED_PHRASES:
        # Check required phrase is present
        if not re.search(metric["pattern"], text):
            # Look for common mistakes
            found_mistake = None
            for mistake in metric["common_mistakes"]:
                m = re.search(mistake, text)
                if m:
                    found_mistake = m.group(0)
                    break
            if found_mistake:
                issues.append({
                    "metric": metric["name"],
                    "reason": f"Found '{found_mistake}' — must be exact phrase '{metric['name']}'",
                    "expected": metric["name"]
                })
            else:
                issues.append({
                    "metric": metric["name"],
                    "reason": f"Required phrase '{metric['name']}' not found in body",
                    "expected": metric["name"]
                })
        else:
            # Check for mistakes alongside the correct phrase
            for mistake in metric["common_mistakes"]:
                m = re.search(mistake, text)
                if m:
                    issues.append({
                        "metric": metric["name"],
                        "reason": f"Found deprecated variant '{m.group(0)}' — remove it",
                        "expected": metric["name"]
                    })

    if not issues:
        return {"script": "metric_name_validator.py", "status": "PASS"}
    return {"script": "metric_name_validator.py", "status": "FAIL",
            "issues": issues, "auto_fix_available": False}


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
        print(f"{icon} metric_name_validator: {result['status']}")
        for issue in result.get("issues", []):
            print(f"   - {issue['metric']}: {issue['reason']}")

    sys.exit(0 if result["status"] == "PASS" else 1)


if __name__ == "__main__":
    main()
