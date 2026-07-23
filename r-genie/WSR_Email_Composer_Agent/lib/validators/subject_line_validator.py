#!/usr/bin/env python3
"""
subject_line_validator.py
Validates WSR subject line against the Collab App parser regex.

Required format:
    WSR | dd-mmm-yy | Project Name | Status - Green/Amber/Red | Region

Usage:
    python subject_line_validator.py --input subject.txt [--format json|human]
    echo "WSR | 10-Apr-26 | MyProj | Status - Green | EMEA" | python subject_line_validator.py

Exit codes: 0=PASS, 1=FAIL
"""
import argparse
import json
import re
import sys

SUBJECT_REGEX = r'^WSR \| \d{2}-[A-Z][a-z]{2}-\d{2} \| .+ \| Status - (Green|Amber|Red) \| .+$'


def validate(subject: str) -> dict:
    subject = subject.strip()
    if not subject:
        return {"script": "subject_line_validator.py", "status": "FAIL",
                "issues": [{"reason": "Empty subject line"}], "auto_fix_available": False}

    # Case-insensitive color check (guidelines show both 'Green' and 'GREEN' in examples)
    normalized = re.sub(r'Status - (GREEN|green|AMBER|amber|RED|red)',
                        lambda m: f"Status - {m.group(1).capitalize()}", subject)

    if re.match(SUBJECT_REGEX, normalized):
        return {"script": "subject_line_validator.py", "status": "PASS",
                "subject": subject, "normalized": normalized}

    issues = []
    if not subject.startswith("WSR |") and not subject.startswith("WSR"):
        issues.append({"reason": "Subject must start with 'WSR |'"})
    if "|" not in subject:
        issues.append({"reason": "Subject must use pipe ('|') delimiters, not dashes/commas"})
    if "Status -" not in normalized and "Status-" not in subject:
        issues.append({"reason": "Subject must include 'Status - {Green|Amber|Red}' with hyphen"})
    if not re.search(r'\d{2}-[A-Z][a-z]{2}-\d{2}', subject):
        issues.append({"reason": "Date must be in dd-mmm-yy format (e.g., 10-Apr-26)"})
    components = [c.strip() for c in subject.split("|")]
    if len(components) < 5:
        issues.append({"reason": f"Subject must have 5 pipe-delimited components; found {len(components)}"})

    if not issues:
        issues.append({"reason": "Subject does not match required regex", "regex": SUBJECT_REGEX})

    return {"script": "subject_line_validator.py", "status": "FAIL",
            "issues": issues, "subject": subject, "auto_fix_available": False}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", help="Path to file containing subject line (or stdin)")
    parser.add_argument("--format", choices=["json", "human"], default="human")
    args = parser.parse_args()

    if args.input:
        with open(args.input) as f:
            subject = f.read()
    else:
        subject = sys.stdin.read()

    result = validate(subject)
    if args.format == "json":
        print(json.dumps(result, indent=2))
    else:
        icon = "✅" if result["status"] == "PASS" else "❌"
        print(f"{icon} subject_line_validator: {result['status']}")
        for issue in result.get("issues", []):
            print(f"   - {issue.get('reason', issue)}")

    sys.exit(0 if result["status"] == "PASS" else 1)


if __name__ == "__main__":
    main()
