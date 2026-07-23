#!/usr/bin/env python3
"""
html_email_builder.py
Renders a parser-ready WSR HTML email from the session state JSON.

Uses the HTML template at templates/wsr-email-template.html with a minimal
string-substitution engine (no external deps). Produces Gmail-compatible HTML
with inline styles matching the Heineken reference email structure.

v1.1: Adds --bundle-dir option that writes BOTH the email body AND a
run_metadata.json audit file to a timestamped folder
(`project/output_wsr/{YYYY-MM-DD-HHmm}_{project-slug}/`). Each run gets
its own folder — same-day re-runs never overwrite previous drafts.

Usage:
    # Bundle mode (recommended in v1.1):
    python html_email_builder.py --state state.json --bundle-dir project/output_wsr

    # Legacy single-file mode (backward compatible):
    python html_email_builder.py --state state.json --output email_body.html

Exit codes: 0=OK, 1=error
"""
import argparse
import html
import json
import re
import sys
from datetime import datetime
from pathlib import Path

COLOR_HEX = {"Green": "#38761d", "Amber": "#e69138", "Red": "#cc0000",
             "GREEN": "#38761d", "AMBER": "#e69138", "RED": "#cc0000"}


def esc(s) -> str:
    """HTML-escape a value and coerce to string."""
    if s is None:
        return "&#x26A0; MISSING"
    return html.escape(str(s))


def render_bullets(bullets):
    """bullets = [{text, children?: [{text}]}]"""
    if not bullets:
        return ""
    parts = ["<ul>"]
    for b in bullets:
        parts.append(f"<li>{esc(b.get('text', ''))}")
        children = b.get("children") or []
        if children:
            parts.append("<ul>")
            for c in children:
                parts.append(f"<li>{esc(c.get('text', ''))}</li>")
            parts.append("</ul>")
        parts.append("</li>")
    parts.append("</ul>")
    return "\n".join(parts)


def render_bullet_block(items):
    if not items:
        return ""
    parts = ["<ul>"]
    for item in items:
        parts.append(f"<li>{esc(item)}</li>")
    parts.append("</ul>")
    return "\n".join(parts)


def render_release_rows(phases: dict) -> str:
    order = ["Build", "SIT", "UAT", "PROD", "Over All Delivery"]
    rows = []
    style_td = 'style="border:1px solid rgb(0,0,0); padding:2px 3px; text-align:center;"'
    style_td_bold = 'style="border:1px solid rgb(0,0,0); padding:2px 3px; font-weight:bold; text-align:center;"'
    for phase in order:
        if phase not in phases:
            continue
        d = phases[phase]
        days = d.get("days", 0)
        defects = d.get("defects", 0)
        dpd = d.get("display", d.get("dpd", "0.00"))
        rows.append(f'<tr style="height:21px;"><td {style_td_bold}>{esc(phase)}</td>'
                    f'<td {style_td}>{esc(days)}</td>'
                    f'<td {style_td}>{esc(defects)}</td>'
                    f'<td {style_td}>{esc(dpd)}</td></tr>')
    return "\n".join(rows)


HTML_TEMPLATE = """<div dir="ltr" style="font-family: arial, sans-serif; font-size: 10pt; color: rgb(0,0,0);">

<div>Dear Leaders,</div>
<div><br></div>

<div>Please find the Weekly Status Report for the <span>{project_name}</span>&nbsp;as of <span style="color: rgb(32,18,77);">{wsr_date}</span></div>
<div><br></div>

<div><b>Overall Delivery status</b>&nbsp;is&nbsp;<b><font color="{overall_hex}">{overall_color}</font></b></div>
<div><br></div>

<div><b>GDC project status</b>&nbsp;is&nbsp;<b><font color="{gdc_hex}">{gdc_color}</font></b></div>
<div><br></div>

<div><u><b>Summary of WSR:</b></u>&nbsp;</div>
{summary_html}

{completed_block}

{in_progress_block}

<div><br></div>

<div><b><u>Ask for/ Attention required by Leaders:</u></b></div>
<div><br></div>
<div><b style="text-decoration-line: underline;">Ask :&nbsp;</b>{ask_content}</div>
<div><br></div>
<div><b><u>Attention:</u></b>&nbsp;</div>
{attention_html}

<div><br></div>

<div><b><u>Delivery Metrics &amp; Quality Details:</u></b>&nbsp;</div>
<div><br></div>

<table cellspacing="0" cellpadding="0" dir="ltr" border="1" style="table-layout:fixed; font-size:10pt; font-family:Arial; border-collapse:collapse;">
<tbody>
<tr style="height:21px;"><td colspan="4" style="border:1px solid rgb(0,0,0); padding:2px 3px; background-color:rgb(255,255,0); font-weight:bold; text-decoration-line:underline; text-align:center;">Delivery Metrics- Sprint {sprint_number}</td></tr>
<tr style="height:21px;"><td style="border:1px solid rgb(0,0,0); padding:2px 3px; background-color:rgb(255,242,204);"></td><td style="border:1px solid rgb(0,0,0); padding:2px 3px; background-color:rgb(255,242,204); font-weight:bold; text-align:center;">Details</td><td colspan="2" style="border:1px solid rgb(0,0,0); padding:2px 3px; background-color:rgb(255,242,204); font-weight:bold; text-align:center;">Comments</td></tr>
<tr style="height:21px;"><td style="border:1px solid rgb(0,0,0); padding:2px 3px;"><span>Capacity utilisation: <b>{cap_value}</b></span><span><b>%&nbsp;&nbsp;</b></span></td><td style="border:1px solid rgb(0,0,0); padding:2px 3px;">Capacity: {cap_actual} vs Planned: {cap_planned}</td><td colspan="2" style="border:1px solid rgb(0,0,0); padding:2px 3px;">{cap_comments}</td></tr>
<tr style="height:21px;"><td style="border:1px solid rgb(0,0,0); padding:2px 3px;"><span>User Story Delivered: <b>{story_value}</b></span><span><b>%</b></span></td><td style="border:1px solid rgb(0,0,0); padding:2px 3px;">Planned: {story_planned} vs Dev Completed: {story_completed}</td><td colspan="2" style="border:1px solid rgb(0,0,0); padding:2px 3px;">{story_comments}</td></tr>
<tr style="height:21px;"><td colspan="4" style="border:1px solid rgb(0,0,0); padding:2px 3px;"></td></tr>
<tr style="height:21px;"><td colspan="4" style="border:1px solid rgb(0,0,0); padding:2px 3px; background-color:rgb(255,255,0); font-weight:bold; text-align:center;">{release_year} Release</td></tr>
<tr style="height:21px;"><td style="border:1px solid rgb(0,0,0); padding:2px 3px; background-color:rgb(255,255,0); font-weight:bold; text-align:center;">Phase</td><td style="border:1px solid rgb(0,0,0); padding:2px 3px; background-color:rgb(255,255,0); font-weight:bold; text-align:center;">Days</td><td style="border:1px solid rgb(0,0,0); padding:2px 3px; background-color:rgb(255,255,0); font-weight:bold; text-align:center;">Valid Defects</td><td style="border:1px solid rgb(0,0,0); padding:2px 3px; background-color:rgb(255,255,0); font-weight:bold; text-align:center;">Defect Per Days (DpD)</td></tr>
{release_rows}
</tbody>
</table>

{release_note_block}

<div><br></div>

<div>Thanks</div>
<div>{sender_name}</div>

</div>
"""


def build(state: dict) -> str:
    proj = state.get("project", {})
    status = state.get("status", {})
    overall = status.get("overallDelivery", {}).get("color", "?")
    gdc = status.get("gdcProject", {}).get("color", "?")
    metrics = state.get("metrics", {})
    cap = metrics.get("capacityUtilisation", {})
    story = metrics.get("userStoryDelivered", {})
    dpd = metrics.get("defectsPerDays", {})

    summary_html = render_bullets(state.get("summary", {}).get("bullets", []))
    completed_bullets = state.get("completed", {}).get("bullets", [])
    in_progress_bullets = state.get("inProgress", {}).get("bullets", [])

    def bullet_block(label, items):
        if not items:
            return ""
        body = render_bullet_block(items)
        return (f'<blockquote style="margin:0 0 0 40px; border:none; padding:0px;">'
                f'<p style="line-height:1.38; margin:0;"><span style="font-size:10pt;">{label}</span></p>'
                f'{body}</blockquote>')

    completed_block = bullet_block("Completed", completed_bullets)
    in_progress_block = bullet_block("In Progress", in_progress_bullets)

    ask = state.get("ask", {})
    ask_items = ask.get("items", [])
    ask_content = "None as of now" if not ask_items else "<br>".join([esc(i) for i in ask_items])

    attention = state.get("attention", {})
    attention_items = attention.get("items", [])
    if attention_items:
        attention_html = render_bullet_block(attention_items)
    else:
        attention_html = "<div>None as of now</div>"

    release_note = state.get("metrics", {}).get("releaseNote", "")
    release_note_block = f'<div><br></div><div style="font-style: italic;">Note: {esc(release_note)}</div>' if release_note else ""

    return HTML_TEMPLATE.format(
        project_name=esc(proj.get("name", "⚠️ MISSING")),
        wsr_date=esc(proj.get("date", "⚠️ MISSING")),
        overall_color=esc(overall),
        overall_hex=COLOR_HEX.get(overall, "#000000"),
        gdc_color=esc(gdc),
        gdc_hex=COLOR_HEX.get(gdc, "#000000"),
        summary_html=summary_html,
        completed_block=completed_block,
        in_progress_block=in_progress_block,
        ask_content=ask_content,
        attention_html=attention_html,
        sprint_number=esc(metrics.get("sprint", {}).get("number", "?")),
        cap_value=esc(cap.get("value", "⚠️ MISSING")),
        cap_actual=esc(cap.get("actual", "?")),
        cap_planned=esc(cap.get("planned", "?")),
        cap_comments=esc(cap.get("comments", "")),
        story_value=esc(story.get("value", "⚠️ MISSING")),
        story_planned=esc(story.get("planned", "?")),
        story_completed=esc(story.get("devCompleted", "?")),
        story_comments=esc(story.get("comments", "")),
        release_year=esc(dpd.get("year", "?")),
        release_rows=render_release_rows(dpd.get("phases", {})),
        release_note_block=release_note_block,
        sender_name=esc(proj.get("sender", "⚠️ MISSING"))
    )


def slugify(s: str) -> str:
    s = (s or "wsr").lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s or "wsr"


def write_bundle(state: dict, bundle_root: Path) -> Path:
    """v1.1: write timestamped folder containing body + run_metadata."""
    proj_name = state.get("project", {}).get("name", "wsr")
    ts = datetime.now().strftime("%Y-%m-%d-%H%M")
    folder = bundle_root / f"{ts}_{slugify(proj_name)}"
    folder.mkdir(parents=True, exist_ok=True)

    html_content = build(state)
    (folder / "email_body.html").write_text(html_content, encoding="utf-8")

    metadata = {
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "mode": state.get("mode", "unknown"),
        "project": state.get("project", {}),
        "status": state.get("status", {}),
        "inferences": state.get("inferences", {}),
        "inputs_summary": state.get("inputs_summary", {}),
        "tuner_attribution": "WSR Email Composer v1.1 (tuned by sohail)",
    }
    (folder / "run_metadata.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")

    return folder


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--state", required=True, help="Path to WSR state JSON")
    parser.add_argument("--output", help="Single-file output path (legacy mode)")
    parser.add_argument("--bundle-dir", help="Bundle root (v1.1) — creates {YYYY-MM-DD-HHmm}_{project-slug}/")
    args = parser.parse_args()

    if not args.output and not args.bundle_dir:
        print("error: provide --output or --bundle-dir", file=sys.stderr)
        sys.exit(1)

    with open(args.state) as f:
        state = json.load(f)

    if args.bundle_dir:
        folder = write_bundle(state, Path(args.bundle_dir))
        print(f"✅ HTML email + run_metadata written to: {folder}/")
    else:
        html_content = build(state)
        Path(args.output).write_text(html_content, encoding="utf-8")
        print(f"✅ HTML email written: {args.output} ({len(html_content)} chars)")
    sys.exit(0)


if __name__ == "__main__":
    main()
