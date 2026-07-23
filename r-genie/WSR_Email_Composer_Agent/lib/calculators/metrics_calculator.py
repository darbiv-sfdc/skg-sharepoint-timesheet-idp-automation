#!/usr/bin/env python3
"""
metrics_calculator.py
Computes the 3 WSR metrics and produces a structured result.

Metrics:
  1. Capacity Utilisation = (actual / planned) * 100  → XX%
  2. User Story Delivered = (dev_completed / planned) * 100  → XX%
  3. Defects Per Days (per phase) = defects / days  → decimal (2dp)
  4. Over All Delivery row = totals across phases

v1.1: Accepts the JSON output of `metrics_inference.py` directly via --input.
      The inference script auto-derives capacity/story/phases from a Jira paste
      or user description so the user does not have to type raw numbers.

Usage:
    python metrics_inference.py --jira-paste paste.txt --output inferred.json
    python metrics_calculator.py --input inferred.json --format json

  OR (manual):
    python metrics_calculator.py --capacity-actual 102 --capacity-planned 102 --story-planned 43 --story-completed 10

Exit codes: 0=OK, 1=error
"""
import argparse
import json
import sys


def compute_capacity(actual: float, planned: float) -> dict:
    if planned == 0:
        return {"metric": "Capacity Utilisation", "value": None, "error": "Planned capacity is 0 — cannot compute"}
    pct = round((actual / planned) * 100)
    return {"metric": "Capacity Utilisation", "actual": actual, "planned": planned,
            "value": pct, "display": f"{pct}%"}


def compute_user_story(planned: float, dev_completed: float) -> dict:
    if planned == 0:
        return {"metric": "User Story Delivered", "value": None, "error": "Planned story points is 0"}
    pct = round((dev_completed / planned) * 100)
    return {"metric": "User Story Delivered", "planned": planned, "devCompleted": dev_completed,
            "value": pct, "display": f"{pct}%"}


def compute_dpd_phase(days: float, defects: float) -> dict:
    if days == 0:
        return {"days": days, "defects": defects, "dpd": 0.00, "display": "0.00"}
    dpd = round(defects / days, 2)
    return {"days": days, "defects": defects, "dpd": dpd, "display": f"{dpd:.2f}"}


def compute_release_table(phases: dict) -> dict:
    """phases = {Build: {days, defects}, SIT: {...}, UAT: {...}, PROD: {...}}"""
    result = {}
    total_days = 0
    total_defects = 0
    for phase, data in phases.items():
        days = float(data.get("days", 0))
        defects = float(data.get("defects", 0))
        result[phase] = compute_dpd_phase(days, defects)
        # Use max days across phases for Over All (days are typically the same across phases)
        total_days = max(total_days, days)
        total_defects += defects
    result["Over All Delivery"] = compute_dpd_phase(total_days, total_defects)
    return result


def run(inputs: dict) -> dict:
    capacity = compute_capacity(
        float(inputs.get("capacity_actual", 0)),
        float(inputs.get("capacity_planned", 0))
    )
    story = compute_user_story(
        float(inputs.get("story_planned", 0)),
        float(inputs.get("story_completed", 0))
    )
    release = compute_release_table(inputs.get("phases", {}))
    return {
        "script": "metrics_calculator.py",
        "status": "OK",
        "sprintMetrics": {"capacityUtilisation": capacity, "userStoryDelivered": story},
        "releaseTable": release
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", help="JSON file with metric inputs")
    parser.add_argument("--capacity-actual", type=float)
    parser.add_argument("--capacity-planned", type=float)
    parser.add_argument("--story-planned", type=float)
    parser.add_argument("--story-completed", type=float)
    parser.add_argument("--format", choices=["json", "human"], default="human")
    args = parser.parse_args()

    if args.input:
        with open(args.input) as f:
            inputs = json.load(f)
    else:
        inputs = {
            "capacity_actual": args.capacity_actual or 0,
            "capacity_planned": args.capacity_planned or 0,
            "story_planned": args.story_planned or 0,
            "story_completed": args.story_completed or 0,
            "phases": {}
        }

    result = run(inputs)

    if args.format == "json":
        print(json.dumps(result, indent=2))
    else:
        print("📊 metrics_calculator")
        cap = result["sprintMetrics"]["capacityUtilisation"]
        story = result["sprintMetrics"]["userStoryDelivered"]
        print(f"   Capacity Utilisation : {cap.get('display', 'N/A')} (actual={cap.get('actual')} / planned={cap.get('planned')})")
        print(f"   User Story Delivered : {story.get('display', 'N/A')} (planned={story.get('planned')} / completed={story.get('devCompleted')})")
        if result["releaseTable"]:
            print("   Release DpD Table:")
            for phase, data in result["releaseTable"].items():
                print(f"     {phase:20s} days={data['days']:<6} defects={data['defects']:<4} dpd={data['display']}")

    sys.exit(0)


if __name__ == "__main__":
    main()
