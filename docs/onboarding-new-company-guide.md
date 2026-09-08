# Onboarding a New Company — Step-by-Step Guide

## Who this guide is for

This guide is for the person setting up SharePoint for a **new company or site** (for example, if
"EKN" and "FLEET" are already set up, and you're adding a new one). No technical knowledge is
needed — you don't need to know anything about the automation itself, just how to click around in
SharePoint.

You'll do most of these steps yourself. There is **one step that needs our support team** — it's
clearly marked below, and you can't skip it.

## What you'll need before you start

- Access to create document libraries on the SharePoint site:
  `https://skgtechoffice.sharepoint.com/sites/MulesoftProjectSite`
- The name you want to use for the new company/site (keep it short, like the existing ones —
  `EKN`, `FLEET`)
- One sample timesheet PDF to use for testing at the end
- 10–15 minutes, plus some waiting time for our support team to confirm step 4

---

## Overview — what you'll do, in order

1. Create the document library
2. Create the 5 required folders inside it
3. Create the 3 classification columns (recommended, not required)
4. **Contact our support team** and wait for confirmation ⏳
5. Upload a test file and trigger a test run
6. Check the results

Don't skip ahead to step 5 before step 4 is confirmed — the automation won't know your new
library exists yet, and your test will just sit there doing nothing.

---

## Step 1 — Create the document library

1. Go to the SharePoint site: `https://skgtechoffice.sharepoint.com/sites/MulesoftProjectSite`
2. Click **New** → **Document library**.
3. Name it after the new company or site. Keep it short and simple, matching the style of the
   existing ones (e.g. `EKN`, `FLEET`) — for example `ABC` for a company called "ABC Logistics".
4. Click **Create**.

**Write down the exact name you used** — you'll need to give this to our support team in step 4,
spelled exactly the same way (capital letters matter).

---

## Step 2 — Create the 5 required folders

Inside your new document library, create these **5 folders**, with these **exact names**:

| Folder name | What it's for |
|---|---|
| `01-Inbound` | Drop new timesheet PDFs here |
| `02-Processing` | The automation uses this while it's working — don't put files here yourself |
| `03-Output` | Extracted results (CSV files) land here automatically |
| `04-Processed` | Successfully processed PDFs are archived here automatically |
| `99-Error` | Anything that failed lands here for review |

**These names must match exactly** — including the numbers, dashes, and capitalization. The
automation looks for these folders by their exact name. If even one is misspelled, the automation
will not find it.

How to create a folder: open the library → **New** → **Folder** → type the name → **Create**.
Repeat 5 times.

---

## Step 3 — Create the classification columns (recommended)

This step is **optional but recommended**. It lets you tag each timesheet PDF with a type, a
site/division, and a week number — and those same tags will automatically appear on the extracted
CSV file later, so you can filter and group your results the same way.

The easiest way to do this is to **copy the columns from an existing library**:

1. Open the **EKN** library (or any existing library).
2. Go to **Settings** (gear icon) → **Library settings** → scroll down to the **Columns** section.
3. For each of these 3 columns, note its **name** and **type**:
   - **PDF Type** — a Choice column, with options `Salary` and `Wages`
   - **Site** — a Choice column (the exact site/division names are specific to that company — for
     your new library, use names that make sense for *your* company's own sites or divisions, not
     EKN's)
   - **Week No.** — a plain text column (e.g. `W31` for week 31)
4. On your **new** library, go to **Library settings** → **Create column**, and recreate each of
   the 3 columns above with a matching name and type.
   - For **PDF Type**, use the same two choices: `Salary` and `Wages` (this keeps things
     consistent across every company).
   - For **Site**, enter choices for your own company's sites/divisions.
   - For **Week No.**, just make it a single line of text.

If you skip this step, the automation still works perfectly fine — you just won't get these
tags carried through to the results.

---

## Step 4 — Contact support and wait for confirmation ⏳

**This step cannot be done by you — it needs our support team, and it's the one part of this
guide you can't skip.**

The automation only scans libraries it has been explicitly told about. Even though you just
created a perfect library with the right folders, the automation doesn't know it exists yet.

**What to do:**

1. Contact our support team: **[insert your support contact here — e.g. email address, phone
   number, or support ticket link]**
2. Tell them:
   - You've created a new document library for onboarding
   - The exact library name you used in Step 1
3. **Wait for their confirmation** before moving on to Step 5. This usually involves a small
   update on their side and can take some time depending on their schedule — don't assume it's
   done just because you finished Steps 1–3.

Once they confirm it's done, your new library is fully part of the automation, permanently — you
will never need to repeat this step for this library again.

---

## Step 5 — Upload a test file and trigger a test run

Once support has confirmed Step 4 is complete:

1. Upload your sample timesheet PDF into your new library's **`01-Inbound`** folder.
2. (Optional) If you set up the classification columns in Step 3, set values for **PDF Type**,
   **Site**, and **Week No.** on the uploaded file, so you can check later that they carried
   through correctly.
3. Open this address in your web browser (just visiting the page is enough — you don't need to
   log in or type anything):

   ```
   https://skg-sharepoint-timesheet-idp-automation-a5gv46.wk9o2f.deu-c1.eu1.cloudhub.io/trigger-ingest
   ```

   This tells the automation to run right now, instead of waiting for its next scheduled run
   (it also runs automatically every hour on its own — this step is just so you don't have to
   wait for testing).

4. **Wait 5–10 minutes.** The automation takes a little time to process each file — this is
   normal, not a sign of a problem.

---

## Step 6 — Check the results

After waiting, check **both** of these things:

### A) Check the folders

Go back to your new library:

- The test file should **no longer be in `01-Inbound`**.
- It should now be sitting in **`04-Processed`** (this means it succeeded).
- A new file should have appeared in **`03-Output`**, named something like
  `idp-results-<your file name>.csv` — this is the extracted data.
- If the file instead ended up in **`99-Error`**, something went wrong — see
  [Troubleshooting](#troubleshooting) below.

### B) Check the job log

1. Open the job log list:
   `https://skgtechoffice.sharepoint.com/sites/MulesoftProjectSite/Lists/Mule%20IDP%20Job%20Logs/AllItems.aspx`
2. Look for the newest row where **SourceFolder** matches your new library's name.
3. Check that **Status** says **Success** (or "Partial Success" if some files had issues, or
   "Failed" if something went wrong) and that **FilesProcessed** shows `1`.

If both checks look good — **congratulations, your new company is fully onboarded.** From now on,
the automation will pick up files in this library automatically, every hour, with no further
setup needed.

---

## Troubleshooting

**The test file is still sitting in `01-Inbound` after 10+ minutes.**
- Double-check Step 4 was actually confirmed by support — this is the single most common cause.
  If you're not 100% sure they confirmed it, follow up with them before trying anything else.
- Double-check the 5 folder names from Step 2 are spelled **exactly** right (including the
  numbers and dashes).
- Make sure your test file is a real PDF (not a Word document or scanned image saved with a
  `.pdf`-looking name but a different actual format).

**The test file ended up in `99-Error`.**
- Open the job log (Step 6B) and check the **Details** column for that run — it usually names
  the file and gives a short reason.
- This can happen if the PDF is corrupted, blank, or doesn't look like a real timesheet to the
  system. Try again with a clean, valid sample timesheet PDF.

**Everything moved correctly, but the CSV in `03-Output` doesn't show PDF Type/Site/Week No.**
- Make sure you actually set those values on the source file in Step 5, and that you completed
  the optional Step 3 (creating the columns) correctly on your new library.
- If you're confident both are set up correctly and it's still not showing up, contact our
  support team.

**Something else looks wrong.**
- Contact our support team with the library name, the file name you tested with, and roughly what
  time you triggered the test — that's enough for them to look up exactly what happened.

---

## Quick reference (keep this handy)

| Item | Value |
|---|---|
| SharePoint site | `https://skgtechoffice.sharepoint.com/sites/MulesoftProjectSite` |
| Required folder names | `01-Inbound`, `02-Processing`, `03-Output`, `04-Processed`, `99-Error` |
| Manual trigger link | `https://skg-sharepoint-timesheet-idp-automation-a5gv46.wk9o2f.deu-c1.eu1.cloudhub.io/trigger-ingest` |
| Job log list | `https://skgtechoffice.sharepoint.com/sites/MulesoftProjectSite/Lists/Mule%20IDP%20Job%20Logs/AllItems.aspx` |
| Automatic schedule | Runs on its own every hour — manual trigger is only needed for immediate testing |
| Support contact | **[insert your support contact here]** |
