# Support Guide: Adding a New Company (CloudHub Settings)

## Who this guide is for

This is for our support team. It covers the one step that only we can do when onboarding a new
company: telling the automation about the new SharePoint library, and confirming it works.

You do **not** need to edit any code or files — this is done entirely through the Anypoint
**Runtime Manager** website. You'll update one setting, save it, and run a quick test.

> **Before you start**: this guide describes the standard Anypoint Runtime Manager screens.
> If your screen looks slightly different (button names, tab layout), it's the same idea —
> just adjust the labels. Send a screenshot if you'd like this guide made more precise for our
> exact setup.

## What you'll need

- The exact library name the customer created (e.g. `ABC`) — get this from the customer, spelled
  and capitalized exactly as they created it in SharePoint.
- Access to Anypoint Platform → Runtime Manager for this application.
- 5–10 minutes, mostly waiting for the application to restart.

---

## Step 1 — Open the application's settings

1. Go to **Anypoint Platform** → **Runtime Manager**.
2. Find the application (currently `skg-sharepoint-timesheet-idp-automation`) and open it.
3. Go to its **Settings** (or **Properties**) tab.

## Step 2 — Back up the current value first

1. Find the property named exactly: **`sharepoint.libraries`**
2. **Before changing anything**, copy its current value and paste it somewhere safe (a notepad,
   an email draft to yourself — anywhere). This is your safety net if you need to undo the change.
   Right now it should look something like:
   ```
   ["EKN","FLEET"]
   ```

## Step 3 — Add the new company name

Edit the value to add the new company name, **keeping the exact same style**:

- Every name has quotation marks around it: `"ABC"`
- Names are separated by commas, no space after the comma
- The whole thing is wrapped in square brackets `[` `]`
- No comma after the very last name

**Example** — adding `ABC` to the existing list:

| Before | After |
|---|---|
| `["EKN","FLEET"]` | `["EKN","FLEET","ABC"]` |

> ⚠️ **This is the one part of this guide to be careful with.** This single setting controls
> **every** company the automation processes, not just the new one. A typo here (a missing
> quote, bracket, or comma) can stop the automation from working for **every** company, not just
> the new one. Double-check it against the example above before saving. If in doubt, use the
> backup value from Step 2 to compare.

## Step 4 — Save and wait

1. Save the change (button may say **Save**, **Save and Apply**, or **Save and Deploy**).
2. The application will restart to pick up the new setting. **Wait 2–5 minutes.**
3. You can watch the application's status in Runtime Manager — wait until it shows as running
   normally again before testing.

---

## Step 5 — Quick test

Now confirm the new company actually works.

1. **Get one sample PDF timesheet** (the customer's own test file from onboarding is fine, or any
   valid sample).
2. **Upload it** into the new company's library, in the `01-Inbound` folder.
3. **Trigger a run** by opening this address in a browser (just visiting the page is enough):
   ```
   https://skg-sharepoint-timesheet-idp-automation-a5gv46.wk9o2f.deu-c1.eu1.cloudhub.io/trigger-ingest
   ```
4. **Wait 5–10 minutes** for processing to finish.

## Step 6 — Check the logs for errors

1. In Runtime Manager, open the application's **Logs** tab.
2. Look at the most recent entries (filter/search for the new company's library name if the log
   list is long).
3. You're looking for:
   - A line saying the file was **submitted to IDP successfully** for the new library — good sign.
   - A line saying the file was processed **successfully** — this is what you want to see.
   - Any line marked **ERROR** mentioning the new library or the test file name — this means
     something went wrong; see [If something goes wrong](#if-something-goes-wrong) below.

For an extra check, you can also just look in SharePoint (optional, but reassuring):
   - The test PDF should have moved out of `01-Inbound` and into `04-Processed`.
   - A results file should have appeared in `03-Output`.
   - A new row for this library should appear in the **Mule IDP Job Logs** SharePoint list, with
     **Status = Success**.

If both the logs and the folders look clean — **you're done.** The new company is fully onboarded
and will be processed automatically from now on, no further changes needed.

---

## If something goes wrong

- **The test file never moved out of `01-Inbound`, and there's no log activity for it at all** —
  double-check the exact spelling/capitalization of the library name in the setting from Step 3
  matches SharePoint exactly. Also confirm the application finished restarting (Step 4) before you
  tested.
- **You see an ERROR in the logs mentioning SharePoint or "folder not found"** — the customer's
  library is likely missing one of the 5 required folders, or a folder name is misspelled. Ask
  them to double check against their onboarding guide.
- **You made a mistake in the `sharepoint.libraries` value and things stopped working for other
  companies too** — go back to Step 3, paste back the backup value you saved in Step 2, save, and
  wait for the restart. This immediately undoes the change.
- **Anything else looks wrong** — escalate to the development team with: the library name, the
  test file name, and roughly when you triggered the test.

---

## Quick reference

| Item | Value |
|---|---|
| Application name | `skg-sharepoint-timesheet-idp-automation` |
| Property to update | `sharepoint.libraries` |
| Value format | `["NAME1","NAME2","NAME3"]` — no spaces, no trailing comma, quotes around each name |
| Manual trigger link | `https://skg-sharepoint-timesheet-idp-automation-a5gv46.wk9o2f.deu-c1.eu1.cloudhub.io/trigger-ingest` |
| Job log list (optional check) | `https://skgtechoffice.sharepoint.com/sites/MulesoftProjectSite/Lists/Mule%20IDP%20Job%20Logs/AllItems.aspx` |
