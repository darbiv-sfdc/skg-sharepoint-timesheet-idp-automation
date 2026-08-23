# Timesheet Automation — UAT Test Plan & Results Tracker

## Purpose

Confirm, from a business user's point of view, that the application correctly picks up timesheet PDFs,
processes them, and returns results — and that it behaves sensibly when something goes wrong (a bad file, an
empty folder, etc.). No technical knowledge of the application's internals is required.

## Environment

| Item | Value |
|---|---|
| Environment | UAT |
| SharePoint site URL | https://skgtechoffice.sharepoint.com/sites/MulesoftProjectSite |
| Document libraries in scope | EKN (https://skgtechoffice.sharepoint.com/sites/MulesoftProjectSite/EKN/Forms/AllItems.aspx), FLEET (https://skgtechoffice.sharepoint.com/sites/MulesoftProjectSite/FLEET/Forms/AllItems.aspx) |
| Mule IDP Job Logs list | https://skgtechoffice.sharepoint.com/sites/MulesoftProjectSite/Lists/Mule%20IDP%20Job%20Logs/AllItems.aspx |
| How to trigger a run manually | Open this URL in a browser (a GET request is enough — no login or body needed): https://skg-sharepoint-timesheet-idp-automation-a5gv46.wk9o2f.deu-c1.eu1.cloudhub.io/trigger-ingest |
| Automatic schedule enabled? | Yes — runs every hour |

*Whoever finalizes this plan before testing begins should fill in the placeholders above.*

## Before you start

- Read/Contribute access to each document library listed above
- Read access to the **Mule IDP Job Logs** SharePoint list
- Access to trigger a run manually (or a contact who can trigger it for you)
- At least 2-3 valid sample timesheet PDFs
- At least one deliberately invalid file for negative testing (a non-PDF file, and a corrupted/blank/non-timesheet PDF)

## Important: processing is not instant

Data extraction happens in the background and can take a few minutes per file. Wait at least 5-10 minutes after
triggering before checking results in any test case below.

## If a test fails

1. Note the test case ID, the time you ran it, and what you saw instead of the expected result.
2. Check the **Mule IDP Job Logs** list for the corresponding entry and copy the **Details** column text.
3. Screenshot the relevant folder showing the unexpected state.
4. Report it to the development/support contact for this project with the above information.

## Overall acceptance criteria

This UAT is **passed** when:
- Every **Required** test case below passes.
- **Optional** test cases have been attempted and recorded, even if they don't pass — they inform follow-up work but don't block acceptance.
- No test case leaves a file "stuck" in an unexplained state that isn't explained by the test itself.

---

## Test Scenarios

### TC-01 — Trigger the Ingest On Demand (Required)
**Purpose:** Confirm a run can be started on demand and covers every configured document library.
**Preconditions:** All Inbound folders empty, or you accept whatever is already there being processed.

**Steps:**
1. Trigger a run manually.
2. Wait 2-3 minutes.
3. Open the Mule IDP Job Logs list.

**Expected result:** A new row appears for every document library in scope, current timestamp. An empty
Inbound shows `FilesProcessed = 0`, `Details = "No files found"` — that's correct, not a failure.

| Result (Pass/Fail) | Tester | Date | Notes |
|---|---|---|---|
| | | | |

### TC-02 — Upload & Classify a Timesheet (Required)
**Purpose:** Confirm a normal file upload and classification works as expected.
**Preconditions:** A valid sample timesheet PDF.

**Steps:**
1. Upload the PDF into a library's `01-Inbound`.
2. Set `PDF Type`, `Site`, `Week No.` on the file.
3. Trigger a run (or wait for schedule).
4. Wait 5-10 minutes.

**Expected result:** File no longer in `01-Inbound`. New Job Logs row for that library: `Status = Success`,
`FilesProcessed = 1`.

| Result (Pass/Fail) | Tester | Date | Notes |
|---|---|---|---|
| | | | |

### TC-03 — Verify the Extraction Output (Required)
**Purpose:** Confirm the extracted data is correct, not just present.
**Preconditions:** TC-02 completed successfully.

**Steps:**
1. Open `03-Output` in the same library.
2. Open the CSV corresponding to the TC-02 file.
3. Compare a few fields (employee name, daily hours) against the original PDF.

**Expected result:** CSV present; contents match the source PDF for the fields checked.

| Result (Pass/Fail) | Tester | Date | Notes |
|---|---|---|---|
| | | | |

### TC-04 — Verify the Archived File & Retained Classification (Required)
**Purpose:** Confirm the original file is archived correctly and classification survives processing.
**Preconditions:** TC-02 completed successfully.

**Steps:**
1. Open `04-Processed` in the same library.
2. Locate the TC-02 file.
3. Check its `PDF Type`, `Site`, `Week No.` values.

**Expected result:** Original PDF present, unchanged, in `04-Processed`, with the same classification values
set in TC-02.

| Result (Pass/Fail) | Tester | Date | Notes |
|---|---|---|---|
| | | | |

### TC-05 — Multiple Files in One Batch (Required)
**Purpose:** Confirm several files in one run are all handled correctly.

**Steps:**
1. Upload 3 valid PDFs into one library's `01-Inbound` at the same time.
2. Trigger a run; wait 5-10 minutes.

**Expected result:** All 3 files end up in `04-Processed` with matching CSVs in `03-Output`. Job Logs shows one
row for this run with `FilesProcessed = 3`.

| Result (Pass/Fail) | Tester | Date | Notes |
|---|---|---|---|
| | | | |

### TC-06 — Multiple Libraries Processed Independently (Required)
**Purpose:** Confirm one library's files never end up in another library's folders.

**Steps:**
1. Upload one valid PDF into Library A's Inbound, a different one into Library B's Inbound.
2. Trigger a run; wait 5-10 minutes.

**Expected result:** Library A's file appears only in Library A's Output/Processed; Library B's file appears
only in Library B's Output/Processed. Job Logs shows one row per library.

| Result (Pass/Fail) | Tester | Date | Notes |
|---|---|---|---|
| | | | |

### TC-07 — Non-PDF File Is Ignored (Required)
**Purpose:** Confirm non-PDF files are safely ignored rather than causing an error.

**Steps:**
1. Upload a non-PDF file (.txt/.docx) into a library's `01-Inbound`.
2. Trigger a run; wait a few minutes.

**Expected result:** File remains untouched in `01-Inbound`. Not counted in `FilesProcessed`/`ErrorCount`; no
error logged because of it.

| Result (Pass/Fail) | Tester | Date | Notes |
|---|---|---|---|
| | | | |

### TC-08 — Invalid/Unreadable PDF Routed to Error (Required)
**Purpose:** Confirm a file the system can't process is safely routed for review instead of getting stuck or
silently lost.

**Steps:**
1. Upload a deliberately invalid/corrupt PDF into a library's `01-Inbound`.
2. Trigger a run; wait 5-10 minutes.

**Expected result:** File ends up in `99-Error` (not left in Inbound/Processing). Job Logs row shows
`Status = Partial Success` or `Failed`, `Details` mentions the file name.

| Result (Pass/Fail) | Tester | Date | Notes |
|---|---|---|---|
| | | | |

### TC-09 — Recovering a File from the Error Folder (Required)
**Purpose:** Confirm a file can be corrected and resubmitted after failing.
**Preconditions:** A file currently in `99-Error` (from TC-08, replaced with a valid PDF if the original was
intentionally broken).

**Steps:**
1. Move the file from `99-Error` back into `01-Inbound`.
2. Trigger a run; wait 5-10 minutes.

**Expected result:** File is picked up again as a new file on this run, and follows the normal success or
error path based on whether it's now valid.

| Result (Pass/Fail) | Tester | Date | Notes |
|---|---|---|---|
| | | | |

### TC-10 — Consecutive Triggers Don't Duplicate Processing (Optional)
**Purpose:** Confirm triggering twice in quick succession doesn't process the same file twice.

**Steps:**
1. Upload one valid PDF into `01-Inbound`.
2. Trigger a run, then trigger again immediately, without waiting for the first to finish.
3. Wait 5-10 minutes.

**Expected result:** Only one CSV and one archived copy appear — not two. The second run's Job Logs row shows
`FilesProcessed = 0`, "No files found" (file was already gone from Inbound).

| Result (Pass/Fail) | Tester | Date | Notes |
|---|---|---|---|
| | | | |

### TC-11 — Scheduled Run Picks Up Files Automatically (Optional)
The automatic schedule runs every hour in this environment.
**Purpose:** Confirm files get processed without anyone manually triggering a run.

**Steps:**
1. Note the current time, then upload a valid PDF into `01-Inbound`.
2. Do **not** trigger a run manually.
3. Wait up to an hour, then check Job Logs for a new row with `ExecutionType = Scheduled` and a timestamp after
your upload.

**Expected result:** File is picked up and processed automatically, same as a manually triggered run, with no
action needed from the tester beyond uploading.

| Result (Pass/Fail) | Tester | Date | Notes |
|---|---|---|---|
| | | | |

---

## Sign-off

| Field | Value |
|---|---|
| Tester name | |
| Date completed | |
| Overall result | |
| Open issues (if any) | |
| Signature | |
