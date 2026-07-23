#!/usr/bin/env python3
"""
british_spelling_linter.py
Detects American 'Utilization' (and related) and flags required British 'Utilisation'.

Scope: WSR metric naming only. Per guidelines line 82, 'Capacity Utilisation' with British 's' is mandatory.

Usage:
    python british_spelling_linter.py --input email_body.txt
    cat email_body.html | python british_spelling_linter.py --format json

Exit codes: 0=PASS, 1=FAIL (critical)
"""
import argparse
import json
import re
import sys

# American -> British word pairs for WSR context
RULES = [
    {"american": r'\bUtilization\b', "british": "Utilisation", "context_hint": "Capacity Utilisation"},
    {"american": r'\bUtilizations\b', "british": "Utilisations", "context_hint": "plural — unusual in WSR"},
    {"american": r'\butilization\b', "british": "utilisation", "context_hint": "Capacity utilisation"},
]


def lint(text: str) -> dict:
    findings = []
    for rule in RULES:
        for m in re.finditer(rule["american"], text):
            line_num = text[:m.start()].count("\n") + 1
            findings.append({
                "line": line_num,
                "found": m.group(0),
                "expected": rule["british"],
                "context_hint": rule["context_hint"]
            })

    if not findings:
        return {"script": "british_spelling_linter.py", "status": "PASS"}

    return {
        "script": "british_spelling_linter.py",
        "status": "FAIL",
        "issues": findings,
        "auto_fix_available": True,
        "fix_preview": "s/Utilization/Utilisation/g",
    }


def apply_fix(text: str) -> str:
    """Auto-fix: replace American with British."""
    for rule in RULES:
        text = re.sub(rule["american"], rule["british"], text)
    return text


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", help="Path to file or stdin")
    parser.add_argument("--format", choices=["json", "human"], default="human")
    parser.add_argument("--fix", action="store_true", help="Apply auto-fix and print corrected text")
    args = parser.parse_args()

    text = open(args.input).read() if args.input else sys.stdin.read()

    if args.fix:
        print(apply_fix(text))
        sys.exit(0)

    result = lint(text)

    if args.format == "json":
        print(json.dumps(result, indent=2))
    else:
        icon = "✅" if result["status"] == "PASS" else "❌"
        print(f"{icon} british_spelling_linter: {result['status']}")
        for issue in result.get("issues", []):
            print(f"   - line {issue['line']}: '{issue['found']}' → '{issue['expected']}'")
        if result.get("auto_fix_available"):
            print(f"   ℹ️  Auto-fix available: rerun with --fix")

    sys.exit(0 if result["status"] == "PASS" else 1)


if __name__ == "__main__":
    main()
