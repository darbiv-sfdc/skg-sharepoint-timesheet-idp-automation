#!/usr/bin/env python3
"""
days_calculator.py

Computes the cumulative running days totals (Build/SIT/UAT/PROD/Over All Delivery)
for the WSR Delivery Metrics — Release table. Operates on:

  new_total = prior_total + (active_members × 5 × weeks_elapsed) − sum(leaves)

Reads the team roster from templates/team-roster.yaml. PROD stays at 0 in
pre-release projects unless explicitly overridden.

Inputs:
  --prior PATH        JSON: {"Build": 641, "SIT": 641, "UAT": 641, "PROD": 0,
                              "Over All Delivery": 641}
  --leaves STR        Comma list "Akshay=2,Bhawna=1" (or "none")
  --weeks N           Weeks elapsed since prior (default 1)
  --roster PATH       Override team roster YAML location (default
                      ../../templates/team-roster.yaml relative to this script)
  --prod-active       Mark PROD phase active (post-release projects)

Output (JSON):
  {
    "script": "days_calculator.py",
    "status": "OK",
    "increment_per_phase": 68,
    "leaves_total": 2,
    "active_members": 14,
    "phases": {"Build": 709, "SIT": 709, "UAT": 709, "PROD": 0,
               "Over All Delivery": 709},
    "leaves_breakdown": {"Akshay": 2}
  }

Exit codes: 0=OK, 1=error
"""
import argparse
import json
import re
import sys
from pathlib import Path


def load_yaml_minimal(path: Path) -> dict:
    """Tiny YAML loader sufficient for team-roster.yaml shape (no PyYAML dep)."""
    try:
        import yaml  # type: ignore
        return yaml.safe_load(path.read_text())
    except ImportError:
        pass

    data: dict = {"teams": {}, "metadata": {}}
    current_team: str | None = None
    in_members = False
    in_metadata = False
    for raw in path.read_text().splitlines():
        line = raw.rstrip()
        if not line or line.lstrip().startswith("#"):
            continue
        stripped = line.strip()
        indent = len(line) - len(line.lstrip(" "))
        if stripped.startswith("metadata:"):
            in_metadata, in_members, current_team = True, False, None
            continue
        if stripped.startswith("teams:"):
            in_metadata, in_members, current_team = False, False, None
            continue
        if in_metadata and ":" in stripped and not stripped.startswith("-"):
            k, _, v = stripped.partition(":")
            v = v.strip().strip('"').strip("'")
            if v.isdigit():
                data["metadata"][k.strip()] = int(v)
            elif v:
                data["metadata"][k.strip()] = v
            continue
        if indent == 2 and stripped.endswith(":"):
            current_team = stripped[:-1]
            data["teams"][current_team] = {"members": []}
            in_members = False
            continue
        if current_team and stripped.startswith("name:"):
            data["teams"][current_team]["name"] = stripped.split(":", 1)[1].strip().strip('"').strip("'")
            continue
        if current_team and stripped == "members:":
            in_members = True
            continue
        if current_team and in_members and stripped.startswith("-"):
            data["teams"][current_team]["members"].append(stripped.lstrip("- ").strip().strip('"').strip("'"))
    return data


def parse_leaves(leaves_str: str | None) -> dict[str, int]:
    if not leaves_str or leaves_str.strip().lower() in ("none", "", "0"):
        return {}
    out: dict[str, int] = {}
    for entry in re.split(r"[,;]", leaves_str):
        if "=" not in entry:
            continue
        name, _, days = entry.partition("=")
        try:
            out[name.strip()] = int(float(days.strip()))
        except ValueError:
            continue
    return out


def count_active_members(roster: dict) -> int:
    return sum(len(t.get("members", [])) for t in roster.get("teams", {}).values())


def compute(prior: dict, leaves: dict[str, int], weeks: int, roster: dict, prod_active: bool) -> dict:
    active_members = count_active_members(roster)
    increment = active_members * 5 * weeks - sum(leaves.values())
    increment = max(0, increment)

    phases_out: dict = {}
    for phase in ("Build", "SIT", "UAT", "PROD"):
        prior_val = int(prior.get(phase, 0))
        if phase == "PROD" and not prod_active:
            phases_out[phase] = prior_val
        else:
            phases_out[phase] = prior_val + increment
    overall_prior = int(prior.get("Over All Delivery", max(phases_out.values())))
    if any(phases_out[p] > overall_prior for p in ("Build", "SIT", "UAT")):
        phases_out["Over All Delivery"] = max(phases_out["Build"], phases_out["SIT"], phases_out["UAT"])
    else:
        phases_out["Over All Delivery"] = overall_prior

    return {
        "script": "days_calculator.py",
        "status": "OK",
        "increment_per_phase": increment,
        "leaves_total": sum(leaves.values()),
        "active_members": active_members,
        "weeks_elapsed": weeks,
        "phases": phases_out,
        "leaves_breakdown": leaves,
    }


def main():
    here = Path(__file__).resolve()
    default_roster = here.parent.parent.parent / "templates" / "team-roster.yaml"
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--prior", help="JSON file with prior phase totals; if omitted, all start at 0")
    p.add_argument("--leaves", default="none", help='Comma list "Name=days,Name=days" or "none"')
    p.add_argument("--weeks", type=int, default=1, help="Weeks elapsed since prior (default 1)")
    p.add_argument("--roster", default=str(default_roster), help="Path to team-roster.yaml")
    p.add_argument("--prod-active", action="store_true", help="Increment PROD as well (post-release)")
    p.add_argument("--format", choices=["json", "human"], default="human")
    args = p.parse_args()

    prior: dict = {}
    if args.prior:
        prior = json.loads(Path(args.prior).read_text())

    roster_path = Path(args.roster)
    if not roster_path.exists():
        print(f"error: roster not found at {roster_path}", file=sys.stderr)
        sys.exit(1)
    roster = load_yaml_minimal(roster_path)
    if not roster.get("teams"):
        print("error: no teams found in roster", file=sys.stderr)
        sys.exit(1)

    leaves = parse_leaves(args.leaves)
    result = compute(prior, leaves, args.weeks, roster, args.prod_active)

    if args.format == "json":
        print(json.dumps(result, indent=2))
    else:
        print(f"📅 days_calculator  active_members={result['active_members']}  weeks={result['weeks_elapsed']}  leaves={result['leaves_total']}  increment={result['increment_per_phase']}")
        for phase, val in result["phases"].items():
            print(f"   {phase:20s}{val}")
    sys.exit(0)


if __name__ == "__main__":
    main()
